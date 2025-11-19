from pydantic import BaseModel, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from decimal import Decimal

class HostingPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    plan_type: str
    cpu_cores: int
    ram_gb: int
    storage_gb: int
    bandwidth_gb: int
    base_price: Decimal

class HostingPlanCreate(HostingPlanBase):
    monthly_price: Decimal
    quarterly_price: Decimal
    annual_price: Decimal
    biennial_price: Decimal
    triennial_price: Decimal
    is_featured: bool = False
    features: Optional[Dict[str, Any]] = None

    @validator('cpu_cores')
    def validate_cpu_cores(cls, v):
        if v < 1:
            raise ValueError('CPU cores must be at least 1')
        return v

    @validator('ram_gb')
    def validate_ram(cls, v):
        if v < 1:
            raise ValueError('RAM must be at least 1GB')
        return v

class HostingPlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    base_price: Optional[Decimal] = None
    monthly_price: Optional[Decimal] = None
    quarterly_price: Optional[Decimal] = None
    annual_price: Optional[Decimal] = None
    biennial_price: Optional[Decimal] = None
    triennial_price: Optional[Decimal] = None
    features: Optional[Dict[str, Any]] = None

class HostingPlan(HostingPlanBase):
    id: int
    monthly_price: Decimal
    quarterly_price: Decimal
    annual_price: Decimal
    biennial_price: Decimal
    triennial_price: Decimal
    is_active: bool = True
    is_featured: bool = False
    features: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PlanPricing(BaseModel):
    monthly: Decimal
    quarterly: Decimal
    annual: Decimal
    biennial: Decimal
    triennial: Decimal

class PlanFeature(BaseModel):
    name: str
    description: str
    included: bool = True

class PlanComparison(BaseModel):
    plan: HostingPlan
    features: List[PlanFeature]
    best_for: str