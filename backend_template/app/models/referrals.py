# # from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# # from sqlalchemy.sql import func
# # from sqlalchemy.orm import relationship
# # from app.core.database import Base

# # class ReferralPayout(Base):
# #     __tablename__ = "referral_payouts"
    
# #     id = Column(Integer, primary_key=True, autoincrement=True)
# #     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
# #     payout_number = Column(String(100), unique=True, nullable=False, index=True)
    
# #     # Amount details
# #     gross_amount = Column(Numeric(10, 2), nullable=False)
# #     tds_amount = Column(Numeric(10, 2), default=0.00)
# #     service_tax_amount = Column(Numeric(10, 2), default=0.00)
# #     net_amount = Column(Numeric(10, 2), nullable=False)
    
# #     # Status
# #     status = Column(String(50), default='requested')
# #     payment_method = Column(String(50), nullable=False)
    
# #     # Bank details
# #     bank_account_details = Column(JSON, nullable=True)
    
# #     # Tax information
# #     tax_year = Column(String(10), nullable=False)
# #     tax_quarter = Column(String(2), nullable=False)
    
# #     # Processing information
# #     payment_reference = Column(String(255), nullable=True)
# #     rejected_reason = Column(Text, nullable=True)
    
# #     # Timestamps
# #     requested_at = Column(DateTime(timezone=True), server_default=func.now())
# #     processed_at = Column(DateTime(timezone=True), nullable=True)
    
# #     # Relationships
# #     user = relationship("UserProfile", back_populates="referral_payouts")

# # class ReferralEarning(Base):
# #     __tablename__ = "referral_earnings"
    
# #     id = Column(Integer, primary_key=True, autoincrement=True)
# #     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
# #     referred_user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
# #     order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    
# #     # Earning details
# #     level = Column(Integer, nullable=False)  # 1, 2, or 3
# #     commission_rate = Column(Numeric(5, 2), nullable=False)
# #     order_amount = Column(Numeric(10, 2), nullable=False)
# #     commission_amount = Column(Numeric(10, 2), nullable=False)
    
# #     # Status
# #     status = Column(String(50), default='pending')  # pending, approved, paid
    
# #     # Timestamps
# #     earned_at = Column(DateTime(timezone=True), server_default=func.now())
# #     paid_at = Column(DateTime(timezone=True), nullable=True)
    
# #     # Relationships
# #     user = relationship("UserProfile", back_populates="referral_earnings", foreign_keys=[user_id])
# #     referred_user = relationship("UserProfile", foreign_keys=[referred_user_id])
# #     order = relationship("Order")




from sqlalchemy import Column, String, Integer, DateTime, Numeric, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class ReferralPayout(Base):
    __tablename__ = "referral_payouts"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    payout_number = Column(String(100), unique=True, nullable=False, index=True)
    
    # Amount details
    gross_amount = Column(Numeric(10, 2), nullable=False)
    tds_amount = Column(Numeric(10, 2), default=0.00)
    service_tax_amount = Column(Numeric(10, 2), default=0.00)
    net_amount = Column(Numeric(10, 2), nullable=False)
    
    # Status
    status = Column(String(50), default='requested')
    payment_method = Column(String(50), nullable=False)
    
    # Bank details
    bank_account_details = Column(JSON, nullable=True)
    
    # Tax information
    tax_year = Column(String(10), nullable=False)
    tax_quarter = Column(String(2), nullable=False)
    
    # Processing information
    payment_reference = Column(String(255), nullable=True)
    rejected_reason = Column(Text, nullable=True)
    
    # Timestamps
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationship
    user = relationship(
        "UserProfile",
        back_populates="referral_payouts",
        foreign_keys=[user_id]
    )
    


class ReferralEarning(Base):
    __tablename__ = "referral_earnings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    referred_user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    
    # Earning details
    level = Column(Integer, nullable=False)  # 1, 2, or 3
    commission_rate = Column(Numeric(5, 2), nullable=False)
    order_amount = Column(Numeric(10, 2), nullable=False)
    commission_amount = Column(Numeric(10, 2), nullable=False)
    
    # Status
    status = Column(String(50), default='pending')  # pending, approved, paid
    
    # Timestamps
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship(
        "UserProfile",
        back_populates="referral_earnings",
        foreign_keys=[user_id]
    )
    referred_user = relationship(
        "UserProfile",
        back_populates="referrals_made",
        foreign_keys=[referred_user_id]
    )

    # 🔹 Corrected relationship to match Order model
    order = relationship(
        "Order",
        back_populates="referral_earnings"
    )


