"""
Seed Commission Rules for Affiliate System
Run this once to set up the commission structure
"""
import asyncio
import sys
import os

# Add the backend_template directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, text
from decimal import Decimal

from app.core.config import settings


async def seed_commission_rules():
    """Seed default commission rules"""
    
    # Create engine and session
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    AsyncSessionLocal = sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
    
    async with AsyncSessionLocal() as db:
        # Check if rules already exist
        result = await db.execute(text("SELECT COUNT(*) FROM commission_rules"))
        count = result.scalar()
        
        if count and count > 0:
            print(f"⚠️  {count} commission rules already exist. Skipping seed.")
            return
        
        print("📊 Creating commission rules...")
        
        # Define commission rules as SQL inserts
        insert_query = """
            INSERT INTO commission_rules 
            (name, description, level, product_type, commission_type, commission_value, is_active, priority, created_at)
            VALUES
            ('Server Recurring - Level 1 (Direct Referral)', '5% commission on every renewal for direct referrals', 1, 'server', 'percentage', 5.00, true, 10, NOW()),
            ('Server Recurring - Level 2', '1% commission on every renewal for second-level referrals', 2, 'server', 'percentage', 1.00, true, 10, NOW()),
            ('Server Recurring - Level 3', '1% commission on every renewal for third-level referrals', 3, 'server', 'percentage', 1.00, true, 10, NOW()),
            ('Server Long-term - Level 1 (Direct Referral)', '15% one-time commission for annual/biennial/triennial plans', 1, 'server_longterm', 'percentage', 15.00, true, 20, NOW()),
            ('Server Long-term - Level 2', '3% one-time commission for second-level referrals on long-term plans', 2, 'server_longterm', 'percentage', 3.00, true, 20, NOW()),
            ('Server Long-term - Level 3', '2% one-time commission for third-level referrals on long-term plans', 3, 'server_longterm', 'percentage', 2.00, true, 20, NOW()),
            ('Default Server - Level 1', 'Default 10% commission for Level 1 (if no specific rule matches)', 1, 'all', 'percentage', 10.00, true, 1, NOW()),
            ('Default Server - Level 2', 'Default 2% commission for Level 2 (if no specific rule matches)', 2, 'all', 'percentage', 2.00, true, 1, NOW()),
            ('Default Server - Level 3', 'Default 1% commission for Level 3 (if no specific rule matches)', 3, 'all', 'percentage', 1.00, true, 1, NOW())
        """
        
        await db.execute(text(insert_query))
        await db.commit()
        
        print("  ✅ Created 9 commission rules")
        print(f"\n🎉 Successfully created commission rules!")
        print("\n📋 Summary:")
        print("  - Recurring Plans: 5% / 1% / 1% (L1/L2/L3)")
        print("  - Long-term Plans: 15% / 3% / 2% (L1/L2/L3)")
        print("  - Default Fallback: 10% / 2% / 1% (L1/L2/L3)")


if __name__ == "__main__":
    print("🚀 Starting Commission Rules Seed Script...")
    asyncio.run(seed_commission_rules())
    print("✅ Seed script completed!")
