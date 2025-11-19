from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

class HostingPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    plan_type: str
    cpu_cores: int
    ram_gb: int
    storage_gb: int
    bandwidth_gb: int
    base_price: Decimal
    monthly_price: Decimal
    quarterly_price: Decimal
    annual_price: Decimal
    biennial_price: Decimal
    triennial_price: Decimal
    is_active: bool = True
    is_featured: bool = False
    features: Optional[List[str]] = None

class HostingPlanResponse(HostingPlanBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PlanTypeResponse(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    description: str

class BillingCycleResponse(BaseModel):
    id: str
    name: str
    discount: int
    months: int

class PricingFiltersResponse(BaseModel):
    plan_types: List[PlanTypeResponse]
    billing_cycles: List[BillingCycleResponse]

class CalculatorAddonResponse(BaseModel):
    id: str
    name: str
    description: str
    unit: str
    price_per_unit: Decimal
    min_value: int
    max_value: int
    default_value: int

# --- Pricing Quote (for Checkout summary) ---
class PricingQuoteRequest(BaseModel):
    plan_id: int
    billing_cycle: str  # monthly | quarterly | semiannually | annually | biennially | triennially
    quantity: int = 1
    # Selected add-ons from the configurator
    additional_ipv4: int = 0
    extra_storage_gb: int = 0
    extra_bandwidth_tb: int = 0
    plesk_addon: str = ''  # '', 'admin', 'pro', 'host'
    backup_storage: str = ''  # '', '100gb','200gb','300gb','500gb','1000gb'
    ssl_certificate: str = ''  # '', 'essential','essential-wildcard','comodo','comodo-wildcard','rapid','rapid-wildcard'
    support_package: str = ''  # '', 'basic','premium'
    managed_service: str = 'self'  # 'self','basic','premium'
    ddos_protection: str = 'basic'  # 'basic','advanced','enterprise'

class PricingQuoteBreakdown(BaseModel):
    cycle_label: str
    cycle_months: int
    base_monthly: Decimal
    addons_monthly: Decimal
    subtotal_before_discount: Decimal  # monthly * months
    discount_percent: Decimal
    discount_amount: Decimal
    subtotal_after_discount: Decimal
    tax_percent: Decimal
    tax_amount: Decimal
    total: Decimal
    currency: str = 'INR'

class PricingQuoteResponse(BaseModel):
    success: bool
    quote: PricingQuoteBreakdown
