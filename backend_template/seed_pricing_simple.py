import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.hosting_plan_config import (
    HostingPlanConfiguration,
    BillingCycleDiscount,
    CalculatorConfiguration,
    CalculatorAddonPricing,
    PlanTypeMetadata
)

async def clear_and_seed():
    print("\n🌱 Seeding BIDUA Hosting pricing data...")
    
    async with AsyncSessionLocal() as session:
        # Clear existing data
        await session.execute("TRUNCATE TABLE hosting_plan_configurations CASCADE")
        await session.execute("TRUNCATE TABLE billing_cycle_discounts CASCADE")
        await session.execute("TRUNCATE TABLE calculator_configurations CASCADE")
        await session.execute("TRUNCATE TABLE calculator_addon_pricing CASCADE")
        await session.execute("TRUNCATE TABLE plan_type_metadata CASCADE")
        await session.commit()
        print("✅ Cleared existing data")

asyncio.run(clear_and_seed())
