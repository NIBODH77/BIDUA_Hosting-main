# # from pydantic import BaseModel, EmailStr, validator
# # from typing import Optional, List
# # from datetime import datetime
# # from decimal import Decimal

# # class UserBase(BaseModel):
# #     email: EmailStr
# #     full_name: str
# #     role: str = "customer"
# #     account_status: str = "active"

# # class UserCreate(UserBase):
# #     password: str
# #     referral_code: Optional[str] = None
# #     phone: Optional[str] = None
# #     company: Optional[str] = None


# # class UserUpdate(BaseModel):
# #     full_name: Optional[str] = None
# #     phone: Optional[str] = None
# #     company: Optional[str] = None
# #     role: Optional[str] = None
# #     account_status: Optional[str] = None

# # class User(UserBase):
# #     id: int
# #     phone: Optional[str] = None
# #     company: Optional[str] = None
    
# #     # Referral fields
# #     referral_code: Optional[str] = None
# #     referred_by: Optional[int] = None
# #     total_referrals: int = 0
# #     l1_referrals: int = 0
# #     l2_referrals: int = 0
# #     l3_referrals: int = 0
# #     total_earnings: Decimal = Decimal('0.00')
# #     available_balance: Decimal = Decimal('0.00')
# #     total_withdrawn: Decimal = Decimal('0.00')
    
# #     created_at: datetime
# #     updated_at: Optional[datetime] = None

# #     class Config:
# #         from_attributes = True

# # # class UserStats(BaseModel):
# # #     total_users: int
# # #     active_users: int
# # #     suspended_users: int
# # #     new_users_today: int
# # #     new_users_this_week: int
# # #     new_users_this_month: int


# # class UserStats(BaseModel):
# #     total_users: int
# #     active_users: int
# #     suspended_users: int
# #     new_users_today: int
# #     new_users_this_week: int
# #     new_users_this_month: int


# # class UserProfileResponse(BaseModel):
# #     user: User
# #     server_count: int = 0
# #     active_servers: int = 0
# #     total_spent: Decimal = Decimal('0.00')

# # class Token(BaseModel):
# #     access_token: str
# #     token_type: str
# #     user: User

# # class LoginRequest(BaseModel):
# #     email: EmailStr
# #     password: str

# # class PasswordChange(BaseModel):
# #     current_password: str
# #     new_password: str

  



# from pydantic import BaseModel, EmailStr, validator, ConfigDict
# from typing import Optional, List
# from datetime import datetime
# from decimal import Decimal

# class UserBase(BaseModel):
#     email: EmailStr
#     full_name: str
#     role: str = "customer"
#     account_status: str = "active"

# class UserCreate(UserBase):
#     password: str
#     referral_code: Optional[str] = None
#     phone: Optional[str] = None
#     company: Optional[str] = None

#     @validator('password')
#     def password_length(cls, v):
#         if len(v) < 6:
#             raise ValueError('Password must be at least 6 characters long')
#         return v

#     @validator('role')
#     def validate_role(cls, v):
#         valid_roles = ['customer', 'admin', 'employee']
#         if v not in valid_roles:
#             raise ValueError(f'Role must be one of: {", ".join(valid_roles)}')
#         return v

#     @validator('account_status')
#     def validate_status(cls, v):
#         valid_statuses = ['active', 'suspended', 'inactive']
#         if v not in valid_statuses:
#             raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
#         return v

# class UserUpdate(BaseModel):
#     full_name: Optional[str] = None
#     phone: Optional[str] = None
#     company: Optional[str] = None
#     role: Optional[str] = None
#     account_status: Optional[str] = None

# class User(UserBase):
#     id: int
#     phone: Optional[str] = None
#     company: Optional[str] = None
    
#     # Referral fields
#     referral_code: Optional[str] = None
#     referred_by: Optional[int] = None
#     referral_level_1: Optional[int] = None
#     referral_level_2: Optional[int] = None
#     referral_level_3: Optional[int] = None
#     total_referrals: int = 0
#     l1_referrals: int = 0
#     l2_referrals: int = 0
#     l3_referrals: int = 0
#     total_earnings: Decimal = Decimal('0.00')
#     available_balance: Decimal = Decimal('0.00')
#     total_withdrawn: Decimal = Decimal('0.00')
    
#     created_at: datetime
#     updated_at: Optional[datetime] = None

#     model_config = ConfigDict(from_attributes=True)

# class UserStats(BaseModel):
#     total_users: int
#     active_users: int
#     suspended_users: int
#     new_users_today: int
#     new_users_this_week: int
#     new_users_this_month: int

# class UserProfileResponse(BaseModel):
#     user: User
#     server_count: int = 0
#     active_servers: int = 0
#     total_spent: Decimal = Decimal('0.00')

# class Token(BaseModel):
#     access_token: str
#     token_type: str
#     user: User

# class LoginRequest(BaseModel):
#     email: EmailStr
#     password: str

# class PasswordChange(BaseModel):
#     current_password: str
#     new_password: str

#     @validator('new_password')
#     def new_password_length(cls, v):
#         if len(v) < 6:
#             raise ValueError('New password must be at least 6 characters long')
#         return v
    



# # 🔹 To show user subscription info
# class SubscriptionInfo(BaseModel):
#     subscription_status: str
#     subscription_start: Optional[datetime]
#     subscription_end: Optional[datetime]

#     class Config:
#         orm_mode = True


# # 🔹 To mark subscription as active (after payment success)
# class SubscriptionActivate(BaseModel):
#     user_id: int
#     plan_name: str
#     amount: float





from pydantic import BaseModel, EmailStr, validator, ConfigDict
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "customer"
    account_status: str = "active"

class UserCreate(UserBase):
    password: str
    referral_code: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None

    @validator('password')
    def password_length(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

    @validator('role')
    def validate_role(cls, v):
        valid_roles = ['customer', 'admin', 'employee']
        if v not in valid_roles:
            raise ValueError(f'Role must be one of: {", ".join(valid_roles)}')
        return v

    @validator('account_status')
    def validate_status(cls, v):
        valid_statuses = ['active', 'suspended', 'inactive']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    account_status: Optional[str] = None

class User(UserBase):
    id: int
    phone: Optional[str] = None
    company: Optional[str] = None
    
    # Referral fields
    referral_code: Optional[str] = None
    referred_by: Optional[int] = None
    referral_level_1: Optional[int] = None
    referral_level_2: Optional[int] = None
    referral_level_3: Optional[int] = None
    total_referrals: int = 0
    l1_referrals: int = 0
    l2_referrals: int = 0
    l3_referrals: int = 0
    total_earnings: Decimal = Decimal('0.00')
    available_balance: Decimal = Decimal('0.00')
    total_withdrawn: Decimal = Decimal('0.00')
    
    # Subscription fields
    subscription_status: str = "inactive"
    subscription_start: Optional[datetime] = None
    subscription_end: Optional[datetime] = None
    
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UserStats(BaseModel):
    total_users: int
    active_users: int
    suspended_users: int
    new_users_today: int
    new_users_this_week: int
    new_users_this_month: int

class UserProfileResponse(BaseModel):
    user: User
    server_count: int = 0
    active_servers: int = 0
    total_spent: Decimal = Decimal('0.00')

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @validator('new_password')
    def new_password_length(cls, v):
        if len(v) < 6:
            raise ValueError('New password must be at least 6 characters long')
        return v

# 🔹 To show user subscription info
class SubscriptionInfo(BaseModel):
    subscription_status: str
    subscription_start: Optional[datetime]
    subscription_end: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

# 🔹 To mark subscription as active (after payment success)
class SubscriptionActivate(BaseModel):
    user_id: int
    plan_name: str
    amount: float