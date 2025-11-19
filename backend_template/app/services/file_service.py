import os
import hashlib
import secrets
import mimetypes
from pathlib import Path
from typing import Optional, Tuple
from datetime import datetime
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64

from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.ticket_attachment import (
    TicketAttachment, 
    ALLOWED_EXTENSIONS, 
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE,
    MAX_ATTACHMENTS_PER_TICKET
)
from app.models.support import SupportTicket
from app.models.users import UserProfile
from app.core.config import settings


class SecureFileService:
    """Service for handling secure file uploads with encryption"""
    
    def __init__(self):
        self.upload_dir = Path("app/static/uploads/tickets")
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Encryption key derivation
        self.master_key = settings.SECRET_KEY.encode()
    
    def _generate_encryption_key(self, file_id: str) -> Tuple[bytes, str]:
        """Generate a unique encryption key for each file"""
        salt = secrets.token_bytes(32)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        key = base64.urlsafe_b64encode(kdf.derive(self.master_key + file_id.encode()))
        key_id = hashlib.sha256(salt).hexdigest()
        return key, key_id
    
    def _encrypt_file(self, file_data: bytes, encryption_key: bytes) -> bytes:
        """Encrypt file data using Fernet symmetric encryption"""
        fernet = Fernet(encryption_key)
        return fernet.encrypt(file_data)
    
    def _decrypt_file(self, encrypted_data: bytes, encryption_key: bytes) -> bytes:
        """Decrypt file data"""
        fernet = Fernet(encryption_key)
        return fernet.decrypt(encrypted_data)
    
    def _calculate_file_hash(self, file_data: bytes) -> str:
        """Calculate SHA-256 hash of file for integrity verification"""
        return hashlib.sha256(file_data).hexdigest()
    
    def _validate_file_extension(self, filename: str) -> Tuple[bool, str]:
        """Validate file extension against whitelist"""
        extension = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
        
        all_allowed = set()
        for exts in ALLOWED_EXTENSIONS.values():
            all_allowed.update(exts)
        
        if extension not in all_allowed:
            return False, extension
        return True, extension
    
    def _validate_mime_type(self, mime_type: str) -> bool:
        """Validate MIME type against whitelist"""
        return mime_type in ALLOWED_MIME_TYPES
    
    def _scan_file_content(self, file_data: bytes) -> Tuple[str, str]:
        """
        Basic security scan for malicious content
        In production, integrate with ClamAV or VirusTotal API
        """
        # Check for executable signatures
        dangerous_signatures = [
            b'MZ',  # PE executable
            b'\x7fELF',  # ELF executable
            b'#!',  # Script shebang
            b'<?php',  # PHP script
            b'<script',  # JavaScript in files
        ]
        
        for signature in dangerous_signatures:
            if signature in file_data[:1024]:  # Check first 1KB
                return 'infected', f'Dangerous signature detected: {signature}'
        
        # Check file size for zip bombs (compressed ratio)
        if len(file_data) < 100 and file_data.startswith(b'PK'):  # ZIP signature
            return 'infected', 'Potential zip bomb detected'
        
        return 'clean', 'File passed basic security checks'
    
    async def validate_ticket_attachment_limit(
        self, 
        db: AsyncSession, 
        ticket_id: int
    ) -> bool:
        """Check if ticket has reached attachment limit"""
        stmt = select(TicketAttachment).where(
            TicketAttachment.ticket_id == ticket_id,
            TicketAttachment.is_deleted == False
        )
        result = await db.execute(stmt)
        attachments = result.scalars().all()
        
        return len(attachments) < MAX_ATTACHMENTS_PER_TICKET
    
    async def upload_file(
        self,
        db: AsyncSession,
        file: UploadFile,
        ticket_id: int,
        user_id: int,
        message_id: Optional[int] = None
    ) -> TicketAttachment:
        """
        Securely upload, validate, encrypt and store file
        """
        # 1. Verify ticket exists
        ticket_stmt = select(SupportTicket).where(SupportTicket.id == ticket_id)
        ticket_result = await db.execute(ticket_stmt)
        ticket = ticket_result.scalar_one_or_none()
        
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        
        # 2. Check attachment limit
        can_upload = await self.validate_ticket_attachment_limit(db, ticket_id)
        if not can_upload:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {MAX_ATTACHMENTS_PER_TICKET} attachments per ticket"
            )
        
        # 3. Validate filename
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid filename"
            )
        
        is_valid_ext, extension = self._validate_file_extension(file.filename)
        if not is_valid_ext:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type .{extension} not allowed"
            )
        
        # 4. Read and validate file
        file_data = await file.read()
        file_size = len(file_data)
        
        if file_size == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty file not allowed"
            )
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum {MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        # 5. Validate MIME type
        mime_type = file.content_type or mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'
        
        if not self._validate_mime_type(mime_type):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"MIME type {mime_type} not allowed"
            )
        
        # 6. Security scan
        scan_status, scan_result = self._scan_file_content(file_data)
        
        if scan_status == 'infected':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File rejected: {scan_result}"
            )
        
        # 7. Calculate file hash
        file_hash = self._calculate_file_hash(file_data)
        
        # 8. Generate unique file ID and encryption key
        file_id = secrets.token_urlsafe(16)
        encryption_key, key_id = self._generate_encryption_key(file_id)
        
        # 9. Encrypt file
        encrypted_data = self._encrypt_file(file_data, encryption_key)
        
        # 10. Save encrypted file
        encrypted_filename = f"{file_id}.enc"
        file_path = self.upload_dir / encrypted_filename
        
        with open(file_path, 'wb') as f:
            f.write(encrypted_data)
        
        # 11. Create database record
        attachment = TicketAttachment(
            ticket_id=ticket_id,
            message_id=message_id,
            user_id=user_id,
            original_filename=file.filename,
            file_extension=extension,
            mime_type=mime_type,
            file_size=file_size,
            storage_path=str(file_path),
            encryption_key_id=key_id,
            file_hash=file_hash,
            is_safe=(scan_status == 'clean'),
            scan_status=scan_status,
            scan_result=scan_result
        )
        
        db.add(attachment)
        await db.commit()
        await db.refresh(attachment)
        
        return attachment
    
    async def download_file(
        self,
        db: AsyncSession,
        attachment_id: int,
        user: UserProfile
    ) -> Tuple[bytes, str, str]:
        """
        Decrypt and download file securely
        Admins and support staff can download any attachment
        Users can only download attachments from their own tickets
        """
        # Get attachment
        stmt = select(TicketAttachment).where(
            TicketAttachment.id == attachment_id,
            TicketAttachment.is_deleted == False
        )
        result = await db.execute(stmt)
        attachment = result.scalar_one_or_none()
        
        if not attachment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attachment not found"
            )
        
        # Verify user has access to ticket
        ticket_stmt = select(SupportTicket).where(SupportTicket.id == attachment.ticket_id)
        ticket_result = await db.execute(ticket_stmt)
        ticket = ticket_result.scalar_one_or_none()
        
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        
        # Check access: admin/support can access any ticket, users only their own
        is_admin_or_support = user.role in ['admin', 'super_admin', 'support']
        is_ticket_owner = ticket.user_id == user.id
        
        if not (is_admin_or_support or is_ticket_owner):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Read encrypted file
        if not os.path.exists(attachment.storage_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found on server"
            )
        
        with open(attachment.storage_path, 'rb') as f:
            encrypted_data = f.read()
        
        # Recreate encryption key
        file_id = Path(attachment.storage_path).stem.replace('.enc', '')
        encryption_key, _ = self._generate_encryption_key(file_id)
        
        # Decrypt file
        try:
            decrypted_data = self._decrypt_file(encrypted_data, encryption_key)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to decrypt file"
            )
        
        # Verify integrity
        current_hash = self._calculate_file_hash(decrypted_data)
        if current_hash != attachment.file_hash:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="File integrity check failed"
            )
        
        # Update download stats
        attachment.downloaded_count += 1
        attachment.last_downloaded_at = datetime.utcnow()
        await db.commit()
        
        return decrypted_data, attachment.original_filename, attachment.mime_type
    
    async def delete_file(
        self,
        db: AsyncSession,
        attachment_id: int,
        user: UserProfile
    ) -> bool:
        """
        Soft delete attachment
        Admins can delete any attachment
        Users can only delete their own pending attachments
        """
        stmt = select(TicketAttachment).where(TicketAttachment.id == attachment_id)
        result = await db.execute(stmt)
        attachment = result.scalar_one_or_none()
        
        if not attachment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attachment not found"
            )
        
        # Verify ownership or admin access
        is_admin_or_support = user.role in ['admin', 'super_admin', 'support']
        is_owner = attachment.user_id == user.id
        
        if not (is_admin_or_support or is_owner):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Soft delete
        attachment.is_deleted = True
        attachment.deleted_at = datetime.utcnow()
        await db.commit()
        
        return True
