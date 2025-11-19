# # from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# # from sqlalchemy.sql import func
# # from sqlalchemy.orm import relationship
# # from app.core.database import Base

# # class Invoice(Base):
# #     __tablename__ = "invoices"
    
# #     id = Column(Integer, primary_key=True, autoincrement=True)
# #     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
# #     invoice_number = Column(String(100), unique=True, nullable=False, index=True)
# #     invoice_date = Column(DateTime(timezone=True), server_default=func.now())
# #     due_date = Column(DateTime(timezone=True), nullable=False)
    
# #     # Amount details
# #     subtotal = Column(Numeric(10, 2), nullable=False)
# #     tax_amount = Column(Numeric(10, 2), default=0.00)
# #     total_amount = Column(Numeric(10, 2), nullable=False)
# #     amount_paid = Column(Numeric(10, 2), default=0.00)
# #     balance_due = Column(Numeric(10, 2), nullable=False)
    
# #     # Status
# #     status = Column(String(50), default='draft')
# #     payment_status = Column(String(50), default='pending')
    
# #     # Invoice items
# #     items = Column(JSON, nullable=False)
    
# #     # Description
# #     description = Column(Text, nullable=True)
    
# #     # Payment information
# #     payment_method = Column(String(100), nullable=True)
# #     payment_date = Column(DateTime(timezone=True), nullable=True)
# #     payment_reference = Column(String(255), nullable=True)
    
# #     # Timestamps
# #     created_at = Column(DateTime(timezone=True), server_default=func.now())
# #     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
# #     # Relationships
# #     user = relationship("UserProfile", back_populates="invoices")





# from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.core.database import Base

# class Invoice(Base):
#     __tablename__ = "invoices"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)

#     # 🔹 Foreign Keys
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
#     order_id = Column(Integer, ForeignKey('orders.id'), nullable=True)  # optional link to an order

#     # 🔹 Invoice info
#     invoice_number = Column(String(100), unique=True, nullable=False, index=True)
#     invoice_date = Column(DateTime(timezone=True), server_default=func.now())
#     due_date = Column(DateTime(timezone=True), nullable=False)

#     # 🔹 Financial details
#     subtotal = Column(Numeric(10, 2), nullable=False)
#     tax_amount = Column(Numeric(10, 2), default=0.00)
#     total_amount = Column(Numeric(10, 2), nullable=False)
#     amount_paid = Column(Numeric(10, 2), default=0.00)
#     balance_due = Column(Numeric(10, 2), nullable=False)

#     # 🔹 Status flags
#     status = Column(String(50), default='draft')             # draft, issued, cancelled
#     payment_status = Column(String(50), default='pending')   # pending, paid, failed, refunded

#     # 🔹 Invoice items (stored as JSON)
#     items = Column(JSON, nullable=False)  # [{ "item_name": "Plan A", "qty": 1, "price": 999.00 }, ...]

#     # 🔹 Optional text
#     description = Column(Text, nullable=True)

#     # 🔹 Payment information
#     payment_method = Column(String(100), nullable=True)
#     payment_date = Column(DateTime(timezone=True), nullable=True)
#     payment_reference = Column(String(255), nullable=True)

#     # 🔹 Metadata
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())

#     # 🔹 Relationships
#     user = relationship("UserProfile", back_populates="invoices")
#     order = relationship("Order", back_populates="invoices")  # connect to order






from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, autoincrement=True)

    # 🔹 Foreign Keys
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=True, index=True)  # optional link to an order


    # 🔹 Invoice info
    invoice_number = Column(String(100), unique=True, nullable=False, index=True)
    invoice_date = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True), nullable=False)

    # 🔹 Financial details
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax_amount = Column(Numeric(10, 2), default=0.00)
    total_amount = Column(Numeric(10, 2), nullable=False)
    amount_paid = Column(Numeric(10, 2), default=0.00)
    balance_due = Column(Numeric(10, 2), nullable=False)

    # 🔹 Status flags
    status = Column(String(50), default='draft', nullable=False)             # draft, issued, sent, paid, cancelled, overdue
    payment_status = Column(String(50), default='pending', nullable=False)   # pending, paid, partially_paid, failed, refunded

    # 🔹 Invoice items (stored as JSON)
    items = Column(JSON, nullable=False)  # [{ "description": "Plan A", "quantity": 1, "unit_price": 999.00, "total": 999.00 }, ...]

    # 🔹 Additional fields
    currency = Column(String(10), default='USD', nullable=False)
    tax_rate = Column(Numeric(5, 2), default=0.00)  # 🔹 New: Tax rate percentage
    notes = Column(Text, nullable=True)
    terms_conditions = Column(Text, nullable=True)  # 🔹 New: Payment terms

    # 🔹 Payment information
    payment_method = Column(String(100), nullable=True)  # stripe, paypal, bank_transfer, etc.
    payment_date = Column(DateTime(timezone=True), nullable=True)
    payment_reference = Column(String(255), nullable=True)
    
    # 🔹 Overdue information
    late_fee = Column(Numeric(10, 2), default=0.00)  # 🔹 New: Late payment fee
    days_overdue = Column(Integer, default=0)  # 🔹 New: Days overdue

    # 🔹 Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)  # 🔹 New: When invoice was fully paid


    # 🔹 FIXED Relationships
    user = relationship(
        "UserProfile", 
        back_populates="invoices",
        foreign_keys=[user_id]
    )
    
    order = relationship(
        "Order", 
        back_populates="invoices",
        foreign_keys=[order_id]
    )

    # 🔹 Comprehensive indexes for optimal query performance
    __table_args__ = (
        # User-specific queries
        Index('idx_invoice_user_status', 'user_id', 'status'),
        Index('idx_invoice_user_payment_status', 'user_id', 'payment_status'),
        
        # Financial reporting
        Index('idx_invoice_date_status', 'invoice_date', 'status'),
        Index('idx_invoice_due_date', 'due_date'),
        Index('idx_invoice_payment_date', 'payment_date'),
        
        # Accounting and collections
        Index('idx_invoice_status_due_date', 'status', 'due_date'),
        Index('idx_invoice_payment_status_balance', 'payment_status', 'balance_due'),
        
        # Quick lookups
        Index('idx_invoice_number', 'invoice_number'),
        Index('idx_invoice_order', 'order_id'),
        
        # Overdue invoices tracking
        Index('idx_invoice_overdue', 'due_date', 'payment_status'),
        
        # Comprehensive analytics
        Index('idx_invoice_comprehensive', 'user_id', 'status', 'payment_status', 'due_date'),
    )

    def __repr__(self):
        return f"<Invoice(id={self.id}, number='{self.invoice_number}', total={self.total_amount}, status='{self.status}')>"

    # 🔹 Business logic helper methods
    def is_overdue(self):
        """Check if invoice is overdue"""
        from datetime import datetime
        return (self.payment_status != 'paid' and 
                self.due_date < datetime.now(self.due_date.tzinfo))
    
    def calculate_days_overdue(self):
        """Calculate days overdue"""
        from datetime import datetime
        if self.is_overdue():
            overdue_days = (datetime.now(self.due_date.tzinfo) - self.due_date).days
            return max(0, overdue_days)
        return 0
    
    def update_balance(self):
        """Update balance due automatically"""
        self.balance_due = self.total_amount - self.amount_paid
        return self.balance_due
    
    def add_payment(self, amount: float):
        """Add payment to invoice"""
        self.amount_paid += amount
        self.update_balance()
        
        if self.balance_due <= 0:
            self.payment_status = 'paid'
            self.paid_at = func.now()
        elif self.amount_paid > 0:
            self.payment_status = 'partially_paid'
    
    def get_next_invoice_number(self):
        """Generate next invoice number (can be used in business logic)"""
        # This would typically be handled by database sequence or business logic
        return f"INV-{self.invoice_date.strftime('%Y%m%d')}-{self.id:06d}"