"""
Fix invoice subtotals - subtotal should be amount BEFORE GST, not the original price
"""
import asyncio
import sys
import os

# Add the parent directory to the path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select, text
from app.core.database import AsyncSessionLocal
from decimal import Decimal

async def fix_invoice_subtotals():
    print("🔧 Fixing invoice subtotals...")
    
    async with AsyncSessionLocal() as db:
        # Use raw SQL to avoid model relationship issues
        result = await db.execute(text("SELECT * FROM invoices"))
        rows = result.fetchall()
        
        print(f"📊 Found {len(rows)} invoices to check\n")
        
        fixed_count = 0
        for row in rows:
            # Current values
            invoice_id = row.id
            invoice_number = row.invoice_number
            old_subtotal = row.subtotal
            tax_amount = row.tax_amount
            total_amount = row.total_amount
            items = row.items
            
            # Calculate correct subtotal (total - tax)
            correct_subtotal = total_amount - tax_amount
            
            needs_update = False
            if abs(old_subtotal - correct_subtotal) > Decimal("0.01"):
                needs_update = True
                print(f"📝 Invoice {invoice_number}:")
                print(f"   Old Subtotal: ₹{old_subtotal:.2f}")
                print(f"   Tax Amount:   ₹{tax_amount:.2f}")
                print(f"   Total:        ₹{total_amount:.2f}")
                print(f"   ✅ New Subtotal: ₹{correct_subtotal:.2f}")
            
            # Check if items need 'amount' field
            items_need_update = False
            if items:
                for item in items:
                    if 'amount' not in item:
                        items_need_update = True
                        item['amount'] = item.get('total_amount', float(total_amount))
            
            if needs_update or items_need_update:
                # Update using raw SQL
                import json
                await db.execute(
                    text("""
                        UPDATE invoices 
                        SET subtotal = :subtotal, items = :items
                        WHERE id = :id
                    """),
                    {
                        "subtotal": correct_subtotal,
                        "items": json.dumps(items) if items else None,
                        "id": invoice_id
                    }
                )
                fixed_count += 1
                print()
        
        if fixed_count > 0:
            await db.commit()
            print(f"✅ Fixed {fixed_count} invoices")
        else:
            print("✅ All invoices are already correct")
        
        print("\n📋 Summary:")
        print(f"Total invoices checked: {len(rows)}")
        print(f"Invoices fixed: {fixed_count}")
        print(f"Already correct: {len(rows) - fixed_count}")

if __name__ == "__main__":
    asyncio.run(fix_invoice_subtotals())
