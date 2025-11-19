from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime
import secrets
import string

from app.models.support import SupportTicket
from app.models.ticket_message import TicketMessage
from app.models.users import UserProfile
from app.schemas.support import SupportTicketCreate, SupportTicketUpdate, SupportStats
from app.schemas.ticket_message import TicketMessageCreate

class SupportService:
    """Enhanced support service with ticket assignment and messaging"""
    
    async def get_user_tickets(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100, 
                              status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get tickets created by a specific user"""
        query = select(SupportTicket).where(SupportTicket.user_id == user_id)
        
        if status and status != "all":
            query = query.where(SupportTicket.status == status)
            
        query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        tickets = result.scalars().all()
        
        # Enrich with message count
        tickets_list = []
        for ticket in tickets:
            msg_count_result = await db.execute(
                select(func.count(TicketMessage.id)).where(
                    TicketMessage.ticket_id == ticket.id,
                    TicketMessage.is_internal_note == False
                )
            )
            message_count = msg_count_result.scalar() or 0
            
            ticket_dict = {
                "id": ticket.id,
                "user_id": ticket.user_id,
                "ticket_number": ticket.ticket_number,
                "subject": ticket.subject,
                "description": ticket.description,
                "status": ticket.status,
                "priority": ticket.priority,
                "department": ticket.department,
                "assigned_to": ticket.assigned_to,
                "created_at": ticket.created_at,
                "updated_at": ticket.updated_at,
                "closed_at": ticket.closed_at,
                "message_count": message_count
            }
            tickets_list.append(ticket_dict)
        
        return tickets_list
    
    async def get_all_tickets(self, db: AsyncSession, skip: int = 0, limit: int = 100, 
                             status: Optional[str] = None, priority: Optional[str] = None,
                             assigned_to: Optional[int] = None, department: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all tickets with filters (Admin/Employee view)"""
        query = select(SupportTicket, UserProfile).join(
            UserProfile, SupportTicket.user_id == UserProfile.id
        )
        
        if status and status != "all":
            query = query.where(SupportTicket.status == status)
            
        if priority and priority != "all":
            query = query.where(SupportTicket.priority == priority)
        
        if assigned_to:
            query = query.where(SupportTicket.assigned_to == assigned_to)
        
        if department and department != "all":
            query = query.where(SupportTicket.department == department)
            
        query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        tickets_with_users = result.all()
        
        tickets_list = []
        for ticket, user in tickets_with_users:
            # Get assigned employee info if exists
            assigned_name = None
            if ticket.assigned_to:
                assigned_result = await db.execute(
                    select(UserProfile).where(UserProfile.id == ticket.assigned_to)
                )
                assigned_user = assigned_result.scalar_one_or_none()
                if assigned_user:
                    assigned_name = assigned_user.full_name
            
            # Get message count
            msg_count_result = await db.execute(
                select(func.count(TicketMessage.id)).where(TicketMessage.ticket_id == ticket.id)
            )
            message_count = msg_count_result.scalar() or 0
            
            ticket_dict = {
                "id": ticket.id,
                "user_id": ticket.user_id,
                "ticket_number": ticket.ticket_number,
                "subject": ticket.subject,
                "description": ticket.description,
                "status": ticket.status,
                "priority": ticket.priority,
                "department": ticket.department,
                "assigned_to": ticket.assigned_to,
                "assigned_to_name": assigned_name,
                "created_at": ticket.created_at,
                "updated_at": ticket.updated_at,
                "closed_at": ticket.closed_at,
                "user_name": user.full_name,
                "user_email": user.email,
                "message_count": message_count
            }
            tickets_list.append(ticket_dict)
        
        return tickets_list
    
    async def get_assigned_tickets(self, db: AsyncSession, employee_id: int, skip: int = 0, 
                                   limit: int = 100, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get tickets assigned to a specific employee"""
        query = select(SupportTicket, UserProfile).join(
            UserProfile, SupportTicket.user_id == UserProfile.id
        ).where(SupportTicket.assigned_to == employee_id)
        
        if status and status != "all":
            query = query.where(SupportTicket.status == status)
            
        query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        tickets_with_users = result.all()
        
        tickets_list = []
        for ticket, user in tickets_with_users:
            msg_count_result = await db.execute(
                select(func.count(TicketMessage.id)).where(TicketMessage.ticket_id == ticket.id)
            )
            message_count = msg_count_result.scalar() or 0
            
            ticket_dict = {
                "id": ticket.id,
                "user_id": ticket.user_id,
                "ticket_number": ticket.ticket_number,
                "subject": ticket.subject,
                "description": ticket.description,
                "status": ticket.status,
                "priority": ticket.priority,
                "department": ticket.department,
                "assigned_to": ticket.assigned_to,
                "created_at": ticket.created_at,
                "updated_at": ticket.updated_at,
                "closed_at": ticket.closed_at,
                "user_name": user.full_name,
                "user_email": user.email,
                "message_count": message_count
            }
            tickets_list.append(ticket_dict)
        
        return tickets_list
    
    async def get_ticket_by_id(self, db: AsyncSession, ticket_id: int) -> Optional[SupportTicket]:
        """Get ticket by ID"""
        result = await db.execute(
            select(SupportTicket).where(SupportTicket.id == ticket_id)
        )
        return result.scalar_one_or_none()
    
    async def get_ticket_with_details(self, db: AsyncSession, ticket_id: int) -> Optional[Dict[str, Any]]:
        """Get ticket with user and assigned employee details"""
        result = await db.execute(
            select(SupportTicket, UserProfile).join(
                UserProfile, SupportTicket.user_id == UserProfile.id
            ).where(SupportTicket.id == ticket_id)
        )
        ticket_user = result.first()
        
        if not ticket_user:
            return None
        
        ticket, user = ticket_user
        
        # Get assigned employee if exists
        assigned_name = None
        assigned_email = None
        if ticket.assigned_to:
            assigned_result = await db.execute(
                select(UserProfile).where(UserProfile.id == ticket.assigned_to)
            )
            assigned_user = assigned_result.scalar_one_or_none()
            if assigned_user:
                assigned_name = assigned_user.full_name
                assigned_email = assigned_user.email
        
        return {
            "id": ticket.id,
            "user_id": ticket.user_id,
            "ticket_number": ticket.ticket_number,
            "subject": ticket.subject,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "department": ticket.department,
            "assigned_to": ticket.assigned_to,
            "assigned_to_name": assigned_name,
            "assigned_to_email": assigned_email,
            "created_at": ticket.created_at,
            "updated_at": ticket.updated_at,
            "closed_at": ticket.closed_at,
            "user_name": user.full_name,
            "user_email": user.email
        }
    
    async def get_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> Optional[SupportTicket]:
        """Get user's specific ticket"""
        result = await db.execute(
            select(SupportTicket).where(
                SupportTicket.id == ticket_id,
                SupportTicket.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create_ticket(self, db: AsyncSession, user_id: int, ticket_data: SupportTicketCreate) -> SupportTicket:
        """Create a new support ticket"""
        ticket_number = await self._generate_ticket_number(db)
        
        db_ticket = SupportTicket(
            user_id=user_id,
            ticket_number=ticket_number,
            subject=ticket_data.subject,
            description=ticket_data.description,
            priority=ticket_data.priority,
            department=ticket_data.department,
            status='open'
        )
        
        db.add(db_ticket)
        await db.commit()
        await db.refresh(db_ticket)
        return db_ticket
    
    async def assign_ticket(self, db: AsyncSession, ticket_id: int, employee_id: int) -> Optional[SupportTicket]:
        """Assign ticket to an employee"""
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if not ticket:
            return None
        
        ticket.assigned_to = employee_id
        if ticket.status == 'open':
            ticket.status = 'in_progress'
        
        await db.commit()
        await db.refresh(ticket)
        return ticket
    
    async def unassign_ticket(self, db: AsyncSession, ticket_id: int) -> Optional[SupportTicket]:
        """Remove employee assignment from ticket"""
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if not ticket:
            return None
        
        ticket.assigned_to = None
        if ticket.status == 'in_progress':
            ticket.status = 'open'
        
        await db.commit()
        await db.refresh(ticket)
        return ticket
    
    async def update_ticket_status(self, db: AsyncSession, ticket_id: int, new_status: str) -> Optional[SupportTicket]:
        """Update ticket status"""
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if not ticket:
            return None
        
        ticket.status = new_status
        if new_status == 'closed':
            ticket.closed_at = datetime.now()
        elif new_status in ['open', 'in_progress']:
            ticket.closed_at = None
        
        await db.commit()
        await db.refresh(ticket)
        return ticket
    
    async def update_ticket(self, db: AsyncSession, ticket_id: int, ticket_update: SupportTicketUpdate) -> Optional[SupportTicket]:
        """Update ticket fields"""
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if not ticket:
            return None
            
        update_data = ticket_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(ticket, field, value)
            
        await db.commit()
        await db.refresh(ticket)
        return ticket
    
    # Message operations
    async def add_message(self, db: AsyncSession, ticket_id: int, user_id: int, 
                         message_data: TicketMessageCreate, is_staff: bool = False) -> TicketMessage:
        """Add a message/reply to a ticket"""
        db_message = TicketMessage(
            ticket_id=ticket_id,
            user_id=user_id,
            message=message_data.message,
            is_internal_note=message_data.is_internal_note,
            is_staff_reply=is_staff
        )
        
        db.add(db_message)
        
        # Update ticket's updated_at timestamp
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if ticket:
            ticket.updated_at = datetime.now()
        
        await db.commit()
        await db.refresh(db_message)
        return db_message
    
    async def get_ticket_messages(self, db: AsyncSession, ticket_id: int, 
                                 include_internal: bool = False) -> List[Dict[str, Any]]:
        """Get all messages for a ticket"""
        query = select(TicketMessage, UserProfile).join(
            UserProfile, TicketMessage.user_id == UserProfile.id
        ).where(TicketMessage.ticket_id == ticket_id)
        
        if not include_internal:
            query = query.where(TicketMessage.is_internal_note == False)
        
        query = query.order_by(TicketMessage.created_at.asc())
        result = await db.execute(query)
        messages_with_users = result.all()
        
        messages_list = []
        for message, user in messages_with_users:
            message_dict = {
                "id": message.id,
                "ticket_id": message.ticket_id,
                "user_id": message.user_id,
                "message": message.message,
                "is_internal_note": message.is_internal_note,
                "is_staff_reply": message.is_staff_reply,
                "created_at": message.created_at,
                "updated_at": message.updated_at,
                "author_name": user.full_name,
                "author_email": user.email
            }
            messages_list.append(message_dict)
        
        return messages_list
    
    async def get_support_stats(self, db: AsyncSession) -> SupportStats:
        """Get support ticket statistics"""
        total_tickets_result = await db.execute(select(func.count(SupportTicket.id)))
        total_tickets = total_tickets_result.scalar()
        
        open_tickets_result = await db.execute(
            select(func.count(SupportTicket.id)).where(SupportTicket.status == 'open')
        )
        open_tickets = open_tickets_result.scalar()
        
        in_progress_tickets_result = await db.execute(
            select(func.count(SupportTicket.id)).where(SupportTicket.status == 'in_progress')
        )
        in_progress_tickets = in_progress_tickets_result.scalar()
        
        resolved_tickets_result = await db.execute(
            select(func.count(SupportTicket.id)).where(SupportTicket.status == 'resolved')
        )
        resolved_tickets = resolved_tickets_result.scalar()
        
        closed_tickets_result = await db.execute(
            select(func.count(SupportTicket.id)).where(SupportTicket.status == 'closed')
        )
        closed_tickets = closed_tickets_result.scalar()
        
        return SupportStats(
            total_tickets=total_tickets,
            open_tickets=open_tickets,
            in_progress_tickets=in_progress_tickets,
            resolved_tickets=resolved_tickets,
            closed_tickets=closed_tickets,
            average_response_time=2.5
        )
    
    async def get_support_employees(self, db: AsyncSession) -> List[Dict[str, Any]]:
        """Get list of users who can be assigned to tickets (support staff)"""
        result = await db.execute(
            select(UserProfile).where(
                or_(
                    UserProfile.role == 'admin',
                    UserProfile.role == 'support',
                    UserProfile.role == 'super_admin'
                )
            ).order_by(UserProfile.full_name)
        )
        employees = result.scalars().all()
        
        employees_list = []
        for emp in employees:
            # Count assigned tickets
            assigned_count_result = await db.execute(
                select(func.count(SupportTicket.id)).where(
                    SupportTicket.assigned_to == emp.id,
                    SupportTicket.status.in_(['open', 'in_progress'])
                )
            )
            assigned_count = assigned_count_result.scalar() or 0
            
            employees_list.append({
                "id": emp.id,
                "full_name": emp.full_name,
                "email": emp.email,
                "role": emp.role,
                "active_tickets": assigned_count
            })
        
        return employees_list
    
    async def _generate_ticket_number(self, db: AsyncSession) -> str:
        """Generate a unique ticket number"""
        year = datetime.now().year
        base_number = f"TICK-{year}-"
        
        result = await db.execute(
            select(SupportTicket.ticket_number).where(
                SupportTicket.ticket_number.like(f"{base_number}%")
            ).order_by(SupportTicket.ticket_number.desc()).limit(1)
        )
        last_ticket = result.scalar_one_or_none()
        
        if last_ticket:
            last_number = int(last_ticket.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        return f"{base_number}{new_number:04d}"
