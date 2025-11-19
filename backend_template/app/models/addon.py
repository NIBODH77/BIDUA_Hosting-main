"""
Addon models for storing configurable addon pricing
"""
from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey, Text, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class AddonCategory(str, enum.Enum):
    """Addon categories for organizing different types of addons"""
    STORAGE = "storage"
    BANDWIDTH = "bandwidth"
    IP_ADDRESS = "ip_address"
    CONTROL_PANEL = "control_panel"
    BACKUP = "backup"
    SSL = "ssl"
    SUPPORT = "support"
    MANAGEMENT = "management"
    SECURITY = "security"


class BillingType(str, enum.Enum):
    """How the addon is billed"""
    MONTHLY = "monthly"
    ANNUAL = "annual"
    ONE_TIME = "one_time"
    PER_UNIT = "per_unit"  # Like ₹2/GB


class Addon(Base):
    """
    Configurable addon pricing table
    Allows dynamic pricing without code changes
    """
    __tablename__ = "addons"

    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Info
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)  # e.g., 'extra-storage', 'plesk-admin'
    category = Column(SQLAlchemyEnum(AddonCategory), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Pricing
    price = Column(Numeric(10, 2), nullable=False)  # Base price
    billing_type = Column(SQLAlchemyEnum(BillingType), nullable=False, default=BillingType.MONTHLY)
    currency = Column(String(3), nullable=False, default='INR')
    
    # Configuration
    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)  # For display ordering
    
    # Quantity constraints
    min_quantity = Column(Integer, default=0)
    max_quantity = Column(Integer, nullable=True)  # NULL = unlimited
    default_quantity = Column(Integer, default=0)
    unit_label = Column(String(50), nullable=True)  # e.g., 'GB', 'TB', 'IP'
    
    # Metadata
    icon = Column(String(50), nullable=True)  # Icon name for frontend
    config_data = Column(Text, nullable=True)  # JSON for additional config
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Addon(id={self.id}, name='{self.name}', price={self.price})>"
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'category': self.category.value,
            'description': self.description,
            'price': float(self.price),
            'billing_type': self.billing_type.value,
            'currency': self.currency,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'min_quantity': self.min_quantity,
            'max_quantity': self.max_quantity,
            'default_quantity': self.default_quantity,
            'unit_label': self.unit_label,
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
