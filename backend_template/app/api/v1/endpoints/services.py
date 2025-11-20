
"""
Complete Service management endpoints with CRUD operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.models.service import Service, ServiceCategory
from app.schemas.users import User
from app.schemas.services import ServiceCreate, ServiceResponse

router = APIRouter()


@router.get("/", response_model=List[dict])
async def get_services(
    category: Optional[str] = Query(None, description="Filter by category"),
    is_active: bool = Query(True, description="Filter by active status"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all services, optionally filtered by category
    
    Categories: SERVER_MANAGEMENT, BACKUP_MANAGEMENT, MONITORING, SECURITY, MIGRATION, OPTIMIZATION, CONSULTATION, CUSTOM
    """
    query = select(Service)
    
    if is_active:
        query = query.where(Service.is_active == True)
    
    if category:
        query = query.where(Service.category == category)
    
    query = query.order_by(Service.sort_order, Service.name)
    
    result = await db.execute(query)
    services = result.scalars().all()
    
    return [service.to_dict() for service in services]


@router.get("/{service_id}", response_model=dict)
async def get_service_by_id(
    service_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific service by ID"""
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with ID {service_id} not found"
        )
    
    return service.to_dict()


# @router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
# async def create_service(
#     service_data: dict,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user)
# ):
#     """
#     Create a new service (Admin only)
#     """
#     new_service = Service(**service_data)
#     db.add(new_service)
#     await db.commit()
#     await db.refresh(new_service)
    
#     return new_service.to_dict()




@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new service (Admin only)
    """
    # Check if slug already exists
    existing_service = await db.execute(
        select(Service).where(Service.slug == service_data.slug)
    )
    if existing_service.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Service with this slug already exists"
        )
    
    new_service = Service(**service_data.dict())
    db.add(new_service)
    await db.commit()
    await db.refresh(new_service)
    
    return new_service



@router.put("/{service_id}", response_model=dict)
async def update_service(
    service_id: int,
    service_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update a service (Admin only)
    """
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with ID {service_id} not found"
        )
    
    for field, value in service_data.items():
        if hasattr(service, field):
            setattr(service, field, value)
    
    await db.commit()
    await db.refresh(service)
    
    return service.to_dict()


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Soft delete a service (Admin only)
    """
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with ID {service_id} not found"
        )
    
    service.is_active = False
    await db.commit()
    
    return None


@router.get("/category/{category}", response_model=List[dict])
async def get_services_by_category(
    category: str,
    is_active: bool = Query(True),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all services in a specific category
    """
    query = select(Service).where(Service.category == category)
    
    if is_active:
        query = query.where(Service.is_active == True)
    
    query = query.order_by(Service.sort_order, Service.name)
    
    result = await db.execute(query)
    services = result.scalars().all()
    
    return [service.to_dict() for service in services]
