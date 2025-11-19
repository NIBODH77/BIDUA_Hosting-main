"""
OrderAddon junction table - Links orders to addons with pricing snapshot
"""
from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class OrderAddon(Base):
    """
    Junction table linking orders to addons
    Stores snapshot of addon pricing at time of purchase
    """
    __tablename__ = "order_addons"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    addon_id = Column(Integer, ForeignKey('addons.id', ondelete='RESTRICT'), nullable=False, index=True)
    
    # Snapshot of addon details at purchase time (for historical accuracy)
    addon_name = Column(String(255), nullable=False)
    addon_category = Column(String(50), nullable=False)
    addon_description = Column(Text, nullable=True)
    
    # Pricing snapshot
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)  # Price per unit at purchase
    subtotal = Column(Numeric(10, 2), nullable=False)  # quantity * unit_price
    discount_percent = Column(Numeric(5, 2), default=0.00)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    tax_percent = Column(Numeric(5, 2), default=18.00)  # GST
    tax_amount = Column(Numeric(10, 2), default=0.00)
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    # Billing details
    billing_type = Column(String(20), nullable=False)  # monthly, annual, one_time
    currency = Column(String(3), default='INR')
    unit_label = Column(String(50), nullable=True)  # GB, TB, IP, etc.
    
    # Status
    is_active = Column(Integer, default=1)  # 1=active, 0=cancelled
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="order_addons")
    addon = relationship("Addon")
    
    def __repr__(self):
        return f"<OrderAddon(id={self.id}, order_id={self.order_id}, addon='{self.addon_name}', qty={self.quantity}, total={self.total_amount})>"
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'addon_id': self.addon_id,
            'addon_name': self.addon_name,
            'addon_category': self.addon_category,
            'addon_description': self.addon_description,
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
            'unit_label': self.unit_label,
            'is_active': bool(self.is_active),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
