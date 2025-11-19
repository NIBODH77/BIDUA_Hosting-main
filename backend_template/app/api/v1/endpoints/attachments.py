from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel
import io

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.file_service import SecureFileService
from app.models.users import UserProfile
from app.models.ticket_attachment import TicketAttachment
from sqlalchemy import select

router = APIRouter()


class LinkAttachmentsRequest(BaseModel):
    attachment_ids: List[int]
    message_id: int


@router.post("/tickets/{ticket_id}/attachments")
async def upload_attachment(
    ticket_id: int,
    file: UploadFile = File(...),
    message_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Upload an encrypted attachment to a support ticket
    
    Security features:
    - File type validation (whitelist)
    - MIME type validation
    - File size limit (10MB)
    - Virus scanning
    - Encryption at rest
    - Integrity verification
    """
    file_service = SecureFileService()
    
    try:
        attachment = await file_service.upload_file(
            db=db,
            file=file,
            ticket_id=ticket_id,
            user_id=current_user.id,
            message_id=message_id
        )
        
        return {
            "id": attachment.id,
            "filename": attachment.original_filename,
            "size": attachment.file_size,
            "mime_type": attachment.mime_type,
            "is_safe": attachment.is_safe,
            "scan_status": attachment.scan_status,
            "uploaded_at": attachment.uploaded_at.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}"
        )


@router.get("/tickets/{ticket_id}/attachments")
async def list_attachments(
    ticket_id: int,
    include_pending: bool = True,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """List all attachments for a ticket"""
    conditions = [
        TicketAttachment.ticket_id == ticket_id,
        TicketAttachment.is_deleted == False
    ]
    
    # If not including pending, only show sent attachments
    if not include_pending:
        conditions.append(TicketAttachment.status == 'sent')
    
    stmt = select(TicketAttachment).where(
        *conditions
    ).order_by(TicketAttachment.uploaded_at.desc())
    
    result = await db.execute(stmt)
    attachments = result.scalars().all()
    
    return [
        {
            "id": att.id,
            "filename": att.original_filename,
            "size": att.file_size,
            "mime_type": att.mime_type,
            "extension": att.file_extension,
            "is_safe": att.is_safe,
            "scan_status": att.scan_status,
            "uploaded_at": att.uploaded_at.isoformat(),
            "downloaded_count": att.downloaded_count,
            "message_id": att.message_id,
            "status": att.status
        }
        for att in attachments
    ]


@router.get("/attachments/{attachment_id}/download")
async def download_attachment(
    attachment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Download and decrypt an attachment
    
    Security features:
    - Access control verification
    - Decryption
    - Integrity check
    - Download tracking
    """
    file_service = SecureFileService()
    
    try:
        file_data, filename, mime_type = await file_service.download_file(
            db=db,
            attachment_id=attachment_id,
            user=current_user
        )
        
        return StreamingResponse(
            io.BytesIO(file_data),
            media_type=mime_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Length": str(len(file_data))
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File download failed: {str(e)}"
        )


@router.delete("/attachments/{attachment_id}")
async def delete_attachment(
    attachment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Delete (soft delete) a pending attachment. Sent attachments cannot be deleted."""
    file_service = SecureFileService()
    
    try:
        # First check if attachment exists and is pending
        stmt = select(TicketAttachment).where(TicketAttachment.id == attachment_id)
        result = await db.execute(stmt)
        attachment = result.scalar_one_or_none()
        
        if not attachment:
            raise HTTPException(status_code=404, detail="Attachment not found")
        
        # Check if attachment is already sent
        if attachment.status == 'sent':
            raise HTTPException(
                status_code=403, 
                detail="Cannot delete sent attachments. They are linked to messages."
            )
        
        success = await file_service.delete_file(
            db=db,
            attachment_id=attachment_id,
            user=current_user
        )
        
        return {"success": success, "message": "Attachment deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File deletion failed: {str(e)}"
        )


@router.get("/attachments/allowed-types")
async def get_allowed_types():
    """Get list of allowed file types and limits"""
    from app.models.ticket_attachment import (
        ALLOWED_EXTENSIONS,
        MAX_FILE_SIZE,
        MAX_ATTACHMENTS_PER_TICKET
    )
    
    return {
        "allowed_extensions": ALLOWED_EXTENSIONS,
        "max_file_size_bytes": MAX_FILE_SIZE,
        "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024),
        "max_attachments_per_ticket": MAX_ATTACHMENTS_PER_TICKET
    }


@router.post("/attachments/link-to-message")
async def link_attachments_to_message(
    request: LinkAttachmentsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    """Link pending attachments to a message and mark them as sent"""
    try:
        # Update all specified attachments
        stmt = select(TicketAttachment).where(
            TicketAttachment.id.in_(request.attachment_ids),
            TicketAttachment.user_id == current_user.id,
            TicketAttachment.status == 'pending'
        )
        result = await db.execute(stmt)
        attachments = result.scalars().all()
        
        if not attachments:
            return {"linked": 0, "message": "No pending attachments found"}
        
        for attachment in attachments:
            attachment.message_id = request.message_id
            attachment.status = 'sent'
        
        await db.commit()
        
        return {
            "linked": len(attachments),
            "message": f"Linked {len(attachments)} attachment(s) to message"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to link attachments: {str(e)}"
        )
