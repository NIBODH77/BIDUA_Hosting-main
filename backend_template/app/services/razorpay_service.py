
import razorpay
from decimal import Decimal
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.order import Order
from app.models.users import UserProfile


class RazorpayService:
    """Handle Razorpay payment operations"""

    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    async def create_order(
        self,
        db: AsyncSession,
        user_id: int,
        plan_id: int,
        billing_cycle: str,
        amount: Decimal,
        referral_code: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create Razorpay order for subscription payment
        """
        # Convert amount to paisa (Razorpay uses smallest currency unit)
        amount_paisa = int(amount * 100)

        # Verify referral code if provided
        referrer_id = None
        if referral_code:
            referrer_id = await self._verify_referral_code(db, referral_code)

        # Create Razorpay order
        razorpay_order = self.client.order.create({
            'amount': amount_paisa,
            'currency': 'INR',
            'payment_capture': 1,
            'notes': {
                'user_id': user_id,
                'plan_id': plan_id,
                'billing_cycle': billing_cycle,
                'referrer_id': referrer_id if referrer_id else 'none'
            }
        })

        return {
            'order_id': razorpay_order['id'],
            'amount': amount,
            'currency': 'INR',
            'key_id': settings.RAZORPAY_KEY_ID,
            'referrer_id': referrer_id
        }

    async def verify_payment(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str
    ) -> bool:
        """
        Verify Razorpay payment signature
        """
        return await self.verify_payment_signature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )

    async def verify_payment_signature(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str
    ) -> bool:
        """
        Verify Razorpay payment signature
        """
        try:
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except razorpay.errors.SignatureVerificationError:
            return False

    async def create_razorpay_order(
        self,
        amount: Decimal,
        user_id: int,
        payment_type: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create a Razorpay order
        
        Args:
            amount: Amount in INR
            user_id: User ID
            payment_type: Type of payment (subscription/server)
            metadata: Additional metadata
        
        Returns:
            Razorpay order details
        """
        # Convert amount to paisa (Razorpay uses smallest currency unit)
        amount_paisa = int(amount * 100)

        # Create Razorpay order
        razorpay_order = self.client.order.create({
            'amount': amount_paisa,
            'currency': 'INR',
            'payment_capture': 1,
            'notes': {
                'user_id': str(user_id),
                'payment_type': payment_type,
                **metadata
            }
        })

        return razorpay_order

    async def _verify_referral_code(
        self,
        db: AsyncSession,
        referral_code: str
    ) -> Optional[int]:
        """
        Verify referral code and return referrer user_id
        """
        # Extract user ID from referral code (format: REF0001)
        if not referral_code.startswith('REF'):
            return None

        try:
            user_id = int(referral_code[3:])
            result = await db.execute(
                select(UserProfile).where(UserProfile.id == user_id)
            )
            user = result.scalar_one_or_none()
            return user.id if user else None
        except (ValueError, IndexError):
            return None

    async def fetch_payment_details(self, payment_id: str) -> Dict[str, Any]:
        """
        Fetch payment details from Razorpay
        """
        try:
            payment = self.client.payment.fetch(payment_id)
            return payment
        except Exception as e:
            return {'error': str(e)}

    async def process_webhook(self, payload: Dict[str, Any], signature: str) -> bool:
        """
        Process Razorpay webhook
        """
        try:
            self.client.utility.verify_webhook_signature(
                payload,
                signature,
                settings.RAZORPAY_KEY_SECRET
            )
            return True
        except razorpay.errors.SignatureVerificationError:
            return False
