"""
Addon management endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.services.addon_service import AddonService
from app.schemas.addon import AddonResponse

router = APIRouter()


@router.get("/", response_model=List[AddonResponse])
async def get_addons(
    category: Optional[str] = Query(None, description="Filter by category (STORAGE, BANDWIDTH, etc.)"),
    is_active: bool = Query(True, description="Filter by active status"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all addons, optionally filtered by category
    
    Categories: STORAGE, BANDWIDTH, IP_ADDRESS, CONTROL_PANEL, BACKUP, SSL, SUPPORT, MANAGEMENT, SECURITY
    """
    addon_service = AddonService()
    
    if category:
        addons = await addon_service.get_addons_by_category(db, category, active_only=is_active)
    else:
        addons = await addon_service.get_all_addons(db, category, active_only=is_active)
    
    return addons


@router.get("/{slug}", response_model=AddonResponse)
async def get_addon_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific addon by slug"""
    addon_service = AddonService()
    addon = await addon_service.get_addon_by_slug(db, slug)
    
    if not addon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Addon with slug '{slug}' not found"
        )
    
    return addon
