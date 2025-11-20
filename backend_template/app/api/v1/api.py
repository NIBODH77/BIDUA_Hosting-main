from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, plans, orders, servers, 
    billing, dashboard, payments, 
    referrals, affiliate, admin, settings,
    invoices, addons, admin_pricing, attachments,
    support_enhanced, countries, services
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(plans.router, prefix="/plans", tags=["plans"])
api_router.include_router(addons.router, prefix="/addons", tags=["addons"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(admin_pricing.router, prefix="/admin/pricing", tags=["admin-pricing"])
api_router.include_router(attachments.router, prefix="/attachments", tags=["attachments"])
api_router.include_router(support_enhanced.router, prefix="/support-enhanced", tags=["support-enhanced"])
api_router.include_router(countries.router, prefix="/countries", tags=["countries"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])

api_router.include_router(servers.router, prefix="/servers", tags=["servers"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["invoices"])
api_router.include_router(referrals.router, prefix="/referrals", tags=["referrals"])
api_router.include_router(affiliate.router, prefix="/affiliate", tags=["affiliate"])  # New affiliate system
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])