# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select
# from typing import List, Optional, Dict, Any
# from decimal import Decimal

# from app.models.plan import HostingPlan
# from app.schemas.plan import HostingPlanCreate, HostingPlanUpdate

# class PlanService:
#     async def get_all_plans(self, db: AsyncSession) -> List[HostingPlan]:
#         result = await db.execute(
#             select(HostingPlan).order_by(HostingPlan.base_price.asc())
#         )
#         return result.scalars().all()
    
#     async def get_active_plans(self, db: AsyncSession) -> List[HostingPlan]:
#         result = await db.execute(
#             select(HostingPlan).where(HostingPlan.is_active == True).order_by(HostingPlan.base_price.asc())
#         )
#         return result.scalars().all()
    
#     async def get_featured_plans(self, db: AsyncSession) -> List[HostingPlan]:
#         result = await db.execute(
#             select(HostingPlan).where(
#                 HostingPlan.is_active == True,
#                 HostingPlan.is_featured == True
#             ).order_by(HostingPlan.base_price.asc())
#         )
#         return result.scalars().all()
    
#     async def get_plan_by_id(self, db: AsyncSession, plan_id: int) -> Optional[HostingPlan]:
#         result = await db.execute(
#             select(HostingPlan).where(HostingPlan.id == plan_id)
#         )
#         return result.scalar_one_or_none()
    
#     async def create_plan(self, db: AsyncSession, plan_data: HostingPlanCreate) -> HostingPlan:
#         db_plan = HostingPlan(
#             name=plan_data.name,
#             description=plan_data.description,
#             plan_type=plan_data.plan_type,
#             cpu_cores=plan_data.cpu_cores,
#             ram_gb=plan_data.ram_gb,
#             storage_gb=plan_data.storage_gb,
#             bandwidth_gb=plan_data.bandwidth_gb,
#             base_price=plan_data.base_price,
#             monthly_price=plan_data.monthly_price,
#             quarterly_price=plan_data.quarterly_price,
#             annual_price=plan_data.annual_price,
#             biennial_price=plan_data.biennial_price,
#             triennial_price=plan_data.triennial_price,
#             is_featured=plan_data.is_featured,
#             features=plan_data.features
#         )
        
#         db.add(db_plan)
#         await db.commit()
#         await db.refresh(db_plan)
#         return db_plan
    
#     async def update_plan(self, db: AsyncSession, plan_id: int, plan_update: HostingPlanUpdate) -> Optional[HostingPlan]:
#         plan = await self.get_plan_by_id(db, plan_id)
#         if not plan:
#             return None
            
#         update_data = plan_update.dict(exclude_unset=True)
#         for field, value in update_data.items():
#             setattr(plan, field, value)
            
#         await db.commit()
#         await db.refresh(plan)
#         return plan
    
#     async def delete_plan(self, db: AsyncSession, plan_id: int) -> bool:
#         plan = await self.get_plan_by_id(db, plan_id)
#         if not plan:
#             return False
            
#         await db.delete(plan)
#         await db.commit()
#         return True
    
#     async def toggle_plan_status(self, db: AsyncSession, plan_id: int) -> Optional[HostingPlan]:
#         plan = await self.get_plan_by_id(db, plan_id)
#         if not plan:
#             return None
            
#         plan.is_active = not plan.is_active
#         await db.commit()
#         await db.refresh(plan)
#         return plan
    
#     async def toggle_featured_status(self, db: AsyncSession, plan_id: int) -> Optional[HostingPlan]:
#         plan = await self.get_plan_by_id(db, plan_id)
#         if not plan:
#             return None
            
#         plan.is_featured = not plan.is_featured
#         await db.commit()
#         await db.refresh(plan)
#         return plan
    
#     async def get_plan_pricing(self, db: AsyncSession, plan_id: int) -> Optional[Dict[str, Decimal]]:
#         plan = await self.get_plan_by_id(db, plan_id)
#         if not plan:
#             return None
            
#         return {
#             "monthly": plan.monthly_price,
#             "quarterly": plan.quarterly_price,
#             "annual": plan.annual_price,
#             "biennial": plan.biennial_price,
#             "triennial": plan.triennial_price
#         }
    
#     async def calculate_discount_percentage(self, db: AsyncSession, plan_id: int, billing_cycle: str) -> Optional[float]:
#         plan = await self.get_plan_by_id(db, plan_id)
#         if not plan:
#             return None
            
#         monthly_total = float(plan.monthly_price)
        
#         if billing_cycle == "quarterly":
#             quarterly_monthly = float(plan.quarterly_price) / 3
#             discount = ((monthly_total - quarterly_monthly) / monthly_total) * 100
#         elif billing_cycle == "annual":
#             annual_monthly = float(plan.annual_price) / 12
#             discount = ((monthly_total - annual_monthly) / monthly_total) * 100
#         elif billing_cycle == "biennial":
#             biennial_monthly = float(plan.biennial_price) / 24
#             discount = ((monthly_total - biennial_monthly) / monthly_total) * 100
#         elif billing_cycle == "triennial":
#             triennial_monthly = float(plan.triennial_price) / 36
#             discount = ((monthly_total - triennial_monthly) / monthly_total) * 100
#         else:
#             discount = 0.0
            
#         return round(discount, 1)


from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional, Dict, Any
from decimal import Decimal

from app.models.plan import HostingPlan
from app.schemas.plan import HostingPlanCreate, HostingPlanUpdate

class PlanService:
    async def get_all_plans(self, db: AsyncSession) -> List[HostingPlan]:
        result = await db.execute(
            select(HostingPlan).order_by(HostingPlan.base_price.asc())
        )
        return result.scalars().all()
    
    async def get_active_plans(self, db: AsyncSession) -> List[HostingPlan]:
        result = await db.execute(
            select(HostingPlan).where(HostingPlan.is_active == True).order_by(HostingPlan.base_price.asc())
        )
        return result.scalars().all()
    
    async def get_featured_plans(self, db: AsyncSession) -> List[HostingPlan]:
        result = await db.execute(
            select(HostingPlan).where(
                HostingPlan.is_active == True,
                HostingPlan.is_featured == True
            ).order_by(HostingPlan.base_price.asc())
        )
        return result.scalars().all()
    
    async def get_plan_by_id(self, db: AsyncSession, plan_id: int) -> Optional[HostingPlan]:
        result = await db.execute(
            select(HostingPlan).where(HostingPlan.id == plan_id)
        )
        return result.scalar_one_or_none()
    
    async def create_plan(self, db: AsyncSession, plan_data: HostingPlanCreate) -> HostingPlan:
        db_plan = HostingPlan(
            name=plan_data.name,
            description=plan_data.description,
            plan_type=plan_data.plan_type,
            cpu_cores=plan_data.cpu_cores,
            ram_gb=plan_data.ram_gb,
            storage_gb=plan_data.storage_gb,
            bandwidth_gb=plan_data.bandwidth_gb,
            base_price=plan_data.base_price,
            monthly_price=plan_data.monthly_price,
            quarterly_price=plan_data.quarterly_price,
            annual_price=plan_data.annual_price,
            biennial_price=plan_data.biennial_price,
            triennial_price=plan_data.triennial_price,
            is_featured=plan_data.is_featured,
            features=plan_data.features
        )
        
        db.add(db_plan)
        await db.commit()
        await db.refresh(db_plan)
        return db_plan
    
    async def update_plan(self, db: AsyncSession, plan_id: int, plan_update: HostingPlanUpdate) -> Optional[HostingPlan]:
        plan = await self.get_plan_by_id(db, plan_id)
        if not plan:
            return None
            
        update_data = plan_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(plan, field, value)
            
        await db.commit()
        await db.refresh(plan)
        return plan
    
    async def delete_plan(self, db: AsyncSession, plan_id: int) -> bool:
        plan = await self.get_plan_by_id(db, plan_id)
        if not plan:
            return False
            
        await db.delete(plan)
        await db.commit()
        return True
    
    async def toggle_plan_status(self, db: AsyncSession, plan_id: int) -> Optional[HostingPlan]:
        plan = await self.get_plan_by_id(db, plan_id)
        if not plan:
            return None
            
        plan.is_active = not plan.is_active
        await db.commit()
        await db.refresh(plan)
        return plan
    
    async def toggle_featured_status(self, db: AsyncSession, plan_id: int) -> Optional[HostingPlan]:
        plan = await self.get_plan_by_id(db, plan_id)
        if not plan:
            return None
            
        plan.is_featured = not plan.is_featured
        await db.commit()
        await db.refresh(plan)
        return plan
    
    async def get_plan_pricing(self, db: AsyncSession, plan_id: int) -> Optional[Dict[str, Decimal]]:
        plan = await self.get_plan_by_id(db, plan_id)
        if not plan:
            return None
            
        return {
            "monthly": plan.monthly_price,
            "quarterly": plan.quarterly_price,
            "annual": plan.annual_price,
            "biennial": plan.biennial_price,
            "triennial": plan.triennial_price
        }
    
    async def calculate_discount_percentage(self, db: AsyncSession, plan_id: int, billing_cycle: str) -> Optional[float]:
        plan = await self.get_plan_by_id(db, plan_id)
        if not plan:
            return None
            
        monthly_total = float(plan.monthly_price)
        
        if billing_cycle == "quarterly":
            quarterly_monthly = float(plan.quarterly_price) / 3
            discount = ((monthly_total - quarterly_monthly) / monthly_total) * 100
        elif billing_cycle == "annual":
            annual_monthly = float(plan.annual_price) / 12
            discount = ((monthly_total - annual_monthly) / monthly_total) * 100
        elif billing_cycle == "biennial":
            biennial_monthly = float(plan.biennial_price) / 24
            discount = ((monthly_total - biennial_monthly) / monthly_total) * 100
        elif billing_cycle == "triennial":
            triennial_monthly = float(plan.triennial_price) / 36
            discount = ((monthly_total - triennial_monthly) / monthly_total) * 100
        else:
            discount = 0.0
            
        return round(discount, 1)