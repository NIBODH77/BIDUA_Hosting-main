from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class UserSettingsBase(BaseModel):
    language: str = "en"
    timezone: str = "UTC"
    date_format: str = "YYYY-MM-DD"
    two_factor_enabled: bool = False
    login_alerts: bool = True
    email_notifications: bool = True
    push_notifications: bool = True
    sms_notifications: bool = False

class UserSettingsCreate(UserSettingsBase):
    user_id: int

class UserSettingsUpdate(BaseModel):
    language: Optional[str] = None
    timezone: Optional[str] = None
    date_format: Optional[str] = None
    two_factor_enabled: Optional[bool] = None
    login_alerts: Optional[bool] = None
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None

class UserSettings(UserSettingsBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SecuritySettings(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @validator('new_password')
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

    @validator('confirm_password')
    def validate_password_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

class NotificationSettings(BaseModel):
    email_notifications: bool = True
    server_alerts: bool = True
    billing_alerts: bool = True
    maintenance_alerts: bool = True
    marketing_emails: bool = False

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None

    @validator('phone')
    def validate_phone(cls, v):
        if v and not v.replace(' ', '').replace('-', '').replace('+', '').isdigit():
            raise ValueError('Phone number must contain only digits and valid symbols')
        return v