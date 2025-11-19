from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketMessageBase(BaseModel):
    message: str
    is_internal_note: bool = False

class TicketMessageCreate(TicketMessageBase):
    pass

class TicketMessage(TicketMessageBase):
    id: int
    ticket_id: int
    user_id: int
    is_staff_reply: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_name: Optional[str] = None
    author_email: Optional[str] = None

    class Config:
        from_attributes = True
