"""
Affiliate/Referral System Models
Handles multi-level referral tracking, commissions, and payouts
"""
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Numeric, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class AffiliateStatus(str, enum.Enum):
    """Affiliate account status"""
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    INACTIVE = "inactive"


class CommissionStatus(str, enum.Enum):
    """Commission payment status"""
    PENDING = "pending"
    APPROVED = "approved"
    PAID = "paid"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class PayoutStatus(str, enum.Enum):
    """Payout request status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AffiliateSubscription(Base):
    """
    Affiliate subscription records - ₹499 one-time fee or free with server purchase
    """
    __tablename__ = "affiliate_subscriptions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id', ondelete='CASCADE'), nullable=False, unique=True)
    
    # Subscription details
    subscription_type = Column(String(20), nullable=False)  # 'paid' or 'free_with_server'
    amount_paid = Column(Numeric(10, 2), default=0.00)  # ₹499 or ₹0
    currency = Column(String(3), default='INR')
    
    # Referral code
    referral_code = Column(String(20), unique=True, nullable=False, index=True)
    
    # Status
    status = Column(SQLEnum(AffiliateStatus), default=AffiliateStatus.PENDING, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_lifetime = Column(Boolean, default=True, nullable=False)  # Lifetime subscription
    
    # Payment info
    payment_id = Column(String(100), nullable=True)
    payment_method = Column(String(50), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # Activation
    activated_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)  # NULL for lifetime
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    referrals = relationship("Referral", foreign_keys="[Referral.referrer_id]", back_populates="referrer")
    
    def __repr__(self):
        return f"<AffiliateSubscription(user_id={self.user_id}, code='{self.referral_code}', status='{self.status}')>"


class Referral(Base):
    """
    Tracks referral relationships - up to 3 levels deep
    """
    __tablename__ = "referrals"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Referral relationship
    referrer_id = Column(Integer, ForeignKey('affiliate_subscriptions.user_id', ondelete='CASCADE'), nullable=False, index=True)
    referred_user_id = Column(Integer, ForeignKey('users_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Level tracking (1, 2, or 3)
    level = Column(Integer, nullable=False, default=1)  # 1=direct, 2=second level, 3=third level
    
    # Parent referral (for level 2 and 3)
    parent_referral_id = Column(Integer, ForeignKey('referrals.id'), nullable=True)
    
    # Tracking
    referral_code_used = Column(String(20), nullable=False)
    signup_ip = Column(String(50), nullable=True)
    signup_user_agent = Column(Text, nullable=True)
    
    # Conversion tracking
    has_purchased = Column(Boolean, default=False)
    first_purchase_at = Column(DateTime(timezone=True), nullable=True)
    first_purchase_amount = Column(Numeric(10, 2), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    referrer = relationship("AffiliateSubscription", foreign_keys=[referrer_id], back_populates="referrals")
    parent = relationship("Referral", remote_side=[id], backref="child_referrals")
    commissions = relationship("Commission", back_populates="referral")
    
    def __repr__(self):
        return f"<Referral(referrer_id={self.referrer_id}, referred_user_id={self.referred_user_id}, level={self.level})>"


class CommissionRule(Base):
    """
    Defines commission rates for different levels and products
    """
    __tablename__ = "commission_rules"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Rule identification
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    
    # Level and product
    level = Column(Integer, nullable=False)  # 1, 2, or 3
    product_type = Column(String(50), nullable=True)  # 'server', 'domain', 'all', etc.
    
    # Commission rates
    commission_type = Column(String(20), nullable=False)  # 'percentage' or 'fixed'
    commission_value = Column(Numeric(10, 2), nullable=False)  # Percentage (e.g., 10.00) or fixed amount
    
    # Conditions
    min_purchase_amount = Column(Numeric(10, 2), nullable=True)
    max_purchase_amount = Column(Numeric(10, 2), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    priority = Column(Integer, default=0)  # Higher priority rules apply first
    
    # Validity
    valid_from = Column(DateTime(timezone=True), nullable=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<CommissionRule(name='{self.name}', level={self.level}, value={self.commission_value})>"


class Commission(Base):
    """
    Individual commission records earned from referrals
    """
    __tablename__ = "commissions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Who earns the commission
    affiliate_user_id = Column(Integer, ForeignKey('users_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Source of commission
    referral_id = Column(Integer, ForeignKey('referrals.id', ondelete='SET NULL'), nullable=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='SET NULL'), nullable=True)
    
    # Commission details
    level = Column(Integer, nullable=False)  # Which level this commission is from (1, 2, or 3)
    commission_rule_id = Column(Integer, ForeignKey('commission_rules.id'), nullable=True)
    
    # Amounts
    order_amount = Column(Numeric(10, 2), nullable=False)
    commission_rate = Column(Numeric(5, 2), nullable=False)  # Percentage or fixed rate applied
    commission_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default='INR')
    
    # Status and payment
    status = Column(SQLEnum(CommissionStatus), default=CommissionStatus.PENDING, nullable=False)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    approved_by = Column(Integer, ForeignKey('users_profiles.id'), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    payout_id = Column(Integer, ForeignKey('payouts.id'), nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    referral = relationship("Referral", back_populates="commissions")
    payout = relationship("Payout", back_populates="commissions")
    
    def __repr__(self):
        return f"<Commission(id={self.id}, affiliate_user_id={self.affiliate_user_id}, amount={self.commission_amount}, status='{self.status}')>"


class Payout(Base):
    """
    Payout requests and history for affiliates
    """
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Affiliate receiving payout
    affiliate_user_id = Column(Integer, ForeignKey('users_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Payout details
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default='INR')
    
    # Payment method
    payment_method = Column(String(50), nullable=False)  # 'bank_transfer', 'upi', 'paypal', etc.
    payment_details = Column(Text, nullable=True)  # JSON string with account details
    
    # Status
    status = Column(SQLEnum(PayoutStatus), default=PayoutStatus.PENDING, nullable=False)
    
    # Processing
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    processed_by = Column(Integer, ForeignKey('users_profiles.id'), nullable=True)
    
    # Transaction details
    transaction_id = Column(String(100), nullable=True)
    transaction_reference = Column(String(200), nullable=True)
    
    # Notes and remarks
    notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    commissions = relationship("Commission", back_populates="payout")
    
    def __repr__(self):
        return f"<Payout(id={self.id}, affiliate_user_id={self.affiliate_user_id}, amount={self.amount}, status='{self.status}')>"


class AffiliateStats(Base):
    """
    Cached statistics for affiliate performance
    """
    __tablename__ = "affiliate_stats"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    affiliate_user_id = Column(Integer, ForeignKey('users_profiles.id', ondelete='CASCADE'), nullable=False, unique=True)
    
    # Referral counts by level
    total_referrals_level1 = Column(Integer, default=0)
    total_referrals_level2 = Column(Integer, default=0)
    total_referrals_level3 = Column(Integer, default=0)
    total_referrals = Column(Integer, default=0)
    
    # Active referrals (who have made purchases)
    active_referrals_level1 = Column(Integer, default=0)
    active_referrals_level2 = Column(Integer, default=0)
    active_referrals_level3 = Column(Integer, default=0)
    active_referrals = Column(Integer, default=0)
    
    # Commission totals
    total_commission_earned = Column(Numeric(12, 2), default=0.00)
    pending_commission = Column(Numeric(12, 2), default=0.00)
    approved_commission = Column(Numeric(12, 2), default=0.00)
    paid_commission = Column(Numeric(12, 2), default=0.00)
    
    # Payout info
    total_payouts = Column(Integer, default=0)
    total_payout_amount = Column(Numeric(12, 2), default=0.00)
    available_balance = Column(Numeric(12, 2), default=0.00)
    
    # Last updated
    last_calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<AffiliateStats(affiliate_user_id={self.affiliate_user_id}, total_earned={self.total_commission_earned})>"
