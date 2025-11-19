# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import func, and_, select
# from typing import List, Optional, Dict, Any
# from datetime import datetime, timedelta
# from decimal import Decimal
# import secrets
# import string

# from app.models.invoice import Invoice
# from app.models.users import UserProfile
# from app.schemas.invoice import InvoiceStats

# class InvoiceService:
#     async def get_user_invoices(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> List[Invoice]:
#         result = await db.execute(
#             select(Invoice).where(Invoice.user_id == user_id)
#             .order_by(Invoice.created_at.desc())
#             .offset(skip).limit(limit)
#         )
#         return result.scalars().all()
    
#     async def get_all_invoices(self, db: AsyncSession) -> List[Dict[str, Any]]:
#         result = await db.execute(
#             select(Invoice, UserProfile).join(UserProfile, Invoice.user_id == UserProfile.id)
#             .order_by(Invoice.created_at.desc())
#         )
#         invoices_with_users = result.all()
        
#         invoices_list = []
#         for invoice, user in invoices_with_users:
#             invoice_dict = {
#                 "id": invoice.id,
#                 "user_id": invoice.user_id,
#                 "invoice_number": invoice.invoice_number,
#                 "invoice_date": invoice.invoice_date,
#                 "due_date": invoice.due_date,
#                 "subtotal": invoice.subtotal,
#                 "tax_amount": invoice.tax_amount,
#                 "total_amount": invoice.total_amount,
#                 "amount_paid": invoice.amount_paid,
#                 "balance_due": invoice.balance_due,
#                 "status": invoice.status,
#                 "payment_status": invoice.payment_status,
#                 "items": invoice.items,
#                 "description": invoice.description,
#                 "payment_method": invoice.payment_method,
#                 "payment_date": invoice.payment_date,
#                 "payment_reference": invoice.payment_reference,
#                 "created_at": invoice.created_at,
#                 "updated_at": invoice.updated_at,
#                 "user_name": user.full_name,
#                 "user_email": user.email
#             }
#             invoices_list.append(invoice_dict)
        
#         return invoices_list
    
#     async def get_user_invoice(self, db: AsyncSession, user_id: int, invoice_id: int) -> Optional[Invoice]:
#         result = await db.execute(
#             select(Invoice).where(
#                 Invoice.id == invoice_id,
#                 Invoice.user_id == user_id
#             )
#         )
#         return result.scalar_one_or_none()
    
#     async def get_invoice_by_id(self, db: AsyncSession, invoice_id: int) -> Optional[Invoice]:
#         result = await db.execute(
#             select(Invoice).where(Invoice.id == invoice_id)
#         )
#         return result.scalar_one_or_none()
    
#     async def create_invoice(self, db: AsyncSession, user_id: int, invoice_data: Dict[str, Any]) -> Invoice:
#         invoice_number = await self._generate_invoice_number(db)
        
#         db_invoice = Invoice(
#             user_id=user_id,
#             invoice_number=invoice_number,
#             invoice_date=datetime.now(),
#             due_date=invoice_data.get('due_date', datetime.now() + timedelta(days=30)),
#             subtotal=invoice_data['subtotal'],
#             tax_amount=invoice_data.get('tax_amount', Decimal('0.0')),
#             total_amount=invoice_data['total_amount'],
#             amount_paid=invoice_data.get('amount_paid', Decimal('0.0')),
#             balance_due=invoice_data['total_amount'] - invoice_data.get('amount_paid', Decimal('0.0')),
#             items=invoice_data['items'],
#             description=invoice_data.get('description'),
#             status=invoice_data.get('status', 'draft'),
#             payment_status=invoice_data.get('payment_status', 'pending')
#         )
        
#         db.add(db_invoice)
#         await db.commit()
#         await db.refresh(db_invoice)
#         return db_invoice
    
#     async def pay_invoice(self, db: AsyncSession, user_id: int, invoice_id: int, payment_method: str) -> bool:
#         invoice = await self.get_user_invoice(db, user_id, invoice_id)
#         if not invoice or invoice.payment_status == 'paid':
#             return False
        
#         invoice.payment_status = 'paid'
#         invoice.payment_method = payment_method
#         invoice.payment_date = datetime.now()
#         invoice.amount_paid = invoice.total_amount
#         invoice.balance_due = Decimal('0.0')
#         invoice.status = 'paid'
        
#         await db.commit()
#         return True
    
#     async def get_user_monthly_cost(self, db: AsyncSession, user_id: int) -> Decimal:
#         # Get all active servers and sum their monthly costs
#         from app.models.server import Server
#         result = await db.execute(
#             select(func.sum(Server.monthly_cost)).where(
#                 Server.user_id == user_id,
#                 Server.server_status == 'active'
#             )
#         )
#         total_cost = result.scalar()
#         return total_cost or Decimal('0.0')
    
#     async def get_user_current_balance(self, db: AsyncSession, user_id: int) -> Decimal:
#         result = await db.execute(
#             select(func.sum(Invoice.balance_due)).where(
#                 Invoice.user_id == user_id,
#                 Invoice.payment_status.in_(['pending', 'overdue'])
#             )
#         )
#         balance = result.scalar()
#         return balance or Decimal('0.0')
    
#     async def get_monthly_revenue(self, db: AsyncSession) -> Decimal:
#         start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
#         result = await db.execute(
#             select(func.sum(Invoice.total_amount)).where(
#                 Invoice.payment_status == 'paid',
#                 Invoice.payment_date >= start_of_month
#             )
#         )
#         revenue = result.scalar()
#         return revenue or Decimal('0.0')
    
#     async def get_user_recent_invoices(self, db: AsyncSession, user_id: int, limit: int = 5) -> List[Dict[str, Any]]:
#         result = await db.execute(
#             select(Invoice).where(Invoice.user_id == user_id)
#             .order_by(Invoice.created_at.desc())
#             .limit(limit)
#         )
#         invoices = result.scalars().all()
        
#         invoices_list = []
#         for invoice in invoices:
#             invoices_list.append({
#                 "id": invoice.id,
#                 "invoice_number": invoice.invoice_number,
#                 "date": invoice.invoice_date,
#                 "amount": invoice.total_amount,
#                 "status": invoice.payment_status,
#                 "description": invoice.description
#             })
        
#         return invoices_list
    
#     async def get_user_pending_invoices_count(self, db: AsyncSession, user_id: int) -> int:
#         result = await db.execute(
#             select(func.count(Invoice.id)).where(
#                 Invoice.user_id == user_id,
#                 Invoice.payment_status.in_(['pending', 'overdue'])
#             )
#         )
#         return result.scalar()
    
#     async def get_invoice_stats(self, db: AsyncSession) -> InvoiceStats:
#         total_invoices_result = await db.execute(select(func.count(Invoice.id)))
#         total_invoices = total_invoices_result.scalar()
        
#         paid_invoices_result = await db.execute(
#             select(func.count(Invoice.id)).where(Invoice.payment_status == 'paid')
#         )
#         paid_invoices = paid_invoices_result.scalar()
        
#         pending_invoices_result = await db.execute(
#             select(func.count(Invoice.id)).where(Invoice.payment_status == 'pending')
#         )
#         pending_invoices = pending_invoices_result.scalar()
        
#         overdue_invoices_result = await db.execute(
#             select(func.count(Invoice.id)).where(Invoice.payment_status == 'overdue')
#         )
#         overdue_invoices = overdue_invoices_result.scalar()
        
#         total_revenue_result = await db.execute(
#             select(func.sum(Invoice.total_amount)).where(Invoice.payment_status == 'paid')
#         )
#         total_revenue = total_revenue_result.scalar() or Decimal('0.0')
        
#         pending_amount_result = await db.execute(
#             select(func.sum(Invoice.balance_due)).where(
#                 Invoice.payment_status.in_(['pending', 'overdue'])
#             )
#         )
#         pending_amount = pending_amount_result.scalar() or Decimal('0.0')
        
#         return InvoiceStats(
#             total_invoices=total_invoices,
#             paid_invoices=paid_invoices,
#             pending_invoices=pending_invoices,
#             overdue_invoices=overdue_invoices,
#             total_revenue=total_revenue,
#             pending_amount=pending_amount
#         )
    
#     async def _generate_invoice_number(self, db: AsyncSession) -> str:
#         """Generate a unique invoice number"""
#         year = datetime.now().year
#         base_number = f"INV-{year}-"
        
#         # Get the last invoice number for this year
#         result = await db.execute(
#             select(Invoice.invoice_number).where(
#                 Invoice.invoice_number.like(f"{base_number}%")
#             ).order_by(Invoice.invoice_number.desc()).limit(1)
#         )
#         last_invoice = result.scalar_one_or_none()
        
#         if last_invoice:
#             last_number = int(last_invoice.split('-')[-1])
#             new_number = last_number + 1
#         else:
#             new_number = 1
        
#         return f"{base_number}{new_number:04d}"






from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal

from app.models.invoice import Invoice
from app.models.users import UserProfile
from app.schemas.invoice import InvoiceStats


class InvoiceService:
    # ---------------------
    # Invoice Retrieval
    # ---------------------

    async def get_user_invoices(
        self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Invoice]:
        result = await db.execute(
            select(Invoice)
            .where(Invoice.user_id == user_id)
            .order_by(Invoice.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    



    

    

    async def get_all_invoices(self, db: AsyncSession) -> List[Dict[str, Any]]:
        result = await db.execute(
            select(Invoice, UserProfile)
            .join(UserProfile, Invoice.user_id == UserProfile.id)
            .order_by(Invoice.created_at.desc())
        )
        invoices_with_users = result.all()

        return [
            {
                "id": invoice.id,
                "user_id": invoice.user_id,
                "invoice_number": invoice.invoice_number,
                "invoice_date": invoice.invoice_date,
                "due_date": invoice.due_date,
                "subtotal": invoice.subtotal,
                "tax_amount": invoice.tax_amount,
                "total_amount": invoice.total_amount,
                "amount_paid": invoice.amount_paid,
                "balance_due": invoice.balance_due,
                "status": invoice.status,
                "payment_status": invoice.payment_status,
                "items": invoice.items,
                "description": invoice.description,
                "payment_method": invoice.payment_method,
                "payment_date": invoice.payment_date,
                "payment_reference": invoice.payment_reference,
                "created_at": invoice.created_at,
                "updated_at": invoice.updated_at,
                "user_name": user.full_name,
                "user_email": user.email,
            }
            for invoice, user in invoices_with_users
        ]

    async def get_user_invoice(
        self, db: AsyncSession, user_id: int, invoice_id: int
    ) -> Optional[Invoice]:
        result = await db.execute(
            select(Invoice).where(
                Invoice.id == invoice_id,
                Invoice.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()


    async def get_invoice_by_id(
        self, db: AsyncSession, invoice_id: int
    ) -> Optional[Invoice]:
        result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
        return result.scalar_one_or_none()

    # ---------------------
    # Invoice Creation / Payment
    # ---------------------

    async def create_invoice(
        self, db: AsyncSession, user_id: int, invoice_data: Dict[str, Any]
    ) -> Invoice:
        invoice_number = await self._generate_invoice_number(db)

        db_invoice = Invoice(
            user_id=user_id,
            invoice_number=invoice_number,
            invoice_date=datetime.now(),
            due_date=invoice_data.get("due_date", datetime.now() + timedelta(days=30)),
            subtotal=invoice_data["subtotal"],
            tax_amount=invoice_data.get("tax_amount", Decimal("0.0")),
            total_amount=invoice_data["total_amount"],
            amount_paid=invoice_data.get("amount_paid", Decimal("0.0")),
            balance_due=invoice_data["total_amount"]
            - invoice_data.get("amount_paid", Decimal("0.0")),
            items=invoice_data["items"],
            description=invoice_data.get("description"),
            status=invoice_data.get("status", "draft"),
            payment_status=invoice_data.get("payment_status", "pending"),
        )

        db.add(db_invoice)
        await db.commit()
        await db.refresh(db_invoice)
        return db_invoice

    async def pay_invoice(
        self, db: AsyncSession, user_id: int, invoice_id: int, payment_method: str
    ) -> bool:
        invoice = await self.get_user_invoice(db, user_id, invoice_id)
        if not invoice or invoice.payment_status == "paid":
            return False

        invoice.payment_status = "paid"
        invoice.payment_method = payment_method
        invoice.payment_date = datetime.now()
        invoice.amount_paid = invoice.total_amount
        invoice.balance_due = Decimal("0.0")
        invoice.status = "paid"

        await db.commit()
        return True

    # ---------------------
    # Financial Stats
    # ---------------------

    async def get_user_monthly_cost(
        self, db: AsyncSession, user_id: int
    ) -> Decimal:
        from app.models.server import Server
        result = await db.execute(
            select(func.sum(Server.monthly_cost)).where(
                Server.user_id == user_id,
                Server.server_status == "active",
            )
        )
        return result.scalar() or Decimal("0.0")

    # async def get_user_current_balance(
    #     self, db: AsyncSession, user_id: int
    # ) -> Decimal:
    #     result = await db.execute(
    #         select(func.sum(Invoice.balance_due)).where(
    #             Invoice.user_id == user_id,
    #             Invoice.payment_status.in_(["pending", "overdue"]),
    #         )
    #     )
    #     return result.scalar() or Decimal("0.0")


    async def get_user_current_balance(
            self, db: AsyncSession, user_id: int
        ) -> Decimal:
            result = await db.execute(
                select(func.sum(Invoice.balance_due)).where(
                    Invoice.user_id == user_id,
                    Invoice.payment_status.in_(["pending", "overdue"]),
                )
            )

            balance = result.scalar() or Decimal("0.0")

            # 🧩 Debug print section
            print(f"🧾 Checking Current Balance for User ID: {user_id}")
            print(f"Query Result: {result}")
            print(f"Calculated Balance (Pending + Overdue): {balance}")

            # Optional: Check all invoice details for debugging
            all_invoices = await db.execute(
                select(Invoice).where(Invoice.user_id == user_id)
            )
            invoices = all_invoices.scalars().all()
            print("All invoice statuses and balances:")
            for inv in invoices:
                print(f"Invoice ID: {inv.id}, Status: {inv.payment_status}, Balance Due: {inv.balance_due}")

            return balance


    async def get_monthly_revenue(self, db: AsyncSession) -> Decimal:
        start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        result = await db.execute(
            select(func.sum(Invoice.total_amount)).where(
                Invoice.payment_status == "paid",
                Invoice.payment_date >= start_of_month,
            )
        )
        return result.scalar() or Decimal("0.0")

    async def get_invoice_stats(self, db: AsyncSession) -> InvoiceStats:
        total_invoices = (await db.execute(select(func.count(Invoice.id)))).scalar()
        paid_invoices = (await db.execute(
            select(func.count(Invoice.id)).where(Invoice.payment_status == "paid")
        )).scalar()
        pending_invoices = (await db.execute(
            select(func.count(Invoice.id)).where(Invoice.payment_status == "pending")
        )).scalar()
        overdue_invoices = (await db.execute(
            select(func.count(Invoice.id)).where(Invoice.payment_status == "overdue")
        )).scalar()

        total_revenue = (
            await db.execute(
                select(func.sum(Invoice.total_amount)).where(Invoice.payment_status == "paid")
            )
        ).scalar() or Decimal("0.0")

        pending_amount = (
            await db.execute(
                select(func.sum(Invoice.balance_due)).where(
                    Invoice.payment_status.in_(["pending", "overdue"])
                )
            )
        ).scalar() or Decimal("0.0")

        return InvoiceStats(
            total_invoices=total_invoices or 0,
            paid_invoices=paid_invoices or 0,
            pending_invoices=pending_invoices or 0,
            overdue_invoices=overdue_invoices or 0,
            total_revenue=total_revenue,
            pending_amount=pending_amount,
        )

    async def get_user_recent_invoices(
        self, db: AsyncSession, user_id: int, limit: int = 5
    ) -> List[Dict[str, Any]]:
        result = await db.execute(
            select(Invoice)
            .where(Invoice.user_id == user_id)
            .order_by(Invoice.created_at.desc())
            .limit(limit)
        )
        invoices = result.scalars().all()

        return [
            {
                "id": invoice.id,
                "invoice_number": invoice.invoice_number,
                "date": invoice.invoice_date,
                "amount": invoice.total_amount,
                "status": invoice.payment_status,
                "description": invoice.description,
            }
            for invoice in invoices
        ]
    

    

    async def get_user_pending_invoices_count(
        self, db: AsyncSession, user_id: int
    ) -> int:
        result = await db.execute(
            select(func.count(Invoice.id)).where(
                Invoice.user_id == user_id,
                Invoice.payment_status.in_(["pending", "overdue"]),
            )
        )
        return result.scalar() or 0




    # ---------------------
    # Internal Helpers
    # ---------------------

    async def _generate_invoice_number(self, db: AsyncSession) -> str:
        """Generate a unique invoice number"""
        year = datetime.now().year
        base_number = f"INV-{year}-"

        result = await db.execute(
            select(Invoice.invoice_number)
            .where(Invoice.invoice_number.like(f"{base_number}%"))
            .order_by(Invoice.invoice_number.desc())
            .limit(1)
        )
        last_invoice = result.scalar_one_or_none()

        if last_invoice:
            last_number = int(last_invoice.split("-")[-1])
            new_number = last_number + 1
        else:
            new_number = 1

        return f"{base_number}{new_number:04d}"
