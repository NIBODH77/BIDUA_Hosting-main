# # from pydantic import BaseModel
# # from typing import Optional, List, Dict, Any
# # from datetime import datetime
# # from decimal import Decimal

# # class InvoiceItem(BaseModel):
# #     description: str
# #     quantity: int = 1
# #     unit_price: Decimal
# #     amount: Decimal

    

# # class InvoiceBase(BaseModel):
# #     subtotal: Decimal
# #     tax_amount: Decimal
# #     total_amount: Decimal
# #     description: Optional[str] = None

# # class InvoiceCreate(InvoiceBase):
# #     user_id: int
# #     due_date: datetime
# #     items: List[InvoiceItem]

# # class InvoiceUpdate(BaseModel):
# #     status: Optional[str] = None
# #     payment_status: Optional[str] = None
# #     payment_method: Optional[str] = None
# #     payment_reference: Optional[str] = None
# #     payment_date: Optional[datetime] = None

# # class Invoice(InvoiceBase):
# #     id: int
# #     user_id: int
# #     invoice_number: str
# #     invoice_date: datetime
# #     due_date: datetime
# #     amount_paid: Decimal
# #     balance_due: Decimal
# #     status: str
# #     payment_status: str
# #     items: List[InvoiceItem]
# #     payment_method: Optional[str] = None
# #     payment_date: Optional[datetime] = None
# #     payment_reference: Optional[str] = None
# #     created_at: datetime
# #     updated_at: Optional[datetime] = None

# #     class Config:
# #         from_attributes = True

# # class InvoiceStats(BaseModel):
# #     total_invoices: int
# #     paid_invoices: int
# #     pending_invoices: int
# #     overdue_invoices: int
# #     total_revenue: Decimal
# #     pending_amount: Decimal



    

# # class InvoiceWithUser(Invoice):
# #     user_name: str
# #     user_email: str





# from pydantic import BaseModel
# from typing import Optional, List, Dict, Any
# from datetime import datetime
# from decimal import Decimal

# class InvoiceItem(BaseModel):
#     description: str
#     quantity: int = 1
#     unit_price: Decimal
#     amount: Decimal

#     class Config:
#         from_attributes = True

# class InvoiceBase(BaseModel):
#     subtotal: Decimal
#     tax_amount: Decimal
#     total_amount: Decimal
#     description: Optional[str] = None

# class InvoiceCreate(InvoiceBase):
#     user_id: int
#     due_date: datetime
#     items: List[InvoiceItem]

# class InvoiceUpdate(BaseModel):
#     status: Optional[str] = None
#     payment_status: Optional[str] = None
#     payment_method: Optional[str] = None
#     payment_reference: Optional[str] = None
#     payment_date: Optional[datetime] = None

# class Invoice(InvoiceBase):
#     id: int
#     user_id: int
#     invoice_number: str
#     invoice_date: datetime
#     due_date: datetime
#     amount_paid: Decimal
#     balance_due: Decimal
#     status: str
#     payment_status: str
#     items: List[InvoiceItem]
#     payment_method: Optional[str] = None
#     payment_date: Optional[datetime] = None
#     payment_reference: Optional[str] = None
#     created_at: datetime
#     updated_at: Optional[datetime] = None

#     class Config:
#         from_attributes = True

# class InvoiceStats(BaseModel):
#     total_invoices: int
#     paid_invoices: int
#     pending_invoices: int
#     overdue_invoices: int
#     total_revenue: Decimal
#     pending_amount: Decimal

# class InvoiceWithUser(Invoice):
#     user_name: str
#     user_email: str



# # -------------------- INVOICE SCHEMA --------------------

# class InvoiceResponse(BaseModel):
#     id: int
#     invoice_number: str
#     order_id: int
#     user_id: int
#     total_amount: Decimal  # Changed from 'amount' to 'total_amount'
#     status: str
#     invoice_date: datetime  # Changed from 'issued_date' to 'invoice_date'
#     due_date: Optional[datetime] = None
#     paid_date: Optional[datetime] = None
#     payment_method: Optional[str] = None
#     created_at: datetime
#     updated_at: Optional[datetime] = None

#     class Config:
#         from_attributes = True





from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal

class InvoiceItem(BaseModel):
    description: str
    quantity: int = 1
    unit_price: Decimal
    amount: Decimal

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    subtotal: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    description: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    user_id: int
    due_date: datetime
    items: List[InvoiceItem]

class InvoiceUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    payment_date: Optional[datetime] = None

class Invoice(InvoiceBase):
    id: int
    user_id: int
    invoice_number: str
    invoice_date: datetime
    due_date: datetime
    amount_paid: Decimal
    balance_due: Decimal
    status: str
    payment_status: str
    items: List[InvoiceItem]
    payment_method: Optional[str] = None
    payment_date: Optional[datetime] = None
    payment_reference: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ✅ ADD THIS MISSING CLASS
class InvoiceStats(BaseModel):
    total_invoices: int
    paid_invoices: int
    pending_invoices: int
    overdue_invoices: int
    total_revenue: Decimal
    pending_amount: Decimal

    class Config:
        from_attributes = True

# class InvoiceWithUser(Invoice):
#     user_name: str
#     user_email: str


class InvoiceWithUser(BaseModel):
    id: int
    total_amount: Decimal
    payment_status: str
    user_name: str
    user_email: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

