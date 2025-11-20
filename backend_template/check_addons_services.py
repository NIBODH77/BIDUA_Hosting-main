
"""
Quick script to check available addon and service IDs in database
Run: python check_addons_services.py
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import async_session_maker
from app.models.addon import Addon
from app.models.service import Service


async def check_data():
    async with async_session_maker() as db:
        # Check Addons
        result = await db.execute(select(Addon))
        addons = result.scalars().all()
        
        print("=" * 60)
        print("📦 ADDONS IN DATABASE:")
        print("=" * 60)
        if addons:
            for addon in addons:
                print(f"  ID: {addon.id:3} | {addon.name:40} | ₹{addon.price:8} | Active: {addon.is_active}")
        else:
            print("  ⚠️  NO ADDONS FOUND IN DATABASE!")
        
        print("\n" + "=" * 60)
        print("🔧 SERVICES IN DATABASE:")
        print("=" * 60)
        
        # Check Services
        result = await db.execute(select(Service))
        services = result.scalars().all()
        
        if services:
            for service in services:
                print(f"  ID: {service.id:3} | {service.name:40} | ₹{service.price:8} | Active: {service.is_active}")
        else:
            print("  ⚠️  NO SERVICES FOUND IN DATABASE!")
        
        print("\n" + "=" * 60)
        print(f"Total Addons: {len(addons)}")
        print(f"Total Services: {len(services)}")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(check_data())
