from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
import secrets
import string

from app.models.order import Order
from app.models.plan import HostingPlan
from app.models.users import UserProfile
from app.models.invoice import Invoice
from app.models.addon import Addon
from app.models.service import Service
from app.models.order_addon import OrderAddon
from app.models.order_service import OrderService as OrderServiceModel
from app.schemas.order import OrderCreate, OrderUpdate, OrderSummary, InvoiceResponse
from app.models.referrals import ReferralEarning
from app.services.referral_service import ReferralService


class OrderService:
    # -----------------------------
    # 🔹 USER-SPECIFIC QUERIES
    # -----------------------------
    async def get_user_orders(
        self,
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
    ) -> List[Order]:
        query = select(Order).where(Order.user_id == user_id)
        if status and status != "all":
            query = query.where(Order.order_status == status)
        query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)

        result = await db.execute(query)
        return result.scalars().all()

    async def get_user_order(
        self, db: AsyncSession, user_id: int, order_id: int
    ) -> Optional[Order]:
        result = await db.execute(
            select(Order).where(Order.id == order_id, Order.user_id == user_id)
        )
        return result.scalar_one_or_none()

    # -----------------------------
    # 🔹 ADMIN / GLOBAL QUERIES
    # -----------------------------
    async def get_all_orders(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
    ) -> List[Order]:
        query = select(Order)
        if status and status != "all":
            query = query.where(Order.order_status == status)
        query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)

        result = await db.execute(query)
        return result.scalars().all()

    async def get_orders_with_plan(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        payment_status: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        query = (
            select(Order, HostingPlan, UserProfile)
            .join(HostingPlan, Order.plan_id == HostingPlan.id)
            .join(UserProfile, Order.user_id == UserProfile.id)
        )

        if status and status != "all":
            query = query.where(Order.order_status == status)
        if payment_status and payment_status != "all":
            query = query.where(Order.payment_status == payment_status)

        query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        rows = result.all()

        return [
            {
                "id": order.id,
                "user_id": order.user_id,
                "plan_id": order.plan_id,
                "order_number": order.order_number,
                "order_status": order.order_status,
                "total_amount": order.total_amount,
                "payment_status": order.payment_status,
                "billing_cycle": order.billing_cycle,
                "server_details": order.server_details,
                "payment_method": order.payment_method,
                "payment_reference": order.payment_reference,
                "payment_date": order.payment_date,
                "created_at": order.created_at,
                "updated_at": order.updated_at,
                "plan_name": plan.name,
                "plan_type": plan.plan_type,
                "user_email": user.email,
            }
            for order, plan, user in rows
        ]

    # -----------------------------
    # 🔹 CRUD OPERATIONS
    # -----------------------------
    async def get_order_by_id(self, db: AsyncSession, order_id: int) -> Optional[Order]:
        result = await db.execute(select(Order).where(Order.id == order_id))
        return result.scalar_one_or_none()

    async def create_order(
        self, db: AsyncSession, user_id: int, order_data
    ) -> Dict[str, Any]:
        try:
            # ✅ 1️⃣ Fetch hosting plan
            result = await db.execute(select(HostingPlan).where(HostingPlan.id == order_data.plan_id))
            plan = result.scalar_one_or_none()
            if not plan:
                raise ValueError("Hosting plan not found")

            # ✅ 2️⃣ Generate unique order number
            order_number = await self._generate_order_number(db)

            # ✅ 3️⃣ Billing cycle → discount %
            discount_map = {
                "monthly": Decimal("5.00"),
                "quarterly": Decimal("10.00"),
                "semi-annually": Decimal("15.00"),
                "annually": Decimal("20.00"),
                "biennially": Decimal("25.00"),
                "triennially": Decimal("35.00"),
            }
            discount_percent = discount_map.get(order_data.billing_cycle.lower(), Decimal("0.00"))

            # ✅ 4️⃣ Calculate base totals from hosting plan
            plan_subtotal = Decimal(order_data.total_amount)
            plan_discount_amount = (plan_subtotal * discount_percent) / Decimal("100.00")
            plan_discounted_total = plan_subtotal - plan_discount_amount

            # ✅ 5️⃣ Process Addons
            addon_total = Decimal("0.00")
            addon_records = []
            invoice_addon_items = []
            
            if order_data.addon_ids:
                addon_result = await db.execute(
                    select(Addon).where(Addon.id.in_(order_data.addon_ids), Addon.is_active == True)
                )
                addons = addon_result.scalars().all()
                
                for addon in addons:
                    unit_price = Decimal(str(addon.price))
                    quantity = Decimal("1")  # Default quantity, can be extended later
                    subtotal = unit_price * quantity
                    
                    # Apply same discount as plan
                    addon_discount = (subtotal * discount_percent) / Decimal("100.00")
                    addon_discounted = subtotal - addon_discount
                    addon_tax = (addon_discounted * Decimal("18.00")) / Decimal("100.00")
                    addon_item_total = addon_discounted + addon_tax
                    
                    addon_total += addon_item_total
                    
                    # Store for OrderAddon creation later
                    addon_records.append({
                        "addon_id": addon.id,
                        "unit_price": unit_price,
                        "quantity": quantity,
                        "subtotal": subtotal,
                        "discount_amount": addon_discount,
                        "tax_amount": addon_tax,
                        "total_amount": addon_item_total,
                        "billing_type": addon.billing_type,
                    })
                    
                    # Invoice line item
                    invoice_addon_items.append({
                        "description": f"{addon.name} - {addon.category.value}",
                        "quantity": int(quantity),
                        "unit_price": float(unit_price),
                        "discount_percent": float(discount_percent),
                        "discount_amount": float(addon_discount),
                        "subtotal_after_discount": float(addon_discounted),
                        "gst_percent": 18.0,
                        "gst_amount": float(addon_tax),
                        "total_amount": float(addon_item_total)
                    })

            # ✅ 6️⃣ Process Services
            service_total = Decimal("0.00")
            service_records = []
            invoice_service_items = []
            
            if order_data.service_ids:
                service_result = await db.execute(
                    select(Service).where(Service.id.in_(order_data.service_ids), Service.is_active == True)
                )
                services = service_result.scalars().all()
                
                for service in services:
                    unit_price = Decimal(str(service.base_price))
                    quantity = Decimal("1")
                    subtotal = unit_price * quantity
                    
                    # Apply same discount as plan
                    service_discount = (subtotal * discount_percent) / Decimal("100.00")
                    service_discounted = subtotal - service_discount
                    service_tax = (service_discounted * Decimal("18.00")) / Decimal("100.00")
                    service_item_total = service_discounted + service_tax
                    
                    service_total += service_item_total
                    
                    # Store for OrderService creation later
                    service_records.append({
                        "service_id": service.id,
                        "unit_price": unit_price,
                        "quantity": quantity,
                        "subtotal": subtotal,
                        "discount_amount": service_discount,
                        "tax_amount": service_tax,
                        "total_amount": service_item_total,
                        "service_status": "pending",
                    })
                    
                    # Invoice line item
                    invoice_service_items.append({
                        "description": f"{service.name} - {service.category.value}",
                        "quantity": int(quantity),
                        "unit_price": float(unit_price),
                        "discount_percent": float(discount_percent),
                        "discount_amount": float(service_discount),
                        "subtotal_after_discount": float(service_discounted),
                        "gst_percent": 18.0,
                        "gst_amount": float(service_tax),
                        "total_amount": float(service_item_total)
                    })

            # ✅ 7️⃣ Calculate final totals (Plan + Addons + Services)
            total_discount_amount = plan_discount_amount + sum(a["discount_amount"] for a in addon_records) + sum(s["discount_amount"] for s in service_records)
            total_discounted = plan_discounted_total + sum(a["subtotal"] - a["discount_amount"] for a in addon_records) + sum(s["subtotal"] - s["discount_amount"] for s in service_records)
            
            # GST calculation (18% on total discounted amount)
            gst_amount = (total_discounted * Decimal("18.00")) / Decimal("100.00")
            
            # Grand total for customer invoice
            grand_total = total_discounted + gst_amount

            # ✅ 8️⃣ Create Order
            new_order = Order(
                user_id=user_id,
                plan_id=order_data.plan_id,
                order_number=order_number,
                billing_cycle=order_data.billing_cycle,
                total_amount=plan_subtotal + sum(a["subtotal"] for a in addon_records) + sum(s["subtotal"] for s in service_records),
                discount_amount=total_discount_amount,
                tax_amount=gst_amount,
                grand_total=grand_total,
                server_details=order_data.server_details,  # Kept for backward compatibility
                order_status="pending",
                payment_status="pending",
                currency="INR",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )

            db.add(new_order)
            await db.flush()  # Get new_order.id

            # ✅ 9️⃣ Create OrderAddon records
            for addon_data in addon_records:
                order_addon = OrderAddon(
                    order_id=new_order.id,
                    addon_id=addon_data["addon_id"],
                    unit_price=addon_data["unit_price"],
                    quantity=addon_data["quantity"],
                    subtotal=addon_data["subtotal"],
                    discount_amount=addon_data["discount_amount"],
                    tax_amount=addon_data["tax_amount"],
                    total_amount=addon_data["total_amount"],
                    billing_type=addon_data["billing_type"],
                    is_active=True,
                )
                db.add(order_addon)

            # ✅ 🔟 Create OrderService records
            for service_data in service_records:
                order_service = OrderServiceModel(
                    order_id=new_order.id,
                    service_id=service_data["service_id"],
                    unit_price=service_data["unit_price"],
                    quantity=service_data["quantity"],
                    subtotal=service_data["subtotal"],
                    discount_amount=service_data["discount_amount"],
                    tax_amount=service_data["tax_amount"],
                    total_amount=service_data["total_amount"],
                    service_status=service_data["service_status"],
                )
                db.add(order_service)

            # ✅ 1️⃣1️⃣ Create Invoice with all line items
            invoice_number = await self._generate_invoice_number(db)
            
            # Build complete invoice items array: plan + addons + services
            plan_item = {
                "description": f"{plan.name} - {order_data.billing_cycle.title()} Plan",
                "quantity": 1,
                "amount": float(grand_total),
                "unit_price": float(plan_subtotal),
                "discount_percent": float(discount_percent),
                "discount_amount": float(plan_discount_amount),
                "subtotal_after_discount": float(plan_discounted_total),
                "gst_percent": 18.0,
                "gst_amount": float((plan_discounted_total * Decimal("18.00")) / Decimal("100.00")),
                "total_amount": float(plan_discounted_total + (plan_discounted_total * Decimal("18.00")) / Decimal("100.00"))
            }
            
            invoice_items = [plan_item] + invoice_addon_items + invoice_service_items
            
            new_invoice = Invoice(
                user_id=user_id,
                order_id=new_order.id,
                invoice_number=invoice_number,
                invoice_date=datetime.utcnow(),
                due_date=datetime.utcnow() + timedelta(days=7),
                subtotal=total_discounted,
                tax_amount=gst_amount,
                total_amount=grand_total,
                amount_paid=Decimal("0.00"),
                balance_due=grand_total,
                status="unpaid",
                payment_status="pending",
                currency="INR",
                tax_rate=Decimal("18.00"),
                late_fee=Decimal("0.00"),
                days_overdue=0,
                items=invoice_items,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )

            db.add(new_invoice)

            # ✅ 1️⃣2️⃣ Commit all changes
            await db.commit()
            await db.refresh(new_order)
            await db.refresh(new_invoice)

            # ✅ 1️⃣3️⃣ Auto Commission (optional)
            # If payment_status == "completed" → auto distribute commission
            if new_order.order_status == "completed":
                referral_service = ReferralService()
                await referral_service.record_commission_earnings(
                    db=db,
                    user_id=new_order.user_id,
                    order_id=new_order.id,
                    plan_amount=new_order.grand_total,
                    plan_type="recurring" if order_data.billing_cycle.lower() == "monthly" else "longterm",
                )

            # ✅ 1️⃣4️⃣ Return combined response with addons and services
            return {
                "order": {
                    "id": new_order.id,
                    "user_id": new_order.user_id,
                    "plan_id": new_order.plan_id,
                    "order_number": new_order.order_number,
                    "order_status": new_order.order_status,
                    "payment_status": new_order.payment_status,
                    "billing_cycle": new_order.billing_cycle,
                    "total_amount": float(new_order.total_amount),
                    "discount_amount": float(new_order.discount_amount),
                    "tax_amount": float(new_order.tax_amount),
                    "grand_total": float(new_order.grand_total),
                    "currency": new_order.currency,
                    "server_details": new_order.server_details,
                    "addons": [
                        {
                            "addon_id": a["addon_id"],
                            "unit_price": float(a["unit_price"]),
                            "quantity": float(a["quantity"]),
                            "total": float(a["total_amount"])
                        }
                        for a in addon_records
                    ],
                    "services": [
                        {
                            "service_id": s["service_id"],
                            "unit_price": float(s["unit_price"]),
                            "quantity": float(s["quantity"]),
                            "total": float(s["total_amount"])
                        }
                        for s in service_records
                    ],
                    "created_at": new_order.created_at,
                    "updated_at": new_order.updated_at,
                },
                "invoice": {
                    "id": new_invoice.id,
                    "invoice_number": new_invoice.invoice_number,
                    "order_id": new_invoice.order_id,
                    "user_id": new_invoice.user_id,
                    "total_amount": float(new_invoice.total_amount),
                    "subtotal": float(new_invoice.subtotal),
                    "tax_amount": float(new_invoice.tax_amount),
                    "items": new_invoice.items,
                    "invoice_date": new_invoice.invoice_date,
                    "due_date": new_invoice.due_date,
                    "created_at": new_invoice.created_at,
                    "updated_at": new_invoice.updated_at,
                    "status": new_invoice.status,
                    "payment_status": new_invoice.payment_status,
                    "currency": new_invoice.currency,
                },
            }

        except Exception as e:
            await db.rollback()
            raise ValueError(f"❌ Error creating order: {str(e)}")


    async def update_order(
        self, db: AsyncSession, order_id: int, order_update: OrderUpdate
    ) -> Optional[Order]:
        order = await self.get_order_by_id(db, order_id)
        if not order:
            return None

        update_data = order_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(order, field, value)

        try:
            db.add(order)
            await db.commit()
            await db.refresh(order)
            return order
        except Exception:
            await db.rollback()
            raise

    # -----------------------------
    # 🔹 ORDER STATUS ACTIONS
    # -----------------------------
    async def cancel_order(self, db: AsyncSession, order_id: int) -> bool:
        order = await self.get_order_by_id(db, order_id)
        if not order:
            return False

        order.order_status = "cancelled"
        try:
            db.add(order)
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            raise

    async def cancel_user_order(
        self, db: AsyncSession, user_id: int, order_id: int
    ) -> bool:
        order = await self.get_user_order(db, user_id, order_id)
        if not order:
            return False

        order.order_status = "cancelled"
        try:
            db.add(order)
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            raise

    async def complete_order(self, db: AsyncSession, order_id: int):
        """
        Mark order as completed and create multi-level referral earnings.
        """
        # 1️⃣ Fetch order
        result = await db.execute(select(Order).filter(Order.id == order_id))
        order = result.scalars().first()
        if not order:
            return False

        # 2️⃣ Update order
        order.order_status = "completed"
        order.completed_at = datetime.utcnow()
        db.add(order)

        # 3️⃣ Fetch buyer
        result = await db.execute(select(UserProfile).filter(UserProfile.id == order.user_id))
        buyer = result.scalars().first()
        if not buyer:
            await db.commit()
            return True

        # 4️⃣ Commission structure (percentages)
        commission_structure = {
            1: 10.0,
            2: 5.0,
            3: 2.0,
        }

        # 5️⃣ Detect referral direction and traverse up
        current_user = buyer
        current_level = 1
        order_amount = float(order.grand_total or 0)

        while current_user.referred_by and current_level <= len(commission_structure):
            # find the referrer (upline)
            result = await db.execute(select(UserProfile).filter(UserProfile.id == current_user.referred_by))
            referrer = result.scalars().first()
            if not referrer:
                break

            commission_rate = commission_structure[current_level]
            commission_amount = round(order_amount * (commission_rate / 100), 2)

            # Create referral earning record
            earning = ReferralEarning(
                user_id=buyer.id,
                referred_user_id=referrer.id,
                order_id=order.id,
                level=current_level,
                commission_rate=commission_rate,
                order_amount=order_amount,
                commission_amount=commission_amount,
                status="pending",
                earned_at=datetime.utcnow(),
            )
            db.add(earning)

            # Move up the chain
            current_user = referrer
            current_level += 1

        await db.commit()
        await db.refresh(order)
        return True



    async def get_total_orders(self, db: AsyncSession) -> int:
        result = await db.execute(select(func.count(Order.id)))
        return result.scalar() or 0

    async def get_recent_orders(self, db: AsyncSession, limit: int = 5) -> List[Order]:
        result = await db.execute(
            select(Order).order_by(Order.created_at.desc()).limit(limit)
        )
        return result.scalars().all()

    async def get_order_stats(self, db: AsyncSession) -> OrderSummary:
        total_orders = await self.get_total_orders(db)

        pending = await db.execute(
            select(func.count(Order.id)).where(Order.order_status == "pending")
        )
        completed = await db.execute(
            select(func.count(Order.id)).where(Order.order_status == "completed")
        )
        cancelled = await db.execute(
            select(func.count(Order.id)).where(Order.order_status == "cancelled")
        )

        total_revenue_result = await db.execute(
            select(func.sum(Order.total_amount)).where(Order.payment_status == "paid")
        )
        total_revenue = total_revenue_result.scalar() or Decimal("0.0")

        start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_revenue_result = await db.execute(
            select(func.sum(Order.total_amount)).where(
                Order.payment_status == "paid", Order.created_at >= start_of_month
            )
        )
        monthly_revenue = monthly_revenue_result.scalar() or Decimal("0.0")

        return OrderSummary(
            total_orders=total_orders,
            pending_orders=pending.scalar() or 0,
            completed_orders=completed.scalar() or 0,
            cancelled_orders=cancelled.scalar() or 0,
            total_revenue=total_revenue,
            monthly_revenue=monthly_revenue,
        )

    # -----------------------------
    # 🔹 PRIVATE HELPERS
    # -----------------------------
    async def _generate_order_number(self, db: AsyncSession, length: int = 10) -> str:
        chars = string.ascii_uppercase + string.digits
        while True:
            number = "ORD-" + "".join(secrets.choice(chars) for _ in range(length))
            result = await db.execute(select(Order).where(Order.order_number == number))
            if not result.scalar_one_or_none():
                return number

    async def _generate_invoice_number(self, db: AsyncSession, length: int = 6) -> str:
        chars = string.digits
        while True:
            number = "INV-" + "".join(secrets.choice(chars) for _ in range(length))
            result = await db.execute(
                select(Invoice).where(Invoice.invoice_number == number)
            )
            if not result.scalar_one_or_none():
                return number

   # ====================== Razorpay Integration Helpers ====================== #

    async def complete_order_by_gateway(
        self,
        db: AsyncSession,
        razorpay_order_id: str,
        payment_id: str,
        amount_paid: float = 0.0
    ) -> bool:
        """
        ✅ Mark order as 'completed' when Razorpay payment is captured.
        Automatically links the Razorpay payment_id and updates invoice.
        """

        try:
            # 🔹 Find order using gateway_order_id (linked when created via Razorpay)
            result = await db.execute(
                select(Order).where(Order.gateway_order_id == razorpay_order_id)
            )
            order = result.scalars().first()

            if not order:
                return False

            # ⚙️ Prevent double marking
            if order.payment_status == "paid" and order.order_status == "completed":
                return True  # Already completed

            # 🔹 Update order status
            order.payment_id = payment_id
            order.payment_status = "paid"
            order.order_status = "completed"
            order.payment_date = datetime.utcnow()
            order.updated_at = datetime.utcnow()

            # 🔹 Update linked invoice (if any)
            invoice_result = await db.execute(
                select(Invoice).where(Invoice.order_id == order.id)
            )
            invoice = invoice_result.scalars().first()
            if invoice:
                invoice.status = "paid"
                invoice.payment_status = "paid"
                invoice.amount_paid = Decimal(str(amount_paid))
                invoice.balance_due = Decimal("0.00")
                invoice.updated_at = datetime.utcnow()
                db.add(invoice)

            db.add(order)
            await db.commit()
            await db.refresh(order)

            return True

        except Exception as e:
            await db.rollback()
            print(f"❌ Error in complete_order_by_gateway: {str(e)}")
            raise