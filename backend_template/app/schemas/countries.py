from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CountryBase(BaseModel):
    name: str
    code: str
    alpha3_code: Optional[str] = None
    numeric_code: Optional[str] = None
    phone_code: Optional[str] = None
    currency_code: Optional[str] = None
    currency_name: Optional[str] = None
    flag_emoji: Optional[str] = None
    is_active: bool = True


class CountryCreate(CountryBase):
    pass


class CountryUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    alpha3_code: Optional[str] = None
    numeric_code: Optional[str] = None
    phone_code: Optional[str] = None
    currency_code: Optional[str] = None
    currency_name: Optional[str] = None
    flag_emoji: Optional[str] = None
    is_active: Optional[bool] = None


class CountryResponse(CountryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CountrySimpleResponse(BaseModel):
    """Simple country format for dropdowns and selection lists"""
    value: str  # Country code
    label: str  # Display name (with flag emoji if available)
    phone_code: Optional[str] = None
    currency: Optional[str] = None
    
    class Config:
        from_attributes = True


class Country(CountryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CountrySimple(BaseModel):
    """Simplified country response for dropdowns"""
    id: int
    name: str
    code: str
    flag_emoji: Optional[str] = None

    class Config:
        from_attributes = True