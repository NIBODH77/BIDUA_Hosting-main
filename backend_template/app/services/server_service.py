




from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal

from app.models.server import Server
from app.models.plan import HostingPlan
from app.models.order import Order
from app.schemas.server import ServerCreate, ServerUpdate, ServerStats


class ServerService:
    """Async service layer for managing servers and related stats."""

    # --------------------------------------------------------
    # ✅ User-specific queries
    # --------------------------------------------------------
    async def get_user_servers(self, db: AsyncSession, user_id: int) -> List[Dict[str, Any]]:
        result = await db.execute(
            select(Server)
            .options(
                selectinload(Server.user),
                selectinload(Server.plan)
            )
            .where(Server.user_id == user_id)
        )
        servers = result.scalars().all()
        
        # Enrich each server with addon and service details
        enriched_servers = []
        for server in servers:
            addon_details = []
            service_details = []
            
            if server.specs:
                addon_ids = server.specs.get('addon_ids', [])
                service_ids = server.specs.get('service_ids', [])
                
                if addon_ids:
                    addon_details = await self.get_addons_from_ids(db, addon_ids)
                
                if service_ids:
                    service_details = await self.get_services_from_ids(db, service_ids)
            
            server_dict = {
                "id": server.id,
                "user_id": server.user_id,
                "order_id": server.order_id,
                "server_name": server.server_name,
                "hostname": server.hostname or "",
                "ip_address": server.ip_address,
                "server_status": server.server_status,
                "server_type": server.server_type or "vps",
                "vcpu": server.vcpu or 1,
                "ram_gb": server.ram_gb,
                "storage_gb": server.storage_gb,
                "bandwidth_gb": server.bandwidth_gb or 1000,
                "operating_system": server.operating_system,
                "plan_id": server.plan_id or 0,
                "plan_name": server.plan_name or "",
                "monthly_cost": float(server.monthly_cost) if server.monthly_cost else 0.0,
                "billing_cycle": server.billing_cycle or "monthly",
                "created_date": server.created_date,
                "expiry_date": server.expiry_date,
                "specs": server.specs,
                "notes": server.notes,
                "created_at": server.created_at,
                "updated_at": server.updated_at,
                "addons": addon_details,
                "services": service_details
            }
            
            enriched_servers.append(server_dict)
        
        return enriched_servers

    async def get_user_active_servers(self, db: AsyncSession, user_id: int) -> List[Server]:
        result = await db.execute(
            select(Server).where(
                Server.user_id == user_id,
                Server.server_status == "active",
            )
        )
        return result.scalars().all()

    async def get_user_server(self, db: AsyncSession, user_id: int, server_id: int) -> Optional[Dict[str, Any]]:
        result = await db.execute(
            select(Server).where(
                Server.id == server_id,
                Server.user_id == user_id,
            )
        )
        server = result.scalar_one_or_none()
        
        if not server:
            return None
        
        # Fetch addon and service details if they exist in specs
        addon_details = []
        service_details = []
        
        print(f"🔍 Server {server.id} specs: {server.specs}")
        
        if server.specs:
            addon_ids = server.specs.get('addon_ids', [])
            service_ids = server.specs.get('service_ids', [])
            
            print(f"📦 Found addon_ids: {addon_ids}")
            print(f"🔧 Found service_ids: {service_ids}")
            
            if addon_ids:
                addon_details = await self.get_addons_from_ids(db, addon_ids)
                print(f"✅ Fetched {len(addon_details)} addons")
            
            if service_ids:
                service_details = await self.get_services_from_ids(db, service_ids)
                print(f"✅ Fetched {len(service_details)} services")
        else:
            print(f"⚠️ Server {server.id} has no specs field")
        
        # Convert server to dict and add details
        server_dict = {
            "id": server.id,
            "user_id": server.user_id,
            "order_id": server.order_id,
            "server_name": server.server_name,
            "hostname": server.hostname or "",
            "ip_address": server.ip_address,
            "server_status": server.server_status,
            "server_type": server.server_type or "vps",
            "vcpu": server.vcpu or 1,
            "ram_gb": server.ram_gb,
            "storage_gb": server.storage_gb,
            "bandwidth_gb": server.bandwidth_gb or 1000,
            "operating_system": server.operating_system,
            "plan_id": server.plan_id or 0,
            "plan_name": server.plan_name or "",
            "monthly_cost": float(server.monthly_cost) if server.monthly_cost else 0.0,
            "billing_cycle": server.billing_cycle or "monthly",
            "created_date": server.created_date,
            "expiry_date": server.expiry_date,
            "specs": server.specs,
            "notes": server.notes,
            "created_at": server.created_at,
            "updated_at": server.updated_at,
            "addons": addon_details,
            "services": service_details
        }
        
        return server_dict

    # --------------------------------------------------------
    # ✅ Admin / General queries
    # --------------------------------------------------------
    async def get_server_by_id(self, db: AsyncSession, server_id: int) -> Optional[Server]:
        result = await db.execute(select(Server).where(Server.id == server_id))
        return result.scalar_one_or_none()

    async def get_all_servers(self, db: AsyncSession) -> List[Server]:
        result = await db.execute(
            select(Server)
            .options(
                selectinload(Server.order).selectinload(Order.order_addons),
                selectinload(Server.order).selectinload(Order.order_services)
            )
        )
        servers = result.scalars().all()
        
        # Enrich servers with addon/service data
        enriched_servers = []
        for server in servers:
            server_dict = {
                "id": server.id,
                "user_id": server.user_id,
                "order_id": server.order_id,
                "server_name": server.server_name,
                "server_status": server.server_status,
                "ip_address": server.ip_address,
                "ram_gb": server.ram_gb,
                "storage_gb": server.storage_gb,
                "operating_system": server.operating_system,
                "created_date": server.created_date,
                "expiry_date": server.expiry_date,
                "addons": [],
                "services": [],
            }
            
            if server.order:
                server_dict["addons"] = [addon.to_dict() for addon in server.order.order_addons] if server.order.order_addons else []
                server_dict["services"] = [service.to_dict() for service in server.order.order_services] if server.order.order_services else []
            
            enriched_servers.append(server_dict)
        
        return enriched_servers




    # --------------------------------------------------------
    # ✅ Create server
    # --------------------------------------------------------
    async def create_user_server(
        self, db: AsyncSession, user_id: int, server_data: ServerCreate, order_id: Optional[int] = None
    ) -> Server:
        # Fetch plan details
        result = await db.execute(
            select(HostingPlan).where(HostingPlan.id == server_data.plan_id)
        )
        plan = result.scalar_one_or_none()
        if not plan:
            raise ValueError("Hosting plan not found")

        # Calculate expiry date based on billing cycle
        billing_cycle_days = {
            "monthly": 30,
            "quarterly": 90,
            "semiannually": 180,
            "annually": 365,
            "biennially": 730,
            "triennially": 1095
        }
        cycle = (server_data.billing_cycle or "monthly").lower()
        days = billing_cycle_days.get(cycle, 30)
        expiry_date = datetime.now() + timedelta(days=days)

        # Build specs with addons and services
        specs_data = {
            "vcpu": server_data.vcpu,
            "ram_gb": server_data.ram_gb,
            "storage_gb": server_data.storage_gb,
            "bandwidth_gb": server_data.bandwidth_gb,
            "os": server_data.operating_system,
            "addon_ids": server_data.addon_ids or [],
            "service_ids": server_data.service_ids or []
        }

        db_server = Server(
            user_id=user_id,
            order_id=order_id,  # 🔹 NEW: Link to order
            server_name=server_data.server_name,
            hostname=server_data.hostname,
            server_type=server_data.server_type,
            operating_system=server_data.operating_system,
            vcpu=server_data.vcpu,
            ram_gb=server_data.ram_gb,
            storage_gb=server_data.storage_gb,
            bandwidth_gb=server_data.bandwidth_gb,
            plan_id=server_data.plan_id,
            plan_name=plan.name,
            monthly_cost=server_data.monthly_cost,
            billing_cycle=server_data.billing_cycle or "monthly",
            expiry_date=expiry_date,
            specs=specs_data,
            server_status="active",  # Set to active immediately after provisioning
        )

        db.add(db_server)
        await db.commit()
        await db.refresh(db_server)
        return db_server

    # --------------------------------------------------------
    # ✅ Update server
    # --------------------------------------------------------
    async def update_server(
        self, db: AsyncSession, server_id: int, server_update: ServerUpdate
    ) -> Optional[Server]:
        server = await self.get_server_by_id(db, server_id)
        if not server:
            return None

        update_data = server_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(server, field, value)

        await db.commit()
        await db.refresh(server)
        return server

    async def update_user_server(
        self, db: AsyncSession, user_id: int, server_id: int, server_update: ServerUpdate
    ) -> Optional[Server]:
        # Get the actual Server object, not the enriched dict
        result = await db.execute(
            select(Server).where(
                Server.id == server_id,
                Server.user_id == user_id,
            )
        )
        server = result.scalar_one_or_none()
        if not server:
            return None

        update_data = server_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(server, field, value)

        await db.commit()
        await db.refresh(server)
        return server

    # --------------------------------------------------------
    # ✅ Server actions (start, stop, restart, terminate)
    # --------------------------------------------------------
    async def perform_server_action(self, db: AsyncSession, server_id: int, action: str) -> bool:
        server = await self.get_server_by_id(db, server_id)
        if not server:
            return False

        valid_actions = {
            "start": "active",
            "stop": "stopped",
            "restart": "active",
            "terminate": "terminated",
        }

        new_status = valid_actions.get(action)
        if not new_status:
            return False

        server.server_status = new_status
        await db.commit()
        return True

    async def perform_user_server_action(
        self, db: AsyncSession, user_id: int, server_id: int, action: str
    ) -> bool:
        # Check if server belongs to user
        result = await db.execute(
            select(Server).where(
                Server.id == server_id,
                Server.user_id == user_id,
            )
        )
        server = result.scalar_one_or_none()
        if not server:
            return False
        return await self.perform_server_action(db, server_id, action)

    # --------------------------------------------------------
    # ✅ Delete server
    # --------------------------------------------------------
    async def delete_server(self, db: AsyncSession, server_id: int) -> bool:
        server = await self.get_server_by_id(db, server_id)
        if not server:
            return False

        await db.delete(server)
        await db.commit()
        return True

    async def delete_user_server(self, db: AsyncSession, user_id: int, server_id: int) -> bool:
        # Get the actual Server object to delete
        result = await db.execute(
            select(Server).where(
                Server.id == server_id,
                Server.user_id == user_id,
            )
        )
        server = result.scalar_one_or_none()
        if not server:
            return False

        await db.delete(server)
        await db.commit()
        return True

    # --------------------------------------------------------
    # ✅ Stats and metrics
    # --------------------------------------------------------
    async def get_user_active_servers_count(self, db: AsyncSession, user_id: int) -> int:
        result = await db.execute(
            select(func.count(Server.id)).where(
                Server.user_id == user_id, Server.server_status == "active"
            )
        )
        return result.scalar() or 0

    async def get_active_servers_count(self, db: AsyncSession) -> int:
        result = await db.execute(
            select(func.count(Server.id)).where(Server.server_status == "active")
        )
        return result.scalar() or 0

    async def get_user_bandwidth_used(self, db: AsyncSession, user_id: int) -> Decimal:
        """Mock function: in production, fetch from monitoring DB."""
        servers = await self.get_user_active_servers(db, user_id)
        total_bandwidth = Decimal("0.0")
        for _ in servers:
            total_bandwidth += Decimal("2.4")  # Assume 2.4 TB per active server
        return total_bandwidth

    async def get_user_recent_servers(
        self, db: AsyncSession, user_id: int, limit: int = 5
    ) -> List[Dict[str, Any]]:
        result = await db.execute(
            select(Server)
            .where(Server.user_id == user_id)
            .order_by(Server.created_at.desc())
            .limit(limit)
        )
        servers = result.scalars().all()

        return [
            {
                "id": s.id,
                "name": s.server_name,
                "hostname": s.hostname,
                "status": s.server_status,
                "ip": s.ip_address,
                "plan": s.plan_name,
            }
            for s in servers
        ]

    async def get_server_stats(self, db: AsyncSession) -> ServerStats:
        total_servers = (
            await db.execute(select(func.count(Server.id)))
        ).scalar() or 0

        active_servers = await self.get_active_servers_count(db)

        stopped_servers = (
            await db.execute(
                select(func.count(Server.id)).where(Server.server_status == "stopped")
            )
        ).scalar() or 0

        provisioning_servers = (
            await db.execute(
                select(func.count(Server.id)).where(Server.server_status == "provisioning")
            )
        ).scalar() or 0

        # Calculate total bandwidth (mocked)
        total_bandwidth_used = Decimal(active_servers) * Decimal("2.4")

        avg_cost_result = await db.execute(select(func.avg(Server.monthly_cost)))
        avg_cost = avg_cost_result.scalar()
        average_monthly_cost = Decimal(avg_cost) if avg_cost else Decimal("0.0")

        return ServerStats(
            total_servers=total_servers,
            active_servers=active_servers,
            stopped_servers=stopped_servers,
            provisioning_servers=provisioning_servers,
            total_bandwidth_used=total_bandwidth_used,
            average_monthly_cost=average_monthly_cost,
        )

    # --------------------------------------------------------
    # ✅ Additional utility methods
    # --------------------------------------------------------
    async def get_servers_expiring_soon(self, db: AsyncSession, days: int = 7) -> List[Server]:
        """Get servers that are expiring within the specified days."""
        expiry_threshold = datetime.now() + timedelta(days=days)
        result = await db.execute(
            select(Server).where(
                Server.expiry_date <= expiry_threshold,
                Server.server_status == "active"
            )
        )
        return result.scalars().all()

    async def renew_server(self, db: AsyncSession, server_id: int, months: int = 1) -> bool:
        """Renew server subscription."""
        server = await self.get_server_by_id(db, server_id)
        if not server:
            return False

        # Extend expiry date
        current_expiry = server.expiry_date or datetime.now()
        server.expiry_date = current_expiry + timedelta(days=30 * months)
        
        await db.commit()
        return True

    async def get_user_server_stats(self, db: AsyncSession, user_id: int) -> Dict[str, Any]:
        """Get comprehensive stats for a user's servers."""
        total_servers = await db.execute(
            select(func.count(Server.id)).where(Server.user_id == user_id)
        )
        active_servers = await self.get_user_active_servers_count(db, user_id)
        
        total_monthly_cost = await db.execute(
            select(func.sum(Server.monthly_cost)).where(
                Server.user_id == user_id,
                Server.server_status == "active"
            )
        )
        
        return {
            "total_servers": total_servers.scalar() or 0,
            "active_servers": active_servers,
            "total_monthly_cost": Decimal(total_monthly_cost.scalar() or 0),
            "bandwidth_used": await self.get_user_bandwidth_used(db, user_id)
        }

    async def get_addons_from_ids(self, db: AsyncSession, addon_ids: List[int]) -> List[Dict[str, Any]]:
        """Fetch addon details from addon IDs"""
        from app.models.addon import Addon
        
        if not addon_ids:
            print("⚠️ No addon IDs provided")
            return []
        
        print(f"🔍 Fetching addons for IDs: {addon_ids}")
        
        result = await db.execute(
            select(Addon).where(Addon.id.in_(addon_ids))
        )
        addons = result.scalars().all()
        
        print(f"📦 Found {len(addons)} addons in database")
        
        # Convert to dict format
        addon_list = []
        for addon in addons:
            addon_dict = addon.to_dict()
            print(f"  ✓ Addon: {addon_dict['name']} (ID: {addon_dict['id']})")
            addon_list.append(addon_dict)
        
        return addon_list

    async def get_services_from_ids(self, db: AsyncSession, service_ids: List[int]) -> List[Dict[str, Any]]:
        """Fetch service details from service IDs"""
        from app.models.service import Service
        
        if not service_ids:
            print("⚠️ No service IDs provided")
            return []
        
        print(f"🔍 Fetching services for IDs: {service_ids}")
        
        result = await db.execute(
            select(Service).where(Service.id.in_(service_ids))
        )
        services = result.scalars().all()
        
        print(f"🔧 Found {len(services)} services in database")
        
        # Convert to dict format
        service_list = []
        for service in services:
            service_dict = service.to_dict()
            print(f"  ✓ Service: {service_dict['name']} (ID: {service_dict['id']})")
            service_list.append(service_dict)
        
        return service_list