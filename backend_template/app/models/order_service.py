"""
OrderService junction table - Links orders to services with pricing snapshot
"""
from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class OrderService(Base):
    """
    Junction table linking orders to managed services
    Stores snapshot of service pricing at time of purchase
    """
    __tablename__ = "order_services"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    service_id = Column(Integer, ForeignKey('services.id', ondelete='RESTRICT'), nullable=False, index=True)
    
    # Snapshot of service details at purchase time
    service_name = Column(String(255), nullable=False)
    service_category = Column(String(50), nullable=False)
    service_description = Column(Text, nullable=True)
    
    # Pricing snapshot
    quantity = Column(Integer, nullable=False, default=1)  # Usually 1 for services
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    discount_percent = Column(Numeric(5, 2), default=0.00)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    tax_percent = Column(Numeric(5, 2), default=18.00)  # GST
    tax_amount = Column(Numeric(10, 2), default=0.00)
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    # Billing details
    billing_type = Column(String(20), nullable=False)  # monthly, annual, one_time
    currency = Column(String(3), default='INR')
    duration_hours = Column(Integer, nullable=True)  # For one-time services
    sla_response_time = Column(String(50), nullable=True)
    
    # Status
    is_active = Column(Integer, default=1)  # 1=active, 0=cancelled
    service_status = Column(String(20), default='pending')  # pending, in_progress, completed
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    order = relationship("Order", back_populates="order_services")
    service = relationship("Service")
    
    def __repr__(self):
        return f"<OrderService(id={self.id}, order_id={self.order_id}, service='{self.service_name}', total={self.total_amount})>"
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'service_id': self.service_id,
            'service_name': self.service_name,
            'service_category': self.service_category,
            'service_description': self.service_description,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'subtotal': float(self.subtotal),
            'discount_percent': float(self.discount_percent),
            'discount_amount': float(self.discount_amount),
            'tax_percent': float(self.tax_percent),
            'tax_amount': float(self.tax_amount),
            'total_amount': float(self.total_amount),
            'billing_type': self.billing_type,
            'currency': self.currency,
            'duration_hours': self.duration_hours,
            'sla_response_time': self.sla_response_time,
            'is_active': bool(self.is_active),
            'service_status': self.service_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
