# from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.core.database import Base

# class PaymentMethod(Base):
#     __tablename__ = "payment_methods"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    
#     # Payment method details
#     type = Column(String(50), nullable=False)
#     brand = Column(String(50), nullable=True)
#     last4 = Column(String(4), nullable=True)
#     expiry_month = Column(Integer, nullable=True)
#     expiry_year = Column(Integer, nullable=True)
    
#     # Additional details
#     is_default = Column(Boolean, default=False)
#     is_active = Column(Boolean, default=True)
    
#     # For cards
#     card_holder_name = Column(String(255), nullable=True)
    
#     # For UPI
#     upi_id = Column(String(255), nullable=True)
    
#     # For net banking
#     bank_name = Column(String(255), nullable=True)
#     account_number = Column(String(50), nullable=True)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships

#     # Foreign key to User table
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

#     # Relationship back to user
#     user = relationship("User", back_populates="payment_methods")

#     def __repr__(self):
#         return f"<PaymentMethod(id={self.id}, type='{self.type}', user_id={self.user_id})>"
    

# class BillingSettings(Base):
#     __tablename__ = "billing_settings"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, unique=True)
    
#     # Notification settings
#     email_notifications = Column(Boolean, default=True)
#     server_alerts = Column(Boolean, default=True)
#     billing_alerts = Column(Boolean, default=True)
#     maintenance_alerts = Column(Boolean, default=True)
#     marketing_emails = Column(Boolean, default=False)
    
#     # Auto-renewal settings
#     auto_renewal = Column(Boolean, default=True)
    
#     # Tax information
#     tax_id = Column(String(100), nullable=True)
#     company_name = Column(String(255), nullable=True)
#     billing_address = Column(JSON, nullable=True)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     user = relationship("UserProfile")







# from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, JSON
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.core.database import Base

# class PaymentMethod(Base):
#     __tablename__ = "payment_methods"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    
#     # Payment method details
#     type = Column(String(50), nullable=False)
#     brand = Column(String(50), nullable=True)
#     last4 = Column(String(4), nullable=True)
#     expiry_month = Column(Integer, nullable=True)
#     expiry_year = Column(Integer, nullable=True)
    
#     # Additional details
#     is_default = Column(Boolean, default=False)
#     is_active = Column(Boolean, default=True)
    
#     # For cards
#     card_holder_name = Column(String(255), nullable=True)
    
#     # For UPI
#     upi_id = Column(String(255), nullable=True)
    
#     # For net banking
#     bank_name = Column(String(255), nullable=True)
#     account_number = Column(String(50), nullable=True)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     user = relationship("UserProfile", back_populates="payment_methods")

#     def __repr__(self):
#         return f"<PaymentMethod(id={self.id}, type='{self.type}', user_id={self.user_id})>"
    

# class BillingSettings(Base):
#     __tablename__ = "billing_settings"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, unique=True)
    
#     # Notification settings
#     email_notifications = Column(Boolean, default=True)
#     server_alerts = Column(Boolean, default=True)
#     billing_alerts = Column(Boolean, default=True)
#     maintenance_alerts = Column(Boolean, default=True)
#     marketing_emails = Column(Boolean, default=False)
    
#     # Auto-renewal settings
#     auto_renewal = Column(Boolean, default=True)
    
#     # Tax information
#     tax_id = Column(String(100), nullable=True)
#     company_name = Column(String(255), nullable=True)
#     billing_address = Column(JSON, nullable=True)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationship back to UserProfile
#     user = relationship("UserProfile", back_populates="billing_settings")


#     def __repr__(self):
#         return f"<BillingSettings(id={self.id}, user_id={self.user_id}, auto_renewal={self.auto_renewal})>"





from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, JSON, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, index=True)
    
    # Payment method details
    type = Column(String(50), nullable=False)
    brand = Column(String(50), nullable=True)
    last4 = Column(String(4), nullable=True)
    expiry_month = Column(Integer, nullable=True)
    expiry_year = Column(Integer, nullable=True)
    
    # Additional details
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # For cards
    card_holder_name = Column(String(255), nullable=True)
    
    # For UPI
    upi_id = Column(String(255), nullable=True)
    
    # For net banking
    bank_name = Column(String(255), nullable=True)
    account_number = Column(String(50), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("UserProfile", back_populates="payment_methods")

    def __repr__(self):
        return f"<PaymentMethod(id={self.id}, type='{self.type}', user_id={self.user_id})>"

class BillingSettings(Base):  # 🔹 YE CLASS ADD KAREIN
    __tablename__ = "billing_settings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, unique=True)
    
    # Notification settings
    email_notifications = Column(Boolean, default=True)
    server_alerts = Column(Boolean, default=True)
    billing_alerts = Column(Boolean, default=True)
    maintenance_alerts = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)
    
    # Auto-renewal settings
    auto_renewal = Column(Boolean, default=True)
    
    # Billing Address
    street = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    
    # Company information
    company_name = Column(String(255), nullable=True)
    tax_id = Column(String(100), nullable=True)
    
    # Billing Contact
    billing_email = Column(String(255), nullable=True)
    billing_phone = Column(String(50), nullable=True)
    
    # Delivery preferences
    invoice_delivery = Column(String(20), default='email')  # email, dashboard
    
    # Legacy fields (keeping for backward compatibility)
    billing_address = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship back to UserProfile
    user = relationship("UserProfile", back_populates="billing_settings")

    def __repr__(self):
        return f"<BillingSettings(id={self.id}, user_id={self.user_id}, auto_renewal={self.auto_renewal})>"