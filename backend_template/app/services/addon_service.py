"""
Addon service for managing addon pricing and validation
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional, Dict
from decimal import Decimal

from app.models.addon import Addon, AddonCategory
from app.schemas.addon import AddonCreate, AddonUpdate, ServerConfigValidation, PriceBreakdown


class AddonService:
    """Service for addon operations"""
    
    async def create_addon(self, db: AsyncSession, addon_data: AddonCreate) -> Addon:
        """Create a new addon"""
        addon = Addon(**addon_data.dict())
        db.add(addon)
        await db.commit()
        await db.refresh(addon)
        return addon
    
    async def get_addon_by_id(self, db: AsyncSession, addon_id: int) -> Optional[Addon]:
        """Get addon by ID"""
        result = await db.execute(
            select(Addon).where(Addon.id == addon_id)
        )
        return result.scalars().first()
    
    async def get_addon_by_slug(self, db: AsyncSession, slug: str) -> Optional[Addon]:
        """Get addon by slug"""
        result = await db.execute(
            select(Addon).where(Addon.slug == slug, Addon.is_active == True)
        )
        return result.scalars().first()
    
    async def get_all_addons(
        self, 
        db: AsyncSession, 
        category: Optional[str] = None,
        active_only: bool = True
    ) -> List[Addon]:
        """Get all addons, optionally filtered by category"""
        query = select(Addon)
        
        if active_only:
            query = query.where(Addon.is_active == True)
        
        if category:
            query = query.where(Addon.category == category)
        
        query = query.order_by(Addon.sort_order, Addon.name)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    async def update_addon(
        self, 
        db: AsyncSession, 
        addon_id: int, 
        addon_data: AddonUpdate
    ) -> Optional[Addon]:
        """Update an addon"""
        addon = await self.get_addon_by_id(db, addon_id)
        if not addon:
            return None
        
        update_data = addon_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(addon, field, value)
        
        await db.commit()
        await db.refresh(addon)
        return addon
    
    async def delete_addon(self, db: AsyncSession, addon_id: int) -> bool:
        """Soft delete an addon (set is_active to False)"""
        addon = await self.get_addon_by_id(db, addon_id)
        if not addon:
            return False
        
        addon.is_active = False
        await db.commit()
        return True
    
    async def calculate_addon_price(
        self,
        db: AsyncSession,
        addon_slug: str,
        quantity: int
    ) -> Decimal:
        """Calculate price for an addon based on quantity"""
        addon = await self.get_addon_by_slug(db, addon_slug)
        if not addon:
            return Decimal('0')
        
        # Validate quantity constraints
        if quantity < addon.min_quantity:
            quantity = addon.min_quantity
        
        if addon.max_quantity and quantity > addon.max_quantity:
            quantity = addon.max_quantity
        
        total = Decimal(str(addon.price)) * Decimal(str(quantity))
        return total
    
    async def validate_and_calculate_server_price(
        self,
        db: AsyncSession,
        server_config: ServerConfigValidation,
        base_plan_price: Decimal,
        user_discount_percent: Decimal = Decimal('0')
    ) -> PriceBreakdown:
        """
        Validate server configuration and calculate total price
        This is the SINGLE SOURCE OF TRUTH for pricing
        """
        addon_costs = {}
        
        # Extra Storage (₹2/GB/month)
        if server_config.extra_storage > 0:
            storage_addon = await self.get_addon_by_slug(db, 'extra-storage')
            if storage_addon:
                cost = Decimal(str(storage_addon.price)) * Decimal(str(server_config.extra_storage))
                addon_costs['Extra Storage'] = float(cost)
        
        # Extra Bandwidth (₹100/TB/month)
        if server_config.extra_bandwidth > 0:
            bandwidth_addon = await self.get_addon_by_slug(db, 'extra-bandwidth')
            if bandwidth_addon:
                cost = Decimal(str(bandwidth_addon.price)) * Decimal(str(server_config.extra_bandwidth))
                addon_costs['Extra Bandwidth'] = float(cost)
        
        # Additional IPv4
        if server_config.additional_ipv4 > 0:
            ipv4_addon = await self.get_addon_by_slug(db, 'additional-ipv4')
            if ipv4_addon:
                cost = Decimal(str(ipv4_addon.price)) * Decimal(str(server_config.additional_ipv4))
                addon_costs['Additional IPv4'] = float(cost)
        
        # Plesk Control Panel
        if server_config.plesk_addon:
            plesk_slug = f'plesk-{server_config.plesk_addon}'
            plesk_addon = await self.get_addon_by_slug(db, plesk_slug)
            if plesk_addon:
                addon_costs[f'Plesk {server_config.plesk_addon.title()}'] = float(plesk_addon.price)
        
        # Backup Storage
        if server_config.backup_storage:
            backup_slug = f'backup-{server_config.backup_storage}'
            backup_addon = await self.get_addon_by_slug(db, backup_slug)
            if backup_addon:
                addon_costs[f'Backup Storage {server_config.backup_storage.upper()}'] = float(backup_addon.price)
        
        # SSL Certificate
        if server_config.ssl_certificate:
            ssl_slug = f'ssl-{server_config.ssl_certificate}'
            ssl_addon = await self.get_addon_by_slug(db, ssl_slug)
            if ssl_addon:
                # SSL is annual, convert to monthly
                monthly_cost = Decimal(str(ssl_addon.price)) / Decimal('12')
                addon_costs[f'SSL {server_config.ssl_certificate.replace("-", " ").title()}'] = float(monthly_cost)
        
        # Support Package
        if server_config.support_package:
            support_slug = f'support-{server_config.support_package}'
            support_addon = await self.get_addon_by_slug(db, support_slug)
            if support_addon:
                addon_costs[f'Support {server_config.support_package.title()}'] = float(support_addon.price)
        
        # Managed Service
        if server_config.managed_service and server_config.managed_service != 'self':
            managed_slug = f'managed-{server_config.managed_service}'
            managed_addon = await self.get_addon_by_slug(db, managed_slug)
            if managed_addon:
                addon_costs[f'Managed {server_config.managed_service.title()}'] = float(managed_addon.price)
        
        # DDoS Protection
        if server_config.ddos_protection and server_config.ddos_protection != 'basic':
            ddos_slug = f'ddos-{server_config.ddos_protection}'
            ddos_addon = await self.get_addon_by_slug(db, ddos_slug)
            if ddos_addon:
                addon_costs[f'DDoS {server_config.ddos_protection.title()}'] = float(ddos_addon.price)
        
        # Calculate totals
        addon_total = Decimal(str(sum(addon_costs.values())))
        per_server_cost = base_plan_price + addon_total
        subtotal = per_server_cost * Decimal(str(server_config.quantity))
        
        # Apply discount
        discount_amount = Decimal('0')
        if user_discount_percent > 0:
            discount_amount = subtotal * (user_discount_percent / Decimal('100'))
        
        taxable_amount = subtotal - discount_amount
        
        # Calculate 18% GST
        tax_amount = taxable_amount * Decimal('0.18')
        
        total = taxable_amount + tax_amount
        
        return PriceBreakdown(
            base_price=float(base_plan_price),
            addon_costs=addon_costs,
            subtotal=float(subtotal),
            discount=float(discount_amount),
            tax=float(tax_amount),
            total=float(total),
            currency='INR'
        )
