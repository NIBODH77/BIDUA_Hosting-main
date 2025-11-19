from sqlalchemy import Column, String, Integer, DateTime, Numeric, ForeignKey, JSON, Index, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    # 🔹 Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # 🔹 Foreign Keys
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey('hosting_plans.id'), nullable=False, index=True)

    # 🔹 Order Information
    order_number = Column(String(100), unique=True, nullable=False, index=True)
    order_status = Column(String(50), default='pending', nullable=False)          # pending, active, cancelled, completed, expired
    payment_status = Column(String(50), default='pending', nullable=False)        # pending, paid, failed, refunded, partially_refunded
    billing_cycle = Column(String(50), nullable=False)                            # monthly, quarterly, annual, biennial, triennial
    
    # Payment Classification
    payment_type = Column(String(20), default='subscription', nullable=False)     # subscription or server
    activation_type = Column(String(20), nullable=True)                           # direct or referral (from user)

    # 🔹 Financial Details
    total_amount = Column(Numeric(10, 2), nullable=False)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    tax_amount = Column(Numeric(10, 2), default=0.00)
    grand_total = Column(Numeric(10, 2), nullable=False)  # 🔹 Fixed: nullable=False

    # 🔹 Server Details (for hosting/server-based plans)
    server_details = Column(JSON, nullable=True)

    # 🔹 Additional Order Details
    currency = Column(String(10), default='USD', nullable=False)
    promo_code = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)  # 🔹 New: For admin/internal notes

    # 🔹 Payment Information
    payment_method = Column(String(100), nullable=True)  # stripe, paypal, bank_transfer, etc.
    payment_reference = Column(String(255), nullable=True)
    payment_date = Column(DateTime(timezone=True), nullable=True)

    # Razorpay specific fields
    razorpay_order_id = Column(String(100), nullable=True, index=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)


    # 🔹 Subscription/Service Dates
    service_start_date = Column(DateTime(timezone=True), nullable=True)
    service_end_date = Column(DateTime(timezone=True), nullable=True)

    # 🔹 Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)  # 🔹 New: When order was completed

    # 🔹 Relationships
    user = relationship(
        "UserProfile",
        back_populates="orders",
        foreign_keys=[user_id]
    )

    plan = relationship(
        "HostingPlan",
        back_populates="orders",
        foreign_keys=[plan_id]
    )

    # Link invoices to orders
    invoices = relationship(
        "Invoice",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="select"  # 🔹 Better performance
    )

    # 🔹 Link to addons and services
    order_addons = relationship(
        "OrderAddon",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="select"
    )

    order_services = relationship(
        "OrderService",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="select"
    )

    # Link referral earnings
    referral_earnings = relationship(
        "ReferralEarning",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="select"  # 🔹 Better performance
    )
    
    # Link to payment transaction (one order can have one payment)
    payment_transaction = relationship(
        "PaymentTransaction",
        back_populates="order",
        uselist=False,  # One-to-one relationship
        foreign_keys="[PaymentTransaction.order_id]"
    )

    # 🔹 Comprehensive indexes for optimal query performance
    __table_args__ = (
        # User-specific queries
        Index('idx_order_user_status', 'user_id', 'order_status'),
        Index('idx_order_user_payment_status', 'user_id', 'payment_status'),

        # Admin dashboard queries
        Index('idx_order_status_payment', 'order_status', 'payment_status'),
        Index('idx_order_payment_status_date', 'payment_status', 'created_at'),

        # Financial reporting
        Index('idx_order_created_date', 'created_at'),
        Index('idx_order_payment_date', 'payment_date'),

        # Billing and subscription management
        Index('idx_order_billing_cycle', 'billing_cycle'),
        Index('idx_order_service_dates', 'service_start_date', 'service_end_date'),

        # Quick lookups
        Index('idx_order_number', 'order_number'),
        Index('idx_order_plan', 'plan_id'),

        # Comprehensive analytics
        Index('idx_order_comprehensive', 'user_id', 'order_status', 'payment_status', 'created_at'),
    )

    def __repr__(self):
        return f"<Order(id={self.id}, number='{self.order_number}', status='{self.order_status}', total={self.grand_total})>"

    # 🔹 Optional: Helper methods for business logic
    def is_paid(self):
        return self.payment_status in ['paid', 'partially_refunded']

    def is_active(self):
        return self.order_status == 'active' and self.is_paid()

    def get_days_remaining(self):
        """Calculate days remaining for service"""
        if self.service_end_date and self.is_active():
            from datetime import datetime
            remaining = self.service_end_date - datetime.now(self.service_end_date.tzinfo)
            return remaining.days
        return 0

    def calculate_refund_amount(self):
        """Calculate potential refund amount"""
        if not self.is_paid():
            return 0.00

        # Basic refund logic - can be customized
        if self.order_status == 'cancelled':
            return self.grand_total * 0.8  # 80% refund
        return 0.00