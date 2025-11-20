
"""
Complete Addon management endpoints with CRUD operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.addon_service import AddonService
from app.schemas.addon import AddonResponse, AddonCreate, AddonUpdate
from app.schemas.users import User

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
    addons = await addon_service.get_all_addons(db, category, active_only=is_active)
    return addons


@router.get("/{addon_id}", response_model=AddonResponse)
async def get_addon_by_id(
    addon_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific addon by ID"""
    addon_service = AddonService()
    addon = await addon_service.get_addon_by_id(db, addon_id)
    
    if not addon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Addon with ID {addon_id} not found"
        )
    
    return addon


@router.post("/", response_model=AddonResponse, status_code=status.HTTP_201_CREATED)
async def create_addon(
    addon_data: AddonCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new addon (Admin only)
    """
    addon_service = AddonService()
    return await addon_service.create_addon(db, addon_data)


@router.put("/{addon_id}", response_model=AddonResponse)
async def update_addon(
    addon_id: int,
    addon_data: AddonUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update an addon (Admin only)
    """
    addon_service = AddonService()
    addon = await addon_service.update_addon(db, addon_id, addon_data)
    
    if not addon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Addon with ID {addon_id} not found"
        )
    
    return addon


@router.delete("/{addon_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_addon(
    addon_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Soft delete an addon (Admin only)
    Sets is_active to False
    """
    addon_service = AddonService()
    success = await addon_service.delete_addon(db, addon_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Addon with ID {addon_id} not found"
        )
    
    return None


@router.get("/category/{category}", response_model=List[AddonResponse])
async def get_addons_by_category(
    category: str,
    is_active: bool = Query(True),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all addons in a specific category
    """
    addon_service = AddonService()
    addons = await addon_service.get_all_addons(db, category, active_only=is_active)
    return addons
