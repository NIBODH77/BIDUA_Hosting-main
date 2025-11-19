from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, BigInteger, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class TicketAttachment(Base):
    __tablename__ = "ticket_attachments"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False)
    message_id = Column(Integer, ForeignKey("ticket_messages.id", ondelete="CASCADE"), nullable=True)
    user_id = Column(Integer, ForeignKey("users_profiles.id"), nullable=False)
    
    # Original file information
    original_filename = Column(String(255), nullable=False)
    file_extension = Column(String(10), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(BigInteger, nullable=False)  # in bytes
    
    # Encrypted storage information
    storage_path = Column(String(500), nullable=False)  # Path to encrypted file
    encryption_key_id = Column(String(100), nullable=False)  # Reference to encryption key
    file_hash = Column(String(64), nullable=False)  # SHA-256 hash for integrity
    
    # Security information
    is_safe = Column(Boolean, default=False)  # After virus scan
    scan_status = Column(String(20), default='pending')  # pending, scanning, clean, infected, error
    scan_result = Column(Text, nullable=True)  # Scan details
    
    # Attachment status
    status = Column(String(20), default='pending')  # pending, sent
    
    # Metadata
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    downloaded_count = Column(Integer, default=0)
    last_downloaded_at = Column(DateTime, nullable=True)
    
    # Soft delete
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)
    
    # Relationships
    ticket = relationship("SupportTicket", back_populates="attachments")
    message = relationship("TicketMessage", back_populates="attachments")
    user = relationship("UserProfile")

    def __repr__(self):
        return f"<TicketAttachment {self.original_filename}>"


# Allowed file types (whitelist approach)
ALLOWED_EXTENSIONS = {
    'images': {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'},
    'documents': {'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'},
    'spreadsheets': {'xls', 'xlsx', 'csv', 'ods'},
    'archives': {'zip', '7z', 'rar', 'tar', 'gz'},
    'logs': {'log', 'json', 'xml'}
}

ALLOWED_MIME_TYPES = {
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/zip',
    'application/x-7z-compressed',
    'application/x-rar-compressed',
    'application/x-tar',
    'application/gzip',
    'text/x-log',
    'application/json',
    'application/xml',
    'text/xml'
}

# Maximum file size: 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes

# Maximum attachments per ticket
MAX_ATTACHMENTS_PER_TICKET = 10
