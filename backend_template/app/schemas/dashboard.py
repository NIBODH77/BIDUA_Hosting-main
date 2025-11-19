# from pydantic import BaseModel
# from typing import List, Optional
# from datetime import datetime
# from decimal import Decimal
# from .users import UserStats
# from .server import ServerStats
# from .order import OrderSummary
# from .invoice import InvoiceStats
# from .support import SupportStats
# from .referrals import ReferralStats


# class DashboardStats(BaseModel):
#     total_users: int
#     active_servers: int
#     total_orders: int
#     open_tickets: int
#     monthly_revenue: Decimal
#     new_users_this_month: int

# class RecentActivity(BaseModel):
#     id: str
#     type: str
#     message: str
#     time: str
#     user_id: Optional[int] = None
#     user_name: Optional[str] = None

# class DashboardResponse(BaseModel):
#     stats: DashboardStats
#     recent_activity: List[RecentActivity]

# class CustomerDashboard(BaseModel):
#     active_servers: int
#     monthly_cost: Decimal
#     open_tickets: int
#     bandwidth_used: Decimal
#     recent_servers: List[dict]
#     recent_invoices: List[dict]

# class AdminDashboard(BaseModel):
#     user_stats: UserStats
#     server_stats: ServerStats
#     order_stats: OrderSummary
#     invoice_stats: InvoiceStats
#     support_stats: SupportStats
#     referral_stats: ReferralStats
#     recent_activity: List[RecentActivity]

# class SystemHealth(BaseModel):
#     status: str
#     uptime: float
#     response_time: float
#     database_status: str
#     api_status: str
#     last_checked: datetime

# class RevenueChartData(BaseModel):
#     period: str
#     revenue: Decimal
#     orders: int

# class UserGrowthData(BaseModel):
#     period: str
#     new_users: int
#     total_users: int




# class ReferralStats(BaseModel):
#     total_referrals: int = 0
#     successful_referrals: int = 0
#     pending_referrals: int = 0
#     total_commission: Optional[Decimal] = Decimal("0.00")



# app/schemas/dashboard.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# from .users import UserStats
# from .server import ServerStats
# from .order import OrderSummary
# from .invoice import InvoiceStats
# from .support import SupportStats
# from .referrals import ReferralStats
from typing import List, Dict, Any, Optional


# ✅ Generic small stat schema
class DashboardStats(BaseModel):
    total_users: int
    active_servers: int
    total_orders: int
    open_tickets: int
    monthly_revenue: Decimal
    new_users_this_month: int


# ✅ Activity log model
class RecentActivity(BaseModel):
    id: str
    type: str
    message: str
    time: datetime
    user_id: Optional[int] = None
    user_name: Optional[str] = None


# ✅ General dashboard response
class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_activity: List[RecentActivity]


# # ✅ Customer Dashboard
# class CustomerDashboard(BaseModel):
#     active_servers: int
#     monthly_cost: Decimal
#     open_tickets: int
#     bandwidth_used: Decimal
#     recent_servers: List[dict]
#     recent_invoices: List[dict]


# # ✅ Admin Dashboard (used in /admin endpoint)
# class AdminDashboard(BaseModel):
#     user_stats: UserStats
#     server_stats: ServerStats
#     order_stats: OrderSummary
#     invoice_stats: InvoiceStats
#     support_stats: SupportStats
#     referral_stats: ReferralStats
#     recent_activity: List[RecentActivity]





class CustomerDashboard(BaseModel):
    active_servers: int
    monthly_cost: Decimal
    open_tickets: int
    bandwidth_used: float
    recent_servers: List[Dict[str, Any]]
    recent_invoices: List[Dict[str, Any]]

class AdminDashboard(BaseModel):
    user_stats: Dict[str, Any]
    server_stats: Dict[str, Any]
    order_stats: Dict[str, Any]
    invoice_stats: Dict[str, Any]
    support_stats: Dict[str, Any]
    referral_stats: Dict[str, Any]
    recent_activity: List[Dict[str, Any]]

class DashboardResponse(BaseModel):
    message: str
    data: Dict[str, Any]

# ✅ Optional system health and analytics schemas
class SystemHealth(BaseModel):
    status: str
    uptime: float
    response_time: float
    database_status: str
    api_status: str
    last_checked: datetime


class RevenueChartData(BaseModel):
    period: str
    revenue: Decimal
    orders: int


class UserGrowthData(BaseModel):
    period: str
    new_users: int
    total_users: int
