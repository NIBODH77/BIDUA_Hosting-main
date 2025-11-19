from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.support_service_enhanced import SupportService
from app.schemas.support import SupportTicketCreate, SupportTicketUpdate
from app.schemas.ticket_message import TicketMessageCreate, TicketMessage
from app.schemas.users import User

router = APIRouter()

# ===========================
# User Ticket Endpoints
# ===========================

@router.get("/tickets")
async def get_my_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """Get current user's support tickets"""
    return await support_service.get_user_tickets(db, current_user.id, skip=skip, limit=limit, status=status)

@router.get("/tickets/{ticket_id}")
async def get_ticket_detail(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """Get ticket details with messages"""
    # Check if user owns this ticket or is admin/support
    if current_user.role in ["admin", "super_admin", "support"]:
        ticket = await support_service.get_ticket_with_details(db, ticket_id)
    else:
        ticket_obj = await support_service.get_user_ticket(db, current_user.id, ticket_id)
        if not ticket_obj:
            raise HTTPException(status_code=404, detail="Ticket not found")
        ticket = await support_service.get_ticket_with_details(db, ticket_id)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Get messages
    include_internal = current_user.role in ["admin", "super_admin", "support"]
    messages = await support_service.get_ticket_messages(db, ticket_id, include_internal=include_internal)
    
    return {
        **ticket,
        "messages": messages
    }

@router.post("/tickets")
async def create_ticket(
    ticket_data: SupportTicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """Create new support ticket"""
    return await support_service.create_ticket(db, current_user.id, ticket_data)

@router.post("/tickets/{ticket_id}/messages")
async def add_ticket_message(
    ticket_id: int,
    message_data: TicketMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """Add a message/reply to a ticket"""
    print(f"=== ADD TICKET MESSAGE ===")
    print(f"Ticket ID: {ticket_id}")
    print(f"Current User: {current_user}")
    print(f"Message Data: {message_data}")
    
    # Verify user has access to this ticket
    if current_user.role in ["admin", "super_admin", "support"]:
        ticket = await support_service.get_ticket_by_id(db, ticket_id)
        is_staff = True
    else:
        ticket = await support_service.get_user_ticket(db, current_user.id, ticket_id)
        is_staff = False
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    message = await support_service.add_message(db, ticket_id, current_user.id, message_data, is_staff=is_staff)
    return message

@router.put("/tickets/{ticket_id}/status")
async def update_ticket_status(
    ticket_id: int,
    new_status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """Update ticket status (user can only close their own tickets)"""
    if current_user.role in ["admin", "super_admin", "support"]:
        ticket = await support_service.update_ticket_status(db, ticket_id, new_status)
    else:
        # Users can only close their own tickets
        if new_status != "closed":
            raise HTTPException(status_code=403, detail="You can only close your own tickets")
        ticket = await support_service.get_user_ticket(db, current_user.id, ticket_id)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        ticket = await support_service.update_ticket_status(db, ticket_id, new_status)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

# ===========================
# Admin/Support Staff Endpoints
# ===========================

@router.get("/admin/tickets")
async def get_all_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to: Optional[int] = None,
    department: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """Get all support tickets with filters (Admin/Support only)"""
    return await support_service.get_all_tickets(
        db, skip=skip, limit=limit, status=status, priority=priority,
        assigned_to=assigned_to, department=department
    )

@router.get("/admin/my-assigned-tickets")
async def get_my_assigned_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """Get tickets assigned to current support employee"""
    if current_user.role not in ["admin", "super_admin", "support"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return await support_service.get_assigned_tickets(db, current_user.id, skip=skip, limit=limit, status=status)

@router.put("/admin/tickets/{ticket_id}/assign")
async def assign_ticket(
    ticket_id: int,
    employee_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """Assign ticket to a support employee"""
    ticket = await support_service.assign_ticket(db, ticket_id, employee_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.put("/admin/tickets/{ticket_id}/unassign")
async def unassign_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """Remove employee assignment from ticket"""
    ticket = await support_service.unassign_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.put("/admin/tickets/{ticket_id}")
async def update_ticket(
    ticket_id: int,
    ticket_update: SupportTicketUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """Update ticket (Admin/Support only)"""
    ticket = await support_service.update_ticket(db, ticket_id, ticket_update)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.get("/admin/employees")
async def get_support_employees(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """Get list of support employees who can be assigned tickets"""
    return await support_service.get_support_employees(db)

@router.get("/stats")
async def get_support_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """Get support statistics (Admin only)"""
    return await support_service.get_support_stats(db)

# ===========================
# Static Data Endpoints
# ===========================

@router.get("/departments")
async def get_support_departments():
    """Get available support departments"""
    return {
        "departments": [
            {"id": "technical", "name": "Technical Support", "description": "Server issues, connectivity, technical problems"},
            {"id": "billing", "name": "Billing Support", "description": "Payment issues, invoices, billing questions"},
            {"id": "sales", "name": "Sales", "description": "Plan upgrades, new services, pricing"},
            {"id": "general", "name": "General Inquiry", "description": "General questions, account issues"}
        ]
    }

@router.get("/priorities")
async def get_support_priorities():
    """Get available support priorities"""
    return {
        "priorities": [
            {"id": "low", "name": "Low", "response_time": "48 hours"},
            {"id": "medium", "name": "Medium", "response_time": "24 hours"},
            {"id": "high", "name": "High", "response_time": "12 hours"},
            {"id": "urgent", "name": "Urgent", "response_time": "4 hours"}
        ]
    }

@router.get("/statuses")
async def get_support_statuses():
    """Get available ticket statuses"""
    return {
        "statuses": [
            {"id": "open", "name": "Open", "description": "Ticket is open and awaiting response"},
            {"id": "in_progress", "name": "In Progress", "description": "Ticket is being worked on"},
            {"id": "closed", "name": "Closed", "description": "Ticket has been resolved and closed"}
        ]
    }
