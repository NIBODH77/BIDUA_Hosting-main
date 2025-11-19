from decimal import Decimal
from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.payment import PaymentTransaction, PaymentType, ActivationType, PaymentStatus
from app.models.users import UserProfile
from app.models.order import Order
from app.services.razorpay_service import RazorpayService


class PaymentService:
    """
    Orchestrates payment processing including:
    - Payment transaction creation
    - Discount calculation and application
    - Razorpay integration
    - Payment verification
    - Transaction state management
    """

    def __init__(self):
        self.razorpay_service = RazorpayService()

    async def create_payment_transaction(
        self,
        db: AsyncSession,
        user_id: int,
        payment_type: PaymentType,
        amount: Decimal,
        plan_id: Optional[int] = None,
        billing_cycle: Optional[str] = 'one_time',
        metadata: Optional[Dict[str, Any]] = None
    ) -> PaymentTransaction:
        """
        Create a payment transaction and initialize Razorpay order
        
        Args:
            db: Database session
            user_id: User making the payment
            payment_type: SUBSCRIPTION or SERVER
            amount: Base amount before discount
            plan_id: Plan ID (for subscription)
            billing_cycle: Billing cycle (for subscription)
            metadata: Additional metadata
        
        Returns:
            PaymentTransaction with Razorpay order details
        """
        # Get user details
        result = await db.execute(
            select(UserProfile).where(UserProfile.id == user_id)
        )
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Special handling for ₹499 Premium Subscription
        is_premium_plan = metadata and metadata.get('is_premium_plan', False)
        skip_backend_calculation = metadata and metadata.get('skip_backend_calculation', False)
        
        if is_premium_plan:
            # ₹499 Premium Plan: No discount, No tax
            discount_amount = Decimal('0.00')
            tax_amount = Decimal('0.00')
            total_amount = amount  # Exactly ₹499
        elif skip_backend_calculation:
            # Frontend already calculated everything (addons + tax)
            # Use amount as final total, don't recalculate
            discount_amount = Decimal('0.00')
            tax_amount = Decimal('0.00')
            total_amount = amount  # Use frontend's calculated total as-is
        else:
            # Server purchase: Apply discount and tax
            discount_amount = self._calculate_discount(amount, user.discount_percent)
            tax_amount = self._calculate_tax(amount - discount_amount)
            total_amount = amount - discount_amount + tax_amount

        # Determine activation type
        activation_type = ActivationType.REFERRAL if user.referred_by else ActivationType.DIRECT

        # Create Razorpay order
        razorpay_order = await self.razorpay_service.create_razorpay_order(
            amount=total_amount,
            user_id=user_id,
            payment_type=payment_type.value,
            metadata=metadata or {}
        )


        print("razorpay order created:", razorpay_order)

        # Create payment transaction record
        payment_transaction = PaymentTransaction(
            user_id=user_id,
            payment_type=payment_type,
            activation_type=activation_type,
            subtotal=amount,
            discount_applied=discount_amount,
            tax_amount=tax_amount,
            total_amount=total_amount,
            currency='INR',
            razorpay_order_id=razorpay_order['id'],
            payment_status=PaymentStatus.INITIATED,
            payment_metadata=metadata
        )

        db.add(payment_transaction)
        await db.commit()
        await db.refresh(payment_transaction)

        return payment_transaction

    async def verify_and_complete_payment(
        self,
        db: AsyncSession,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str
    ) -> PaymentTransaction:
        """
        Verify Razorpay payment and mark transaction as paid
        
        Args:
            db: Database session
            razorpay_order_id: Razorpay order ID
            razorpay_payment_id: Razorpay payment ID
            razorpay_signature: Razorpay signature for verification
        
        Returns:
            Updated PaymentTransaction
        """
        # Verify signature
        is_valid = await self.razorpay_service.verify_payment_signature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )

        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail="Invalid payment signature"
            )

        # Find payment transaction
        result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.razorpay_order_id == razorpay_order_id
            )
        )
        payment_transaction = result.scalars().first()

        if not payment_transaction:
            raise HTTPException(
                status_code=404,
                detail="Payment transaction not found"
            )

        # Fetch payment details from Razorpay
        payment_details = await self.razorpay_service.fetch_payment_details(
            razorpay_payment_id
        )

        # Update payment transaction
        payment_transaction.razorpay_payment_id = razorpay_payment_id
        payment_transaction.razorpay_signature = razorpay_signature
        payment_transaction.payment_status = PaymentStatus.PAID
        payment_transaction.payment_method = payment_details.get('method', 'unknown')
        payment_transaction.paid_at = datetime.utcnow()
        
        # Store additional Razorpay metadata
        if payment_details:
            payment_transaction.payment_metadata = {
                **(payment_transaction.payment_metadata or {}),
                'razorpay_details': payment_details
            }

        await db.commit()
        await db.refresh(payment_transaction)

        return payment_transaction

    async def link_payment_to_order(
        self,
        db: AsyncSession,
        payment_transaction_id: int,
        order_id: int
    ):
        """
        Link a payment transaction to an order after order creation
        
        Args:
            db: Database session
            payment_transaction_id: PaymentTransaction ID
            order_id: Order ID
        """
        result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.id == payment_transaction_id
            )
        )
        payment_transaction = result.scalars().first()

        if payment_transaction:
            payment_transaction.order_id = order_id
            await db.commit()

    def _calculate_discount(self, amount: Decimal, discount_percent: Decimal) -> Decimal:
        """Calculate discount amount based on percentage"""
        if discount_percent <= 0:
            return Decimal('0.00')
        return (amount * discount_percent / Decimal('100')).quantize(Decimal('0.01'))

    def _calculate_tax(self, amount: Decimal, tax_rate: Decimal = Decimal('18.00')) -> Decimal:
        """Calculate tax amount (default 18% GST for India)"""
        return (amount * tax_rate / Decimal('100')).quantize(Decimal('0.01'))

    async def get_payment_by_razorpay_order_id(
        self,
        db: AsyncSession,
        razorpay_order_id: str
    ) -> Optional[PaymentTransaction]:
        """Get payment transaction by Razorpay order ID"""
        result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.razorpay_order_id == razorpay_order_id
            )
        )
        return result.scalars().first()

    async def mark_payment_failed(
        self,
        db: AsyncSession,
        razorpay_order_id: str,
        reason: str
    ):
        """Mark a payment as failed"""
        result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.razorpay_order_id == razorpay_order_id
            )
        )
        payment_transaction = result.scalars().first()

        if payment_transaction:
            payment_transaction.payment_status = PaymentStatus.FAILED
            payment_transaction.failure_reason = reason
            await db.commit()
