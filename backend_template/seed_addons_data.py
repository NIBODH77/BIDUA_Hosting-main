"""
Seed addon data - Professional hosting addons
"""
import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.addon import Addon, AddonCategory, BillingType


async def seed_addons():
    print("🌱 Seeding addon data...")
    
    addons_data = [
        # Storage Addons
        {
            "name": "Extra Storage 50GB",
            "slug": "extra-storage-50gb",
            "category": AddonCategory.STORAGE,
            "description": "Additional 50GB NVMe SSD storage",
            "price": 500.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 10,
            "default_quantity": 1,
            "unit_label": "50GB",
            "icon": "hard-drive"
        },
        {
            "name": "Extra Storage 100GB",
            "slug": "extra-storage-100gb",
            "category": AddonCategory.STORAGE,
            "description": "Additional 100GB NVMe SSD storage",
            "price": 900.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 10,
            "default_quantity": 1,
            "unit_label": "100GB",
            "icon": "hard-drive"
        },
        
        # Bandwidth Addons
        {
            "name": "Extra Bandwidth 500GB",
            "slug": "extra-bandwidth-500gb",
            "category": AddonCategory.BANDWIDTH,
            "description": "Additional 500GB monthly bandwidth",
            "price": 300.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "min_quantity": 1,
            "max_quantity": 20,
            "default_quantity": 1,
            "unit_label": "500GB",
            "icon": "activity"
        },
        {
            "name": "Extra Bandwidth 1TB",
            "slug": "extra-bandwidth-1tb",
            "category": AddonCategory.BANDWIDTH,
            "description": "Additional 1TB monthly bandwidth",
            "price": 500.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "min_quantity": 1,
            "max_quantity": 20,
            "default_quantity": 1,
            "unit_label": "1TB",
            "icon": "activity"
        },
        
        # IP Address Addons
        {
            "name": "Dedicated IPv4 Address",
            "slug": "dedicated-ipv4",
            "category": AddonCategory.IP_ADDRESS,
            "description": "Dedicated IPv4 address for your server",
            "price": 200.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 5,
            "default_quantity": 1,
            "unit_label": "IP",
            "icon": "globe"
        },
        
        # Control Panel Addons
        {
            "name": "cPanel/WHM License",
            "slug": "cpanel-license",
            "category": AddonCategory.CONTROL_PANEL,
            "description": "cPanel/WHM control panel license",
            "price": 1500.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 1,
            "default_quantity": 1,
            "icon": "layout-dashboard"
        },
        {
            "name": "Plesk Panel License",
            "slug": "plesk-license",
            "category": AddonCategory.CONTROL_PANEL,
            "description": "Plesk control panel license",
            "price": 1200.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "min_quantity": 1,
            "max_quantity": 1,
            "default_quantity": 1,
            "icon": "layout-dashboard"
        },
        
        # Backup Addons
        {
            "name": "Daily Automated Backups",
            "slug": "daily-backups",
            "category": AddonCategory.BACKUP,
            "description": "Automated daily backups with 30-day retention",
            "price": 800.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 1,
            "default_quantity": 1,
            "icon": "database"
        },
        {
            "name": "Weekly Backup Service",
            "slug": "weekly-backups",
            "category": AddonCategory.BACKUP,
            "description": "Weekly automated backups with 90-day retention",
            "price": 400.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "min_quantity": 1,
            "max_quantity": 1,
            "default_quantity": 1,
            "icon": "database"
        },
        
        # SSL Addons
        {
            "name": "Standard SSL Certificate",
            "slug": "standard-ssl",
            "category": AddonCategory.SSL,
            "description": "Domain Validated SSL certificate",
            "price": 1000.00,
            "billing_type": BillingType.ANNUAL,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 10,
            "default_quantity": 1,
            "icon": "shield-check"
        },
        {
            "name": "Wildcard SSL Certificate",
            "slug": "wildcard-ssl",
            "category": AddonCategory.SSL,
            "description": "Wildcard SSL for unlimited subdomains",
            "price": 5000.00,
            "billing_type": BillingType.ANNUAL,
            "is_active": True,
            "min_quantity": 1,
            "max_quantity": 5,
            "default_quantity": 1,
            "icon": "shield-check"
        },
        
        # Security Addons
        {
            "name": "Advanced DDoS Protection",
            "slug": "ddos-protection",
            "category": AddonCategory.SECURITY,
            "description": "Enterprise-grade DDoS protection",
            "price": 2000.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 1,
            "default_quantity": 1,
            "icon": "shield"
        },
        {
            "name": "Malware Scanning",
            "slug": "malware-scanning",
            "category": AddonCategory.SECURITY,
            "description": "Daily malware scanning and removal",
            "price": 600.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "min_quantity": 1,
            "max_quantity": 1,
            "default_quantity": 1,
            "icon": "shield-alert"
        },
        
        # Support Addons
        {
            "name": "Priority Support",
            "slug": "priority-support",
            "category": AddonCategory.SUPPORT,
            "description": "24/7 priority support with 1-hour response time",
            "price": 3000.00,
            "billing_type": BillingType.MONTHLY,
            "is_active": True,
            "is_featured": True,
            "min_quantity": 1,
            "max_quantity": 1,
            "default_quantity": 1,
            "icon": "headphones"
        },
    ]
    
    async with AsyncSessionLocal() as db:
        # Check if addons already exist
        result = await db.execute(select(Addon))
        existing_addons = result.scalars().all()
        
        if existing_addons:
            print(f"⚠️  Found {len(existing_addons)} existing addons. Skipping seed.")
            return
        
        # Insert addons
        for addon_data in addons_data:
            addon = Addon(**addon_data)
            db.add(addon)
        
        await db.commit()
        print(f"✅ Successfully seeded {len(addons_data)} addons")
        
        # Display summary
        print("\n📊 Addon Categories:")
        for category in AddonCategory:
            count = sum(1 for a in addons_data if a['category'] == category)
            if count > 0:
                print(f"   {category.value}: {count} addons")


if __name__ == "__main__":
    asyncio.run(seed_addons())
