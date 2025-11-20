
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.schemas.users import User
from app.schemas.pricing import (
    HostingPlanResponse,
    HostingPlanBase
)
from app.models.plan import HostingPlan
from sqlalchemy import select

router = APIRouter()


@router.get("/plans", response_model=List[HostingPlanResponse])
async def get_all_pricing_plans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all hosting plan configurations (Admin only)"""
    result = await db.execute(select(HostingPlan))
    plans = result.scalars().all()
    return plans


@router.get("/plans/{plan_id}", response_model=HostingPlanResponse)
async def get_pricing_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get a specific pricing plan configuration (Admin only)"""
    result = await db.execute(
        select(HostingPlan).where(HostingPlan.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pricing plan with ID {plan_id} not found"
        )
    
    return plan


@router.post("/plans", response_model=HostingPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_pricing_plan(
    plan_data: HostingPlanBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new pricing plan configuration (Admin only)"""
    new_plan = HostingPlan(**plan_data.dict())
    db.add(new_plan)
    await db.commit()
    await db.refresh(new_plan)
    return new_plan


@router.put("/plans/{plan_id}", response_model=HostingPlanResponse)
async def update_pricing_plan(
    plan_id: int,
    plan_data: HostingPlanBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a pricing plan configuration (Admin only)"""
    result = await db.execute(
        select(HostingPlan).where(HostingPlan.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pricing plan with ID {plan_id} not found"
        )
    
    update_data = plan_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(plan, field, value)
    
    await db.commit()
    await db.refresh(plan)
    return plan


@router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pricing_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a pricing plan configuration (Admin only)"""
    result = await db.execute(
        select(HostingPlan).where(HostingPlan.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pricing plan with ID {plan_id} not found"
        )
    
    await db.delete(plan)
    await db.commit()
    return None
