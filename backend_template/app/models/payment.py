from sqlalchemy import Column, String, Integer, DateTime, Numeric, ForeignKey, JSON, Index, Text, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class PaymentType(str, enum.Enum):
    """Payment type enum"""
    SUBSCRIPTION = "subscription"  # 499 plan payment
    SERVER = "server"  # Server purchase payment


class ActivationType(str, enum.Enum):
    """How user activated their account"""
    DIRECT = "direct"  # Direct activation without referral
    REFERRAL = "referral"  # Activated via referral code


class PaymentStatus(str, enum.Enum):
    """Payment status enum"""
    INITIATED = "initiated"
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class PaymentTransaction(Base):
    """
    Central payment tracking table for all Razorpay transactions
    Tracks both subscription (499 plan) and server purchase payments
    """
    __tablename__ = "payment_transactions"

    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=True, index=True)  # Linked after order creation

    # Payment Classification
    payment_type = Column(Enum(PaymentType), nullable=False, index=True)
    activation_type = Column(Enum(ActivationType), nullable=False, index=True)

    # Financial Details
    subtotal = Column(Numeric(10, 2), nullable=False)  # Original amount before discount
    discount_applied = Column(Numeric(10, 2), default=0.00)  # User-specific discount
    tax_amount = Column(Numeric(10, 2), default=0.00)
    total_amount = Column(Numeric(10, 2), nullable=False)  # Final amount charged
    currency = Column(String(10), default='INR', nullable=False)

    # Razorpay Details
    razorpay_order_id = Column(String(100), unique=True, nullable=False, index=True)
    razorpay_payment_id = Column(String(100), nullable=True, index=True)
    razorpay_signature = Column(String(255), nullable=True)
    
    # Additional payment metadata from Razorpay
    payment_metadata = Column(JSON, nullable=True)  # Store additional Razorpay response data

    # Payment Status
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.INITIATED, nullable=False, index=True)
    payment_method = Column(String(50), nullable=True)  # card, upi, netbanking, etc.

    # Commission Tracking
    commission_distributed = Column(Boolean, default=False, nullable=False, index=True)
    commission_distributed_at = Column(DateTime(timezone=True), nullable=True)

    # Refund Tracking
    refunded_amount = Column(Numeric(10, 2), default=0.00)
    razorpay_refund_ids = Column(JSON, nullable=True)  # List of refund IDs if any

    # Additional Info
    notes = Column(Text, nullable=True)
    failure_reason = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship(
        "UserProfile",
        back_populates="payment_transactions",
        foreign_keys=[user_id]
    )

    order = relationship(
        "Order",
        back_populates="payment_transaction",
        foreign_keys=[order_id]
    )

    # Indexes for optimal query performance
    __table_args__ = (
        Index('idx_payment_user_type', 'user_id', 'payment_type'),
        Index('idx_payment_user_status', 'user_id', 'payment_status'),
        Index('idx_payment_status_created', 'payment_status', 'created_at'),
        Index('idx_payment_commission', 'commission_distributed', 'payment_status'),
        Index('idx_payment_activation', 'activation_type', 'payment_type'),
    )

    def __repr__(self):
        return f"<PaymentTransaction(id={self.id}, type='{self.payment_type}', status='{self.payment_status}', amount={self.total_amount})>"

    def is_paid(self):
        """Check if payment is successfully paid"""
        return self.payment_status in [PaymentStatus.PAID, PaymentStatus.PARTIALLY_REFUNDED]

    def requires_commission(self):
        """
        Check if this payment requires commission distribution
        Note: Partial refunds still allow commission, but refund handling may need reversal logic
        """
        return (
            self.is_paid() and 
            self.activation_type == ActivationType.REFERRAL and
            not self.commission_distributed and
            self.payment_status != PaymentStatus.REFUNDED  # Full refunds don't get commission
        )
    
    def get_commission_eligible_amount(self):
        """Calculate the amount eligible for commission after refunds"""
        if self.payment_status == PaymentStatus.REFUNDED:
            return 0.00
        return float(self.total_amount - self.refunded_amount)


class ReferralCommissionRate(Base):
    """
    Configuration table for referral commission rates
    Allows flexible commission rates based on level and payment type
    """
    __tablename__ = "referral_commission_rates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Configuration
    level = Column(Integer, nullable=False, index=True)  # 1, 2, or 3
    payment_type = Column(Enum(PaymentType), nullable=False, index=True)
    commission_percent = Column(Numeric(5, 2), nullable=False)  # e.g., 10.00 for 10%
    
    # Active period
    active_from = Column(DateTime(timezone=True), server_default=func.now())
    active_until = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Description
    description = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes and Constraints
    __table_args__ = (
        Index('idx_commission_rate_active', 'level', 'payment_type', 'is_active'),
        # Ensure only one active rate per level and payment_type
        # Note: For unique constraint with is_active=True, consider using a partial index in migration
    )

    def __repr__(self):
        return f"<ReferralCommissionRate(level={self.level}, type='{self.payment_type}', rate={self.commission_percent}%)>"
