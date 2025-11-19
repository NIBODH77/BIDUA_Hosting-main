#!/usr/bin/env python3
"""
Seed script for departments, roles, and permissions
This creates the initial RBAC structure for the system
"""
import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import select, text
from app.core.database import DATABASE_URL
from app.models.roles import Department, Role, Permission, role_permissions


# Department definitions
DEPARTMENTS = [
    {"name": "Executive", "code": "EXEC", "description": "Top-level management and strategic decisions"},
    {"name": "Technology", "code": "TECH", "description": "System development, maintenance, and infrastructure"},
    {"name": "Customer Support", "code": "SUPPORT", "description": "Customer service and technical support"},
    {"name": "Sales & Marketing", "code": "SALES", "description": "Revenue generation and customer acquisition"},
    {"name": "Affiliate Management", "code": "AFFILIATE_MGMT", "description": "Manage affiliate program and partnerships"},
    {"name": "Finance & Billing", "code": "FINANCE", "description": "Financial operations and billing management"},
    {"name": "Product Management", "code": "PRODUCT", "description": "Product strategy and development"},
    {"name": "Quality Assurance", "code": "QA", "description": "Testing and quality control"},
    {"name": "Compliance & Legal", "code": "LEGAL", "description": "Legal compliance and risk management"},
]


# Role definitions with department codes
ROLES = [
    # System roles
    {"name": "Super Admin", "code": "SUPER_ADMIN", "department_code": "EXEC", "is_system_role": True, "level": 100, "description": "Full system access"},
    {"name": "Admin", "code": "ADMIN", "department_code": "EXEC", "is_system_role": True, "level": 90, "description": "Administrative access"},
    
    # Customer roles
    {"name": "Customer", "code": "CUSTOMER", "department_code": None, "is_system_role": True, "level": 1, "description": "Standard customer"},
    {"name": "Affiliate", "code": "AFFILIATE", "department_code": "AFFILIATE_MGMT", "is_system_role": True, "level": 5, "description": "Affiliate partner"},
    
    # Executive roles
    {"name": "CEO", "code": "CEO", "department_code": "EXEC", "level": 95, "description": "Chief Executive Officer"},
    {"name": "COO", "code": "COO", "department_code": "EXEC", "level": 94, "description": "Chief Operating Officer"},
    {"name": "CFO", "code": "CFO", "department_code": "EXEC", "level": 94, "description": "Chief Financial Officer"},
    
    # Technology roles
    {"name": "CTO", "code": "CTO", "department_code": "TECH", "level": 93, "description": "Chief Technology Officer"},
    {"name": "System Administrator", "code": "SYSADMIN", "department_code": "TECH", "level": 70, "description": "System and server management"},
    {"name": "DevOps Engineer", "code": "DEVOPS", "department_code": "TECH", "level": 65, "description": "Deployment and automation"},
    {"name": "Backend Developer", "code": "BACKEND_DEV", "department_code": "TECH", "level": 60, "description": "Backend development"},
    {"name": "Frontend Developer", "code": "FRONTEND_DEV", "department_code": "TECH", "level": 60, "description": "Frontend development"},
    {"name": "Security Engineer", "code": "SECURITY", "department_code": "TECH", "level": 75, "description": "Security and compliance"},
    
    # Support roles
    {"name": "Support Manager", "code": "SUPPORT_MANAGER", "department_code": "SUPPORT", "level": 60, "description": "Support team oversight"},
    {"name": "Senior Support Agent", "code": "SR_SUPPORT", "department_code": "SUPPORT", "level": 50, "description": "Senior support specialist"},
    {"name": "Support Agent", "code": "SUPPORT_AGENT", "department_code": "SUPPORT", "level": 40, "description": "Customer support"},
    {"name": "Technical Support", "code": "TECH_SUPPORT", "department_code": "SUPPORT", "level": 45, "description": "Technical troubleshooting"},
    
    # Sales roles
    {"name": "Sales Manager", "code": "SALES_MANAGER", "department_code": "SALES", "level": 60, "description": "Sales team oversight"},
    {"name": "Sales Executive", "code": "SALES_EXEC", "department_code": "SALES", "level": 45, "description": "Direct sales"},
    {"name": "Marketing Manager", "code": "MARKETING_MGR", "department_code": "SALES", "level": 60, "description": "Marketing strategy"},
    {"name": "Content Creator", "code": "CONTENT_CREATOR", "department_code": "SALES", "level": 40, "description": "Marketing content"},
    {"name": "SEO Specialist", "code": "SEO", "department_code": "SALES", "level": 45, "description": "SEO and organic growth"},
    
    # Affiliate management roles
    {"name": "Affiliate Manager", "code": "AFFILIATE_MANAGER", "department_code": "AFFILIATE_MGMT", "level": 65, "description": "Affiliate program oversight"},
    {"name": "Affiliate Support", "code": "AFFILIATE_SUPPORT", "department_code": "AFFILIATE_MGMT", "level": 45, "description": "Affiliate assistance"},
    {"name": "Commission Analyst", "code": "COMMISSION_ANALYST", "department_code": "AFFILIATE_MGMT", "level": 50, "description": "Commission tracking"},
    
    # Finance roles
    {"name": "Finance Manager", "code": "FINANCE_MANAGER", "department_code": "FINANCE", "level": 70, "description": "Financial oversight"},
    {"name": "Billing Specialist", "code": "BILLING_SPECIALIST", "department_code": "FINANCE", "level": 50, "description": "Billing management"},
    {"name": "Accountant", "code": "ACCOUNTANT", "department_code": "FINANCE", "level": 55, "description": "Financial records"},
    {"name": "Payout Manager", "code": "PAYOUT_MANAGER", "department_code": "FINANCE", "level": 60, "description": "Payout processing"},
    
    # Product roles
    {"name": "Product Manager", "code": "PRODUCT_MANAGER", "department_code": "PRODUCT", "level": 65, "description": "Product roadmap"},
    {"name": "Product Analyst", "code": "PRODUCT_ANALYST", "department_code": "PRODUCT", "level": 55, "description": "Product analytics"},
    
    # QA roles
    {"name": "QA Manager", "code": "QA_MANAGER", "department_code": "QA", "level": 60, "description": "QA team oversight"},
    {"name": "QA Engineer", "code": "QA_ENGINEER", "department_code": "QA", "level": 50, "description": "Quality assurance"},
    
    # Legal/Compliance roles
    {"name": "Compliance Officer", "code": "COMPLIANCE", "department_code": "LEGAL", "level": 70, "description": "Regulatory compliance"},
    {"name": "Legal Advisor", "code": "LEGAL_ADVISOR", "department_code": "LEGAL", "level": 75, "description": "Legal matters"},
]


# Permission definitions (resource.action format)
PERMISSIONS = [
    # User management
    {"code": "user.create", "name": "Create Users", "resource": "user", "action": "create", "description": "Create new user accounts"},
    {"code": "user.read", "name": "View Users", "resource": "user", "action": "read", "description": "View user information"},
    {"code": "user.update", "name": "Update Users", "resource": "user", "action": "update", "description": "Modify user accounts"},
    {"code": "user.delete", "name": "Delete Users", "resource": "user", "action": "delete", "description": "Delete user accounts"},
    {"code": "user.manage", "name": "Manage Users", "resource": "user", "action": "manage", "description": "Full user management"},
    
    # Server management
    {"code": "server.create", "name": "Create Servers", "resource": "server", "action": "create", "description": "Create new servers"},
    {"code": "server.read", "name": "View Servers", "resource": "server", "action": "read", "description": "View server information"},
    {"code": "server.update", "name": "Update Servers", "resource": "server", "action": "update", "description": "Modify server settings"},
    {"code": "server.delete", "name": "Delete Servers", "resource": "server", "action": "delete", "description": "Delete servers"},
    {"code": "server.manage", "name": "Manage Servers", "resource": "server", "action": "manage", "description": "Full server management"},
    
    # Billing
    {"code": "billing.create", "name": "Create Billing", "resource": "billing", "action": "create", "description": "Create billing records"},
    {"code": "billing.read", "name": "View Billing", "resource": "billing", "action": "read", "description": "View billing information"},
    {"code": "billing.update", "name": "Update Billing", "resource": "billing", "action": "update", "description": "Modify billing records"},
    {"code": "billing.delete", "name": "Delete Billing", "resource": "billing", "action": "delete", "description": "Delete billing records"},
    {"code": "billing.manage", "name": "Manage Billing", "resource": "billing", "action": "manage", "description": "Full billing management"},
    
    # Affiliate
    {"code": "affiliate.create", "name": "Create Affiliates", "resource": "affiliate", "action": "create", "description": "Create affiliate accounts"},
    {"code": "affiliate.read", "name": "View Affiliates", "resource": "affiliate", "action": "read", "description": "View affiliate information"},
    {"code": "affiliate.update", "name": "Update Affiliates", "resource": "affiliate", "action": "update", "description": "Modify affiliate accounts"},
    {"code": "affiliate.delete", "name": "Delete Affiliates", "resource": "affiliate", "action": "delete", "description": "Delete affiliate accounts"},
    {"code": "affiliate.manage", "name": "Manage Affiliates", "resource": "affiliate", "action": "manage", "description": "Full affiliate management"},
    
    # Commission
    {"code": "commission.create", "name": "Create Commissions", "resource": "commission", "action": "create", "description": "Create commission records"},
    {"code": "commission.read", "name": "View Commissions", "resource": "commission", "action": "read", "description": "View commission information"},
    {"code": "commission.update", "name": "Update Commissions", "resource": "commission", "action": "update", "description": "Modify commission records"},
    {"code": "commission.delete", "name": "Delete Commissions", "resource": "commission", "action": "delete", "description": "Delete commission records"},
    {"code": "commission.approve", "name": "Approve Commissions", "resource": "commission", "action": "approve", "description": "Approve pending commissions"},
    {"code": "commission.manage", "name": "Manage Commissions", "resource": "commission", "action": "manage", "description": "Full commission management"},
    
    # Payout
    {"code": "payout.create", "name": "Create Payouts", "resource": "payout", "action": "create", "description": "Request payouts"},
    {"code": "payout.read", "name": "View Payouts", "resource": "payout", "action": "read", "description": "View payout information"},
    {"code": "payout.update", "name": "Update Payouts", "resource": "payout", "action": "update", "description": "Modify payout records"},
    {"code": "payout.delete", "name": "Delete Payouts", "resource": "payout", "action": "delete", "description": "Delete payout records"},
    {"code": "payout.approve", "name": "Approve Payouts", "resource": "payout", "action": "approve", "description": "Approve payout requests"},
    {"code": "payout.manage", "name": "Manage Payouts", "resource": "payout", "action": "manage", "description": "Full payout management"},
    
    # Orders
    {"code": "order.create", "name": "Create Orders", "resource": "order", "action": "create", "description": "Create new orders"},
    {"code": "order.read", "name": "View Orders", "resource": "order", "action": "read", "description": "View order information"},
    {"code": "order.update", "name": "Update Orders", "resource": "order", "action": "update", "description": "Modify orders"},
    {"code": "order.delete", "name": "Delete Orders", "resource": "order", "action": "delete", "description": "Delete orders"},
    {"code": "order.manage", "name": "Manage Orders", "resource": "order", "action": "manage", "description": "Full order management"},
    
    # Support tickets
    {"code": "ticket.create", "name": "Create Tickets", "resource": "ticket", "action": "create", "description": "Create support tickets"},
    {"code": "ticket.read", "name": "View Tickets", "resource": "ticket", "action": "read", "description": "View support tickets"},
    {"code": "ticket.update", "name": "Update Tickets", "resource": "ticket", "action": "update", "description": "Update ticket status/replies"},
    {"code": "ticket.delete", "name": "Delete Tickets", "resource": "ticket", "action": "delete", "description": "Delete tickets"},
    {"code": "ticket.manage", "name": "Manage Tickets", "resource": "ticket", "action": "manage", "description": "Full ticket management"},
    
    # Departments
    {"code": "department.create", "name": "Create Departments", "resource": "department", "action": "create", "description": "Create departments"},
    {"code": "department.read", "name": "View Departments", "resource": "department", "action": "read", "description": "View departments"},
    {"code": "department.update", "name": "Update Departments", "resource": "department", "action": "update", "description": "Modify departments"},
    {"code": "department.delete", "name": "Delete Departments", "resource": "department", "action": "delete", "description": "Delete departments"},
    {"code": "department.manage", "name": "Manage Departments", "resource": "department", "action": "manage", "description": "Full department management"},
    
    # Roles
    {"code": "role.create", "name": "Create Roles", "resource": "role", "action": "create", "description": "Create roles"},
    {"code": "role.read", "name": "View Roles", "resource": "role", "action": "read", "description": "View roles"},
    {"code": "role.update", "name": "Update Roles", "resource": "role", "action": "update", "description": "Modify roles"},
    {"code": "role.delete", "name": "Delete Roles", "resource": "role", "action": "delete", "description": "Delete roles"},
    {"code": "role.manage", "name": "Manage Roles", "resource": "role", "action": "manage", "description": "Full role management"},
    
    # Permissions
    {"code": "permission.create", "name": "Create Permissions", "resource": "permission", "action": "create", "description": "Create permissions"},
    {"code": "permission.read", "name": "View Permissions", "resource": "permission", "action": "read", "description": "View permissions"},
    {"code": "permission.update", "name": "Update Permissions", "resource": "permission", "action": "update", "description": "Modify permissions"},
    {"code": "permission.delete", "name": "Delete Permissions", "resource": "permission", "action": "delete", "description": "Delete permissions"},
    {"code": "permission.manage", "name": "Manage Permissions", "resource": "permission", "action": "manage", "description": "Full permission management"},
    
    # Analytics
    {"code": "analytics.read", "name": "View Analytics", "resource": "analytics", "action": "read", "description": "View system analytics"},
    {"code": "analytics.manage", "name": "Manage Analytics", "resource": "analytics", "action": "manage", "description": "Full analytics management"},
]


# Role-Permission mappings
ROLE_PERMISSIONS = {
    "SUPER_ADMIN": "ALL",  # Gets all permissions
    "ADMIN": "ALL",  # Gets all permissions except system management
    
    "CUSTOMER": [
        "server.read", "billing.read", "order.create", "order.read", "ticket.create", "ticket.read"
    ],
    
    "AFFILIATE": [
        "affiliate.read", "commission.read", "payout.create", "payout.read",
        "server.read", "billing.read", "order.create", "order.read", "ticket.create", "ticket.read"
    ],
    
    "AFFILIATE_MANAGER": [
        "affiliate.manage", "commission.manage", "payout.manage", "analytics.read"
    ],
    
    "SUPPORT_AGENT": [
        "ticket.read", "ticket.update", "user.read", "server.read", "billing.read"
    ],
    
    "SUPPORT_MANAGER": [
        "ticket.manage", "user.read", "user.update", "server.read", "server.update", "billing.read"
    ],
    
    "SALES_EXEC": [
        "order.create", "order.read", "user.read", "billing.read"
    ],
    
    "BILLING_SPECIALIST": [
        "billing.manage", "order.read"
    ],
    
    "PAYOUT_MANAGER": [
        "payout.read", "payout.approve", "payout.update", "commission.read"
    ],
    
    "SYSADMIN": [
        "server.manage", "user.read", "analytics.read"
    ],
}


async def seed_departments(session):
    """Seed departments"""
    print("🏢 Seeding departments...")
    
    created_departments = {}
    
    for dept_data in DEPARTMENTS:
        # Check if exists
        result = await session.execute(
            select(Department).where(Department.code == dept_data["code"])
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"   ⏭️  Department '{dept_data['name']}' already exists")
            created_departments[dept_data["code"]] = existing
        else:
            department = Department(**dept_data)
            session.add(department)
            await session.flush()
            created_departments[dept_data["code"]] = department
            print(f"   ✅ Created department: {dept_data['name']} ({dept_data['code']})")
    
    await session.commit()
    return created_departments


async def seed_roles(session, departments):
    """Seed roles"""
    print("\n👥 Seeding roles...")
    
    created_roles = {}
    
    for role_data in ROLES:
        # Check if exists
        result = await session.execute(
            select(Role).where(Role.code == role_data["code"])
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"   ⏭️  Role '{role_data['name']}' already exists")
            created_roles[role_data["code"]] = existing
        else:
            # Get department ID if specified
            dept_code = role_data.pop("department_code", None)
            if dept_code and dept_code in departments:
                role_data["department_id"] = departments[dept_code].id
            
            role = Role(**role_data)
            session.add(role)
            await session.flush()
            created_roles[role_data["code"]] = role
            print(f"   ✅ Created role: {role_data['name']} ({role_data['code']})")
    
    await session.commit()
    return created_roles


async def seed_permissions(session):
    """Seed permissions"""
    print("\n🔐 Seeding permissions...")
    
    created_permissions = {}
    
    for perm_data in PERMISSIONS:
        # Check if exists
        result = await session.execute(
            select(Permission).where(Permission.code == perm_data["code"])
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            created_permissions[perm_data["code"]] = existing
        else:
            permission = Permission(**perm_data)
            session.add(permission)
            await session.flush()
            created_permissions[perm_data["code"]] = permission
            print(f"   ✅ Created permission: {perm_data['code']}")
    
    await session.commit()
    return created_permissions


async def assign_role_permissions(session, roles, permissions):
    """Assign permissions to roles"""
    print("\n🔗 Assigning permissions to roles...")
    
    for role_code, perm_list in ROLE_PERMISSIONS.items():
        if role_code not in roles:
            continue
        
        role = roles[role_code]
        
        if perm_list == "ALL":
            # Assign all permissions manually via junction table
            for permission in permissions.values():
                await session.execute(
                    text("INSERT INTO role_permissions (role_id, permission_id) VALUES (:role_id, :perm_id) ON CONFLICT DO NOTHING"),
                    {"role_id": role.id, "perm_id": permission.id}
                )
            print(f"   ✅ Assigned ALL {len(permissions)} permissions to {role_code}")
        else:
            # Assign specific permissions manually
            assigned_count = 0
            for pcode in perm_list:
                if pcode in permissions:
                    await session.execute(
                        text("INSERT INTO role_permissions (role_id, permission_id) VALUES (:role_id, :perm_id) ON CONFLICT DO NOTHING"),
                        {"role_id": role.id, "perm_id": permissions[pcode].id}
                    )
                    assigned_count += 1
            print(f"   ✅ Assigned {assigned_count} permissions to {role_code}")
    
    await session.commit()


async def main():
    """Main seeding function"""
    print("🌱 Starting RBAC seeding process...\n")
    
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.begin() as conn:
        session = AsyncSession(bind=conn, expire_on_commit=False)
        
        try:
            # Seed in order
            departments = await seed_departments(session)
            roles = await seed_roles(session, departments)
            permissions = await seed_permissions(session)
            await assign_role_permissions(session, roles, permissions)
            
            print("\n" + "="*60)
            print("🎉 RBAC seeding completed successfully!")
            print("="*60)
            print(f"📊 Summary:")
            print(f"   • Departments: {len(departments)}")
            print(f"   • Roles: {len(roles)}")
            print(f"   • Permissions: {len(permissions)}")
            print("="*60)
            
        except Exception as e:
            print(f"\n❌ Error during seeding: {str(e)}")
            import traceback
            traceback.print_exc()
            await session.rollback()
        finally:
            await session.close()
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
