from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from typing import List, Optional, Dict, Any
from datetime import datetime
import secrets
import string

from app.models.support import SupportTicket
from app.models.users import UserProfile
from app.schemas.support import SupportTicketCreate, SupportTicketUpdate, SupportStats

class SupportService:
    async def get_user_tickets(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100, 
                              status: Optional[str] = None) -> List[SupportTicket]:
        query = select(SupportTicket).where(SupportTicket.user_id == user_id)
        
        if status and status != "all":
            query = query.where(SupportTicket.status == status)
            
        query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    async def get_all_tickets(self, db: AsyncSession, skip: int = 0, limit: int = 100, 
                             status: Optional[str] = None, priority: Optional[str] = None) -> List[Dict[str, Any]]:
        query = select(SupportTicket, UserProfile).join(
            UserProfile, SupportTicket.user_id == UserProfile.id
        )
        
        if status and status != "all":
            query = query.where(SupportTicket.status == status)
            
        if priority and priority != "all":
            query = query.where(SupportTicket.priority == priority)
            
        query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        tickets_with_users = result.all()
        
        tickets_list = []
        for ticket, user in tickets_with_users:
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
                "user_email": user.email
            }
            tickets_list.append(ticket_dict)
        
        return tickets_list
    
    async def get_ticket_by_id(self, db: AsyncSession, ticket_id: int) -> Optional[SupportTicket]:
        result = await db.execute(
            select(SupportTicket).where(SupportTicket.id == ticket_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> Optional[SupportTicket]:
        result = await db.execute(
            select(SupportTicket).where(
                SupportTicket.id == ticket_id,
                SupportTicket.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create_ticket(self, db: AsyncSession, user_id: int, ticket_data: SupportTicketCreate) -> SupportTicket:
        ticket_number = await self._generate_ticket_number(db)
        
        db_ticket = SupportTicket(
            user_id=user_id,
            ticket_number=ticket_number,
            subject=ticket_data.subject,
            description=ticket_data.description,
            priority=ticket_data.priority,
            department=ticket_data.department
        )
        
        db.add(db_ticket)
        await db.commit()
        await db.refresh(db_ticket)
        return db_ticket
    
    async def update_ticket(self, db: AsyncSession, ticket_id: int, ticket_update: SupportTicketUpdate) -> Optional[SupportTicket]:
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if not ticket:
            return None
            
        update_data = ticket_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(ticket, field, value)
            
        await db.commit()
        await db.refresh(ticket)
        return ticket
    
    async def update_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int, ticket_update: SupportTicketUpdate) -> Optional[SupportTicket]:
        ticket = await self.get_user_ticket(db, user_id, ticket_id)
        if not ticket:
            return None
            
        update_data = ticket_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(ticket, field, value)
            
        await db.commit()
        await db.refresh(ticket)
        return ticket
    
    async def close_ticket(self, db: AsyncSession, ticket_id: int) -> bool:
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if not ticket:
            return False
            
        ticket.status = 'closed'
        ticket.closed_at = datetime.now()
        await db.commit()
        return True
    
    async def close_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> bool:
        ticket = await self.get_user_ticket(db, user_id, ticket_id)
        if not ticket:
            return False
            
        ticket.status = 'closed'
        ticket.closed_at = datetime.now()
        await db.commit()
        return True
    
    async def reopen_ticket(self, db: AsyncSession, ticket_id: int) -> bool:
        ticket = await self.get_ticket_by_id(db, ticket_id)
        if not ticket:
            return False
            
        ticket.status = 'open'
        ticket.closed_at = None
        await db.commit()
        return True
    
    async def reopen_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> bool:
        ticket = await self.get_user_ticket(db, user_id, ticket_id)
        if not ticket:
            return False
            
        ticket.status = 'open'
        ticket.closed_at = None
        await db.commit()
        return True
    
    async def get_user_open_tickets_count(self, db: AsyncSession, user_id: int) -> int:
        result = await db.execute(
            select(func.count(SupportTicket.id)).where(
                SupportTicket.user_id == user_id,
                SupportTicket.status.in_(['open', 'in_progress'])
            )
        )
        return result.scalar()
    
    async def get_open_tickets_count(self, db: AsyncSession) -> int:
        result = await db.execute(
            select(func.count(SupportTicket.id)).where(
                SupportTicket.status.in_(['open', 'in_progress'])
            )
        )
        return result.scalar()
    
    async def get_support_stats(self, db: AsyncSession) -> SupportStats:
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
        
        # Calculate average response time (mock data)
        average_response_time = 2.5  # hours
        
        return SupportStats(
            total_tickets=total_tickets,
            open_tickets=open_tickets,
            in_progress_tickets=in_progress_tickets,
            resolved_tickets=resolved_tickets,
            closed_tickets=closed_tickets,
            average_response_time=average_response_time
        )
    
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
        
        return f"{base_number}{new_number:03d}"