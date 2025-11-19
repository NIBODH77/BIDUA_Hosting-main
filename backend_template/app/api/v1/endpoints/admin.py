from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from datetime import datetime, timedelta
from typing import Dict, Any, List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.users import UserProfile
from app.models.server import Server
from app.models.order import Order
from app.models.support import SupportTicket
from app.models.affiliate import Referral
from app.models.roles import Department, Role, Permission, UserDepartment, user_roles
from app.models.plan import HostingPlan
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


# Pydantic schemas for employee management
class DepartmentCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_active: bool = True

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class RoleCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    department_id: Optional[int] = None
    is_active: bool = True
    level: int = 0

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None
    level: Optional[int] = None

class EmployeeCreate(BaseModel):
    email: str
    full_name: str
    password: str
    role: str = "employee"
    department_id: Optional[int] = None

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    department_id: Optional[int] = None
    account_status: Optional[str] = None

class PlanCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    plan_type: str = "vps"
    vcpu: int
    ram_gb: int
    storage_gb: int
    bandwidth_gb: int
    base_price: float
    is_active: bool = True
    features: List[str] = []

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    plan_type: Optional[str] = None
    vcpu: Optional[int] = None
    ram_gb: Optional[int] = None
    storage_gb: Optional[int] = None
    bandwidth_gb: Optional[int] = None
    base_price: Optional[float] = None
    is_active: Optional[bool] = None
    features: Optional[List[str]] = None


def require_admin(current_user: UserProfile = Depends(get_current_user)):
    """Dependency to ensure user is admin or super_admin"""
    if current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/stats")
async def get_admin_stats(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get admin dashboard statistics"""
    
    # Get total users count
    users_stmt = select(func.count(UserProfile.id))
    users_result = await db.execute(users_stmt)
    total_users = users_result.scalar() or 0
    
    # Get users created this month
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    users_this_month_stmt = select(func.count(UserProfile.id)).where(
        UserProfile.created_at >= current_month_start
    )
    users_this_month_result = await db.execute(users_this_month_stmt)
    users_this_month = users_this_month_result.scalar() or 0
    
    # Get active servers count
    servers_stmt = select(func.count(Server.id)).where(Server.server_status == 'active')
    servers_result = await db.execute(servers_stmt)
    active_servers = servers_result.scalar() or 0
    
    # Get total servers count
    total_servers_stmt = select(func.count(Server.id))
    total_servers_result = await db.execute(total_servers_stmt)
    total_servers = total_servers_result.scalar() or 0
    
    # Get total orders count
    orders_stmt = select(func.count(Order.id))
    orders_result = await db.execute(orders_stmt)
    total_orders = orders_result.scalar() or 0
    
    # Get monthly revenue (sum of completed orders this month)
    monthly_revenue_stmt = select(func.sum(Order.total_amount)).where(
        and_(
            Order.created_at >= current_month_start,
            Order.order_status == 'completed'
        )
    )
    monthly_revenue_result = await db.execute(monthly_revenue_stmt)
    monthly_revenue = float(monthly_revenue_result.scalar() or 0)
    
    # Get open support tickets
    open_tickets_stmt = select(func.count(SupportTicket.id)).where(
        SupportTicket.status.in_(['open', 'in_progress'])
    )
    open_tickets_result = await db.execute(open_tickets_stmt)
    open_tickets = open_tickets_result.scalar() or 0
    
    # Get referral program status
    referrals_stmt = select(func.count(Referral.id)).where(Referral.status == 'active')
    referrals_result = await db.execute(referrals_stmt)
    active_referrals = referrals_result.scalar() or 0
    
    return {
        "total_users": total_users,
        "users_this_month": users_this_month,
        "active_servers": active_servers,
        "total_servers": total_servers,
        "total_orders": total_orders,
        "monthly_revenue": monthly_revenue,
        "open_tickets": open_tickets,
        "active_referrals": active_referrals,
        "referral_status": "Active" if active_referrals > 0 else "Inactive"
    }


@router.get("/users")
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all users with pagination"""
    stmt = select(UserProfile).offset(skip).limit(limit).order_by(UserProfile.created_at.desc())
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    # Get total count
    count_stmt = select(func.count(UserProfile.id))
    count_result = await db.execute(count_stmt)
    total = count_result.scalar() or 0
    
    return {
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "account_status": user.account_status,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "referral_code": user.referral_code
            }
            for user in users
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/servers")
async def get_all_servers(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all servers with pagination"""
    stmt = select(Server).offset(skip).limit(limit).order_by(Server.created_at.desc())
    result = await db.execute(stmt)
    servers = result.scalars().all()
    
    # Get total count
    count_stmt = select(func.count(Server.id))
    count_result = await db.execute(count_stmt)
    total = count_result.scalar() or 0
    
    return {
        "servers": [
            {
                "id": server.id,
                "user_id": server.user_id,
                "hostname": server.hostname,
                "ip_address": server.ip_address,
                "status": server.status,
                "plan_id": server.plan_id,
                "created_at": server.created_at.isoformat() if server.created_at else None,
            }
            for server in servers
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/orders")
async def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all orders with pagination"""
    stmt = select(Order).offset(skip).limit(limit).order_by(Order.created_at.desc())
    result = await db.execute(stmt)
    orders = result.scalars().all()
    
    # Get total count
    count_stmt = select(func.count(Order.id))
    count_result = await db.execute(count_stmt)
    total = count_result.scalar() or 0
    
    return {
        "orders": [
            {
                "id": order.id,
                "user_id": order.user_id,
                "plan_id": order.plan_id,
                "status": order.status,
                "total_amount": float(order.total_amount) if order.total_amount else 0,
                "created_at": order.created_at.isoformat() if order.created_at else None,
            }
            for order in orders
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/tickets")
async def get_all_tickets(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all support tickets with pagination"""
    stmt = select(SupportTicket).offset(skip).limit(limit).order_by(SupportTicket.created_at.desc())
    result = await db.execute(stmt)
    tickets = result.scalars().all()

    # Get total count
    count_stmt = select(func.count(SupportTicket.id))
    count_result = await db.execute(count_stmt)
    total = count_result.scalar() or 0

    return {
        "tickets": [
            {
                "id": ticket.id,
                "user_id": ticket.user_id,
                "subject": ticket.subject,
                "status": ticket.status,
                "priority": ticket.priority,
                "category": ticket.category,
                "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
            }
            for ticket in tickets
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }


# ========================================
# DEPARTMENT MANAGEMENT ENDPOINTS
# ========================================

@router.get("/departments")
async def get_all_departments(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all departments"""
    stmt = select(Department).order_by(Department.name)
    result = await db.execute(stmt)
    departments = result.scalars().all()

    return [
        {
            "id": dept.id,
            "name": dept.name,
            "code": dept.code,
            "description": dept.description,
            "is_active": dept.is_active,
            "created_at": dept.created_at.isoformat() if dept.created_at else None,
        }
        for dept in departments
    ]


@router.post("/departments")
async def create_department(
    data: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Create a new department"""
    # Check if department with same code exists
    existing = await db.execute(select(Department).where(Department.code == data.code))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Department with this code already exists")

    dept = Department(
        name=data.name,
        code=data.code.upper(),
        description=data.description,
        is_active=data.is_active
    )
    db.add(dept)
    await db.commit()
    await db.refresh(dept)

    return {
        "id": dept.id,
        "name": dept.name,
        "code": dept.code,
        "description": dept.description,
        "is_active": dept.is_active,
        "created_at": dept.created_at.isoformat() if dept.created_at else None,
    }


@router.put("/departments/{department_id}")
async def update_department(
    department_id: int,
    data: DepartmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Update a department"""
    result = await db.execute(select(Department).where(Department.id == department_id))
    dept = result.scalar_one_or_none()

    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    if data.name is not None:
        dept.name = data.name
    if data.code is not None:
        dept.code = data.code.upper()
    if data.description is not None:
        dept.description = data.description
    if data.is_active is not None:
        dept.is_active = data.is_active

    await db.commit()
    await db.refresh(dept)

    return {
        "id": dept.id,
        "name": dept.name,
        "code": dept.code,
        "description": dept.description,
        "is_active": dept.is_active,
    }


@router.delete("/departments/{department_id}")
async def delete_department(
    department_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Delete a department"""
    result = await db.execute(select(Department).where(Department.id == department_id))
    dept = result.scalar_one_or_none()

    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    await db.delete(dept)
    await db.commit()

    return {"message": "Department deleted successfully"}


# ========================================
# ROLE MANAGEMENT ENDPOINTS
# ========================================

@router.get("/roles")
async def get_all_roles(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all roles with department info"""
    stmt = select(Role).order_by(Role.level.desc(), Role.name)
    result = await db.execute(stmt)
    roles = result.scalars().all()

    roles_list = []
    for role in roles:
        dept_name = None
        if role.department_id:
            dept_result = await db.execute(select(Department).where(Department.id == role.department_id))
            dept = dept_result.scalar_one_or_none()
            if dept:
                dept_name = dept.name

        roles_list.append({
            "id": role.id,
            "name": role.name,
            "code": role.code,
            "description": role.description,
            "department_id": role.department_id,
            "department_name": dept_name,
            "is_system_role": role.is_system_role,
            "is_active": role.is_active,
            "level": role.level,
            "created_at": role.created_at.isoformat() if role.created_at else None,
        })

    return roles_list


@router.post("/roles")
async def create_role(
    data: RoleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Create a new role"""
    # Check if role with same code exists
    existing = await db.execute(select(Role).where(Role.code == data.code))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Role with this code already exists")

    role = Role(
        name=data.name,
        code=data.code.upper(),
        description=data.description,
        department_id=data.department_id,
        is_active=data.is_active,
        level=data.level
    )
    db.add(role)
    await db.commit()
    await db.refresh(role)

    return {
        "id": role.id,
        "name": role.name,
        "code": role.code,
        "description": role.description,
        "department_id": role.department_id,
        "is_active": role.is_active,
        "level": role.level,
        "created_at": role.created_at.isoformat() if role.created_at else None,
    }


@router.put("/roles/{role_id}")
async def update_role(
    role_id: int,
    data: RoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Update a role"""
    result = await db.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if role.is_system_role:
        raise HTTPException(status_code=400, detail="Cannot modify system role")

    if data.name is not None:
        role.name = data.name
    if data.code is not None:
        role.code = data.code.upper()
    if data.description is not None:
        role.description = data.description
    if data.department_id is not None:
        role.department_id = data.department_id
    if data.is_active is not None:
        role.is_active = data.is_active
    if data.level is not None:
        role.level = data.level

    await db.commit()
    await db.refresh(role)

    return {
        "id": role.id,
        "name": role.name,
        "code": role.code,
        "description": role.description,
        "department_id": role.department_id,
        "is_active": role.is_active,
        "level": role.level,
    }


@router.delete("/roles/{role_id}")
async def delete_role(
    role_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Delete a role"""
    result = await db.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if role.is_system_role:
        raise HTTPException(status_code=400, detail="Cannot delete system role")

    await db.delete(role)
    await db.commit()

    return {"message": "Role deleted successfully"}


# ========================================
# EMPLOYEE MANAGEMENT ENDPOINTS
# ========================================

@router.get("/employees")
async def get_all_employees(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all employees (users with admin/employee/support roles)"""
    stmt = select(UserProfile).where(
        UserProfile.role.in_(['admin', 'super_admin', 'employee', 'support', 'sales', 'marketing', 'billing'])
    ).order_by(UserProfile.created_at.desc())
    result = await db.execute(stmt)
    employees = result.scalars().all()

    employee_list = []
    for emp in employees:
        # Get department assignment
        dept_stmt = select(UserDepartment).where(
            and_(UserDepartment.user_id == emp.id, UserDepartment.is_primary == True)
        )
        dept_result = await db.execute(dept_stmt)
        user_dept = dept_result.scalar_one_or_none()

        dept_name = None
        dept_id = None
        if user_dept:
            dept_info = await db.execute(select(Department).where(Department.id == user_dept.department_id))
            dept = dept_info.scalar_one_or_none()
            if dept:
                dept_name = dept.name
                dept_id = dept.id

        employee_list.append({
            "id": emp.id,
            "email": emp.email,
            "full_name": emp.full_name,
            "role": emp.role,
            "department_id": dept_id,
            "department_name": dept_name,
            "account_status": emp.account_status,
            "created_at": emp.created_at.isoformat() if emp.created_at else None,
        })

    return employee_list


@router.post("/employees")
async def create_employee(
    data: EmployeeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Create a new employee"""
    from app.utils.security_utils import get_password_hash

    # Check if email already exists
    existing = await db.execute(select(UserProfile).where(UserProfile.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create employee
    employee = UserProfile(
        email=data.email,
        full_name=data.full_name,
        hashed_password=await get_password_hash(data.password),
        role=data.role,
        account_status="active"
    )
    db.add(employee)
    await db.commit()
    await db.refresh(employee)

    # Assign to department if specified
    if data.department_id:
        user_dept = UserDepartment(
            user_id=employee.id,
            department_id=data.department_id,
            is_primary=True,
            assigned_by=current_user.id
        )
        db.add(user_dept)
        await db.commit()

    return {
        "id": employee.id,
        "email": employee.email,
        "full_name": employee.full_name,
        "role": employee.role,
        "department_id": data.department_id,
        "account_status": employee.account_status,
        "created_at": employee.created_at.isoformat() if employee.created_at else None,
    }


@router.put("/employees/{employee_id}")
async def update_employee(
    employee_id: int,
    data: EmployeeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Update an employee"""
    result = await db.execute(select(UserProfile).where(UserProfile.id == employee_id))
    employee = result.scalar_one_or_none()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if data.full_name is not None:
        employee.full_name = data.full_name
    if data.role is not None:
        employee.role = data.role
    if data.account_status is not None:
        employee.account_status = data.account_status

    # Update department assignment
    if data.department_id is not None:
        # Remove existing primary department
        del_stmt = select(UserDepartment).where(
            and_(UserDepartment.user_id == employee_id, UserDepartment.is_primary == True)
        )
        del_result = await db.execute(del_stmt)
        old_dept = del_result.scalar_one_or_none()
        if old_dept:
            await db.delete(old_dept)

        # Add new department
        if data.department_id > 0:
            user_dept = UserDepartment(
                user_id=employee_id,
                department_id=data.department_id,
                is_primary=True,
                assigned_by=current_user.id
            )
            db.add(user_dept)

    await db.commit()
    await db.refresh(employee)

    return {
        "id": employee.id,
        "email": employee.email,
        "full_name": employee.full_name,
        "role": employee.role,
        "account_status": employee.account_status,
    }


@router.delete("/employees/{employee_id}")
async def delete_employee(
    employee_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Delete an employee (deactivate)"""
    if employee_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    result = await db.execute(select(UserProfile).where(UserProfile.id == employee_id))
    employee = result.scalar_one_or_none()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Deactivate instead of hard delete
    employee.account_status = "deactivated"
    await db.commit()

    return {"message": "Employee deactivated successfully"}


# ========================================
# PLANS MANAGEMENT ENDPOINTS
# ========================================

@router.get("/plans")
async def get_all_plans_admin(
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Get all plans for admin"""
    stmt = select(HostingPlan).order_by(HostingPlan.base_price)
    result = await db.execute(stmt)
    plans = result.scalars().all()

    return [
        {
            "id": plan.id,
            "name": plan.name,
            "slug": plan.name.lower().replace(" ", "-"),  # Generate slug from name
            "description": plan.description,
            "vcpu": plan.cpu_cores,  # Map cpu_cores to vcpu for frontend
            "ram_gb": plan.ram_gb,
            "storage_gb": plan.storage_gb,
            "bandwidth_gb": plan.bandwidth_gb,
            "base_price": float(plan.base_price),
            "is_active": plan.is_active,
            "features": plan.features or [],
            "created_at": plan.created_at.isoformat() if plan.created_at else None,
        }
        for plan in plans
    ]


@router.post("/plans")
async def create_plan(
    data: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Create a new plan"""
    # Check if name already exists
    existing = await db.execute(select(HostingPlan).where(HostingPlan.name == data.name))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Plan with this name already exists")

    plan = HostingPlan(
        name=data.name,
        description=data.description,
        plan_type=data.plan_type,
        cpu_cores=data.vcpu,  # Map vcpu to cpu_cores
        ram_gb=data.ram_gb,
        storage_gb=data.storage_gb,
        bandwidth_gb=data.bandwidth_gb,
        base_price=data.base_price,
        monthly_price=data.base_price,  # Default to base_price
        quarterly_price=data.base_price * 3 * 0.95,  # 5% discount
        annual_price=data.base_price * 12 * 0.90,  # 10% discount
        biennial_price=data.base_price * 24 * 0.85,  # 15% discount
        triennial_price=data.base_price * 36 * 0.80,  # 20% discount
        is_active=data.is_active,
        features=data.features
    )
    db.add(plan)
    await db.commit()
    await db.refresh(plan)

    return {
        "id": plan.id,
        "name": plan.name,
        "slug": plan.name.lower().replace(" ", "-"),
        "description": plan.description,
        "vcpu": plan.cpu_cores,
        "ram_gb": plan.ram_gb,
        "storage_gb": plan.storage_gb,
        "bandwidth_gb": plan.bandwidth_gb,
        "base_price": float(plan.base_price),
        "is_active": plan.is_active,
        "features": plan.features or [],
        "created_at": plan.created_at.isoformat() if plan.created_at else None,
    }


@router.put("/plans/{plan_id}")
async def update_plan(
    plan_id: int,
    data: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Update a plan"""
    result = await db.execute(select(HostingPlan).where(HostingPlan.id == plan_id))
    plan = result.scalar_one_or_none()

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    if data.name is not None:
        plan.name = data.name
    if data.description is not None:
        plan.description = data.description
    if data.plan_type is not None:
        plan.plan_type = data.plan_type
    if data.vcpu is not None:
        plan.cpu_cores = data.vcpu  # Map vcpu to cpu_cores
    if data.ram_gb is not None:
        plan.ram_gb = data.ram_gb
    if data.storage_gb is not None:
        plan.storage_gb = data.storage_gb
    if data.bandwidth_gb is not None:
        plan.bandwidth_gb = data.bandwidth_gb
    if data.base_price is not None:
        plan.base_price = data.base_price
        plan.monthly_price = data.base_price
        plan.quarterly_price = data.base_price * 3 * 0.95
        plan.annual_price = data.base_price * 12 * 0.90
        plan.biennial_price = data.base_price * 24 * 0.85
        plan.triennial_price = data.base_price * 36 * 0.80
    if data.is_active is not None:
        plan.is_active = data.is_active
    if data.features is not None:
        plan.features = data.features

    await db.commit()
    await db.refresh(plan)

    return {
        "id": plan.id,
        "name": plan.name,
        "slug": plan.name.lower().replace(" ", "-"),
        "description": plan.description,
        "vcpu": plan.cpu_cores,
        "ram_gb": plan.ram_gb,
        "storage_gb": plan.storage_gb,
        "bandwidth_gb": plan.bandwidth_gb,
        "base_price": float(plan.base_price),
        "is_active": plan.is_active,
        "features": plan.features or [],
    }


@router.delete("/plans/{plan_id}")
async def delete_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """Delete a plan"""
    result = await db.execute(select(HostingPlan).where(HostingPlan.id == plan_id))
    plan = result.scalar_one_or_none()

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Check if plan is in use
    servers_using = await db.execute(select(func.count(Server.id)).where(Server.plan_id == plan_id))
    if servers_using.scalar() > 0:
        raise HTTPException(status_code=400, detail="Cannot delete plan that is in use by servers")

    await db.delete(plan)
    await db.commit()

    return {"message": "Plan deleted successfully"}
