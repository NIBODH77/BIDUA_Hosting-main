"""
Affiliate API Endpoints
Handles subscription, referrals, commissions, and payouts
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.affiliate_service import AffiliateService
from app.schemas.affiliate import (
    AffiliateSubscriptionCreate, AffiliateSubscriptionResponse,
    AffiliateStatsResponse, PayoutRequest, PayoutResponse,
    PayoutActionRequest, CommissionDetail, TeamMember,
    AffiliateDashboard, CommissionRuleResponse
)
from app.models.users import UserProfile

router = APIRouter()
affiliate_service = AffiliateService()


# ==================== Subscription Management ====================

@router.get("/validate-code")
async def validate_referral_code(
    code: str = Query(..., min_length=3, description="Referral code to validate"),
    db: AsyncSession = Depends(get_db)
):
    """Public: validate a referral code and return inviter details if valid.
    Accepts both AffiliateSubscription.referral_code and legacy UserProfile.referral_code.
    """
    from sqlalchemy import select
    from app.models.affiliate import AffiliateSubscription

    # 1) Try affiliate subscription code (primary)
    result = await db.execute(
        select(AffiliateSubscription).where(AffiliateSubscription.referral_code == code)
    )
    aff = result.scalar_one_or_none()

    inviter: Optional[UserProfile] = None
    normalized_code: Optional[str] = None

    if aff and aff.is_active:
        normalized_code = aff.referral_code
        inviter_result = await db.execute(
            select(UserProfile).where(UserProfile.id == aff.user_id)
        )
        inviter = inviter_result.scalar_one_or_none()
    else:
        # 2) Try legacy user referral codes and map to their affiliate code if any
        legacy_user_result = await db.execute(
            select(UserProfile).where(UserProfile.referral_code == code)
        )
        legacy_user = legacy_user_result.scalar_one_or_none()
        if legacy_user:
            # If user has affiliate subscription, use that code; else still return basic inviter info
            aff2_result = await db.execute(
                select(AffiliateSubscription).where(AffiliateSubscription.user_id == legacy_user.id)
            )
            aff2 = aff2_result.scalar_one_or_none()
            normalized_code = aff2.referral_code if (aff2 and aff2.is_active) else None
            inviter = legacy_user

    if not inviter:
        return {"valid": False}

    return {
        "valid": True,
        "code": normalized_code or code,
        "inviter": {
            "id": inviter.id,
            "full_name": inviter.full_name,
            "email": inviter.email,
        },
        "has_active_affiliate": bool(normalized_code)
    }

@router.post("/subscription/create", response_model=AffiliateSubscriptionResponse)
async def create_affiliate_subscription(
    subscription_data: AffiliateSubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Create affiliate subscription (₹499 payment)
    Auto-free if user already bought a server
    """
    # Check if user already has a server
    subscription = await affiliate_service.check_and_activate_from_server_purchase(
        db, current_user.id
    )
    
    if subscription:
        return subscription

    # Create paid subscription
    subscription = await affiliate_service.create_affiliate_subscription(
        db,
        current_user.id,
        subscription_data,
        is_free_with_server=False
    )
    
    return subscription


@router.get("/subscription/status", response_model=AffiliateSubscriptionResponse)
async def get_subscription_status(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get user's affiliate subscription status"""
    subscription = await affiliate_service.get_user_subscription(db, current_user.id)
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No affiliate subscription found. Please subscribe to the affiliate program."
        )
    
    return subscription


@router.post("/subscription/activate-from-server")
async def activate_from_server_purchase(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Check if user bought a server and activate affiliate for free
    Called after successful server purchase
    """
    subscription = await affiliate_service.check_and_activate_from_server_purchase(
        db, current_user.id
    )
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No completed server purchase found"
        )
    
    return {"message": "Affiliate subscription activated for free!", "subscription": subscription}


# ==================== Stats & Dashboard ====================

@router.get("/stats", response_model=AffiliateStatsResponse)
async def get_affiliate_stats(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get comprehensive affiliate statistics"""
    return await affiliate_service.get_affiliate_stats(db, current_user.id)


@router.get("/dashboard", response_model=AffiliateDashboard)
async def get_affiliate_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get complete affiliate dashboard data"""
    subscription = await affiliate_service.get_user_subscription(db, current_user.id)
    stats = await affiliate_service.get_affiliate_stats(db, current_user.id)
    recent_commissions = await affiliate_service.get_recent_commissions(db, current_user.id, limit=10)
    
    # Get pending payouts
    from app.models.affiliate import Payout, PayoutStatus
    from sqlalchemy import select, and_
    
    payout_result = await db.execute(
        select(Payout).where(
            and_(
                Payout.affiliate_user_id == current_user.id,
                Payout.status.in_([PayoutStatus.PENDING, PayoutStatus.PROCESSING])
            )
        )
    )
    pending_payouts = payout_result.scalars().all()

    # Team summary
    team_summary = {
        "level1_count": stats.total_referrals_level1,
        "level2_count": stats.total_referrals_level2,
        "level3_count": stats.total_referrals_level3,
        "total_active": stats.active_referrals,
        "total_commission": stats.total_commission_earned
    }

    return AffiliateDashboard(
        subscription=subscription,
        stats=stats,
        recent_commissions=recent_commissions,
        pending_payouts=[PayoutResponse.from_orm(p) for p in pending_payouts],
        team_summary=team_summary
    )


# ==================== Team Management ====================

@router.get("/team/members", response_model=List[TeamMember])
async def get_team_members(
    level: Optional[int] = Query(None, ge=1, le=3, description="Filter by level (1, 2, or 3)"),
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get team members with detailed info"""
    return await affiliate_service.get_team_members(db, current_user.id, level)


@router.get("/team/hierarchy")
async def get_team_hierarchy(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get complete team hierarchy (3 levels deep)"""
    # This would build a tree structure - simplified version
    l1_members = await affiliate_service.get_team_members(db, current_user.id, level=1)
    l2_members = await affiliate_service.get_team_members(db, current_user.id, level=2)
    l3_members = await affiliate_service.get_team_members(db, current_user.id, level=3)

    return {
        "level1": [m.dict() for m in l1_members],
        "level2": [m.dict() for m in l2_members],
        "level3": [m.dict() for m in l3_members],
        "totals": {
            "l1_count": len(l1_members),
            "l2_count": len(l2_members),
            "l3_count": len(l3_members),
            "total_count": len(l1_members) + len(l2_members) + len(l3_members)
        }
    }


# ==================== Commission Management ====================

@router.get("/commissions", response_model=List[CommissionDetail])
async def get_my_commissions(
    limit: int = Query(50, ge=1, le=200),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get user's commission history"""
    return await affiliate_service.get_recent_commissions(db, current_user.id, limit)


@router.get("/commissions/{commission_id}", response_model=CommissionDetail)
async def get_commission_detail(
    commission_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get detailed commission information"""
    from app.models.affiliate import Commission
    from sqlalchemy import select, and_
    
    result = await db.execute(
        select(Commission).where(
            and_(
                Commission.id == commission_id,
                Commission.affiliate_user_id == current_user.id
            )
        )
    )
    commission = result.scalar_one_or_none()
    
    if not commission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission not found"
        )
    
    # Build detailed response (simplified - use service method for full details)
    return CommissionDetail.from_orm(commission)


# ==================== Payout Management ====================

@router.post("/payouts/request", response_model=PayoutResponse)
async def request_payout(
    payout_request: PayoutRequest,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Request payout (minimum ₹500)
    """
    try:
        payout = await affiliate_service.request_payout(
            db, current_user.id, payout_request
        )
        return PayoutResponse.from_orm(payout)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/payouts", response_model=List[PayoutResponse])
async def get_my_payouts(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get user's payout history"""
    from app.models.affiliate import Payout
    from sqlalchemy import select, desc
    
    result = await db.execute(
        select(Payout)
        .where(Payout.affiliate_user_id == current_user.id)
        .order_by(desc(Payout.requested_at))
    )
    payouts = result.scalars().all()
    
    return [PayoutResponse.from_orm(p) for p in payouts]


@router.get("/payouts/{payout_id}", response_model=PayoutResponse)
async def get_payout_detail(
    payout_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get payout details"""
    from app.models.affiliate import Payout
    from sqlalchemy import select, and_
    
    result = await db.execute(
        select(Payout).where(
            and_(
                Payout.id == payout_id,
                Payout.affiliate_user_id == current_user.id
            )
        )
    )
    payout = result.scalar_one_or_none()
    
    if not payout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payout not found"
        )
    
    return PayoutResponse.from_orm(payout)


# ==================== Admin Endpoints ====================

@router.get("/admin/affiliates")
async def get_all_affiliates(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Get all affiliate subscriptions (Admin only)"""
    from app.models.affiliate import AffiliateSubscription
    from sqlalchemy import select
    
    result = await db.execute(
        select(AffiliateSubscription)
        .offset(skip)
        .limit(limit)
    )
    affiliates = result.scalars().all()
    
    return [AffiliateSubscriptionResponse.from_orm(a) for a in affiliates]


@router.get("/admin/payouts/pending")
async def get_pending_payouts(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Get all pending payouts (Admin only)"""
    from app.models.affiliate import Payout, PayoutStatus
    from sqlalchemy import select
    
    result = await db.execute(
        select(Payout).where(
            Payout.status.in_([PayoutStatus.PENDING, PayoutStatus.PROCESSING])
        )
    )
    payouts = result.scalars().all()
    
    return [PayoutResponse.from_orm(p) for p in payouts]


@router.post("/admin/payouts/{payout_id}/process", response_model=PayoutResponse)
async def process_payout_admin(
    payout_id: int,
    action_request: PayoutActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """
    Process payout (Admin only)
    Actions: approve, complete, reject
    """
    payout = await affiliate_service.process_payout(
        db,
        payout_id,
        action_request.action,
        current_user.id,
        action_request.transaction_id,
        action_request.admin_notes
    )
    
    if not payout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payout not found"
        )
    
    return PayoutResponse.from_orm(payout)


@router.post("/admin/commissions/{commission_id}/approve")
async def approve_commission_admin(
    commission_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_admin_user)
):
    """Approve a commission (Admin only)"""
    commission = await affiliate_service.approve_commission(
        db, commission_id, current_user.id
    )
    
    if not commission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission not found or already approved"
        )
    
    return {"message": "Commission approved successfully", "commission_id": commission.id}


# ==================== Referral Tracking (Public) ====================

@router.post("/track-referral")
async def track_referral_signup(
    referral_code: str,
    referred_user_id: int,
    signup_ip: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Track referral when user signs up with referral code
    Called during signup process
    """
    referral = await affiliate_service.track_referral(
        db, referral_code, referred_user_id, signup_ip
    )
    
    if not referral:
        return {"message": "Invalid or inactive referral code"}
    
    return {
        "message": "Referral tracked successfully",
        "referral_id": referral.id,
        "level": referral.level
    }


# ==================== Commission Rules (Config) ====================

@router.get("/commission-rules", response_model=List[CommissionRuleResponse])
async def get_commission_rules(
    product_type: Optional[str] = Query(None, description="Filter by product type, e.g. 'server'"),
    level: Optional[int] = Query(None, ge=1, le=3, description="Filter by level (1-3)"),
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Get active commission rule configurations (for dynamic frontend display)"""
    from app.models.affiliate import CommissionRule
    from sqlalchemy import select, and_

    conditions = [CommissionRule.is_active == True]
    if product_type:
        conditions.append(CommissionRule.product_type == product_type)
    if level:
        conditions.append(CommissionRule.level == level)

    result = await db.execute(
        select(CommissionRule).where(and_(*conditions)).order_by(CommissionRule.level, CommissionRule.priority.desc())
    )
    rules = result.scalars().all()
    return [CommissionRuleResponse.from_orm(r) for r in rules]
