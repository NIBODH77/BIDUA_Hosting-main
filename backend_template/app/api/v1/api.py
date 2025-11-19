from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, plans, servers, orders, 
    invoices, settings, billing, 
    dashboard, referrals, payments, attachments, admin, affiliate, addons
)
from app.api.v1.endpoints import support_enhanced as support
from app.api.v1 import pricing, countries

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(plans.router, prefix="/plans", tags=["plans"])
api_router.include_router(pricing.router, tags=["Pricing"])
api_router.include_router(countries.router, tags=["Countries"])
api_router.include_router(addons.router, prefix="/addons", tags=["addons"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])

api_router.include_router(servers.router, prefix="/servers", tags=["servers"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["invoices"])
api_router.include_router(referrals.router, prefix="/referrals", tags=["referrals"])
api_router.include_router(affiliate.router, prefix="/affiliate", tags=["affiliate"])  # New affiliate system
api_router.include_router(support.router, prefix="/support", tags=["support"])
api_router.include_router(attachments.router, prefix="/attachments", tags=["attachments"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])