# # from sqlalchemy.ext.asyncio import AsyncSession
# # from sqlalchemy import func, select
# # from typing import List, Optional, Dict, Any
# # from datetime import datetime
# # import secrets
# # import string

# # from app.models.support import SupportTicket
# # from app.models.user import UserProfile
# # from app.schemas.support import SupportTicketCreate, SupportTicketUpdate, SupportStats

# # class SupportService:
# #     async def get_user_tickets(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100, 
# #                               status: Optional[str] = None) -> List[SupportTicket]:
# #         query = select(SupportTicket).where(SupportTicket.user_id == user_id)
        
# #         if status and status != "all":
# #             query = query.where(SupportTicket.status == status)
            
# #         query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
# #         result = await db.execute(query)
# #         return result.scalars().all()
    
# #     async def get_all_tickets(self, db: AsyncSession, skip: int = 0, limit: int = 100, 
# #                              status: Optional[str] = None, priority: Optional[str] = None) -> List[Dict[str, Any]]:
# #         query = select(SupportTicket, UserProfile).join(
# #             UserProfile, SupportTicket.user_id == UserProfile.id
# #         )
        
# #         if status and status != "all":
# #             query = query.where(SupportTicket.status == status)
            
# #         if priority and priority != "all":
# #             query = query.where(SupportTicket.priority == priority)
            
# #         query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
# #         result = await db.execute(query)
# #         tickets_with_users = result.all()
        
# #         tickets_list = []
# #         for ticket, user in tickets_with_users:
# #             ticket_dict = {
# #                 "id": ticket.id,
# #                 "user_id": ticket.user_id,
# #                 "ticket_number": ticket.ticket_number,
# #                 "subject": ticket.subject,
# #                 "description": ticket.description,
# #                 "status": ticket.status,
# #                 "priority": ticket.priority,
# #                 "department": ticket.department,
# #                 "assigned_to": ticket.assigned_to,
# #                 "created_at": ticket.created_at,
# #                 "updated_at": ticket.updated_at,
# #                 "closed_at": ticket.closed_at,
# #                 "user_name": user.full_name,
# #                 "user_email": user.email
# #             }
# #             tickets_list.append(ticket_dict)
        
# #         return tickets_list
    
# #     async def get_ticket_by_id(self, db: AsyncSession, ticket_id: int) -> Optional[SupportTicket]:
# #         result = await db.execute(
# #             select(SupportTicket).where(SupportTicket.id == ticket_id)
# #         )
# #         return result.scalar_one_or_none()
    
# #     async def get_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> Optional[SupportTicket]:
# #         result = await db.execute(
# #             select(SupportTicket).where(
# #                 SupportTicket.id == ticket_id,
# #                 SupportTicket.user_id == user_id
# #             )
# #         )
# #         return result.scalar_one_or_none()
    
# #     async def create_ticket(self, db: AsyncSession, user_id: int, ticket_data: SupportTicketCreate) -> SupportTicket:
# #         ticket_number = await self._generate_ticket_number(db)
        
# #         db_ticket = SupportTicket(
# #             user_id=user_id,
# #             ticket_number=ticket_number,
# #             subject=ticket_data.subject,
# #             description=ticket_data.description,
# #             priority=ticket_data.priority,
# #             department=ticket_data.department
# #         )
        
# #         db.add(db_ticket)
# #         await db.commit()
# #         await db.refresh(db_ticket)
# #         return db_ticket
    
# #     async def update_ticket(self, db: AsyncSession, ticket_id: int, ticket_update: SupportTicketUpdate) -> Optional[SupportTicket]:
# #         ticket = await self.get_ticket_by_id(db, ticket_id)
# #         if not ticket:
# #             return None
            
# #         update_data = ticket_update.dict(exclude_unset=True)
# #         for field, value in update_data.items():
# #             setattr(ticket, field, value)
            
# #         await db.commit()
# #         await db.refresh(ticket)
# #         return ticket
    
# #     async def update_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int, ticket_update: SupportTicketUpdate) -> Optional[SupportTicket]:
# #         ticket = await self.get_user_ticket(db, user_id, ticket_id)
# #         if not ticket:
# #             return None
            
# #         update_data = ticket_update.dict(exclude_unset=True)
# #         for field, value in update_data.items():
# #             setattr(ticket, field, value)
            
# #         await db.commit()
# #         await db.refresh(ticket)
# #         return ticket
    
# #     async def close_ticket(self, db: AsyncSession, ticket_id: int) -> bool:
# #         ticket = await self.get_ticket_by_id(db, ticket_id)
# #         if not ticket:
# #             return False
            
# #         ticket.status = 'closed'
# #         ticket.closed_at = datetime.now()
# #         await db.commit()
# #         return True
    
# #     async def close_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> bool:
# #         ticket = await self.get_user_ticket(db, user_id, ticket_id)
# #         if not ticket:
# #             return False
            
# #         ticket.status = 'closed'
# #         ticket.closed_at = datetime.now()
# #         await db.commit()
# #         return True
    
# #     async def reopen_ticket(self, db: AsyncSession, ticket_id: int) -> bool:
# #         ticket = await self.get_ticket_by_id(db, ticket_id)
# #         if not ticket:
# #             return False
            
# #         ticket.status = 'open'
# #         ticket.closed_at = None
# #         await db.commit()
# #         return True
    
# #     async def reopen_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> bool:
# #         ticket = await self.get_user_ticket(db, user_id, ticket_id)
# #         if not ticket:
# #             return False
            
# #         ticket.status = 'open'
# #         ticket.closed_at = None
# #         await db.commit()
# #         return True
    
# #     async def get_user_open_tickets_count(self, db: AsyncSession, user_id: int) -> int:
# #         result = await db.execute(
# #             select(func.count(SupportTicket.id)).where(
# #                 SupportTicket.user_id == user_id,
# #                 SupportTicket.status.in_(['open', 'in_progress'])
# #             )
# #         )
# #         return result.scalar()
    
# #     async def get_open_tickets_count(self, db: AsyncSession) -> int:
# #         result = await db.execute(
# #             select(func.count(SupportTicket.id)).where(
# #                 SupportTicket.status.in_(['open', 'in_progress'])
# #             )
# #         )
# #         return result.scalar()
    
# #     async def get_support_stats(self, db: AsyncSession) -> SupportStats:
# #         total_tickets_result = await db.execute(select(func.count(SupportTicket.id)))
# #         total_tickets = total_tickets_result.scalar()
        
# #         open_tickets_result = await db.execute(
# #             select(func.count(SupportTicket.id)).where(SupportTicket.status == 'open')
# #         )
# #         open_tickets = open_tickets_result.scalar()
        
# #         in_progress_tickets_result = await db.execute(
# #             select(func.count(SupportTicket.id)).where(SupportTicket.status == 'in_progress')
# #         )
# #         in_progress_tickets = in_progress_tickets_result.scalar()
        
# #         resolved_tickets_result = await db.execute(
# #             select(func.count(SupportTicket.id)).where(SupportTicket.status == 'resolved')
# #         )
# #         resolved_tickets = resolved_tickets_result.scalar()
        
# #         closed_tickets_result = await db.execute(
# #             select(func.count(SupportTicket.id)).where(SupportTicket.status == 'closed')
# #         )
# #         closed_tickets = closed_tickets_result.scalar()
        
# #         # Calculate average response time (mock data)
# #         average_response_time = 2.5  # hours
        
# #         return SupportStats(
# #             total_tickets=total_tickets,
# #             open_tickets=open_tickets,
# #             in_progress_tickets=in_progress_tickets,
# #             resolved_tickets=resolved_tickets,
# #             closed_tickets=closed_tickets,
# #             average_response_time=average_response_time
# #         )
    
# #     async def _generate_ticket_number(self, db: AsyncSession) -> str:
# #         """Generate a unique ticket number"""
# #         year = datetime.now().year
# #         base_number = f"TICK-{year}-"
        
# #         result = await db.execute(
# #             select(SupportTicket.ticket_number).where(
# #                 SupportTicket.ticket_number.like(f"{base_number}%")
# #             ).order_by(SupportTicket.ticket_number.desc()).limit(1)
# #         )
# #         last_ticket = result.scalar_one_or_none()
        
# #         if last_ticket:
# #             last_number = int(last_ticket.split('-')[-1])
# #             new_number = last_number + 1
# #         else:
# #             new_number = 1
        
# #         return f"{base_number}{new_number:03d}"






# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import func, select
# from typing import List, Optional, Dict, Any
# from datetime import datetime

# from app.models.support import SupportTicket
# from app.models.user import UserProfile
# from app.schemas.support import SupportTicketCreate, SupportTicketUpdate, SupportStats


# class SupportService:
#     """Handles all support ticket operations and stats."""

#     # ------------------------------------------------------
#     # ✅ User Ticket Retrieval
#     # ------------------------------------------------------
#     async def get_user_tickets(
#         self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100, status: Optional[str] = None
#     ) -> List[SupportTicket]:
#         query = select(SupportTicket).where(SupportTicket.user_id == user_id)

#         if status and status.lower() != "all":
#             query = query.where(SupportTicket.status == status)

#         query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
#         result = await db.execute(query)
#         return result.scalars().all()

#     # ------------------------------------------------------
#     # ✅ Admin: Get All Tickets (with User Info)
#     # ------------------------------------------------------
#     async def get_all_tickets(
#         self, db: AsyncSession, skip: int = 0, limit: int = 100, status: Optional[str] = None, priority: Optional[str] = None
#     ) -> List[Dict[str, Any]]:
#         query = select(SupportTicket, UserProfile).join(UserProfile, SupportTicket.user_id == UserProfile.id)

#         if status and status.lower() != "all":
#             query = query.where(SupportTicket.status == status)

#         if priority and priority.lower() != "all":
#             query = query.where(SupportTicket.priority == priority)

#         query = query.order_by(SupportTicket.created_at.desc()).offset(skip).limit(limit)
#         result = await db.execute(query)
#         tickets_with_users = result.all()

#         return [
#             {
#                 "id": ticket.id,
#                 "user_id": ticket.user_id,
#                 "ticket_number": ticket.ticket_number,
#                 "subject": ticket.subject,
#                 "description": ticket.description,
#                 "status": ticket.status,
#                 "priority": ticket.priority,
#                 "department": ticket.department,
#                 "assigned_to": ticket.assigned_to,
#                 "created_at": ticket.created_at,
#                 "updated_at": ticket.updated_at,
#                 "closed_at": ticket.closed_at,
#                 "user_name": user.full_name,
#                 "user_email": user.email,
#             }
#             for ticket, user in tickets_with_users
#         ]

#     # ------------------------------------------------------
#     # ✅ Single Ticket Fetch
#     # ------------------------------------------------------
#     async def get_ticket_by_id(self, db: AsyncSession, ticket_id: int) -> Optional[SupportTicket]:
#         result = await db.execute(select(SupportTicket).where(SupportTicket.id == ticket_id))
#         return result.scalar_one_or_none()

#     async def get_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> Optional[SupportTicket]:
#         result = await db.execute(
#             select(SupportTicket).where(SupportTicket.id == ticket_id, SupportTicket.user_id == user_id)
#         )
#         return result.scalar_one_or_none()

#     # ------------------------------------------------------
#     # ✅ Ticket Creation
#     # ------------------------------------------------------
#     async def create_ticket(self, db: AsyncSession, user_id: int, ticket_data: SupportTicketCreate) -> SupportTicket:
#         ticket_number = await self._generate_ticket_number(db)

#         db_ticket = SupportTicket(
#             user_id=user_id,
#             ticket_number=ticket_number,
#             subject=ticket_data.subject,
#             description=ticket_data.description,
#             priority=ticket_data.priority,
#             department=ticket_data.department,
#             status="open",
#             created_at=datetime.utcnow(),
#         )

#         db.add(db_ticket)
#         await db.commit()
#         await db.refresh(db_ticket)
#         return db_ticket

#     # ------------------------------------------------------
#     # ✅ Ticket Update
#     # ------------------------------------------------------
#     async def update_ticket(self, db: AsyncSession, ticket_id: int, ticket_update: SupportTicketUpdate) -> Optional[SupportTicket]:
#         ticket = await self.get_ticket_by_id(db, ticket_id)
#         if not ticket:
#             return None

#         for field, value in ticket_update.dict(exclude_unset=True).items():
#             setattr(ticket, field, value)

#         ticket.updated_at = datetime.utcnow()
#         await db.commit()
#         await db.refresh(ticket)
#         return ticket

#     async def update_user_ticket(
#         self, db: AsyncSession, user_id: int, ticket_id: int, ticket_update: SupportTicketUpdate
#     ) -> Optional[SupportTicket]:
#         ticket = await self.get_user_ticket(db, user_id, ticket_id)
#         if not ticket:
#             return None

#         for field, value in ticket_update.dict(exclude_unset=True).items():
#             setattr(ticket, field, value)

#         ticket.updated_at = datetime.utcnow()
#         await db.commit()
#         await db.refresh(ticket)
#         return ticket

#     # ------------------------------------------------------
#     # ✅ Ticket Status Actions
#     # ------------------------------------------------------
#     async def close_ticket(self, db: AsyncSession, ticket_id: int) -> bool:
#         ticket = await self.get_ticket_by_id(db, ticket_id)
#         if not ticket:
#             return False

#         ticket.status = "closed"
#         ticket.closed_at = datetime.utcnow()
#         await db.commit()
#         return True

#     async def close_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> bool:
#         ticket = await self.get_user_ticket(db, user_id, ticket_id)
#         if not ticket:
#             return False

#         ticket.status = "closed"
#         ticket.closed_at = datetime.utcnow()
#         await db.commit()
#         return True

#     async def reopen_ticket(self, db: AsyncSession, ticket_id: int) -> bool:
#         ticket = await self.get_ticket_by_id(db, ticket_id)
#         if not ticket:
#             return False

#         ticket.status = "open"
#         ticket.closed_at = None
#         await db.commit()
#         return True

#     async def reopen_user_ticket(self, db: AsyncSession, user_id: int, ticket_id: int) -> bool:
#         ticket = await self.get_user_ticket(db, user_id, ticket_id)
#         if not ticket:
#             return False

#         ticket.status = "open"
#         ticket.closed_at = None
#         await db.commit()
#         return True

#     # ------------------------------------------------------
#     # ✅ Counts & Stats
#     # ------------------------------------------------------
#     async def get_user_open_tickets_count(self, db: AsyncSession, user_id: int) -> int:
#         result = await db.execute(
#             select(func.count(SupportTicket.id)).where(
#                 SupportTicket.user_id == user_id,
#                 SupportTicket.status.in_(["open", "in_progress"]),
#             )
#         )
#         return result.scalar() or 0

#     async def get_open_tickets_count(self, db: AsyncSession) -> int:
#         result = await db.execute(
#             select(func.count(SupportTicket.id)).where(SupportTicket.status.in_(["open", "in_progress"]))
#         )
#         return result.scalar() or 0

#     async def get_support_stats(self, db: AsyncSession) -> SupportStats:
#         def _count_query(condition=None):
#             q = select(func.count(SupportTicket.id))
#             if condition is not None:
#                 q = q.where(condition)
#             return q

#         total_tickets = (await db.execute(_count_query())).scalar() or 0
#         open_tickets = (await db.execute(_count_query(SupportTicket.status == "open"))).scalar() or 0
#         in_progress = (await db.execute(_count_query(SupportTicket.status == "in_progress"))).scalar() or 0
#         resolved = (await db.execute(_count_query(SupportTicket.status == "resolved"))).scalar() or 0
#         closed = (await db.execute(_count_query(SupportTicket.status == "closed"))).scalar() or 0

#         # Mock average response time (you can calculate this from DB later)
#         average_response_time = 2.5  # hours

#         return SupportStats(
#             total_tickets=total_tickets,
#             open_tickets=open_tickets,
#             in_progress_tickets=in_progress,
#             resolved_tickets=resolved,
#             closed_tickets=closed,
#             average_response_time=average_response_time,
#         )

#     # ------------------------------------------------------
#     # ✅ Helper: Generate Unique Ticket Number
#     # ------------------------------------------------------
#     async def _generate_ticket_number(self, db: AsyncSession) -> str:
#         """Generate a unique ticket number like TICK-2025-001"""
#         year = datetime.utcnow().year
#         prefix = f"TICK-{year}-"

#         result = await db.execute(
#             select(SupportTicket.ticket_number)
#             .where(SupportTicket.ticket_number.like(f"{prefix}%"))
#             .order_by(SupportTicket.ticket_number.desc())
#             .limit(1)
#         )
#         last_ticket = result.scalar_one_or_none()

#         next_num = int(last_ticket.split("-")[-1]) + 1 if last_ticket else 1
#         return f"{prefix}{next_num:03d}"








# from sqlalchemy.orm import Session
# from sqlalchemy import func
# from datetime import datetime
# from decimal import Decimal
# from typing import List, Optional, Dict, Any

# from app.models.referrals import ReferralEarning, ReferralPayout
# from app.models.user import UserProfile
# from app.schemas.referrals import ReferralPayoutCreate, ReferralStats


# class ReferralService:
#     """Handles all referral earnings, payouts, and statistics."""

#     # --------------------------------------------------------
#     # ✅ User referral stats
#     # --------------------------------------------------------
#     def get_user_referral_stats(self, db: Session, user_id: int) -> ReferralStats:
#         total_referrals = (
#             db.query(ReferralEarning)
#             .filter(ReferralEarning.user_id == user_id)
#             .count()
#         )

#         total_earnings = (
#             db.query(ReferralEarning)
#             .filter(ReferralEarning.user_id == user_id)
#             .with_entities(func.coalesce(func.sum(ReferralEarning.commission_amount), 0))
#             .scalar()
#         )

#         total_withdrawn = (
#             db.query(ReferralPayout)
#             .filter(ReferralPayout.user_id == user_id, ReferralPayout.status == "approved")
#             .with_entities(func.coalesce(func.sum(ReferralPayout.net_amount), 0))
#             .scalar()
#         )

#         available_balance = Decimal(total_earnings) - Decimal(total_withdrawn)

#         return ReferralStats(
#             total_referrals=total_referrals,
#             l1_referrals=total_referrals,  # For now (extend later)
#             l2_referrals=0,
#             l3_referrals=0,
#             total_earnings=total_earnings,
#             available_balance=available_balance,
#             total_withdrawn=total_withdrawn,
#             can_request_payout=available_balance >= 500,
#             referral_code=f"REF{user_id:04d}",
#         )

#     # --------------------------------------------------------
#     # ✅ User referral earnings
#     # --------------------------------------------------------
#     def get_user_earnings(self, db: Session, user_id: int) -> List[ReferralEarning]:
#         return (
#             db.query(ReferralEarning)
#             .filter(ReferralEarning.user_id == user_id)
#             .order_by(ReferralEarning.earned_at.desc())
#             .all()
#         )

#     # --------------------------------------------------------
#     # ✅ User payouts
#     # --------------------------------------------------------
#     def get_user_payouts(self, db: Session, user_id: int) -> List[ReferralPayout]:
#         return (
#             db.query(ReferralPayout)
#             .filter(ReferralPayout.user_id == user_id)
#             .order_by(ReferralPayout.requested_at.desc())
#             .all()
#         )

#     # --------------------------------------------------------
#     # ✅ Request new payout
#     # --------------------------------------------------------
#     def request_payout(self, db: Session, user_id: int, data: ReferralPayoutCreate) -> ReferralPayout:
#         payout = ReferralPayout(
#             user_id=user_id,
#             gross_amount=data.gross_amount,
#             payment_method=data.payment_method,
#             tax_year=data.tax_year,
#             tax_quarter=data.tax_quarter,
#             tds_amount=data.gross_amount * Decimal("0.10"),
#             service_tax_amount=data.gross_amount * Decimal("0.18"),
#             net_amount=data.gross_amount * Decimal("0.72"),
#             status="requested",
#             payout_number=f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}-{user_id}",
#             requested_at=datetime.now(),
#         )

#         db.add(payout)
#         db.commit()
#         db.refresh(payout)
#         return payout

#     # --------------------------------------------------------
#     # ✅ Get all payouts (admin)
#     # --------------------------------------------------------
#     def get_all_payouts(self, db: Session, status: str = "all") -> List[ReferralPayout]:
#         query = db.query(ReferralPayout)
#         if status != "all":
#             query = query.filter(ReferralPayout.status == status)
#         return query.order_by(ReferralPayout.requested_at.desc()).all()

#     # --------------------------------------------------------
#     # ✅ Approve payout (admin)
#     # --------------------------------------------------------
#     def approve_payout(self, db: Session, payout_id: int, payment_ref: str) -> bool:
#         payout = db.query(ReferralPayout).filter(ReferralPayout.id == payout_id).first()
#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "approved"
#         payout.payment_reference = payment_ref
#         payout.processed_at = datetime.now()
#         db.commit()
#         return True

#     # --------------------------------------------------------
#     # ✅ Reject payout (admin)
#     # --------------------------------------------------------
#     def reject_payout(self, db: Session, payout_id: int, reason: str) -> bool:
#         payout = db.query(ReferralPayout).filter(ReferralPayout.id == payout_id).first()
#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "rejected"
#         payout.rejected_reason = reason
#         payout.processed_at = datetime.now()
#         db.commit()
#         return True

#     # --------------------------------------------------------
#     # ✅ Admin stats (overview)
#     # --------------------------------------------------------
#     def get_admin_referral_stats(self, db: Session) -> Dict[str, Any]:
#         total_payouts = db.query(func.count(ReferralPayout.id)).scalar()
#         approved_payouts = (
#             db.query(func.count(ReferralPayout.id))
#             .filter(ReferralPayout.status == "approved")
#             .scalar()
#         )
#         rejected_payouts = (
#             db.query(func.count(ReferralPayout.id))
#             .filter(ReferralPayout.status == "rejected")
#             .scalar()
#         )
#         pending_payouts = (
#             db.query(func.count(ReferralPayout.id))
#             .filter(ReferralPayout.status == "requested")
#             .scalar()
#         )

#         total_earnings = db.query(func.sum(ReferralEarning.commission_amount)).scalar() or 0
#         total_withdrawn = db.query(func.sum(ReferralPayout.net_amount)).scalar() or 0

#         return {
#             "total_payouts": total_payouts,
#             "approved_payouts": approved_payouts,
#             "rejected_payouts": rejected_payouts,
#             "pending_payouts": pending_payouts,
#             "total_earnings": total_earnings,
#             "total_withdrawn": total_withdrawn,
#             "available_balance": total_earnings - total_withdrawn,
#         }







# from sqlalchemy.orm import Session
# from sqlalchemy import func
# from datetime import datetime
# from decimal import Decimal
# from typing import List, Dict, Any

# from app.models.referrals import ReferralEarning, ReferralPayout
# from app.models.users import UserProfile  # ✅ Ensure this class actually exists!
# from app.schemas.referrals import ReferralPayoutCreate, ReferralStats


# class ReferralService:
#     """Handles all referral earnings, payouts, and statistics."""

#     # --------------------------------------------------------
#     # ✅ User referral stats
#     # --------------------------------------------------------
#     def get_user_referral_stats(self, db: Session, user_id: int) -> ReferralStats:
#         # --- Total referrals ---
#         total_referrals = (
#             db.query(ReferralEarning)
#             .filter(ReferralEarning.user_id == user_id)
#             .count()
#         )

#         # --- Total earnings ---
#         total_earnings = (
#             db.query(func.coalesce(func.sum(ReferralEarning.commission_amount), 0))
#             .filter(ReferralEarning.user_id == user_id)
#             .scalar()
#         )

#         # --- Total withdrawn ---
#         total_withdrawn = (
#             db.query(func.coalesce(func.sum(ReferralPayout.net_amount), 0))
#             .filter(ReferralPayout.user_id == user_id, ReferralPayout.status == "approved")
#             .scalar()
#         )

#         # --- Safe decimal conversion ---
#         total_earnings = Decimal(total_earnings or 0)
#         total_withdrawn = Decimal(total_withdrawn or 0)
#         available_balance = total_earnings - total_withdrawn

#         return ReferralStats(
#             total_referrals=total_referrals,
#             l1_referrals=total_referrals,  # Placeholder (extend later)
#             l2_referrals=0,
#             l3_referrals=0,
#             total_earnings=total_earnings,
#             available_balance=available_balance,
#             total_withdrawn=total_withdrawn,
#             can_request_payout=available_balance >= Decimal("500"),
#             referral_code=f"REF{user_id:04d}",
#         )

#     # --------------------------------------------------------
#     # ✅ User referral earnings
#     # --------------------------------------------------------
#     def get_user_earnings(self, db: Session, user_id: int) -> List[ReferralEarning]:
#         return (
#             db.query(ReferralEarning)
#             .filter(ReferralEarning.user_id == user_id)
#             .order_by(ReferralEarning.earned_at.desc())
#             .all()
#         )

#     # --------------------------------------------------------
#     # ✅ User payouts
#     # --------------------------------------------------------
#     def get_user_payouts(self, db: Session, user_id: int) -> List[ReferralPayout]:
#         return (
#             db.query(ReferralPayout)
#             .filter(ReferralPayout.user_id == user_id)
#             .order_by(ReferralPayout.requested_at.desc())
#             .all()
#         )

#     # --------------------------------------------------------
#     # ✅ Request new payout
#     # --------------------------------------------------------
#     def request_payout(self, db: Session, user_id: int, data: ReferralPayoutCreate) -> ReferralPayout:
#         payout = ReferralPayout(
#             user_id=user_id,
#             gross_amount=data.gross_amount,
#             payment_method=data.payment_method,
#             tax_year=data.tax_year,
#             tax_quarter=data.tax_quarter,
#             tds_amount=data.gross_amount * Decimal("0.10"),
#             service_tax_amount=data.gross_amount * Decimal("0.18"),
#             net_amount=data.gross_amount * Decimal("0.72"),
#             status="requested",
#             payout_number=f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}-{user_id}",
#             requested_at=datetime.now(),
#         )

#         db.add(payout)
#         db.commit()
#         db.refresh(payout)
#         return payout

#     # --------------------------------------------------------
#     # ✅ Get all payouts (admin)
#     # --------------------------------------------------------
#     def get_all_payouts(self, db: Session, status: str = "all") -> List[ReferralPayout]:
#         query = db.query(ReferralPayout)
#         if status != "all":
#             query = query.filter(ReferralPayout.status == status)
#         return query.order_by(ReferralPayout.requested_at.desc()).all()

#     # --------------------------------------------------------
#     # ✅ Approve payout (admin)
#     # --------------------------------------------------------
#     def approve_payout(self, db: Session, payout_id: int, payment_ref: str) -> bool:
#         payout = db.query(ReferralPayout).filter(ReferralPayout.id == payout_id).first()
#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "approved"
#         payout.payment_reference = payment_ref
#         payout.processed_at = datetime.now()
#         db.commit()
#         return True

#     # --------------------------------------------------------
#     # ✅ Reject payout (admin)
#     # --------------------------------------------------------
#     def reject_payout(self, db: Session, payout_id: int, reason: str) -> bool:
#         payout = db.query(ReferralPayout).filter(ReferralPayout.id == payout_id).first()
#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "rejected"
#         payout.rejected_reason = reason
#         payout.processed_at = datetime.now()
#         db.commit()
#         return True

#     # --------------------------------------------------------
#     # ✅ Admin stats (overview)
#     # --------------------------------------------------------
#     def get_admin_referral_stats(self, db: Session) -> Dict[str, Any]:
#         total_payouts = db.query(func.count(ReferralPayout.id)).scalar() or 0
#         approved_payouts = (
#             db.query(func.count(ReferralPayout.id))
#             .filter(ReferralPayout.status == "approved")
#             .scalar()
#             or 0
#         )
#         rejected_payouts = (
#             db.query(func.count(ReferralPayout.id))
#             .filter(ReferralPayout.status == "rejected")
#             .scalar()
#             or 0
#         )
#         pending_payouts = (
#             db.query(func.count(ReferralPayout.id))
#             .filter(ReferralPayout.status == "requested")
#             .scalar()
#             or 0
#         )

#         total_earnings = db.query(func.sum(ReferralEarning.commission_amount)).scalar() or 0
#         total_withdrawn = db.query(func.sum(ReferralPayout.net_amount)).scalar() or 0

#         return {
#             "total_payouts": total_payouts,
#             "approved_payouts": approved_payouts,
#             "rejected_payouts": rejected_payouts,
#             "pending_payouts": pending_payouts,
#             "total_earnings": float(total_earnings),
#             "total_withdrawn": float(total_withdrawn),
#             "available_balance": float(total_earnings) - float(total_withdrawn),
#         }





# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func
# from datetime import datetime
# from decimal import Decimal
# from typing import List, Dict, Any, Optional

# from app.models.referrals import ReferralEarning, ReferralPayout
# from app.models.users import UserProfile  # ✅ Ensure this model actually exists
# from app.schemas.referrals import ReferralPayoutCreate, ReferralStats


# class ReferralService:
#     """Handles all referral earnings, payouts, and statistics (Async)."""

   



#     async def get_user_referral_stats(
#             self, db: AsyncSession, user_id: int
#         ) -> ReferralStats:
#             # --------------------------------------------------------
#             # 🔹 Level 1 Referrals (direct referrals)
#             # --------------------------------------------------------
#             l1_result = await db.execute(
#                 select(func.count(UserProfile.id)).where(UserProfile.referred_by == user_id)
#             )
#             l1_referrals = l1_result.scalar() or 0

#             # --------------------------------------------------------
#             # 🔹 Level 2 Referrals (users referred by level 1 users)
#             # --------------------------------------------------------
#             l2_result = await db.execute(
#                 select(func.count(UserProfile.id)).where(
#                     UserProfile.referred_by.in_(
#                         select(UserProfile.id).where(UserProfile.referred_by == user_id)
#                     )
#                 )
#             )
#             l2_referrals = l2_result.scalar() or 0

#             # --------------------------------------------------------
#             # 🔹 Level 3 Referrals (users referred by level 2 users)
#             # --------------------------------------------------------
#             l3_result = await db.execute(
#                 select(func.count(UserProfile.id)).where(
#                     UserProfile.referred_by.in_(
#                         select(UserProfile.id).where(
#                             UserProfile.referred_by.in_(
#                                 select(UserProfile.id).where(UserProfile.referred_by == user_id)
#                             )
#                         )
#                     )
#                 )
#             )
#             l3_referrals = l3_result.scalar() or 0

#             # --------------------------------------------------------
#             # 🔹 Total referrals (sum of all levels)
#             # --------------------------------------------------------
#             total_referrals = l1_referrals + l2_referrals + l3_referrals

#             # --------------------------------------------------------
#             # 🔹 Total earnings (sum of all commissions earned)
#             # --------------------------------------------------------
#             total_earnings_result = await db.execute(
#                 select(func.coalesce(func.sum(ReferralEarning.commission_amount), 0)).where(
#                     ReferralEarning.user_id == user_id
#                 )
#             )
#             total_earnings = Decimal(total_earnings_result.scalar() or 0)

#             # --------------------------------------------------------
#             # 🔹 Pending payouts (user requests not yet approved)
#             # --------------------------------------------------------
#             pending_payouts_result = await db.execute(
#                 select(func.coalesce(func.sum(ReferralPayout.net_amount), 0)).where(
#                     ReferralPayout.user_id == user_id,
#                     ReferralPayout.status == "pending"
#                 )
#             )
#             pending_payouts = Decimal(pending_payouts_result.scalar() or 0)

#             # --------------------------------------------------------
#             # 🔹 Completed payouts (approved payouts)
#             # --------------------------------------------------------
#             completed_payouts_result = await db.execute(
#                 select(func.coalesce(func.sum(ReferralPayout.net_amount), 0)).where(
#                     ReferralPayout.user_id == user_id,
#                     ReferralPayout.status == "approved"
#                 )
#             )
#             completed_payouts = Decimal(completed_payouts_result.scalar() or 0)

#             # --------------------------------------------------------
#             # 🔹 Total withdrawn (same as approved payouts)
#             # --------------------------------------------------------
#             total_withdrawn = completed_payouts

#             # --------------------------------------------------------
#             # 🔹 Available balance
#             # --------------------------------------------------------
#             available_balance = total_earnings - (pending_payouts + completed_payouts)
#             print("Available Balance==================>:", available_balance)

#             # --------------------------------------------------------
#             # 🔹 Return fully dynamic stats
#             # --------------------------------------------------------
#             return ReferralStats(
#                 total_referrals=total_referrals,
#                 l1_referrals=l1_referrals,
#                 l2_referrals=l2_referrals,
#                 l3_referrals=l3_referrals,
#                 total_earnings=total_earnings,
#                 pending_payouts=pending_payouts,
#                 completed_payouts=completed_payouts,
#                 available_balance=available_balance,
#                 total_withdrawn=total_withdrawn,
#                 can_request_payout=available_balance >= Decimal("500"),
#                 referral_code=f"REF{user_id:04d}",
#             )




#     # --------------------------------------------------------
#     # ✅ User referral earnings
#     # --------------------------------------------------------
#     async def get_user_earnings(
#         self, db: AsyncSession, user_id: int
#     ) -> List[ReferralEarning]:
#         result = await db.execute(
#             select(ReferralEarning)
#             .where(ReferralEarning.user_id == user_id)
#             .order_by(ReferralEarning.earned_at.desc())
#         )
#         return result.scalars().all()

#     # --------------------------------------------------------
#     # ✅ User payouts
#     # --------------------------------------------------------
#     async def get_user_payouts(
#         self, db: AsyncSession, user_id: int
#     ) -> List[ReferralPayout]:
#         result = await db.execute(
#             select(ReferralPayout)
#             .where(ReferralPayout.user_id == user_id)
#             .order_by(ReferralPayout.requested_at.desc())
#         )
#         return result.scalars().all()

#     # --------------------------------------------------------
#     # ✅ Request new payout
#     # --------------------------------------------------------
#     async def request_payout(
#         self, db: AsyncSession, user_id: int, data: ReferralPayoutCreate
#     ) -> ReferralPayout:
#         payout = ReferralPayout(
#             user_id=user_id,
#             gross_amount=data.gross_amount,
#             payment_method=data.payment_method,
#             tax_year=data.tax_year,
#             tax_quarter=data.tax_quarter,
#             tds_amount=data.gross_amount * Decimal("0.10"),
#             service_tax_amount=data.gross_amount * Decimal("0.18"),
#             net_amount=data.gross_amount * Decimal("0.72"),
#             status="requested",
#             payout_number=f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}-{user_id}",
#             requested_at=datetime.now(),
#         )

#         async with db.begin():
#             db.add(payout)

#         await db.refresh(payout)
#         return payout

#     # --------------------------------------------------------
#     # ✅ Get all payouts (admin)
#     # --------------------------------------------------------
#     async def get_all_payouts(
#         self, db: AsyncSession, status: str = "all"
#     ) -> List[ReferralPayout]:
#         query = select(ReferralPayout).order_by(ReferralPayout.requested_at.desc())
#         if status != "all":
#             query = query.where(ReferralPayout.status == status)

#         result = await db.execute(query)
#         return result.scalars().all()

#     # --------------------------------------------------------
#     # ✅ Approve payout (admin)
#     # --------------------------------------------------------
#     async def approve_payout(
#         self, db: AsyncSession, payout_id: int, payment_ref: str
#     ) -> bool:
#         result = await db.execute(
#             select(ReferralPayout).where(ReferralPayout.id == payout_id)
#         )
#         payout = result.scalar_one_or_none()

#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "approved"
#         payout.payment_reference = payment_ref
#         payout.processed_at = datetime.now()

#         async with db.begin():
#             db.add(payout)
#         return True

#     # --------------------------------------------------------
#     # ✅ Reject payout (admin)
#     # --------------------------------------------------------
#     async def reject_payout(
#         self, db: AsyncSession, payout_id: int, reason: str
#     ) -> bool:
#         result = await db.execute(
#             select(ReferralPayout).where(ReferralPayout.id == payout_id)
#         )
#         payout = result.scalar_one_or_none()

#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "rejected"
#         payout.rejected_reason = reason
#         payout.processed_at = datetime.now()

#         async with db.begin():
#             db.add(payout)
#         return True

#     # --------------------------------------------------------
#     # ✅ Admin stats (overview)
#     # --------------------------------------------------------
#     async def get_admin_referral_stats(self, db: AsyncSession) -> Dict[str, Any]:
#         # --- Counts ---
#         total_payouts = (await db.execute(select(func.count(ReferralPayout.id)))).scalar() or 0
#         approved_payouts = (
#             await db.execute(
#                 select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "approved")
#             )
#         ).scalar() or 0
#         rejected_payouts = (
#             await db.execute(
#                 select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "rejected")
#             )
#         ).scalar() or 0
#         pending_payouts = (
#             await db.execute(
#                 select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "requested")
#             )
#         ).scalar() or 0

#         # --- Sums ---
#         total_earnings = (
#             await db.execute(select(func.sum(ReferralEarning.commission_amount)))
#         ).scalar() or 0
#         total_withdrawn = (
#             await db.execute(select(func.sum(ReferralPayout.net_amount)))
#         ).scalar() or 0

#         return {
#             "total_payouts": total_payouts,
#             "approved_payouts": approved_payouts,
#             "rejected_payouts": rejected_payouts,
#             "pending_payouts": pending_payouts,
#             "total_earnings": float(total_earnings),
#             "total_withdrawn": float(total_withdrawn),
#             "available_balance": float(total_earnings) - float(total_withdrawn),
#         }
    

#     RECURRING_COMMISSIONS = {1: Decimal("0.05"), 2: Decimal("0.01"), 3: Decimal("0.01")}
#     LONGTERM_COMMISSIONS = {1: Decimal("0.15"), 2: Decimal("0.03"), 3: Decimal("0.02")}

#     async def record_commission_earnings(
#         self,
#         db: AsyncSession,
#         user_id: int,        # jiske through plan activate hua
#         plan_amount: Decimal,
#         plan_type: str       # "recurring" or "longterm"
#     ):
#         """
#         Create 3-level referral earnings whenever a new subscription activates.
#         """
#         # Fetch the user
#         result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
#         user = result.scalar_one_or_none()
#         if not user or not user.referred_by:
#             return  # No referral chain

#         structure = (
#             self.RECURRING_COMMISSIONS if plan_type == "recurring"
#             else self.LONGTERM_COMMISSIONS
#         )

#         current_referrer_id = user.referred_by

#         for level, percent in structure.items():
#             if not current_referrer_id:
#                 break

#             commission_amount = plan_amount * percent

#             earning = ReferralEarning(
#                 user_id=current_referrer_id,
#                 from_user_id=user_id,
#                 level=level,
#                 plan_type=plan_type,
#                 commission_amount=commission_amount,
#                 earned_at=datetime.now(),
#                 status="pending"
#             )
#             db.add(earning)
#             await db.flush()

#             # Get next referrer
#             next_ref = await db.execute(
#                 select(UserProfile.referred_by).where(UserProfile.id == current_referrer_id)
#             )
#             current_referrer_id = next_ref.scalar_one_or_none()

#         await db.commit()






# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func
# from datetime import datetime
# from decimal import Decimal
# from typing import List, Dict, Any

# from app.models.referrals import ReferralEarning, ReferralPayout
# from app.models.users import UserProfile
# from app.schemas.referrals import ReferralPayoutCreate, ReferralStats


# class ReferralService:
#     """Handles referral earnings, payouts, and stats."""

#     # --------------------------------------------------------
#     # 🔹 Commission structures
#     # --------------------------------------------------------
#     RECURRING_COMMISSIONS = {1: Decimal("0.05"), 2: Decimal("0.01"), 3: Decimal("0.01")}
#     LONGTERM_COMMISSIONS = {1: Decimal("0.15"), 2: Decimal("0.03"), 3: Decimal("0.02")}

#     # --------------------------------------------------------
#     # ✅ Record commissions when an order completes
#     # --------------------------------------------------------


#     async def record_commission_earnings(
#         self,
#         db: AsyncSession,
#         user_id: int,
#         order_id: int,
#         plan_amount: Decimal,
#         plan_type: str
#     ):
#         """
#         Create 3-level referral earnings whenever an order completes.
#         """
#         result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
#         user = result.scalar_one_or_none()
#         if not user or not user.referred_by:
#             return  # No referral chain

#         structure = (
#             self.RECURRING_COMMISSIONS if plan_type == "recurring"
#             else self.LONGTERM_COMMISSIONS
#         )

#         current_referrer_id = user.referred_by

#         for level, percent in structure.items():
#             if not current_referrer_id:
#                 break

#             commission_amount = plan_amount * percent

#             earning = ReferralEarning(
#                 user_id=current_referrer_id,        # Who earned
#                 referred_user_id=user_id,           # Who bought
#                 order_id=order_id,                  # Link order
#                 level=level,
#                 commission_rate=percent * 100,
#                 order_amount=plan_amount,
#                 commission_amount=commission_amount,
#                 status="pending"
#             )

#             db.add(earning)
#             await db.flush()

#             # Find next-level referrer
#             next_ref = await db.execute(
#                 select(UserProfile.referred_by).where(UserProfile.id == current_referrer_id)
#             )
#             current_referrer_id = next_ref.scalar_one_or_none()

#         await db.commit()




#     # --------------------------------------------------------
#     # ✅ User stats (for dashboard)
#     # --------------------------------------------------------
#     async def get_user_referral_stats(self, db: AsyncSession, user_id: int) -> ReferralStats:
#         # --- Level 1 ---
#         l1_result = await db.execute(select(func.count(UserProfile.id)).where(UserProfile.referred_by == user_id))
#         l1_referrals = l1_result.scalar() or 0

#         # --- Level 2 ---
#         l2_result = await db.execute(
#             select(func.count(UserProfile.id)).where(
#                 UserProfile.referred_by.in_(
#                     select(UserProfile.id).where(UserProfile.referred_by == user_id)
#                 )
#             )
#         )
#         l2_referrals = l2_result.scalar() or 0

#         # --- Level 3 ---
#         l3_result = await db.execute(
#             select(func.count(UserProfile.id)).where(
#                 UserProfile.referred_by.in_(
#                     select(UserProfile.id).where(
#                         UserProfile.referred_by.in_(
#                             select(UserProfile.id).where(UserProfile.referred_by == user_id)
#                         )
#                     )
#                 )
#             )
#         )
#         l3_referrals = l3_result.scalar() or 0

#         total_referrals = l1_referrals + l2_referrals + l3_referrals

#         total_earnings_result = await db.execute(
#             select(func.coalesce(func.sum(ReferralEarning.commission_amount), 0)).where(
#                 ReferralEarning.user_id == user_id
#             )
#         )
#         total_earnings = Decimal(total_earnings_result.scalar() or 0)

#         pending_payouts_result = await db.execute(
#             select(func.coalesce(func.sum(ReferralPayout.net_amount), 0)).where(
#                 ReferralPayout.user_id == user_id, ReferralPayout.status == "pending"
#             )
#         )
#         pending_payouts = Decimal(pending_payouts_result.scalar() or 0)

#         completed_payouts_result = await db.execute(
#             select(func.coalesce(func.sum(ReferralPayout.net_amount), 0)).where(
#                 ReferralPayout.user_id == user_id, ReferralPayout.status == "approved"
#             )
#         )
#         completed_payouts = Decimal(completed_payouts_result.scalar() or 0)

#         available_balance = total_earnings - (pending_payouts + completed_payouts)

#         return ReferralStats(
#             total_referrals=total_referrals,
#             l1_referrals=l1_referrals,
#             l2_referrals=l2_referrals,
#             l3_referrals=l3_referrals,
#             total_earnings=total_earnings,
#             pending_payouts=pending_payouts,
#             completed_payouts=completed_payouts,
#             available_balance=available_balance,
#             total_withdrawn=completed_payouts,
#             can_request_payout=available_balance >= Decimal("500"),
#             referral_code=f"REF{user_id:04d}",
#         )

#     # --------------------------------------------------------
#     # ✅ Get user earnings
#     # --------------------------------------------------------
#     async def get_user_earnings(self, db: AsyncSession, user_id: int) -> List[ReferralEarning]:
#         result = await db.execute(
#             select(ReferralEarning)
#             .where(ReferralEarning.user_id == user_id)
#             .order_by(ReferralEarning.earned_at.desc())
#         )
#         return result.scalars().all()

#     # --------------------------------------------------------
#     # ✅ Request payout
#     # --------------------------------------------------------
#     async def request_payout(self, db: AsyncSession, user_id: int, data: ReferralPayoutCreate) -> ReferralPayout:
#         payout = ReferralPayout(
#             user_id=user_id,
#             gross_amount=data.gross_amount,
#             payment_method=data.payment_method,
#             tax_year=data.tax_year,
#             tax_quarter=data.tax_quarter,
#             tds_amount=data.gross_amount * Decimal("0.10"),
#             service_tax_amount=data.gross_amount * Decimal("0.18"),
#             net_amount=data.gross_amount * Decimal("0.72"),
#             status="requested",
#             payout_number=f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}-{user_id}",
#             requested_at=datetime.now(),
#         )
#         async with db.begin():
#             db.add(payout)
#         await db.refresh(payout)
#         return payout

#     # --------------------------------------------------------
#     # ✅ Admin payout management
#     # --------------------------------------------------------
#     async def approve_payout(self, db: AsyncSession, payout_id: int, payment_ref: str) -> bool:
#         result = await db.execute(select(ReferralPayout).where(ReferralPayout.id == payout_id))
#         payout = result.scalar_one_or_none()
#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "approved"
#         payout.payment_reference = payment_ref
#         payout.processed_at = datetime.now()

#         async with db.begin():
#             db.add(payout)
#         return True

#     async def reject_payout(self, db: AsyncSession, payout_id: int, reason: str) -> bool:
#         result = await db.execute(select(ReferralPayout).where(ReferralPayout.id == payout_id))
#         payout = result.scalar_one_or_none()
#         if not payout or payout.status != "requested":
#             return False

#         payout.status = "rejected"
#         payout.rejected_reason = reason
#         payout.processed_at = datetime.now()

#         async with db.begin():
#             db.add(payout)
#         return True

#     # --------------------------------------------------------
#     # ✅ Admin overview stats
#     # --------------------------------------------------------
#     async def get_admin_referral_stats(self, db: AsyncSession) -> Dict[str, Any]:
#         total_payouts = (await db.execute(select(func.count(ReferralPayout.id)))).scalar() or 0
#         approved_payouts = (
#             await db.execute(select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "approved"))
#         ).scalar() or 0
#         rejected_payouts = (
#             await db.execute(select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "rejected"))
#         ).scalar() or 0
#         pending_payouts = (
#             await db.execute(select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "requested"))
#         ).scalar() or 0

#         total_earnings = (
#             await db.execute(select(func.sum(ReferralEarning.commission_amount)))
#         ).scalar() or 0
#         total_withdrawn = (
#             await db.execute(select(func.sum(ReferralPayout.net_amount)))
#         ).scalar() or 0

#         return {
#             "total_payouts": total_payouts,
#             "approved_payouts": approved_payouts,
#             "rejected_payouts": rejected_payouts,
#             "pending_payouts": pending_payouts,
#             "total_earnings": float(total_earnings),
#             "total_withdrawn": float(total_withdrawn),
#             "available_balance": float(total_earnings) - float(total_withdrawn),
#         }








from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime
from decimal import Decimal
from typing import List, Dict, Any

from app.models.referrals import ReferralEarning, ReferralPayout
from app.models.users import UserProfile
from app.schemas.referrals import ReferralPayoutCreate, ReferralStats


class ReferralService:
    """Handles multi-level referral commissions, payout requests, and admin tracking."""

    # --------------------------------------------------------
    # 🔹 Commission structures
    # --------------------------------------------------------
    RECURRING_COMMISSIONS = {1: Decimal("0.05"), 2: Decimal("0.01"), 3: Decimal("0.01")}
    LONGTERM_COMMISSIONS = {1: Decimal("0.15"), 2: Decimal("0.03"), 3: Decimal("0.02")}

    # --------------------------------------------------------
    # ✅ Record commissions when an order completes
    # --------------------------------------------------------
    async def record_commission_earnings(
        self,
        db: AsyncSession,
        user_id: int,
        order_id: int,
        plan_amount: Decimal,
        plan_type: str
    ):
        """
        Create 3-level referral earnings whenever an order completes.
        Automatically tracks commissions for up to 3 upline users.
        If user has no referrer, commission goes to L1 referrer only.
        """
        result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            return  # ❌ User not found
        
        if not user.referred_by:
            print(f"ℹ️ User {user_id} has no referrer, skipping commission")
            return  # No referrer chain

        structure = (
            self.RECURRING_COMMISSIONS if plan_type == "recurring"
            else self.LONGTERM_COMMISSIONS
        )

        current_referrer_id = user.referred_by

        for level, percent in structure.items():
            if not current_referrer_id:
                break

            commission_amount = plan_amount * percent

            earning = ReferralEarning(
                # user_id=current_referrer_id,        # Who earned
                # referred_user_id=user_id,           # Who made the purchase

                user_id=current_referrer_id,        # ✅ The referrer who earned
                referred_user_id=user_id, 
                order_id=order_id,
                level=level,
                commission_rate=percent * 100,
                order_amount=plan_amount,
                commission_amount=commission_amount,
                status="pending",
            )

            db.add(earning)
            await db.flush()

            # Find next-level referrer
            next_ref = await db.execute(
                select(UserProfile.referred_by).where(UserProfile.id == current_referrer_id)
            )
            current_referrer_id = next_ref.scalar_one_or_none()

        await db.commit()

    # --------------------------------------------------------
    # ✅ User stats (Dashboard)
    # --------------------------------------------------------
    async def get_user_referral_stats(self, db: AsyncSession, user_id: int) -> ReferralStats:
        """Return detailed stats for user's referrals and earnings."""

        # --- Level 1 ---
        l1_result = await db.execute(select(func.count(UserProfile.id)).where(UserProfile.referred_by == user_id))
        l1_referrals = l1_result.scalar() or 0

        # --- Level 2 ---
        l2_result = await db.execute(
            select(func.count(UserProfile.id)).where(
                UserProfile.referred_by.in_(
                    select(UserProfile.id).where(UserProfile.referred_by == user_id)
                )
            )
        )
        l2_referrals = l2_result.scalar() or 0

        # --- Level 3 ---
        l3_result = await db.execute(
            select(func.count(UserProfile.id)).where(
                UserProfile.referred_by.in_(
                    select(UserProfile.id).where(
                        UserProfile.referred_by.in_(
                            select(UserProfile.id).where(UserProfile.referred_by == user_id)
                        )
                    )
                )
            )
        )
        l3_referrals = l3_result.scalar() or 0

        total_referrals = l1_referrals + l2_referrals + l3_referrals

        total_earnings_result = await db.execute(
            select(func.coalesce(func.sum(ReferralEarning.commission_amount), 0))
            .where(ReferralEarning.user_id == user_id)
        )
        total_earnings = Decimal(total_earnings_result.scalar() or 0)

        pending_payouts_result = await db.execute(
            select(func.coalesce(func.sum(ReferralPayout.net_amount), 0))
            .where(ReferralPayout.user_id == user_id, ReferralPayout.status == "requested")
        )
        pending_payouts = Decimal(pending_payouts_result.scalar() or 0)

        completed_payouts_result = await db.execute(
            select(func.coalesce(func.sum(ReferralPayout.net_amount), 0))
            .where(ReferralPayout.user_id == user_id, ReferralPayout.status == "approved")
        )
        completed_payouts = Decimal(completed_payouts_result.scalar() or 0)

        available_balance = total_earnings - (pending_payouts + completed_payouts)

        return ReferralStats(
            total_referrals=total_referrals,
            l1_referrals=l1_referrals,
            l2_referrals=l2_referrals,
            l3_referrals=l3_referrals,
            total_earnings=total_earnings,
            pending_payouts=pending_payouts,
            completed_payouts=completed_payouts,
            available_balance=available_balance,
            total_withdrawn=completed_payouts,
            can_request_payout=available_balance >= Decimal("500"),
            referral_code=f"REF{user_id:04d}",
        )

    # --------------------------------------------------------
    # ✅ Fetch user's earnings
    # --------------------------------------------------------
    async def get_user_earnings(self, db: AsyncSession, user_id: int) -> List[ReferralEarning]:
        """List of referral earnings for a user."""
        result = await db.execute(
            select(ReferralEarning)
            .where(ReferralEarning.user_id == user_id)
            .order_by(ReferralEarning.earned_at.desc())
        )
        return result.scalars().all()

    # --------------------------------------------------------
    # ✅ Create payout request (User Side)
    # --------------------------------------------------------
    async def request_payout(self, db: AsyncSession, user_id: int, data: ReferralPayoutCreate) -> ReferralPayout:
        """
        Create a payout request entry.
        Auto-calculates tax, service charge, and net payable amount.
        """
        gross = Decimal(data.gross_amount)
        tds = gross * Decimal("0.10")       # 10% TDS
        gst = gross * Decimal("0.18")       # 18% Service Tax
        net = gross - (tds + gst)

        payout = ReferralPayout(
            user_id=user_id,
            gross_amount=gross,
            tds_amount=tds,
            service_tax_amount=gst,
            net_amount=net,
            payment_method=data.payment_method,
            tax_year=data.tax_year,
            tax_quarter=data.tax_quarter,
            status="requested",
            payout_number=f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}-{user_id}",
            requested_at=datetime.now(),
        )

        async with db.begin():
            db.add(payout)
        await db.refresh(payout)
        return payout

    # --------------------------------------------------------
    # ✅ Admin: Approve / Reject Payout
    # --------------------------------------------------------
    async def approve_payout(self, db: AsyncSession, payout_id: int, payment_ref: str) -> bool:
        """Admin approves a payout request."""
        result = await db.execute(select(ReferralPayout).where(ReferralPayout.id == payout_id))
        payout = result.scalar_one_or_none()
        if not payout or payout.status != "requested":
            return False

        payout.status = "approved"
        payout.payment_reference = payment_ref
        payout.processed_at = datetime.now()

        async with db.begin():
            db.add(payout)
        return True

    async def reject_payout(self, db: AsyncSession, payout_id: int, reason: str) -> bool:
        """Admin rejects a payout request with reason."""
        result = await db.execute(select(ReferralPayout).where(ReferralPayout.id == payout_id))
        payout = result.scalar_one_or_none()
        if not payout or payout.status != "requested":
            return False

        payout.status = "rejected"
        payout.rejected_reason = reason
        payout.processed_at = datetime.now()

        async with db.begin():
            db.add(payout)
        return True

    async def complete_payout(self, db: AsyncSession, payout_id: int) -> bool:
        """Mark payout as completed after bank transfer"""
        result = await db.execute(select(ReferralPayout).where(ReferralPayout.id == payout_id))
        payout = result.scalar_one_or_none()
        if not payout or payout.status != "approved":
            return False

        payout.status = "completed"
        
        # Mark all related earnings as paid
        await db.execute(
            select(ReferralEarning)
            .where(ReferralEarning.user_id == payout.user_id, ReferralEarning.status == "pending")
        )
        earnings_result = await db.execute(
            select(ReferralEarning).where(
                ReferralEarning.user_id == payout.user_id,
                ReferralEarning.status == "pending"
            )
        )
        earnings = earnings_result.scalars().all()
        
        for earning in earnings:
            earning.status = "paid"
            earning.paid_at = datetime.now()

        async with db.begin():
            db.add(payout)
        return True

    async def get_user_payouts(self, db: AsyncSession, user_id: int) -> List[ReferralPayout]:
        """Get all payout requests for a user"""
        result = await db.execute(
            select(ReferralPayout)
            .where(ReferralPayout.user_id == user_id)
            .order_by(ReferralPayout.requested_at.desc())
        )
        return result.scalars().all()

    async def get_all_payouts(self, db: AsyncSession, status: str = "all") -> List[ReferralPayout]:
        """Get all payout requests (Admin)"""
        query = select(ReferralPayout).order_by(ReferralPayout.requested_at.desc())
        if status != "all":
            query = query.where(ReferralPayout.status == status)
        
        result = await db.execute(query)
        return result.scalars().all()

    async def get_referred_users(self, db: AsyncSession, user_id: int):
        """Get list of users referred by this user"""
        result = await db.execute(
            select(UserProfile).where(UserProfile.referred_by == user_id)
        )
        return result.scalars().all()

    # --------------------------------------------------------
    # ✅ Admin Overview Stats
    # --------------------------------------------------------
    async def get_admin_referral_stats(self, db: AsyncSession) -> Dict[str, Any]:
        """Get overall system-wide referral stats for admin dashboard."""
        total_payouts = (await db.execute(select(func.count(ReferralPayout.id)))).scalar() or 0
        approved_payouts = (
            await db.execute(select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "approved"))
        ).scalar() or 0
        rejected_payouts = (
            await db.execute(select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "rejected"))
        ).scalar() or 0
        pending_payouts = (
            await db.execute(select(func.count(ReferralPayout.id)).where(ReferralPayout.status == "requested"))
        ).scalar() or 0

        total_earnings = (
            await db.execute(select(func.sum(ReferralEarning.commission_amount)))
        ).scalar() or 0
        total_withdrawn = (
            await db.execute(select(func.sum(ReferralPayout.net_amount)))
        ).scalar() or 0

        return {
            "total_payouts": total_payouts,
            "approved_payouts": approved_payouts,
            "rejected_payouts": rejected_payouts,
            "pending_payouts": pending_payouts,
            "total_earnings": float(total_earnings),
            "total_withdrawn": float(total_withdrawn),
            "available_balance": float(total_earnings) - float(total_withdrawn),
        }
