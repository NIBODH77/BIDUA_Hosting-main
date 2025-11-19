from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class SupportTicketBase(BaseModel):
    subject: str
    description: str
    priority: str = "medium"
    department: str = "technical"

class SupportTicketCreate(SupportTicketBase):
    pass

    @validator('priority')
    def validate_priority(cls, v):
        valid_priorities = ['low', 'medium', 'high', 'urgent']
        if v not in valid_priorities:
            raise ValueError(f'Priority must be one of: {", ".join(valid_priorities)}')
        return v

    @validator('department')
    def validate_department(cls, v):
        valid_departments = ['technical', 'billing', 'sales', 'general']
        if v not in valid_departments:
            raise ValueError(f'Department must be one of: {", ".join(valid_departments)}')
        return v

class SupportTicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None
    department: Optional[str] = None

class SupportTicket(SupportTicketBase):
    id: int
    user_id: int
    ticket_number: str
    status: str = "open"
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SupportTicketWithUser(SupportTicket):
    user_name: str
    user_email: str
    assigned_admin_name: Optional[str] = None

class SupportStats(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    closed_tickets: int
    average_response_time: Optional[float] = None


    

class TicketMessage(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    message: str
    is_admin: bool = False
    created_at: datetime

    class Config:
        from_attributes = True