from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models.plan import HostingPlan
from app.schemas.pricing import (
    HostingPlanResponse,
    PlanTypeResponse,
    BillingCycleResponse,
    PricingFiltersResponse,
    PricingQuoteRequest,
    PricingQuoteResponse,
)
from decimal import Decimal
from app.models.addon import Addon
from sqlalchemy import select

router = APIRouter(prefix="/pricing", tags=["Pricing"])

@router.get("/plans", response_model=List[HostingPlanResponse])
async def get_all_plans(
    plan_type: str = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all hosting plans, optionally filtered by plan type
    """
    query = select(HostingPlan).where(HostingPlan.is_active == True)
    
    if plan_type:
        query = query.where(HostingPlan.plan_type == plan_type)
    
    query = query.order_by(HostingPlan.monthly_price)
    
    result = await db.execute(query)
    plans = result.scalars().all()
    
    return plans

@router.get("/plans/{plan_id}", response_model=HostingPlanResponse)
async def get_plan_by_id(
    plan_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific hosting plan by ID
    """
    result = await db.execute(
        select(HostingPlan).where(HostingPlan.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return plan

@router.get("/plan-types", response_model=List[PlanTypeResponse])
async def get_plan_types():
    """
    Get all available plan types with metadata
    """
    return [
        {
            "id": "general_purpose",
            "name": "General Purpose VM",
            "icon": "Server",
            "color": "blue",
            "description": "Balanced CPU and memory resources perfect for web applications"
        },
        {
            "id": "cpu_optimized",
            "name": "CPU Optimized VM",
            "icon": "Zap",
            "color": "orange",
            "description": "Dedicated CPU cores with high-performance Intel Xeon processors"
        },
        {
            "id": "memory_optimized",
            "name": "Memory Optimized VM",
            "icon": "Database",
            "color": "green",
            "description": "High memory-to-CPU ratio for memory-intensive applications"
        }
    ]

@router.get("/billing-cycles", response_model=List[BillingCycleResponse])
async def get_billing_cycles():
    """
    Get all available billing cycles with discounts
    """
    return [
        {"id": "monthly", "name": "Monthly", "discount": 5, "months": 1},
        {"id": "quarterly", "name": "Quarterly", "discount": 10, "months": 3},
        {"id": "semiannually", "name": "Semi-Annually", "discount": 15, "months": 6},
        {"id": "annually", "name": "Annually", "discount": 20, "months": 12},
        {"id": "biennially", "name": "Biennially", "discount": 25, "months": 24},
        {"id": "triennially", "name": "Triennially", "discount": 35, "months": 36}
    ]

@router.get("/filters", response_model=PricingFiltersResponse)
async def get_pricing_filters():
    """
    Get all filters (plan types and billing cycles) in one call
    """
    return {
        "plan_types": await get_plan_types(),
        "billing_cycles": await get_billing_cycles()
    }


@router.post("/quote", response_model=PricingQuoteResponse)
async def get_pricing_quote(
    payload: PricingQuoteRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Calculate a pricing quote for a given plan, billing cycle and selected add-ons.

    This endpoint is designed to be used by the checkout page so the summary is
    computed on the backend instead of only on the UI.
    """
    # 1) Fetch plan
    plan_result = await db.execute(select(HostingPlan).where(HostingPlan.id == payload.plan_id))
    plan = plan_result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # 2) Helper to get addon price by slug with a fallback
    async def addon_price(slug: str, fallback: Decimal) -> Decimal:
        try:
            res = await db.execute(select(Addon).where(Addon.slug == slug, Addon.is_active == True))
            addon = res.scalar_one_or_none()
            if addon and addon.price is not None:
                return Decimal(str(addon.price))
        except Exception:
            pass
        return Decimal(str(fallback))

    qty = max(1, payload.quantity or 1)

    # 3) Base monthly and addons monthly
    base_monthly = Decimal(str(plan.monthly_price))

    addons_monthly = Decimal('0')
    # IPv4
    if payload.additional_ipv4 and payload.additional_ipv4 > 0:
        price_per_ip = await addon_price('additional-ipv4', Decimal('200'))
        addons_monthly += price_per_ip * Decimal(str(payload.additional_ipv4))

    # Extra storage (₹2/GB)
    if payload.extra_storage_gb and payload.extra_storage_gb > 0:
        price_per_gb = await addon_price('extra-storage', Decimal('2'))
        addons_monthly += price_per_gb * Decimal(str(payload.extra_storage_gb))

    # Extra bandwidth (₹100/TB)
    if payload.extra_bandwidth_tb and payload.extra_bandwidth_tb > 0:
        price_per_tb = await addon_price('extra-bandwidth', Decimal('100'))
        addons_monthly += price_per_tb * Decimal(str(payload.extra_bandwidth_tb))

    # Plesk license
    if payload.plesk_addon == 'admin':
        addons_monthly += await addon_price('plesk-admin', Decimal('950'))
    elif payload.plesk_addon == 'pro':
        addons_monthly += await addon_price('plesk-pro', Decimal('1750'))
    elif payload.plesk_addon == 'host':
        addons_monthly += await addon_price('plesk-host', Decimal('2650'))

    # Backup storage tiers
    backup_map = {
        '100gb': Decimal('750'),
        '200gb': Decimal('1500'),
        '300gb': Decimal('2250'),
        '500gb': Decimal('3750'),
        '1000gb': Decimal('7500'),
    }
    if payload.backup_storage in backup_map:
        addons_monthly += backup_map[payload.backup_storage]

    # SSL certificates are annual; convert to monthly
    ssl_annual_map = {
        'essential': Decimal('2700'),
        'essential-wildcard': Decimal('13945.61'),
        'comodo': Decimal('2500'),
        'comodo-wildcard': Decimal('13005.86'),
        'rapid': Decimal('3000'),
        'rapid-wildcard': Decimal('16452.72'),
    }
    if payload.ssl_certificate in ssl_annual_map:
        addons_monthly += (ssl_annual_map[payload.ssl_certificate] / Decimal('12')).quantize(Decimal('1'))

    # Support packages
    if payload.support_package == 'basic':
        addons_monthly += await addon_price('support-basic', Decimal('2500'))
    elif payload.support_package == 'premium':
        addons_monthly += await addon_price('support-premium', Decimal('7500'))

    # Managed services
    if payload.managed_service == 'basic':
        addons_monthly += await addon_price('managed-basic', Decimal('2000'))
    elif payload.managed_service == 'premium':
        addons_monthly += await addon_price('managed-premium', Decimal('5000'))

    # DDoS protection
    if payload.ddos_protection == 'advanced':
        addons_monthly += await addon_price('ddos-advanced', Decimal('1000'))
    elif payload.ddos_protection == 'enterprise':
        addons_monthly += await addon_price('ddos-enterprise', Decimal('3000'))

    # 4) Cycle months and discount
    cycle_map = {
        'monthly': (1, 'Monthly', Decimal('5')),
        'quarterly': (3, 'Quarterly', Decimal('10')),
        'semiannually': (6, 'Semiannually', Decimal('15')),
        'annually': (12, 'Annually', Decimal('20')),
        'biennially': (24, 'Biennially', Decimal('25')),
        'triennially': (36, 'Triennially', Decimal('35')),
    }
    months, label, discount_percent = cycle_map.get(payload.billing_cycle, (1, 'Monthly', Decimal('0')))

    # 5) Subtotals and totals
    per_server_monthly = base_monthly + addons_monthly
    subtotal_before_discount = per_server_monthly * Decimal(str(months)) * Decimal(str(qty))

    discount_amount = (subtotal_before_discount * discount_percent / Decimal('100')).quantize(Decimal('1.00')) if discount_percent > 0 else Decimal('0.00')
    subtotal_after_discount = subtotal_before_discount - discount_amount

    tax_percent = Decimal('18.00')
    tax_amount = (subtotal_after_discount * tax_percent / Decimal('100')).quantize(Decimal('1.00'))
    total = subtotal_after_discount + tax_amount

    return {
        'success': True,
        'quote': {
            'cycle_label': label,
            'cycle_months': months,
            'base_monthly': base_monthly,
            'addons_monthly': addons_monthly,
            'subtotal_before_discount': subtotal_before_discount,
            'discount_percent': discount_percent,
            'discount_amount': discount_amount,
            'subtotal_after_discount': subtotal_after_discount,
            'tax_percent': tax_percent,
            'tax_amount': tax_amount,
            'total': total,
            'currency': 'INR',
        }
    }
