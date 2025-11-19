"""
Affiliate Service - Handles subscription, referral tracking, and commission calculations
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload, joinedload
from typing import Optional, List, Dict, Tuple
from decimal import Decimal
from datetime import datetime, timedelta
import secrets
import string

from app.models.affiliate import (
    AffiliateSubscription, Referral, Commission, CommissionRule,
    Payout, AffiliateStats, AffiliateStatus, CommissionStatus, PayoutStatus
)
from app.models.users import UserProfile
from app.models.order import Order
from app.models.server import Server
from app.schemas.affiliate import (
    AffiliateSubscriptionCreate, AffiliateSubscriptionResponse,
    PayoutRequest, PayoutResponse, AffiliateStatsResponse,
    CommissionDetail, TeamMember, ServerPurchaseDetail
)


class AffiliateService:
    """Service for managing affiliate/referral system"""

    # ==================== Subscription Management ====================

    @staticmethod
    def generate_referral_code(length: int = 8) -> str:
        """Generate unique referral code"""
        chars = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(chars) for _ in range(length))

    async def create_affiliate_subscription(
        self,
        db: AsyncSession,
        user_id: int,
        subscription_data: Optional[AffiliateSubscriptionCreate] = None,
        is_free_with_server: bool = False
    ) -> AffiliateSubscription:
        """
        Create affiliate subscription
        - Free if user bought a server
        - Rs 499 if user hasn't bought server but wants to become affiliate
        """
        # Check if subscription already exists
        result = await db.execute(
            select(AffiliateSubscription).where(AffiliateSubscription.user_id == user_id)
        )
        existing = result.scalar_one_or_none()
        if existing:
            return existing

        # Generate unique referral code
        referral_code = None
        while not referral_code:
            code = self.generate_referral_code()
            check = await db.execute(
                select(AffiliateSubscription).where(AffiliateSubscription.referral_code == code)
            )
            if not check.scalar_one_or_none():
                referral_code = code

        # Create subscription
        subscription = AffiliateSubscription(
            user_id=user_id,
            subscription_type='free_with_server' if is_free_with_server else 'paid',
            amount_paid=Decimal('0.00') if is_free_with_server else Decimal('499.00'),
            currency='INR',
            referral_code=referral_code,
            status=AffiliateStatus.ACTIVE,
            is_active=True,
            is_lifetime=True,
            payment_id=subscription_data.payment_id if subscription_data else None,
            payment_method=subscription_data.payment_method if subscription_data else 'free',
            paid_at=datetime.utcnow() if subscription_data else None,
            activated_at=datetime.utcnow()
        )

        db.add(subscription)
        await db.commit()
        await db.refresh(subscription)

        # Initialize affiliate stats
        await self._initialize_affiliate_stats(db, user_id)

        return subscription

    async def get_user_subscription(
        self,
        db: AsyncSession,
        user_id: int
    ) -> Optional[AffiliateSubscription]:
        """Get user's affiliate subscription"""
        result = await db.execute(
            select(AffiliateSubscription).where(AffiliateSubscription.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def check_and_activate_from_server_purchase(
        self,
        db: AsyncSession,
        user_id: int
    ) -> Optional[AffiliateSubscription]:
        """
        Check if user qualifies for free affiliate subscription.
        Qualification paths:
        1. Any completed/active order (original logic)
        2. Fallback: Any active/running server record (covers legacy/manual provisioning without order row)
        """
        # Check if user has any completed orders
        result = await db.execute(
            select(Order).where(
                and_(
                    Order.user_id == user_id,
                    Order.order_status.in_(['completed', 'active'])
                )
            ).limit(1)
        )
        has_order = result.scalar_one_or_none()
        if has_order:
            return await self.create_affiliate_subscription(db, user_id, is_free_with_server=True)

        # Fallback: server existence with active/running status (legacy direct server provisioning)
        server_result = await db.execute(
            select(Server).where(
                and_(
                    Server.user_id == user_id,
                    Server.server_status.in_(['active', 'running'])
                )
            ).limit(1)
        )
        has_active_server = server_result.scalar_one_or_none()

        if has_active_server:
            return await self.create_affiliate_subscription(db, user_id, is_free_with_server=True)

        return None

    # ==================== Referral Tracking ====================

    async def track_referral(
        self,
        db: AsyncSession,
        referrer_code: str,
        referred_user_id: int,
        signup_ip: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Optional[Referral]:
        """
        Track new referral - automatically calculates levels up to 3
        """
        # Find referrer by code
        result = await db.execute(
            select(AffiliateSubscription).where(
                and_(
                    AffiliateSubscription.referral_code == referrer_code,
                    AffiliateSubscription.is_active == True
                )
            )
        )
        referrer_subscription = result.scalar_one_or_none()
        if not referrer_subscription:
            return None

        # Check if referral already exists
        existing = await db.execute(
            select(Referral).where(Referral.referred_user_id == referred_user_id)
        )
        if existing.scalar_one_or_none():
            return None  # Already referred

        # Create Level 1 referral
        referral_l1 = Referral(
            referrer_id=referrer_subscription.user_id,
            referred_user_id=referred_user_id,
            level=1,
            parent_referral_id=None,
            referral_code_used=referrer_code,
            signup_ip=signup_ip,
            signup_user_agent=user_agent,
            is_active=True
        )
        db.add(referral_l1)
        await db.flush()

        # Update referred user's profile
        user_result = await db.execute(
            select(UserProfile).where(UserProfile.id == referred_user_id)
        )
        user = user_result.scalar_one_or_none()
        if user:
            user.referred_by = referrer_subscription.user_id

        # Track up to Level 2 and Level 3
        current_referrer_id = referrer_subscription.user_id
        parent_referral_id = referral_l1.id
        
        for level in [2, 3]:
            # Find next level referrer
            next_result = await db.execute(
                select(UserProfile.referred_by).where(UserProfile.id == current_referrer_id)
            )
            next_referrer_id = next_result.scalar_one_or_none()
            
            if not next_referrer_id:
                break

            # Create referral record for this level
            referral = Referral(
                referrer_id=next_referrer_id,
                referred_user_id=referred_user_id,
                level=level,
                parent_referral_id=parent_referral_id,
                referral_code_used=referrer_code,
                signup_ip=signup_ip,
                signup_user_agent=user_agent,
                is_active=True
            )
            db.add(referral)
            await db.flush()
            
            # Update user's referral levels
            if level == 2 and user:
                user.referral_level_2 = next_referrer_id
            elif level == 3 and user:
                user.referral_level_3 = next_referrer_id
            
            parent_referral_id = referral.id
            current_referrer_id = next_referrer_id

        await db.commit()
        
        # Update stats for all affected affiliates
        await self._update_referral_counts(db, referrer_subscription.user_id)
        
        return referral_l1

    async def mark_referral_converted(
        self,
        db: AsyncSession,
        user_id: int,
        order_id: int,
        amount: Decimal
    ):
        """Mark referral as converted (first purchase made)"""
        result = await db.execute(
            select(Referral).where(Referral.referred_user_id == user_id)
        )
        referrals = result.scalars().all()

        for referral in referrals:
            if not referral.has_purchased:
                referral.has_purchased = True
                referral.first_purchase_at = datetime.utcnow()
                referral.first_purchase_amount = amount
                
                # Update stats
                await self._update_referral_counts(db, referral.referrer_id)

        await db.commit()

    # ==================== Commission Management ====================

    async def calculate_and_record_commissions(
        self,
        db: AsyncSession,
        order_id: int,
        user_id: int,
        order_amount: Decimal,
        product_type: str = 'server'
    ):
        """
        Calculate and record commissions for all levels based on order
        """
        # Get all referrals for this user (L1, L2, L3)
        result = await db.execute(
            select(Referral).where(
                and_(
                    Referral.referred_user_id == user_id,
                    Referral.is_active == True
                )
            )
        )
        referrals = result.scalars().all()

        for referral in referrals:
            # Get applicable commission rule
            commission_rule = await self._get_commission_rule(
                db, referral.level, product_type, order_amount
            )
            
            if not commission_rule:
                continue

            # Calculate commission
            if commission_rule.commission_type == 'percentage':
                commission_amount = order_amount * (commission_rule.commission_value / 100)
            else:
                commission_amount = commission_rule.commission_value

            # Create commission record
            commission = Commission(
                affiliate_user_id=referral.referrer_id,
                referral_id=referral.id,
                order_id=order_id,
                level=referral.level,
                commission_rule_id=commission_rule.id,
                order_amount=order_amount,
                commission_rate=commission_rule.commission_value,
                commission_amount=commission_amount,
                currency='INR',
                status=CommissionStatus.PENDING
            )
            db.add(commission)

        await db.commit()

        # Update affiliate stats for all referrers
        for referral in referrals:
            await self._update_commission_stats(db, referral.referrer_id)

    async def approve_commission(
        self,
        db: AsyncSession,
        commission_id: int,
        approved_by: int
    ) -> Optional[Commission]:
        """Approve a pending commission"""
        result = await db.execute(
            select(Commission).where(Commission.id == commission_id)
        )
        commission = result.scalar_one_or_none()

        if commission and commission.status == CommissionStatus.PENDING:
            commission.status = CommissionStatus.APPROVED
            commission.approved_at = datetime.utcnow()
            commission.approved_by = approved_by
            await db.commit()
            
            # Update stats
            await self._update_commission_stats(db, commission.affiliate_user_id)
            
            return commission
        return None

    # ==================== Payout Management ====================

    async def request_payout(
        self,
        db: AsyncSession,
        user_id: int,
        payout_request: PayoutRequest
    ) -> Payout:
        """Create payout request"""
        # Get available balance
        stats = await self.get_affiliate_stats(db, user_id)
        
        if stats.available_balance < payout_request.amount:
            raise ValueError("Insufficient balance for payout")

        payout = Payout(
            affiliate_user_id=user_id,
            amount=payout_request.amount,
            currency='INR',
            payment_method=payout_request.payment_method,
            payment_details=payout_request.payment_details,
            status=PayoutStatus.PENDING,
            notes=payout_request.notes
        )
        db.add(payout)
        await db.commit()
        await db.refresh(payout)

        return payout

    async def process_payout(
        self,
        db: AsyncSession,
        payout_id: int,
        action: str,
        processed_by: int,
        transaction_id: Optional[str] = None,
        admin_notes: Optional[str] = None
    ) -> Optional[Payout]:
        """Process payout (approve/reject/complete)"""
        result = await db.execute(
            select(Payout).where(Payout.id == payout_id)
        )
        payout = result.scalar_one_or_none()

        if not payout:
            return None

        if action == 'approve':
            payout.status = PayoutStatus.PROCESSING
        elif action == 'complete':
            payout.status = PayoutStatus.COMPLETED
            payout.processed_at = datetime.utcnow()
            
            # Mark commissions as paid
            await self._mark_commissions_paid(db, payout.affiliate_user_id, payout.amount, payout_id)
        elif action == 'reject':
            payout.status = PayoutStatus.FAILED
            payout.processed_at = datetime.utcnow()

        payout.processed_by = processed_by
        payout.transaction_id = transaction_id
        payout.admin_notes = admin_notes

        await db.commit()
        await db.refresh(payout)

        # Update stats
        if action == 'complete':
            await self._update_commission_stats(db, payout.affiliate_user_id)

        return payout

    # ==================== Stats & Analytics ====================

    async def get_affiliate_stats(
        self,
        db: AsyncSession,
        user_id: int
    ) -> AffiliateStatsResponse:
        """Get comprehensive affiliate statistics"""
        # Get or create stats record
        result = await db.execute(
            select(AffiliateStats).where(AffiliateStats.affiliate_user_id == user_id)
        )
        stats = result.scalar_one_or_none()

        if not stats:
            await self._initialize_affiliate_stats(db, user_id)
            stats = await db.execute(
                select(AffiliateStats).where(AffiliateStats.affiliate_user_id == user_id)
            )
            stats = stats.scalar_one()

        # Get subscription info
        subscription = await self.get_user_subscription(db, user_id)

        return AffiliateStatsResponse(
            total_referrals_level1=stats.total_referrals_level1,
            total_referrals_level2=stats.total_referrals_level2,
            total_referrals_level3=stats.total_referrals_level3,
            total_referrals=stats.total_referrals,
            active_referrals_level1=stats.active_referrals_level1,
            active_referrals_level2=stats.active_referrals_level2,
            active_referrals_level3=stats.active_referrals_level3,
            active_referrals=stats.active_referrals,
            total_commission_earned=stats.total_commission_earned,
            pending_commission=stats.pending_commission,
            approved_commission=stats.approved_commission,
            paid_commission=stats.paid_commission,
            available_balance=stats.available_balance,
            total_payouts=stats.total_payouts,
            total_payout_amount=stats.total_payout_amount,
            subscription_type=subscription.subscription_type if subscription else None,
            subscription_status=subscription.status.value if subscription else None,
            referral_code=subscription.referral_code if subscription else None,
            is_active=subscription.is_active if subscription else False,
            can_request_payout=stats.available_balance >= Decimal('500')
        )

    async def get_team_members(
        self,
        db: AsyncSession,
        user_id: int,
        level: Optional[int] = None
    ) -> List[TeamMember]:
        """Get team members at specific level or all levels"""
        query = select(Referral).where(Referral.referrer_id == user_id)
        
        if level:
            query = query.where(Referral.level == level)

        query = query.options(selectinload(Referral.commissions))
        
        result = await db.execute(query)
        referrals = result.scalars().all()

        team_members = []
        for ref in referrals:
            # Get user details
            user_result = await db.execute(
                select(UserProfile).where(UserProfile.id == ref.referred_user_id)
            )
            user = user_result.scalar_one_or_none()
            if not user:
                continue

            # Get total purchases
            purchases_result = await db.execute(
                select(func.coalesce(func.sum(Order.total_amount), 0)).where(
                    and_(
                        Order.user_id == ref.referred_user_id,
                        Order.order_status.in_(['completed', 'active'])
                    )
                )
            )
            total_purchases = purchases_result.scalar() or Decimal('0')

            # Get total commission from this user
            commission_result = await db.execute(
                select(func.coalesce(func.sum(Commission.commission_amount), 0)).where(
                    and_(
                        Commission.referral_id == ref.id,
                        Commission.affiliate_user_id == user_id
                    )
                )
            )
            total_commission = commission_result.scalar() or Decimal('0')

            # Get active servers count
            servers_result = await db.execute(
                select(func.count(Server.id)).where(
                    and_(
                        Server.user_id == ref.referred_user_id,
                        Server.server_status.in_(['active', 'running'])
                    )
                )
            )
            active_servers = servers_result.scalar() or 0

            # Get child count (direct referrals of this member)
            child_result = await db.execute(
                select(func.count(Referral.id)).where(
                    and_(
                        Referral.referrer_id == ref.referred_user_id,
                        Referral.level == 1
                    )
                )
            )
            child_count = child_result.scalar() or 0

            team_members.append(TeamMember(
                user_id=user.id,
                email=user.email,
                full_name=user.full_name,
                level=ref.level,
                joined_at=ref.created_at,
                has_purchased=ref.has_purchased,
                total_purchases=total_purchases,
                total_commission=total_commission,
                active_servers=active_servers,
                child_count=child_count
            ))

        return team_members

    async def get_recent_commissions(
        self,
        db: AsyncSession,
        user_id: int,
        limit: int = 10
    ) -> List[CommissionDetail]:
        """Get recent commissions"""
        result = await db.execute(
            select(Commission)
            .where(Commission.affiliate_user_id == user_id)
            .order_by(desc(Commission.created_at))
            .limit(limit)
            .options(
                selectinload(Commission.referral)
            )
        )
        commissions = result.scalars().all()

        details = []
        for comm in commissions:
            # Get referred user email
            referred_email = None
            if comm.referral:
                user_result = await db.execute(
                    select(UserProfile.email).where(UserProfile.id == comm.referral.referred_user_id)
                )
                referred_email = user_result.scalar_one_or_none()

            # Get order description
            order_desc = None
            if comm.order_id:
                order_result = await db.execute(
                    select(Order).where(Order.id == comm.order_id)
                )
                order = order_result.scalar_one_or_none()
                if order:
                    order_desc = f"Order #{order.id}"

            details.append(CommissionDetail(
                id=comm.id,
                affiliate_user_id=comm.affiliate_user_id,
                level=comm.level,
                order_id=comm.order_id,
                order_amount=comm.order_amount,
                commission_rate=comm.commission_rate,
                commission_amount=comm.commission_amount,
                status=comm.status.value,
                approved_at=comm.approved_at,
                paid_at=comm.paid_at,
                created_at=comm.created_at,
                referred_user_email=referred_email,
                order_description=order_desc
            ))

        return details

    # ==================== Helper Methods ====================

    async def _initialize_affiliate_stats(self, db: AsyncSession, user_id: int):
        """Initialize affiliate stats record"""
        stats = AffiliateStats(
            affiliate_user_id=user_id,
            total_referrals_level1=0,
            total_referrals_level2=0,
            total_referrals_level3=0,
            total_referrals=0,
            active_referrals_level1=0,
            active_referrals_level2=0,
            active_referrals_level3=0,
            active_referrals=0,
            total_commission_earned=Decimal('0'),
            pending_commission=Decimal('0'),
            approved_commission=Decimal('0'),
            paid_commission=Decimal('0'),
            available_balance=Decimal('0'),
            total_payouts=0,
            total_payout_amount=Decimal('0')
        )
        db.add(stats)
        await db.commit()

    async def _update_referral_counts(self, db: AsyncSession, user_id: int):
        """Update referral counts in stats"""
        stats_result = await db.execute(
            select(AffiliateStats).where(AffiliateStats.affiliate_user_id == user_id)
        )
        stats = stats_result.scalar_one_or_none()
        if not stats:
            await self._initialize_affiliate_stats(db, user_id)
            return

        # Count referrals by level
        for level in [1, 2, 3]:
            # Total referrals
            total_result = await db.execute(
                select(func.count(Referral.id)).where(
                    and_(
                        Referral.referrer_id == user_id,
                        Referral.level == level
                    )
                )
            )
            total = total_result.scalar() or 0

            # Active referrals (with purchases)
            active_result = await db.execute(
                select(func.count(Referral.id)).where(
                    and_(
                        Referral.referrer_id == user_id,
                        Referral.level == level,
                        Referral.has_purchased == True
                    )
                )
            )
            active = active_result.scalar() or 0

            if level == 1:
                stats.total_referrals_level1 = total
                stats.active_referrals_level1 = active
            elif level == 2:
                stats.total_referrals_level2 = total
                stats.active_referrals_level2 = active
            else:
                stats.total_referrals_level3 = total
                stats.active_referrals_level3 = active

        stats.total_referrals = stats.total_referrals_level1 + stats.total_referrals_level2 + stats.total_referrals_level3
        stats.active_referrals = stats.active_referrals_level1 + stats.active_referrals_level2 + stats.active_referrals_level3

        await db.commit()

    async def _update_commission_stats(self, db: AsyncSession, user_id: int):
        """Update commission stats"""
        stats_result = await db.execute(
            select(AffiliateStats).where(AffiliateStats.affiliate_user_id == user_id)
        )
        stats = stats_result.scalar_one_or_none()
        if not stats:
            return

        # Total earned
        total_result = await db.execute(
            select(func.coalesce(func.sum(Commission.commission_amount), 0)).where(
                Commission.affiliate_user_id == user_id
            )
        )
        stats.total_commission_earned = total_result.scalar() or Decimal('0')

        # Pending
        pending_result = await db.execute(
            select(func.coalesce(func.sum(Commission.commission_amount), 0)).where(
                and_(
                    Commission.affiliate_user_id == user_id,
                    Commission.status == CommissionStatus.PENDING
                )
            )
        )
        stats.pending_commission = pending_result.scalar() or Decimal('0')

        # Approved
        approved_result = await db.execute(
            select(func.coalesce(func.sum(Commission.commission_amount), 0)).where(
                and_(
                    Commission.affiliate_user_id == user_id,
                    Commission.status == CommissionStatus.APPROVED
                )
            )
        )
        stats.approved_commission = approved_result.scalar() or Decimal('0')

        # Paid
        paid_result = await db.execute(
            select(func.coalesce(func.sum(Commission.commission_amount), 0)).where(
                and_(
                    Commission.affiliate_user_id == user_id,
                    Commission.status == CommissionStatus.PAID
                )
            )
        )
        stats.paid_commission = paid_result.scalar() or Decimal('0')

        # Payouts
        payout_count_result = await db.execute(
            select(func.count(Payout.id)).where(
                and_(
                    Payout.affiliate_user_id == user_id,
                    Payout.status == PayoutStatus.COMPLETED
                )
            )
        )
        stats.total_payouts = payout_count_result.scalar() or 0

        payout_amount_result = await db.execute(
            select(func.coalesce(func.sum(Payout.amount), 0)).where(
                and_(
                    Payout.affiliate_user_id == user_id,
                    Payout.status == PayoutStatus.COMPLETED
                )
            )
        )
        stats.total_payout_amount = payout_amount_result.scalar() or Decimal('0')

        # Available balance = approved - paid - pending payouts
        pending_payouts_result = await db.execute(
            select(func.coalesce(func.sum(Payout.amount), 0)).where(
                and_(
                    Payout.affiliate_user_id == user_id,
                    Payout.status.in_([PayoutStatus.PENDING, PayoutStatus.PROCESSING])
                )
            )
        )
        pending_payouts = pending_payouts_result.scalar() or Decimal('0')

        stats.available_balance = stats.approved_commission - stats.paid_commission - pending_payouts
        stats.last_calculated_at = datetime.utcnow()

        await db.commit()

    async def _get_commission_rule(
        self,
        db: AsyncSession,
        level: int,
        product_type: str,
        order_amount: Decimal
    ) -> Optional[CommissionRule]:
        """Get applicable commission rule"""
        result = await db.execute(
            select(CommissionRule).where(
                and_(
                    CommissionRule.level == level,
                    or_(
                        CommissionRule.product_type == product_type,
                        CommissionRule.product_type == 'all',
                        CommissionRule.product_type == None
                    ),
                    CommissionRule.is_active == True,
                    or_(
                        CommissionRule.min_purchase_amount == None,
                        CommissionRule.min_purchase_amount <= order_amount
                    ),
                    or_(
                        CommissionRule.max_purchase_amount == None,
                        CommissionRule.max_purchase_amount >= order_amount
                    )
                )
            ).order_by(desc(CommissionRule.priority))
        )
        return result.scalars().first()

    async def _mark_commissions_paid(
        self,
        db: AsyncSession,
        user_id: int,
        amount: Decimal,
        payout_id: int
    ):
        """Mark commissions as paid for a payout"""
        # Get approved commissions up to the payout amount
        result = await db.execute(
            select(Commission).where(
                and_(
                    Commission.affiliate_user_id == user_id,
                    Commission.status == CommissionStatus.APPROVED,
                    Commission.payout_id == None
                )
            ).order_by(Commission.created_at).limit(100)  # Safety limit
        )
        commissions = result.scalars().all()

        remaining = amount
        for comm in commissions:
            if remaining <= 0:
                break
            
            comm.status = CommissionStatus.PAID
            comm.paid_at = datetime.utcnow()
            comm.payout_id = payout_id
            remaining -= comm.commission_amount

        await db.commit()
