#!/usr/bin/env python3
"""
Recovery script to create missing servers for paid orders.
Run this AFTER fixing the payment.py bug.
"""

import asyncio
from sqlalchemy import select, text
from app.core.database import get_db
from app.services.server_service import ServerService
from app.schemas.server import ServerCreate
from app.models.plan import HostingPlan


async def recover_missing_servers():
    """Find paid orders without servers and create them."""
    
    async for db in get_db():
        try:
            print("🔍 Searching for paid orders without servers...\n")
            
            # Find orders that are paid but have no corresponding server
            query = text("""
                SELECT DISTINCT
                    o.id as order_id,
                    o.order_number,
                    o.user_id,
                    o.plan_id,
                    o.total_amount,
                    o.created_at
                FROM orders o
                LEFT JOIN servers s ON s.user_id = o.user_id 
                    AND s.plan_id = o.plan_id
                    AND s.created_at >= o.created_at - INTERVAL '5 minutes'
                    AND s.created_at <= o.created_at + INTERVAL '5 minutes'
                WHERE o.payment_status = 'paid'
                  AND o.order_status = 'completed'
                  AND s.id IS NULL
                  AND o.plan_id IS NOT NULL
                ORDER BY o.created_at ASC;
            """)
            
            result = await db.execute(query)
            missing_orders = result.fetchall()
            
            if not missing_orders:
                print("✅ No missing servers found. All paid orders have servers!")
                return
            
            print(f"⚠️  Found {len(missing_orders)} paid orders WITHOUT servers:\n")
            
            for order in missing_orders:
                print(f"Order #{order.order_number}")
                print(f"  - Order ID: {order.order_id}")
                print(f"  - User ID: {order.user_id}")
                print(f"  - Plan ID: {order.plan_id}")
                print(f"  - Amount: ₹{order.total_amount}")
                print(f"  - Date: {order.created_at}")
                print()
            
            # Ask for confirmation
            print("\n⚠️  WARNING: This will create servers for all orders above.")
            confirm = input("Continue? (yes/no): ").strip().lower()
            
            if confirm != 'yes':
                print("❌ Cancelled by user")
                return
            
            # Create servers for each missing order
            server_service = ServerService()
            created_count = 0
            
            for order in missing_orders:
                try:
                    # Get plan details
                    plan_result = await db.execute(
                        select(HostingPlan).filter(HostingPlan.id == order.plan_id)
                    )
                    plan = plan_result.scalar_one_or_none()
                    
                    if not plan:
                        print(f"❌ Plan {order.plan_id} not found for order {order.order_number}")
                        continue
                    
                    # Create server with default config (metadata not available in orders table)
                    server_data = ServerCreate(
                        server_name=f'{plan.name} Server',
                        hostname=f'server-{order.user_id}-{order.order_id}.bidua.com',
                        server_type='VPS',
                        operating_system='Ubuntu 22.04 LTS',
                        vcpu=plan.cpu_cores,
                        ram_gb=plan.ram_gb,
                        storage_gb=plan.storage_gb,
                        bandwidth_gb=plan.bandwidth_gb or 1000,
                        plan_id=plan.id,
                        monthly_cost=plan.base_price
                    )
                    
                    server = await server_service.create_user_server(
                        db, order.user_id, server_data
                    )
                    
                    print(f"✅ Created server {server.id} for order {order.order_number}")
                    print(f"   - Server Name: {server.server_name}")
                    print(f"   - Plan: {plan.name}")
                    print(f"   - User ID: {order.user_id}")
                    print()
                    
                    created_count += 1
                    
                except Exception as e:
                    print(f"❌ Failed to create server for order {order.order_number}: {e}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            print(f"\n✅ Recovery complete!")
            print(f"   - Total missing: {len(missing_orders)}")
            print(f"   - Created: {created_count}")
            print(f"   - Failed: {len(missing_orders) - created_count}")
            
        except Exception as e:
            print(f"❌ Recovery failed: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    print("=" * 60)
    print("🛠️  BIDUA Hosting - Missing Servers Recovery Script")
    print("=" * 60)
    print()
    asyncio.run(recover_missing_servers())
