# from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.core.database import Base

# class SupportTicket(Base):
#     __tablename__ = "support_tickets"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
#     ticket_number = Column(String(100), unique=True, nullable=False, index=True)
    
#     # Ticket details
#     subject = Column(String(255), nullable=False)
#     description = Column(Text, nullable=False)
#     status = Column(String(50), default='open')
#     priority = Column(String(50), default='medium')
    
#     # Assignment
#     assigned_to = Column(Integer, ForeignKey('users_profiles.id'), nullable=True)
#     department = Column(String(100), default='technical')
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     closed_at = Column(DateTime(timezone=True), nullable=True)
    
#     # Relationships
#     user = relationship("UserProfile", back_populates="support_tickets", foreign_keys=[user_id])
#     assigned_admin = relationship("UserProfile", foreign_keys=[assigned_to])




# from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.core.database import Base


# class SupportTicket(Base):
#     __tablename__ = "support_tickets"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
#     ticket_number = Column(String(100), unique=True, nullable=False, index=True)
    
#     # Ticket details
#     subject = Column(String(255), nullable=False)
#     description = Column(Text, nullable=False)
#     status = Column(String(50), default='open')     # open, in_progress, closed
#     priority = Column(String(50), default='medium') # low, medium, high, urgent
#     department = Column(String(100), default='technical')
    
#     # Assignment
#     assigned_to = Column(Integer, ForeignKey('users_profiles.id'), nullable=True)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     closed_at = Column(DateTime(timezone=True), nullable=True)
    
#     # ----------------------------------------------------
#     # Relationships
#     # ----------------------------------------------------
    
#     # The user who created the ticket
#     user = relationship(
#         "UserProfile",
#         back_populates="support_tickets",
#         foreign_keys=[user_id]
#     )

#     # The admin/employee assigned to handle the ticket
#     assigned_to_user = relationship(
#         "UserProfile",
#         back_populates="assigned_tickets",
#         foreign_keys=[assigned_to]
#     )




from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

if False:  # Type checking only
    from app.models.ticket_attachment import TicketAttachment
    from app.models.ticket_message import TicketMessage

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    ticket_number = Column(String(100), unique=True, nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default='open')      # open, in_progress, closed
    priority = Column(String(50), default='medium')  # low, medium, high, urgent
    department = Column(String(100), default='technical')
    assigned_to = Column(Integer, ForeignKey('users_profiles.id'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    closed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship(
        "UserProfile",
        back_populates="created_tickets",
        foreign_keys=[user_id]
    )
    assigned_to_user = relationship(
        "UserProfile",
        back_populates="assigned_tickets",
        foreign_keys=[assigned_to]
    )
    messages = relationship(
        "TicketMessage",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )
    attachments = relationship(
        "TicketAttachment",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )

