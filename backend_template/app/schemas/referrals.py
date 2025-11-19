# from pydantic import BaseModel, validator
# from typing import Optional, Dict, Any
# from datetime import datetime
# from decimal import Decimal

# class ReferralPayoutBase(BaseModel):
#     gross_amount: Decimal
#     payment_method: str
#     bank_account_details: Optional[Dict[str, Any]] = None
#     tax_year: str
#     tax_quarter: str

# class ReferralPayoutCreate(ReferralPayoutBase):
#     pass

# class ReferralPayout(ReferralPayoutBase):
#     id: int
#     user_id: int
#     payout_number: str
#     tds_amount: Decimal
#     service_tax_amount: Decimal
#     net_amount: Decimal
#     status: str = "requested"
#     payment_reference: Optional[str] = None
#     rejected_reason: Optional[str] = None
#     requested_at: datetime
#     processed_at: Optional[datetime] = None

#     class Config:
#         from_attributes = True

# class ReferralPayoutAction(BaseModel):
#     action: str  # approve, reject
#     payment_reference: Optional[str] = None
#     reject_reason: Optional[str] = None

#     @validator('action')
#     def validate_action(cls, v):
#         if v not in ['approve', 'reject']:
#             raise ValueError('Action must be either "approve" or "reject"')
#         return v

#     @validator('payment_reference')
#     def validate_payment_reference(cls, v, values):
#         if values.get('action') == 'approve' and not v:
#             raise ValueError('Payment reference is required for approval')
#         return v

#     @validator('reject_reason')
#     def validate_reject_reason(cls, v, values):
#         if values.get('action') == 'reject' and not v:
#             raise ValueError('Reject reason is required for rejection')
#         return v

# class ReferralEarning(BaseModel):
#     id: int
#     user_id: int
#     referred_user_id: int
#     order_id: int
#     level: int
#     commission_rate: Decimal
#     order_amount: Decimal
#     commission_amount: Decimal
#     status: str = "pending"
#     earned_at: datetime
#     paid_at: Optional[datetime] = None

#     class Config:
#         from_attributes = True

# class ReferralStats(BaseModel):
#     total_referrals: int
#     l1_referrals: int
#     l2_referrals: int
#     l3_referrals: int
#     total_earnings: Decimal
#     available_balance: Decimal
#     total_withdrawn: Decimal
#     can_request_payout: bool = False
#     referral_code: Optional[str] = None

# class BankAccountDetails(BaseModel):
#     account_holder: str
#     account_number: str
#     ifsc_code: str
#     bank_name: str
#     branch: Optional[str] = None

# class CommissionStructure(BaseModel):
#     level_1_rate: Decimal = Decimal('0.05')  # 5%
#     level_2_rate: Decimal = Decimal('0.01')  # 1%
#     level_3_rate: Decimal = Decimal('0.01')  # 1%
#     long_term_level_1_rate: Decimal = Decimal('0.15')  # 15%
#     long_term_level_2_rate: Decimal = Decimal('0.03')  # 3%
#     long_term_level_3_rate: Decimal = Decimal('0.02')  # 2%






# from pydantic import BaseModel, field_validator
# from typing import Optional, Dict, Any
# from datetime import datetime
# from decimal import Decimal


# # ----------------------------
# # ✅ Base Schema for Payouts
# # ----------------------------
# class ReferralPayoutBase(BaseModel):
#     gross_amount: Decimal
#     payment_method: str
#     bank_account_details: Optional[Dict[str, Any]] = None
#     tax_year: str
#     tax_quarter: str


# # ----------------------------
# # ✅ Create / DB Representation
# # ----------------------------
# class ReferralPayoutCreate(ReferralPayoutBase):
#     pass


# class ReferralPayout(ReferralPayoutBase):
#     id: int
#     user_id: int
#     payout_number: str
#     tds_amount: Decimal
#     service_tax_amount: Decimal
#     net_amount: Decimal
#     status: str = "requested"
#     payment_reference: Optional[str] = None
#     rejected_reason: Optional[str] = None
#     requested_at: datetime
#     processed_at: Optional[datetime] = None

#     class Config:
#         from_attributes = True  # Works with ORM models


# # ----------------------------
# # ✅ Payout Action (Approve / Reject)
# # ----------------------------
# class ReferralPayoutAction(BaseModel):
#     action: str  # approve or reject
#     payment_reference: Optional[str] = None
#     reject_reason: Optional[str] = None

#     @field_validator('action')
#     @classmethod
#     def validate_action(cls, v):
#         allowed = ['approve', 'reject']
#         if v not in allowed:
#             raise ValueError(f'Action must be one of {allowed}')
#         return v

#     @field_validator('payment_reference')
#     @classmethod
#     def validate_payment_reference(cls, v, values):
#         if values.get('action') == 'approve' and not v:
#             raise ValueError('Payment reference is required for approval')
#         return v

#     @field_validator('reject_reason')
#     @classmethod
#     def validate_reject_reason(cls, v, values):
#         if values.get('action') == 'reject' and not v:
#             raise ValueError('Reject reason is required for rejection')
#         return v


# # ----------------------------
# # ✅ Referral Earning Schema
# # ----------------------------
# class ReferralEarning(BaseModel):
#     id: int
#     user_id: int
#     referred_user_id: int
#     order_id: int
#     level: int
#     commission_rate: Decimal
#     order_amount: Decimal
#     commission_amount: Decimal
#     status: str = "pending"
#     earned_at: datetime
#     paid_at: Optional[datetime] = None

#     class Config:
#         from_attributes = True




# class ReferralStats(BaseModel):
#     total_referrals: int
#     l1_referrals: int
#     l2_referrals: int
#     l3_referrals: int
#     total_earnings: Decimal
#     pending_payouts: Decimal
#     completed_payouts: Decimal
#     available_balance: Decimal
#     total_withdrawn: Decimal
#     can_request_payout: bool
#     referral_code: str


# # ----------------------------
# # ✅ Bank Account Details
# # ----------------------------
# class BankAccountDetails(BaseModel):
#     account_holder: str
#     account_number: str
#     ifsc_code: str
#     bank_name: str
#     branch: Optional[str] = None


# # ----------------------------
# # ✅ Commission Structure
# # ----------------------------
# class CommissionStructure(BaseModel):
#     level_1_rate: Decimal = Decimal('0.05')   # 5%
#     level_2_rate: Decimal = Decimal('0.01')   # 1%
#     level_3_rate: Decimal = Decimal('0.01')   # 1%
#     long_term_level_1_rate: Decimal = Decimal('0.15')  # 15%
#     long_term_level_2_rate: Decimal = Decimal('0.03')  # 3%
#     long_term_level_3_rate: Decimal = Decimal('0.02')  # 2%






from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal


# ----------------------------
# ✅ Base Schema for Payouts
# ----------------------------
class ReferralPayoutBase(BaseModel):
    gross_amount: Decimal
    payment_method: str
    bank_account_details: Optional[Dict[str, Any]] = None
    tax_year: str
    tax_quarter: str

    @field_validator('gross_amount')
    @classmethod
    def validate_gross_amount(cls, v):
        if v <= 0:
            raise ValueError('Gross amount must be greater than 0')
        return v

    @field_validator('tax_year')
    @classmethod
    def validate_tax_year(cls, v):
        if not v.isdigit() or len(v) != 4:
            raise ValueError('Tax year must be a 4-digit year')
        return v

    @field_validator('tax_quarter')
    @classmethod
    def validate_tax_quarter(cls, v):
        if v not in ['Q1', 'Q2', 'Q3', 'Q4']:
            raise ValueError('Tax quarter must be Q1, Q2, Q3, or Q4')
        return v


# ----------------------------
# ✅ Create / DB Representation
# ----------------------------
class ReferralPayoutCreate(ReferralPayoutBase):
    pass


class ReferralPayout(ReferralPayoutBase):
    id: int
    user_id: int
    payout_number: str
    tds_amount: Decimal
    service_tax_amount: Decimal
    net_amount: Decimal
    status: str = "requested"
    payment_reference: Optional[str] = None
    rejected_reason: Optional[str] = None
    requested_at: datetime
    processed_at: Optional[datetime] = None

    # 🔹 FIX: Use new Pydantic v2 style config
    model_config = ConfigDict(from_attributes=True)


# ----------------------------
# ✅ Payout Action (Approve / Reject)
# ----------------------------
class ReferralPayoutAction(BaseModel):
    action: str  # approve or reject
    payment_reference: Optional[str] = None
    reject_reason: Optional[str] = None

    @field_validator('action')
    @classmethod
    def validate_action(cls, v):
        allowed = ['approve', 'reject']
        if v not in allowed:
            raise ValueError(f'Action must be one of {allowed}')
        return v

    @field_validator('payment_reference')
    @classmethod
    def validate_payment_reference(cls, v, info):
        if info.data.get('action') == 'approve' and not v:
            raise ValueError('Payment reference is required for approval')
        return v

    @field_validator('reject_reason')
    @classmethod
    def validate_reject_reason(cls, v, info):
        if info.data.get('action') == 'reject' and not v:
            raise ValueError('Reject reason is required for rejection')
        return v


# ----------------------------
# ✅ Referral Earning Schema
# ----------------------------
class ReferralEarning(BaseModel):
    id: int
    user_id: int
    referred_user_id: int
    order_id: int
    level: int
    commission_rate: Decimal
    order_amount: Decimal
    commission_amount: Decimal
    status: str = "pending"
    earned_at: datetime
    paid_at: Optional[datetime] = None

    # 🔹 FIX: Use new Pydantic v2 style config
    model_config = ConfigDict(from_attributes=True)

    @field_validator('level')
    @classmethod
    def validate_level(cls, v):
        if v not in [1, 2, 3]:
            raise ValueError('Level must be 1, 2, or 3')
        return v

    @field_validator('commission_rate')
    @classmethod
    def validate_commission_rate(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Commission rate must be between 0 and 100')
        return v


# ----------------------------
# ✅ Referral Stats Schema
# ----------------------------
class ReferralStats(BaseModel):
    total_referrals: int
    l1_referrals: int
    l2_referrals: int
    l3_referrals: int
    total_earnings: Decimal
    pending_payouts: Decimal
    completed_payouts: Decimal
    available_balance: Decimal
    total_withdrawn: Decimal
    can_request_payout: bool
    referral_code: str

    # 🔹 FIX: Add validation for positive values
    @field_validator('total_referrals', 'l1_referrals', 'l2_referrals', 'l3_referrals')
    @classmethod
    def validate_positive_ints(cls, v):
        if v < 0:
            raise ValueError('Referral counts cannot be negative')
        return v

    @field_validator('total_earnings', 'pending_payouts', 'completed_payouts', 
                    'available_balance', 'total_withdrawn')
    @classmethod
    def validate_positive_decimals(cls, v):
        if v < 0:
            raise ValueError('Amounts cannot be negative')
        return v


# ----------------------------
# ✅ Bank Account Details
# ----------------------------
class BankAccountDetails(BaseModel):
    account_holder: str
    account_number: str
    ifsc_code: str
    bank_name: str
    branch: Optional[str] = None

    @field_validator('account_number')
    @classmethod
    def validate_account_number(cls, v):
        if not v.isdigit() or len(v) < 9 or len(v) > 18:
            raise ValueError('Account number must be 9-18 digits')
        return v

    @field_validator('ifsc_code')
    @classmethod
    def validate_ifsc_code(cls, v):
        if len(v) != 11 or not v[:4].isalpha() or not v[4:].isalnum():
            raise ValueError('IFSC code must be 11 characters (4 letters + 7 alphanumeric)')
        return v


# ----------------------------
# ✅ Commission Structure
# ----------------------------
class CommissionStructure(BaseModel):
    level_1_rate: Decimal = Decimal('0.05')   # 5%
    level_2_rate: Decimal = Decimal('0.01')   # 1%
    level_3_rate: Decimal = Decimal('0.01')   # 1%
    long_term_level_1_rate: Decimal = Decimal('0.15')  # 15%
    long_term_level_2_rate: Decimal = Decimal('0.03')  # 3%
    long_term_level_3_rate: Decimal = Decimal('0.02')  # 2%

    @field_validator('level_1_rate', 'level_2_rate', 'level_3_rate', 
                    'long_term_level_1_rate', 'long_term_level_2_rate', 'long_term_level_3_rate')
    @classmethod
    def validate_rates(cls, v):
        if v < 0 or v > 1:
            raise ValueError('Commission rates must be between 0 and 1')
        return v


# ----------------------------
# ✅ NEW: Payout Request Schema
# ----------------------------
class PayoutRequest(BaseModel):
    gross_amount: Decimal
    payment_method: str
    bank_account_details: BankAccountDetails  # 🔹 Use the specific schema
    tax_year: str
    tax_quarter: str

    @field_validator('gross_amount')
    @classmethod
    def validate_gross_amount(cls, v):
        if v <= 0:
            raise ValueError('Gross amount must be greater than 0')
        return v


# ----------------------------
# ✅ NEW: Referral Earning Create Schema
# ----------------------------
class ReferralEarningCreate(BaseModel):
    user_id: int
    referred_user_id: int
    order_id: int
    level: int
    commission_rate: Decimal
    order_amount: Decimal

    @field_validator('level')
    @classmethod
    def validate_level(cls, v):
        if v not in [1, 2, 3]:
            raise ValueError('Level must be 1, 2, or 3')
        return v