from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.user_service import UserService
from app.services.server_service import ServerService
from app.services.order_service import OrderService
from app.services.support_service import SupportService
from app.services.invoice_service import InvoiceService
from app.schemas.dashboard import DashboardResponse, CustomerDashboard, AdminDashboard
from app.schemas.users import User


router = APIRouter()



@router.get("/overview", response_model=CustomerDashboard)
async def get_customer_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get customer dashboard overview
    """
    try:
        # Initialize services manually (avoid dependency injection issues)
        server_service = ServerService()
        invoice_service = InvoiceService()
        support_service = SupportService()

        # ✅ Await all async service methods
        active_servers = await server_service.get_user_active_servers_count(db, current_user.id)
        monthly_cost = await invoice_service.get_user_monthly_cost(db, current_user.id)
        open_tickets = await support_service.get_user_open_tickets_count(db, current_user.id)
        bandwidth_used = await server_service.get_user_bandwidth_used(db, current_user.id)

        recent_servers = await server_service.get_user_recent_servers(db, current_user.id, limit=3)
        recent_invoices = await invoice_service.get_user_recent_invoices(db, current_user.id, limit=2)

        return CustomerDashboard(
            active_servers=active_servers,
            monthly_cost=monthly_cost,
            open_tickets=open_tickets,
            bandwidth_used=bandwidth_used,
            recent_servers=recent_servers,
            recent_invoices=recent_invoices
        )

    except Exception as e:
        import traceback
        print("❌ DASHBOARD ERROR:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard data: {str(e)}")



@router.get("/admin", response_model=AdminDashboard)
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Get admin dashboard overview
    """
    try:
        # Import inside to avoid circular dependencies
        from app.services.referral_service import ReferralService

        # Initialize services
        user_service = UserService()
        server_service = ServerService()
        order_service = OrderService()
        support_service = SupportService()
        invoice_service = InvoiceService()
        referral_service = ReferralService()

        # Await all async service methods
        user_stats = await user_service.get_user_stats(db)
        server_stats = await server_service.get_server_stats(db)
        order_stats = await order_service.get_order_stats(db)
        invoice_stats = await invoice_service.get_invoice_stats(db)
        support_stats = await support_service.get_support_stats(db)
        referral_stats = await referral_service.get_admin_referral_stats(db)
        recent_activity = await user_service.get_recent_activity(db, limit=10)

        # Return combined dashboard response
        return AdminDashboard(
            user_stats=user_stats,
            server_stats=server_stats,
            order_stats=order_stats,
            invoice_stats=invoice_stats,
            support_stats=support_stats,
            referral_stats=referral_stats,
            recent_activity=recent_activity
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching admin dashboard: {str(e)}"
        )


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get basic dashboard statistics
    """
    try:
        server_service = ServerService()
        invoice_service = InvoiceService()
        support_service = SupportService()
        
        if current_user.role in ["admin", "super_admin"]:
            # Admin stats
            from app.services.user_service import UserService
            from app.services.order_service import OrderService
            
            user_service = UserService()
            order_service = OrderService()
            
            # ✅ await every async function
            total_users = await user_service.get_total_users(db)
            active_servers = await server_service.get_active_servers_count(db)
            total_orders = await order_service.get_total_orders(db)
            open_tickets = await support_service.get_open_tickets_count(db)
            monthly_revenue = await invoice_service.get_monthly_revenue(db)
            new_users = await user_service.get_new_users_this_month(db)
            
            return {
                "total_users": total_users,
                "active_servers": active_servers,
                "total_orders": total_orders,
                "open_tickets": open_tickets,
                "monthly_revenue": float(monthly_revenue),
                "new_users_this_month": new_users
            }
        
        else:
            # Customer stats
            active_servers = await server_service.get_user_active_servers_count(db, current_user.id)
            monthly_cost = await invoice_service.get_user_monthly_cost(db, current_user.id)
            open_tickets = await support_service.get_user_open_tickets_count(db, current_user.id)
            bandwidth_used = await server_service.get_user_bandwidth_used(db, current_user.id)
            
            return {
                "active_servers": active_servers,
                "monthly_cost": float(monthly_cost),
                "open_tickets": open_tickets,
                "bandwidth_used": float(bandwidth_used)
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")




