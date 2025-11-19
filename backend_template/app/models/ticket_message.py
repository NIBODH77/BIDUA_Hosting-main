from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TicketMessage(Base):
    """Messages/replies within a support ticket for threaded conversations"""
    __tablename__ = "ticket_messages"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey('support_tickets.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    message = Column(Text, nullable=False)
    is_internal_note = Column(Boolean, default=False)  # Admin/employee notes not visible to customer
    is_staff_reply = Column(Boolean, default=False)  # Message from admin/support staff
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    ticket = relationship("SupportTicket", back_populates="messages")
    author = relationship("UserProfile", foreign_keys=[user_id])
    attachments = relationship(
        "TicketAttachment",
        back_populates="message",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"<TicketMessage(id={self.id}, ticket_id={self.ticket_id}, staff={self.is_staff_reply})>"
