"""
Affiliate/Referral System Schemas
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


# ==================== Affiliate Subscription ====================

class AffiliateSubscriptionCreate(BaseModel):
    """Create affiliate subscription - payment info"""
    payment_method: str = Field(..., description="Payment method used")
    payment_id: Optional[str] = Field(None, description="Payment transaction ID")
    transaction_id: Optional[str] = Field(None, description="External transaction ID")


class AffiliateSubscriptionResponse(BaseModel):
    """Affiliate subscription response"""
    id: int
    user_id: int
    subscription_type: str  # 'paid' or 'free_with_server'
    amount_paid: Decimal
    currency: str
    referral_code: str
    status: str
    is_active: bool
    is_lifetime: bool
    paid_at: Optional[datetime]
    activated_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Referral Management ====================

class ReferralDetail(BaseModel):
    """Detailed referral information"""
    id: int
    referred_user_id: int
    referred_user_email: str
    referred_user_name: str
    level: int
    referral_code_used: str
    has_purchased: bool
    first_purchase_at: Optional[datetime]
    first_purchase_amount: Optional[Decimal]
    total_commission_earned: Decimal
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TeamMember(BaseModel):
    """Team member with hierarchical info"""
    user_id: int
    email: str
    full_name: str
    level: int
    joined_at: datetime
    has_purchased: bool
    total_purchases: Decimal
    total_commission: Decimal
    active_servers: int
    child_count: int  # Number of referrals under them


# ==================== Commission Tracking ====================

class CommissionDetail(BaseModel):
    """Individual commission record"""
    id: int
    affiliate_user_id: int
    level: int
    order_id: Optional[int]
    order_amount: Decimal
    commission_rate: Decimal
    commission_amount: Decimal
    status: str
    approved_at: Optional[datetime]
    paid_at: Optional[datetime]
    created_at: datetime

    # Related info
    referred_user_email: Optional[str]
    order_description: Optional[str]

    class Config:
        from_attributes = True


# ==================== Payout Management ====================

class PayoutRequest(BaseModel):
    """Create payout request"""
    amount: Decimal = Field(..., gt=0, description="Amount to withdraw")
    payment_method: str = Field(..., description="bank_transfer, upi, paypal, etc")
    payment_details: str = Field(..., description="Account details as JSON string")
    notes: Optional[str] = None

    @validator('amount')
    def validate_minimum_amount(cls, v):
        if v < Decimal('500'):
            raise ValueError('Minimum payout amount is ₹500')
        return v


class PayoutResponse(BaseModel):
    """Payout response"""
    id: int
    affiliate_user_id: int
    amount: Decimal
    currency: str
    payment_method: str
    status: str
    requested_at: datetime
    processed_at: Optional[datetime]
    transaction_id: Optional[str]
    notes: Optional[str]
    admin_notes: Optional[str]

    class Config:
        from_attributes = True


class PayoutActionRequest(BaseModel):
    """Admin action on payout"""
    action: str = Field(..., description="approve, reject, complete")
    transaction_id: Optional[str] = None
    admin_notes: Optional[str] = None


# ==================== Affiliate Stats ====================

class AffiliateStatsResponse(BaseModel):
    """Comprehensive affiliate statistics"""
    # Referral counts
    total_referrals_level1: int
    total_referrals_level2: int
    total_referrals_level3: int
    total_referrals: int
    active_referrals_level1: int
    active_referrals_level2: int
    active_referrals_level3: int
    active_referrals: int

    # Commission totals
    total_commission_earned: Decimal
    pending_commission: Decimal
    approved_commission: Decimal
    paid_commission: Decimal
    available_balance: Decimal

    # Payout info
    total_payouts: int
    total_payout_amount: Decimal
    
    # Subscription info
    subscription_type: Optional[str]
    subscription_status: Optional[str]
    referral_code: Optional[str]
    is_active: bool
    can_request_payout: bool

    class Config:
        from_attributes = True


# ==================== Team Hierarchy ====================

class TeamHierarchy(BaseModel):
    """3-level team hierarchy"""
    user_id: int
    email: str
    full_name: str
    level: int
    joined_at: datetime
    has_purchased: bool
    total_purchases: Decimal
    total_commission_from_user: Decimal
    active_servers: int
    children: List['TeamHierarchy'] = []


TeamHierarchy.model_rebuild()  # Allow self-referencing


# ==================== Dashboard Summary ====================

class AffiliateDashboard(BaseModel):
    """Complete affiliate dashboard data"""
    subscription: Optional[AffiliateSubscriptionResponse]
    stats: AffiliateStatsResponse
    recent_commissions: List[CommissionDetail]
    pending_payouts: List[PayoutResponse]
    team_summary: dict  # L1, L2, L3 counts and totals


# ==================== Server Purchase Tracking ====================

class ServerPurchaseDetail(BaseModel):
    """Server purchase by team member"""
    order_id: int
    user_id: int
    user_email: str
    user_name: str
    level: int  # Level of user who made purchase
    server_name: str
    plan_name: str
    amount: Decimal
    commission_earned: Decimal
    purchase_date: datetime
    renewal_date: Optional[datetime]
    status: str


# ==================== Commission Rules ====================

class CommissionRuleResponse(BaseModel):
    """Commission rule configuration"""
    id: int
    name: str
    description: Optional[str]
    level: int
    product_type: Optional[str]
    commission_type: str
    commission_value: Decimal
    is_active: bool
    
    class Config:
        from_attributes = True


# ==================== Activity Feed ====================

class AffiliateActivity(BaseModel):
    """Activity feed item"""
    id: int
    activity_type: str  # 'referral_joined', 'purchase_made', 'commission_earned', 'payout_requested', etc
    description: str
    amount: Optional[Decimal]
    user_email: Optional[str]
    level: Optional[int]
    created_at: datetime
