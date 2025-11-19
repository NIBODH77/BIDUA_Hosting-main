"""
Script to fix existing invoice amounts - remove TDS deduction from customer invoices
Run this once to correct historical data
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from decimal import Decimal
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import ALL models to avoid relationship errors
from app.models.invoice import Invoice
from app.models.order import Order
from app.models.users import UserProfile
from app.models.ticket_attachment import TicketAttachment
from app.models.ticket_message import TicketMessage
from app.models.support import SupportTicket

async def fix_invoice_amounts():
    """Fix invoice amounts by recalculating without TDS deduction"""
    
    # Create database engine
    database_url = os.getenv("DATABASE_URL")
    engine = create_async_engine(database_url, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        print("🔍 Fetching all invoices...")
        
        # Get all invoices
        result = await session.execute(select(Invoice))
        invoices = result.scalars().all()
        
        print(f"📊 Found {len(invoices)} invoices to check")
        
        fixed_count = 0
        
        for invoice in invoices:
            # Only fix pending/unpaid invoices to avoid changing paid ones
            if invoice.payment_status in ['pending', 'unpaid']:
                print(f"\n🔧 Checking Invoice #{invoice.invoice_number}")
                print(f"   Current: subtotal={invoice.subtotal}, tax={invoice.tax_amount}, total={invoice.total_amount}")
                
                # Recalculate correct total
                # The subtotal should already be discounted
                # Total should be: subtotal + GST (no TDS for customers)
                
                # If tax_amount exists, use it; otherwise calculate 18% GST
                if invoice.tax_amount and invoice.tax_amount > 0:
                    gst_amount = invoice.tax_amount
                else:
                    gst_amount = (invoice.subtotal * Decimal("18.00")) / Decimal("100.00")
                
                # Correct total
                correct_total = invoice.subtotal + gst_amount
                
                # Check if total needs fixing (allow small rounding differences)
                if abs(invoice.total_amount - correct_total) > Decimal("0.01"):
                    print(f"   ⚠️  NEEDS FIX!")
                    print(f"   Correct total should be: {correct_total}")
                    print(f"   Difference: {invoice.total_amount - correct_total}")
                    
                    # Update invoice
                    invoice.total_amount = correct_total
                    invoice.tax_amount = gst_amount
                    invoice.balance_due = correct_total - invoice.amount_paid
                    
                    # Update items if they exist
                    if invoice.items and isinstance(invoice.items, list) and len(invoice.items) > 0:
                        item = invoice.items[0]
                        if 'tds_percent' in item:
                            del item['tds_percent']
                        item['gst_amount'] = float(gst_amount)
                        item['total_amount'] = float(correct_total)
                        invoice.items = invoice.items  # Trigger update
                    
                    fixed_count += 1
                    print(f"   ✅ Fixed!")
                else:
                    print(f"   ✓ Amount is correct")
        
        if fixed_count > 0:
            print(f"\n💾 Committing {fixed_count} invoice fixes to database...")
            await session.commit()
            print("✅ Database updated successfully!")
        else:
            print("\n✅ All invoices are already correct!")
        
        print(f"\n📈 Summary:")
        print(f"   Total invoices checked: {len(invoices)}")
        print(f"   Invoices fixed: {fixed_count}")
        print(f"   Already correct: {len(invoices) - fixed_count}")
    
    await engine.dispose()

if __name__ == "__main__":
    print("🚀 Starting invoice amount correction script...\n")
    asyncio.run(fix_invoice_amounts())
    print("\n✨ Script completed!")
