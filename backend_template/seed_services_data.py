"""
Seed services data - Managed services
"""
import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.service import Service, ServiceCategory


async def seed_services():
    print("🌱 Seeding services data...")
    
    services_data = [
        # Server Management Services
        {
            "name": "Full Server Management",
            "slug": "full-server-management",
            "category": ServiceCategory.SERVER_MANAGEMENT,
            "description": "Complete server management including updates, security, monitoring, and optimization",
            "price": 5000.00,
            "billing_type": "monthly",
            "is_active": True,
            "is_featured": True,
            "sla_response_time": "2 hours",
            "icon": "server"
        },
        {
            "name": "Basic Server Management",
            "slug": "basic-server-management",
            "category": ServiceCategory.SERVER_MANAGEMENT,
            "description": "Essential server management including updates and basic security",
            "price": 2500.00,
            "billing_type": "monthly",
            "is_active": True,
            "sla_response_time": "24 hours",
            "icon": "server"
        },
        
        # Backup Management
        {
            "name": "Managed Backup Service",
            "slug": "managed-backup",
            "category": ServiceCategory.BACKUP_MANAGEMENT,
            "description": "Professional backup management with monitoring and restore testing",
            "price": 1500.00,
            "billing_type": "monthly",
            "is_active": True,
            "is_featured": True,
            "sla_response_time": "4 hours",
            "icon": "database"
        },
        {
            "name": "Backup Restoration Service",
            "slug": "backup-restoration",
            "category": ServiceCategory.BACKUP_MANAGEMENT,
            "description": "Professional backup restoration service",
            "price": 3000.00,
            "billing_type": "one_time",
            "is_active": True,
            "duration_hours": 4,
            "icon": "refresh-ccw"
        },
        
        # Monitoring Services
        {
            "name": "24/7 Server Monitoring",
            "slug": "24-7-monitoring",
            "category": ServiceCategory.MONITORING,
            "description": "Round-the-clock server monitoring with instant alerts",
            "price": 2000.00,
            "billing_type": "monthly",
            "is_active": True,
            "is_featured": True,
            "sla_response_time": "15 minutes",
            "icon": "activity"
        },
        {
            "name": "Application Performance Monitoring",
            "slug": "app-monitoring",
            "category": ServiceCategory.MONITORING,
            "description": "Advanced application performance monitoring and reporting",
            "price": 3000.00,
            "billing_type": "monthly",
            "is_active": True,
            "sla_response_time": "1 hour",
            "icon": "bar-chart"
        },
        
        # Security Services
        {
            "name": "Security Hardening",
            "slug": "security-hardening",
            "category": ServiceCategory.SECURITY,
            "description": "Complete server security hardening and configuration",
            "price": 8000.00,
            "billing_type": "one_time",
            "is_active": True,
            "is_featured": True,
            "duration_hours": 8,
            "icon": "shield"
        },
        {
            "name": "Security Audit",
            "slug": "security-audit",
            "category": ServiceCategory.SECURITY,
            "description": "Comprehensive security audit with detailed report",
            "price": 5000.00,
            "billing_type": "one_time",
            "is_active": True,
            "duration_hours": 6,
            "icon": "shield-check"
        },
        {
            "name": "Vulnerability Assessment",
            "slug": "vulnerability-assessment",
            "category": ServiceCategory.SECURITY,
            "description": "Regular vulnerability scanning and assessment",
            "price": 2500.00,
            "billing_type": "monthly",
            "is_active": True,
            "sla_response_time": "24 hours",
            "icon": "shield-alert"
        },
        
        # Migration Services
        {
            "name": "Server Migration Service",
            "slug": "server-migration",
            "category": ServiceCategory.MIGRATION,
            "description": "Complete server migration with zero downtime",
            "price": 10000.00,
            "billing_type": "one_time",
            "is_active": True,
            "is_featured": True,
            "duration_hours": 12,
            "icon": "move"
        },
        {
            "name": "Website Migration",
            "slug": "website-migration",
            "category": ServiceCategory.MIGRATION,
            "description": "Website migration to our servers",
            "price": 3000.00,
            "billing_type": "one_time",
            "is_active": True,
            "duration_hours": 4,
            "icon": "globe"
        },
        {
            "name": "Database Migration",
            "slug": "database-migration",
            "category": ServiceCategory.MIGRATION,
            "description": "Database migration and optimization",
            "price": 5000.00,
            "billing_type": "one_time",
            "is_active": True,
            "duration_hours": 6,
            "icon": "database"
        },
        
        # Optimization Services
        {
            "name": "Performance Optimization",
            "slug": "performance-optimization",
            "category": ServiceCategory.OPTIMIZATION,
            "description": "Server and application performance optimization",
            "price": 7000.00,
            "billing_type": "one_time",
            "is_active": True,
            "is_featured": True,
            "duration_hours": 8,
            "icon": "zap"
        },
        {
            "name": "Database Optimization",
            "slug": "database-optimization",
            "category": ServiceCategory.OPTIMIZATION,
            "description": "Database query and structure optimization",
            "price": 4000.00,
            "billing_type": "one_time",
            "is_active": True,
            "duration_hours": 4,
            "icon": "database"
        },
        
        # Consultation Services
        {
            "name": "Technical Consultation - 1 Hour",
            "slug": "tech-consultation-1hr",
            "category": ServiceCategory.CONSULTATION,
            "description": "One-on-one technical consultation with expert",
            "price": 2000.00,
            "billing_type": "one_time",
            "is_active": True,
            "duration_hours": 1,
            "icon": "message-circle"
        },
        {
            "name": "Architecture Review",
            "slug": "architecture-review",
            "category": ServiceCategory.CONSULTATION,
            "description": "Comprehensive architecture review and recommendations",
            "price": 8000.00,
            "billing_type": "one_time",
            "is_active": True,
            "is_featured": True,
            "duration_hours": 6,
            "icon": "clipboard"
        },
        
        # Custom Services
        {
            "name": "Custom Development",
            "slug": "custom-development",
            "category": ServiceCategory.CUSTOM,
            "description": "Custom development services (per hour)",
            "price": 1500.00,
            "billing_type": "one_time",
            "is_active": True,
            "duration_hours": 1,
            "icon": "code"
        },
    ]
    
    async with AsyncSessionLocal() as db:
        # Check if services already exist
        result = await db.execute(select(Service))
        existing_services = result.scalars().all()
        
        if existing_services:
            print(f"⚠️  Found {len(existing_services)} existing services. Skipping seed.")
            return
        
        # Insert services
        for service_data in services_data:
            service = Service(**service_data)
            db.add(service)
        
        await db.commit()
        print(f"✅ Successfully seeded {len(services_data)} services")
        
        # Display summary
        print("\n📊 Service Categories:")
        for category in ServiceCategory:
            count = sum(1 for s in services_data if s['category'] == category)
            if count > 0:
                print(f"   {category.value}: {count} services")


if __name__ == "__main__":
    asyncio.run(seed_services())
