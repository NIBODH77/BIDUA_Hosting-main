"""
Clean database - Delete all test data (invoices, orders, servers)
WARNING: This will delete ALL user data except user accounts!
"""
import asyncio
from sqlalchemy import text
from app.core.database import AsyncSessionLocal


async def clean_database():
    print("⚠️  DATABASE CLEANUP - This will delete ALL test data!")
    print("=" * 60)
    
    confirm = input("\n🔴 Type 'DELETE ALL DATA' to confirm: ")
    if confirm != "DELETE ALL DATA":
        print("❌ Cleanup cancelled")
        return
    
    async with AsyncSessionLocal() as db:
        try:
            # Get counts before deletion
            print("\n📊 Current database state:")
            
            result = await db.execute(text("SELECT COUNT(*) FROM invoices"))
            invoice_count = result.scalar()
            print(f"   Invoices: {invoice_count}")
            
            result = await db.execute(text("SELECT COUNT(*) FROM orders"))
            order_count = result.scalar()
            print(f"   Orders: {order_count}")
            
            result = await db.execute(text("SELECT COUNT(*) FROM servers"))
            server_count = result.scalar()
            print(f"   Servers: {server_count}")
            
            result = await db.execute(text("SELECT COUNT(*) FROM order_addons"))
            addon_count = result.scalar()
            print(f"   Order Addons: {addon_count}")
            
            result = await db.execute(text("SELECT COUNT(*) FROM order_services"))
            service_count = result.scalar()
            print(f"   Order Services: {service_count}")
            
            result = await db.execute(text("SELECT COUNT(*) FROM payment_transactions"))
            payment_count = result.scalar()
            print(f"   Payment Transactions: {payment_count}")
            
            print("\n🗑️  Deleting data...")
            
            # Delete in correct order (respect foreign keys)
            # 1. Delete payment transactions first
            await db.execute(text("DELETE FROM payment_transactions"))
            print("   ✅ Deleted payment_transactions")
            
            # 2. Delete invoices (linked to orders)
            await db.execute(text("DELETE FROM invoices"))
            print("   ✅ Deleted invoices")
            
            # 3. Delete order addons and services
            await db.execute(text("DELETE FROM order_addons"))
            print("   ✅ Deleted order_addons")
            
            await db.execute(text("DELETE FROM order_services"))
            print("   ✅ Deleted order_services")
            
            # 4. Delete servers (may be linked to orders)
            await db.execute(text("DELETE FROM servers"))
            print("   ✅ Deleted servers")
            
            # 5. Finally delete orders
            await db.execute(text("DELETE FROM orders"))
            print("   ✅ Deleted orders")
            
            # Reset sequences to 1
            print("\n🔄 Resetting ID sequences...")
            await db.execute(text("ALTER SEQUENCE invoices_id_seq RESTART WITH 1"))
            await db.execute(text("ALTER SEQUENCE orders_id_seq RESTART WITH 1"))
            await db.execute(text("ALTER SEQUENCE servers_id_seq RESTART WITH 1"))
            await db.execute(text("ALTER SEQUENCE order_addons_id_seq RESTART WITH 1"))
            await db.execute(text("ALTER SEQUENCE order_services_id_seq RESTART WITH 1"))
            await db.execute(text("ALTER SEQUENCE payment_transactions_id_seq RESTART WITH 1"))
            print("   ✅ Sequences reset")
            
            # Commit all changes
            await db.commit()
            
            print("\n" + "=" * 60)
            print("✅ DATABASE CLEANUP COMPLETE!")
            print("=" * 60)
            print("\n📊 Summary:")
            print(f"   Deleted {invoice_count} invoices")
            print(f"   Deleted {order_count} orders")
            print(f"   Deleted {server_count} servers")
            print(f"   Deleted {addon_count} order addons")
            print(f"   Deleted {service_count} order services")
            print(f"   Deleted {payment_count} payment transactions")
            print("\n✨ Database is now clean and ready for fresh deployment!")
            
        except Exception as e:
            await db.rollback()
            print(f"\n❌ Error during cleanup: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(clean_database())
