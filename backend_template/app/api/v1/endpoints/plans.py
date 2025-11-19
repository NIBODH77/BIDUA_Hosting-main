# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List

# from app.core.database import get_db
# from app.core.security import get_current_user, get_current_admin_user
# from app.services.plan_service import PlanService
# from app.schemas.plan import HostingPlan, HostingPlanCreate, HostingPlanUpdate
# from app.schemas.users import User

# router = APIRouter()

# @router.get("/", response_model=List[HostingPlan])
# async def get_plans(
#     db: AsyncSession = Depends(get_db),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Get all hosting plans
#     """
#     return plan_service.get_active_plans(db)

# @router.get("/all", response_model=List[HostingPlan])
# async def get_all_plans(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Get all plans including inactive (Admin only)
#     """
#     return plan_service.get_all_plans(db)

# @router.get("/{plan_id}", response_model=HostingPlan)
# async def get_plan(
#     plan_id: int,
#     db: AsyncSession = Depends(get_db),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Get plan by ID
#     """
#     plan = plan_service.get_plan_by_id(db, plan_id)
#     if not plan:
#         raise HTTPException(status_code=404, detail="Plan not found")
#     return plan

# @router.post("/", response_model=HostingPlan)
# async def create_plan(
#     plan_data: HostingPlanCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Create new hosting plan (Admin only)
#     """
#     return plan_service.create_plan(db, plan_data)

# @router.put("/{plan_id}", response_model=HostingPlan)
# async def update_plan(
#     plan_id: int,
#     plan_update: HostingPlanUpdate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Update hosting plan (Admin only)
#     """
#     plan = plan_service.update_plan(db, plan_id, plan_update)
#     if not plan:
#         raise HTTPException(status_code=404, detail="Plan not found")
#     return plan

# @router.delete("/{plan_id}")
# async def delete_plan(
#     plan_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Delete hosting plan (Admin only)
#     """
#     success = plan_service.delete_plan(db, plan_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Plan not found")
#     return {"message": "Plan deleted successfully"}

# @router.post("/{plan_id}/toggle")
# async def toggle_plan_status(
#     plan_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Toggle plan active status (Admin only)
#     """
#     plan = plan_service.toggle_plan_status(db, plan_id)
#     if not plan:
#         raise HTTPException(status_code=404, detail="Plan not found")
#     return {"message": "Plan status updated successfully", "is_active": plan.is_active}

# @router.get("/{plan_id}/features")
# async def get_plan_features(
#     plan_id: int,
#     db: AsyncSession = Depends(get_db),
#     plan_service: PlanService = Depends()
# ):
#     """
#     Get plan features and specifications
#     """
#     plan = plan_service.get_plan_by_id(db, plan_id)
#     if not plan:
#         raise HTTPException(status_code=404, detail="Plan not found")
    
#     return {
#         "plan_id": plan.id,
#         "plan_name": plan.name,
#         "specifications": {
#             "cpu_cores": plan.cpu_cores,
#             "ram_gb": plan.ram_gb,
#             "storage_gb": plan.storage_gb,
#             "bandwidth_gb": plan.bandwidth_gb
#         },
#         "pricing": {
#             "monthly": float(plan.monthly_price),
#             "quarterly": float(plan.quarterly_price),
#             "annual": float(plan.annual_price),
#             "biennial": float(plan.biennial_price),
#             "triennial": float(plan.triennial_price)
#         },
#         "features": plan.features or {}
#     }






from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.plan_service import PlanService
from app.schemas.plan import HostingPlan, HostingPlanCreate, HostingPlanUpdate
from app.schemas.users import User

router = APIRouter()


@router.get("/", response_model=List[HostingPlan])
async def get_plans(
    db: AsyncSession = Depends(get_db),
    plan_service: PlanService = Depends()
):
    """
    Get all active hosting plans
    """
    return await plan_service.get_active_plans(db)


@router.get("/all", response_model=List[HostingPlan])
async def get_all_plans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    plan_service: PlanService = Depends()
):
    """
    Get all plans including inactive (Admin only)
    """
    return await plan_service.get_all_plans(db)


@router.get("/{plan_id}", response_model=HostingPlan)
async def get_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    plan_service: PlanService = Depends()
):
    """
    Get plan by ID
    """
    plan = await plan_service.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


@router.post("/", response_model=HostingPlan)
async def create_plan(
    plan_data: HostingPlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    plan_service: PlanService = Depends()
):
    """
    Create new hosting plan (Admin only)
    """
    return await plan_service.create_plan(db, plan_data)


@router.put("/{plan_id}", response_model=HostingPlan)
async def update_plan(
    plan_id: int,
    plan_update: HostingPlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    plan_service: PlanService = Depends()
):
    """
    Update hosting plan (Admin only)
    """
    plan = await plan_service.update_plan(db, plan_id, plan_update)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


@router.delete("/{plan_id}")
async def delete_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    plan_service: PlanService = Depends()
):
    """
    Delete hosting plan (Admin only)
    """
    success = await plan_service.delete_plan(db, plan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"message": "Plan deleted successfully"}


@router.post("/{plan_id}/toggle")
async def toggle_plan_status(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    plan_service: PlanService = Depends()
):
    """
    Toggle plan active status (Admin only)
    """
    plan = await plan_service.toggle_plan_status(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"message": "Plan status updated successfully", "is_active": plan.is_active}


@router.get("/{plan_id}/features")
async def get_plan_features(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    plan_service: PlanService = Depends()
):
    """
    Get plan features and specifications
    """
    plan = await plan_service.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return {
        "plan_id": plan.id,
        "plan_name": plan.name,
        "specifications": {
            "cpu_cores": plan.cpu_cores,
            "ram_gb": plan.ram_gb,
            "storage_gb": plan.storage_gb,
            "bandwidth_gb": plan.bandwidth_gb,
        },
        "pricing": {
            "monthly": float(plan.monthly_price),
            "quarterly": float(plan.quarterly_price),
            "annual": float(plan.annual_price),
            "biennial": float(plan.biennial_price),
            "triennial": float(plan.triennial_price),
        },
        "features": plan.features or {},
    }
