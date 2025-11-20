# app/schemas/services.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import enum

class ServiceCategory(str, enum.Enum):
    """Categories for managed services"""
    SERVER_MANAGEMENT = "server_management"
    BACKUP_MANAGEMENT = "backup_management"
    MONITORING = "monitoring"
    SECURITY = "security"
    MIGRATION = "migration"
    OPTIMIZATION = "optimization"
    CONSULTATION = "consultation"
    CUSTOM = "custom"

class ServiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    category: ServiceCategory
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    billing_type: str = Field(..., pattern="^(monthly|annual|one_time)$")
    currency: str = Field(default="INR", max_length=3)
    is_active: bool = True
    is_featured: bool = False
    sort_order: int = Field(default=0, ge=0)
    duration_hours: Optional[int] = Field(None, ge=0)
    sla_response_time: Optional[str] = None
    icon: Optional[str] = None
    config_data: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True