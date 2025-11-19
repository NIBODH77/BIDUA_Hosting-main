from fastapi import APIRouter, Depends, HTTPException, Query
# from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.support_service import SupportService
from app.schemas.support import SupportTicket, SupportTicketCreate, SupportTicketUpdate, SupportTicketWithUser
from app.schemas.users import User

router = APIRouter()

@router.get("/tickets", response_model=List[SupportTicket])
async def get_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """
    Get user's support tickets
    """
    return support_service.get_user_tickets(db, current_user.id, skip=skip, limit=limit, status=status)

@router.get("/tickets/admin", response_model=List[SupportTicketWithUser])
async def get_all_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """
    Get all support tickets (Admin only)
    """
    return support_service.get_all_tickets(db, skip=skip, limit=limit, status=status, priority=priority)

@router.get("/tickets/{ticket_id}", response_model=SupportTicket)
async def get_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """
    Get support ticket by ID
    """
    if current_user.role in ["admin", "super_admin"]:
        ticket = support_service.get_ticket_by_id(db, ticket_id)
    else:
        ticket = support_service.get_user_ticket(db, current_user.id, ticket_id)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.post("/tickets", response_model=SupportTicket)
async def create_ticket(
    ticket_data: SupportTicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """
    Create new support ticket
    """
    return support_service.create_ticket(db, current_user.id, ticket_data)

@router.put("/tickets/{ticket_id}", response_model=SupportTicket)
async def update_ticket(
    ticket_id: int,
    ticket_update: SupportTicketUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """
    Update support ticket
    """
    if current_user.role in ["admin", "super_admin"]:
        ticket = support_service.update_ticket(db, ticket_id, ticket_update)
    else:
        ticket = support_service.update_user_ticket(db, current_user.id, ticket_id, ticket_update)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.post("/tickets/{ticket_id}/close")
async def close_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """
    Close support ticket
    """
    if current_user.role in ["admin", "super_admin"]:
        success = support_service.close_ticket(db, ticket_id)
    else:
        success = support_service.close_user_ticket(db, current_user.id, ticket_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"message": "Ticket closed successfully"}

@router.post("/tickets/{ticket_id}/reopen")
async def reopen_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    support_service: SupportService = Depends()
):
    """
    Reopen support ticket
    """
    if current_user.role in ["admin", "super_admin"]:
        success = support_service.reopen_ticket(db, ticket_id)
    else:
        success = support_service.reopen_user_ticket(db, current_user.id, ticket_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"message": "Ticket reopened successfully"}

@router.get("/stats")
async def get_support_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    support_service: SupportService = Depends()
):
    """
    Get support statistics (Admin only)
    """
    return support_service.get_support_stats(db)

@router.get("/departments")
async def get_support_departments():
    """
    Get available support departments
    """
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
    """
    Get available support priorities
    """
    return {
        "priorities": [
            {"id": "low", "name": "Low", "response_time": "48 hours"},
            {"id": "medium", "name": "Medium", "response_time": "24 hours"},
            {"id": "high", "name": "High", "response_time": "12 hours"},
            {"id": "urgent", "name": "Urgent", "response_time": "4 hours"}
        ]
    }