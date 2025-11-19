"""
Service models for managed services (server management, backups, monitoring, etc.)
"""
from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, Text, Enum as SQLAlchemyEnum
from sqlalchemy.sql import func
from app.core.database import Base
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


class Service(Base):
    """
    Managed services table
    Professional services offered to customers
    """
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Info
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    category = Column(SQLAlchemyEnum(ServiceCategory), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Pricing
    price = Column(Numeric(10, 2), nullable=False)
    billing_type = Column(String(20), nullable=False, default='monthly')  # monthly, annual, one_time
    currency = Column(String(3), nullable=False, default='INR')
    
    # Configuration
    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    
    # Service details
    duration_hours = Column(Integer, nullable=True)  # Estimated hours for one-time services
    sla_response_time = Column(String(50), nullable=True)  # e.g., "2 hours", "24 hours"
    
    # Metadata
    icon = Column(String(50), nullable=True)
    config_data = Column(Text, nullable=True)  # JSON for additional config
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Service(id={self.id}, name='{self.name}', price={self.price})>"
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'category': self.category.value,
            'description': self.description,
            'price': float(self.price),
            'billing_type': self.billing_type,
            'currency': self.currency,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'duration_hours': self.duration_hours,
            'sla_response_time': self.sla_response_time,
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
