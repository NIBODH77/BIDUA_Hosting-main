# from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# # from app.database.session import Base
# from app.core.database import Base


# class UserSettings(Base):
#     __tablename__ = "user_settings"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, unique=True)
    
#     # Profile settings
#     language = Column(String(10), default='en')
#     timezone = Column(String(50), default='UTC')
#     date_format = Column(String(20), default='YYYY-MM-DD')
    
#     # Security settings
#     two_factor_enabled = Column(Boolean, default=False)
#     login_alerts = Column(Boolean, default=True)
    
#     # Notification settings
#     email_notifications = Column(Boolean, default=True)
#     push_notifications = Column(Boolean, default=True)
#     sms_notifications = Column(Boolean, default=False)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     user = relationship("UserProfile")






from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, unique=True)
    
    # Profile settings
    language = Column(String(10), default='en')
    timezone = Column(String(50), default='UTC')
    date_format = Column(String(20), default='YYYY-MM-DD')
    
    # Security settings
    two_factor_enabled = Column(Boolean, default=False)
    login_alerts = Column(Boolean, default=True)
    
    # Notification settings
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 🔹 FIXED Relationship
    user = relationship(
        "UserProfile",
        back_populates="user_settings",  # 🔹 Ye UserProfile mein define karna hoga
        foreign_keys=[user_id],
        uselist=False  # 🔹 Each user has only one settings record
    )