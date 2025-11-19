"""
Base file that imports all models for Alembic migrations.
This consolidates all SQLAlchemy models so Alembic can auto-detect them.
"""

from app.core.database import Base

# Import all model files so metadata is registered
from app.models.users import UserProfile
from app.models.server import Server
from app.models.plan import HostingPlan
from app.models.order import Order
from app.models.invoice import Invoice
from app.models.billing import PaymentMethod, BillingSettings
from app.models.referrals import  ReferralEarning, ReferralPayout
from app.models.support import SupportTicket
from app.models.settings import UserSettings
from app.models.countries import Country
from app.models.roles import Department, Role, Permission, UserDepartment, role_permissions, user_roles
from app.models.affiliate import (
    AffiliateSubscription, Referral, CommissionRule, Commission, Payout, AffiliateStats
)
# from app.models.payment import PaymentModel, PlanModel, SubscriptionModel

__all__ = [
    "Base",
    "UserProfile",
    "Server",
    "HostingPlan",
    "Order",
    "Invoice",
    "PaymentMethod",
    "BillingSettings",
    "ReferralEarning", "ReferralPayout",
    "SupportTicket",
    "UserSettings",
    "Country",
    "Department", "Role", "Permission", "UserDepartment",
    "AffiliateSubscription", "Referral", "CommissionRule", "Commission", "Payout", "AffiliateStats",
]

# Optional debug info
if __name__ == "__main__":
    print("✅ All models imported successfully in base.py")
    print(f"📊 Total tables in metadata: {len(Base.metadata.tables)}")
    for table_name in Base.metadata.tables.keys():
        print(f"   - {table_name}")
