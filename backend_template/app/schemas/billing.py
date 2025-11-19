from pydantic import BaseModel, validator
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal

class PaymentMethodBase(BaseModel):
    type: str
    brand: Optional[str] = None
    last4: Optional[str] = None
    expiry_month: Optional[int] = None
    expiry_year: Optional[int] = None
    is_default: bool = False

class PaymentMethodCreate(PaymentMethodBase):
    card_holder_name: Optional[str] = None
    upi_id: Optional[str] = None
    bank_name: Optional[str] = None
    account_number: Optional[str] = None

    @validator('type')
    def validate_type(cls, v):
        valid_types = ['card', 'upi', 'net_banking']
        if v not in valid_types:
            raise ValueError(f'Payment method type must be one of: {", ".join(valid_types)}')
        return v

class PaymentMethod(PaymentMethodBase):
    id: int
    user_id: int
    is_active: bool = True
    card_holder_name: Optional[str] = None
    upi_id: Optional[str] = None
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BillingSettingsBase(BaseModel):
    email_notifications: bool = True
    server_alerts: bool = True
    billing_alerts: bool = True
    maintenance_alerts: bool = True
    marketing_emails: bool = False
    auto_renewal: bool = True
    
    # Billing Address
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    
    # Company information
    company_name: Optional[str] = None
    tax_id: Optional[str] = None
    
    # Billing Contact
    billing_email: Optional[str] = None
    billing_phone: Optional[str] = None
    
    # Delivery preferences
    invoice_delivery: str = 'email'  # email, dashboard

class BillingSettingsCreate(BillingSettingsBase):
    pass

class BillingSettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    server_alerts: Optional[bool] = None
    billing_alerts: Optional[bool] = None
    maintenance_alerts: Optional[bool] = None
    marketing_emails: Optional[bool] = None
    auto_renewal: Optional[bool] = None
    
    # Billing Address
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    
    # Company information
    company_name: Optional[str] = None
    tax_id: Optional[str] = None
    
    # Billing Contact
    billing_email: Optional[str] = None
    billing_phone: Optional[str] = None
    
    # Delivery preferences
    invoice_delivery: Optional[str] = None

class BillingSettings(BillingSettingsBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Legacy field for backward compatibility
    billing_address: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class BillingAddress(BaseModel):
    street: str
    city: str
    state: str
    country: str
    postal_code: str
    phone: Optional[str] = None

class CurrentBalance(BaseModel):
    balance: Decimal
    currency: str = "INR"
    last_updated: datetime