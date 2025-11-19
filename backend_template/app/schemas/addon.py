"""
Addon schemas for API requests/responses
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AddonBase(BaseModel):
    """Base addon schema"""
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    category: str
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    billing_type: str = "monthly"
    currency: str = "INR"
    is_active: bool = True
    is_featured: bool = False
    sort_order: int = 0
    min_quantity: int = 0
    max_quantity: Optional[int] = None
    default_quantity: int = 0
    unit_label: Optional[str] = None
    icon: Optional[str] = None


class AddonCreate(AddonBase):
    """Schema for creating an addon"""
    pass


class AddonUpdate(BaseModel):
    """Schema for updating an addon"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    billing_type: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None
    min_quantity: Optional[int] = None
    max_quantity: Optional[int] = None
    default_quantity: Optional[int] = None
    unit_label: Optional[str] = None
    icon: Optional[str] = None


class AddonResponse(AddonBase):
    """Schema for addon API response"""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AddonPriceCalculation(BaseModel):
    """Schema for price calculation request"""
    addon_slug: str
    quantity: int = 1


class ServerConfigValidation(BaseModel):
    """Schema for validating server configuration and calculating total price"""
    plan_id: int
    billing_cycle: str
    extra_storage: int = 0  # GB
    extra_bandwidth: int = 0  # TB
    additional_ipv4: int = 0
    plesk_addon: Optional[str] = None  # 'admin', 'pro', 'host'
    backup_storage: Optional[str] = None  # '100gb', '200gb', etc.
    ssl_certificate: Optional[str] = None
    support_package: Optional[str] = None  # 'basic', 'premium'
    managed_service: str = 'self'  # 'self', 'basic', 'premium'
    ddos_protection: str = 'basic'  # 'basic', 'advanced', 'enterprise'
    quantity: int = 1


class PriceBreakdown(BaseModel):
    """Detailed price breakdown"""
    base_price: float
    addon_costs: dict  # {addon_name: cost}
    subtotal: float
    discount: float
    tax: float
    total: float
    currency: str = "INR"
