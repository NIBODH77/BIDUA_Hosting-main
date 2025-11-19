from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, Dict, Any
from decimal import Decimal
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.payment_service import PaymentService
from app.services.commission_service import CommissionService
from app.services.order_service import OrderService
from app.services.plan_service import PlanService
from app.schemas.users import User
from app.models.payment import PaymentType, PaymentStatus
from app.core.config import settings
from pydantic import BaseModel


router = APIRouter()


class RazorpayKeyResponse(BaseModel):
    razorpay_key_id: str


@router.get("/get-razorpay-key", response_model=RazorpayKeyResponse)
async def get_razorpay_key():
    """
    Returns the Razorpay Key ID from the settings.
    """
    return {"razorpay_key_id": settings.RAZORPAY_KEY_ID}


# --------------------------------------------------------
# Request/Response Schemas
# --------------------------------------------------------
class CreatePaymentRequest(BaseModel):
    """
    Unified payment creation request for subscription, server, and invoice payments
    """
    payment_type: str  # 'subscription', 'server', or 'invoice'
    plan_id: Optional[int] = None  # Required only for server purchase
    billing_cycle: Optional[str] = 'one_time'
    server_config: Optional[Dict[str, Any]] = None  # For server purchase
    amount: Optional[float] = None  # Required for invoice payment
    invoice_id: Optional[int] = None  # For invoice payment tracking


class VerifyPaymentRequest(BaseModel):
    """Payment verification request"""
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# --------------------------------------------------------
# ✅ Create Payment Order (Subscription or Server)
# --------------------------------------------------------
@router.post("/create-order")
async def create_payment_order(
    payment_request: CreatePaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create Razorpay payment order for subscription (499 plan) or server purchase
    
    This endpoint:
    1. Creates a PaymentTransaction record
    2. Calculates user-specific discount
    3. Creates Razorpay order
    4. Returns order details for frontend payment
    """
    payment_service = PaymentService()
    plan_service = PlanService()

    # Validate payment type
    if payment_request.payment_type not in ['subscription', 'server', 'invoice']:
        raise HTTPException(
            status_code=400,
            detail="Invalid payment_type. Must be 'subscription', 'server', or 'invoice'"
        )

    # Determine amount based on payment type
    if payment_request.payment_type == 'subscription':
        # ₹499 Premium Subscription - No discount, No tax, Direct ₹499
        # plan_id is NOT required for this
        amount = Decimal('499.00')  # Fixed ₹499 premium amount
        billing_cycle = 'one_time'
        
        metadata = {
            'plan_id': None,  # Not related to any server plan
            'billing_cycle': billing_cycle,
            'plan_name': 'Premium Subscription',
            'subscription_type': 'premium_membership',
            'is_premium_plan': True
        }
    elif payment_request.payment_type == 'invoice':
        # For invoice payment - use amount passed from frontend
        if not payment_request.amount:
            raise HTTPException(status_code=400, detail="amount is required for invoice payment")
        
        amount = Decimal(str(payment_request.amount))
        billing_cycle = 'one_time'
        
        metadata = {
            'plan_id': None,
            'billing_cycle': billing_cycle,
            'payment_for': 'invoice',
            'invoice_id': payment_request.invoice_id
        }
    else:
        # For server purchase - plan_id is mandatory
        if not payment_request.plan_id:
            raise HTTPException(status_code=400, detail="plan_id is required for server purchase")
        
        # Get plan details for server purchase
        plan = await plan_service.get_plan_by_id(db, payment_request.plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Use amount from frontend if provided (includes all addons AND tax already calculated)
        # Frontend sends final total, so we mark it to skip backend tax/discount recalculation
        if payment_request.amount:
            amount = Decimal(str(payment_request.amount))
            skip_backend_calculation = True  # Use frontend's final amount
        else:
            amount = plan.monthly_price  # Fallback to base server cost
            skip_backend_calculation = False  # Let backend calculate
        
        # Check if user has active ₹499 premium subscription
        from sqlalchemy import select, and_
        from app.models.users import UserProfile
        result = await db.execute(
            select(UserProfile).where(UserProfile.id == current_user.id)
        )
        user = result.scalars().first()
        has_premium = user.subscription_status == 'active' if user else False
        
        metadata = {
            'plan_id': payment_request.plan_id,
            'server_config': payment_request.server_config,
            'plan_name': plan.name,
            'has_premium_subscription': has_premium,
            'enable_commission': has_premium,  # Commission केवल premium users के लिए
            'skip_backend_calculation': skip_backend_calculation  # Flag to skip tax/discount recalc
        }

    try:
        # Create payment transaction with Razorpay order
        payment_type = PaymentType.SUBSCRIPTION if payment_request.payment_type == 'subscription' else PaymentType.SERVER
        
        payment_transaction = await payment_service.create_payment_transaction(
            db=db,
            user_id=current_user.id,
            payment_type=payment_type,
            amount=amount,
            plan_id=payment_request.plan_id,
            billing_cycle=payment_request.billing_cycle,
            metadata=metadata
        )

        # print("response is",type(payment_transaction))
        # print("response is",payment_transaction.json())

        response = {
            "success": True,
            "message": "Payment order created successfully",
            "payment": {
                "transaction_id": payment_transaction.id,
                "razorpay_order_id": payment_transaction.razorpay_order_id,
                "amount": float(payment_transaction.subtotal),
                "discount": float(payment_transaction.discount_applied),
                "tax": float(payment_transaction.tax_amount),
                "total_amount": float(payment_transaction.total_amount),
                "currency": payment_transaction.currency,
                "payment_type": payment_transaction.payment_type.value,
                "activation_type": payment_transaction.activation_type.value
            }
        }
        
        # Add plan details only for server purchase
        if payment_request.payment_type == 'server' and payment_request.plan_id:
            plan = await plan_service.get_plan_by_id(db, payment_request.plan_id)
            response["plan"] = {
                "id": plan.id,
                "name": plan.name,
                "billing_cycle": payment_request.billing_cycle
            }
        else:
            # For ₹499 premium subscription
            response["plan"] = {
                "id": None,
                "name": "Premium Subscription",
                "billing_cycle": "one_time"
            }
        
        return response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create payment order: {str(e)}"
        )


# --------------------------------------------------------
# ✅ Verify Payment and Complete Transaction
# --------------------------------------------------------
@router.post("/verify-payment")
async def verify_payment(
    payment_data: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Verify Razorpay payment and complete the transaction
    
    This endpoint:
    1. Verifies Razorpay payment signature
    2. Updates PaymentTransaction to PAID status
    3. Creates Order in database
    4. Distributes commission (if user activated via referral)
    5. Updates user subscription status (for subscription payments)
    """
    import time
    start_time = time.time()
    print(f"🔄 Payment verification started at {start_time}")
    
    payment_service = PaymentService()
    commission_service = CommissionService()
    order_service = OrderService()

    try:
        # Verify and complete payment
        t1 = time.time()
        payment_transaction = await payment_service.verify_and_complete_payment(
            db=db,
            razorpay_order_id=payment_data.razorpay_order_id,
            razorpay_payment_id=payment_data.razorpay_payment_id,
            razorpay_signature=payment_data.razorpay_signature
        )
        print(f"⏱️  Payment verification took {time.time() - t1:.2f}s")

        # Check if this is an invoice payment
        payment_for = payment_transaction.payment_metadata.get('payment_for')
        
        if payment_for == 'invoice':
            # For invoice payment, update the invoice status
            invoice_id = payment_transaction.payment_metadata.get('invoice_id')
            
            if invoice_id:
                from sqlalchemy import select
                from app.models.invoice import Invoice as InvoiceModel
                
                invoice_result = await db.execute(
                    select(InvoiceModel).where(InvoiceModel.id == invoice_id)
                )
                invoice_obj = invoice_result.scalars().first()
                
                if invoice_obj:
                    # Update invoice status
                    invoice_obj.payment_status = 'paid'
                    invoice_obj.status = 'paid'
                    invoice_obj.amount_paid = invoice_obj.total_amount
                    invoice_obj.balance_due = 0
                    invoice_obj.payment_date = payment_transaction.paid_at
                    invoice_obj.paid_at = payment_transaction.paid_at
                    invoice_obj.payment_method = 'razorpay'
                    invoice_obj.payment_reference = payment_data.razorpay_payment_id
                    
                    # If invoice has an associated order, create the server
                    if invoice_obj.order_id:
                        from app.models.order import Order as OrderModel
                        from app.services.server_service import ServerService
                        
                        order_result = await db.execute(
                            select(OrderModel).where(OrderModel.id == invoice_obj.order_id)
                        )
                        order_obj = order_result.scalars().first()
                        
                        if order_obj and order_obj.plan_id:
                            # Update order status
                            order_obj.payment_status = 'paid'
                            order_obj.order_status = 'completed'
                            order_obj.razorpay_order_id = payment_data.razorpay_order_id
                            order_obj.razorpay_payment_id = payment_data.razorpay_payment_id
                            order_obj.paid_at = payment_transaction.paid_at
                            
                            # Create server
                            server_service = ServerService()
                            try:
                                # Get plan details to create server
                                from app.services.plan_service import PlanService
                                from app.schemas.server import ServerCreate
                                
                                plan_service = PlanService()
                                plan = await plan_service.get_plan_by_id(db, order_obj.plan_id)
                                
                                if plan:
                                    # Extract addons and services from order metadata
                                    order_addons = order_obj.order_metadata.get('addons', []) if order_obj.order_metadata else []
                                    order_services = order_obj.order_metadata.get('services', []) if order_obj.order_metadata else []
                                    billing_cycle = order_obj.billing_cycle or "monthly"
                                    
                                    server_data = ServerCreate(
                                        plan_id=plan.id,
                                        server_name=f"{plan.name} Server",
                                        hostname=f"server-{current_user.id}-{order_obj.id}",
                                        server_type=plan.plan_type,
                                        operating_system="Ubuntu 22.04 LTS",
                                        vcpu=plan.vcpu,
                                        ram_gb=plan.ram,
                                        storage_gb=plan.storage,
                                        bandwidth_gb=plan.bandwidth,
                                        monthly_cost=float(plan.monthly_price),
                                        billing_cycle=billing_cycle,
                                        addons=order_addons,
                                        services=order_services
                                    )
                                    
                                    server = await server_service.create_user_server(
                                        db=db,
                                        user_id=current_user.id,
                                        server_data=server_data
                                    )
                                    
                                    # Update order with server_id
                                    if isinstance(server, dict):
                                        order_obj.server_id = server.get('id')
                                    else:
                                        order_obj.server_id = server.id
                                        
                            except Exception as e:
                                print(f"Warning: Server creation failed: {str(e)}")
                                # Don't fail the payment if server creation fails
                    
                    await db.commit()
            
            return {
                "success": True,
                "message": "Invoice payment verified successfully",
                "payment": {
                    "transaction_id": payment_transaction.id,
                    "razorpay_payment_id": payment_data.razorpay_payment_id,
                    "amount": float(payment_transaction.total_amount),
                    "status": "paid",
                    "invoice_id": invoice_id
                }
            }
        
        # Check payment type and handle accordingly
        plan_id = payment_transaction.payment_metadata.get('plan_id')
        order_data = None
        order_id = None
        
        # Handle subscription payment (₹499 premium)
        if payment_transaction.payment_type == PaymentType.SUBSCRIPTION:
            t2 = time.time()
            # Create affiliate subscription instead of order
            from app.services.affiliate_service import AffiliateService
            affiliate_service = AffiliateService()
            
            # Create affiliate subscription with payment details
            from app.schemas.affiliate import AffiliateSubscriptionCreate
            subscription_data = AffiliateSubscriptionCreate(
                subscription_type='premium',
                payment_method='razorpay',
                payment_id=payment_data.razorpay_payment_id,
                transaction_id=str(payment_transaction.id),
                amount_paid=float(payment_transaction.total_amount)
            )
            
            affiliate_sub = await affiliate_service.create_affiliate_subscription(
                db=db,
                user_id=current_user.id,
                subscription_data=subscription_data
            )
            print(f"⏱️  Affiliate subscription creation took {time.time() - t2:.2f}s")
            print(f"✅ Affiliate subscription created: {affiliate_sub.id}")
            
            # Update user profile subscription status
            from sqlalchemy import select
            from app.models.users import UserProfile
            result = await db.execute(
                select(UserProfile).where(UserProfile.id == current_user.id)
            )
            user = result.scalars().first()
            if user:
                user.subscription_status = 'active'
                user.subscription_start = datetime.utcnow()
                await db.commit()
            
            # Set order data for response (subscription doesn't create order)
            order_data = {
                'id': None,
                'order_number': f'SUB-{affiliate_sub.id}',
                'order_status': 'active',
                'is_subscription': True
            }
            
        else:
            # For server payments, create order
            from app.schemas.order import OrderCreate
            
            t2 = time.time()
            order_create = OrderCreate(
                plan_id=plan_id,
                billing_cycle=payment_transaction.payment_metadata.get('billing_cycle', 'one_time'),
                total_amount=payment_transaction.total_amount,
                status='active',
                payment_method='razorpay',
                payment_status='paid'
            )

            order = await order_service.create_order(db, current_user.id, order_create)
            print(f"⏱️  Order creation took {time.time() - t2:.2f}s")

            # Extract order details from the returned dictionary
            order_data = order.get('order', {}) if isinstance(order, dict) else order
            order_id = order_data.get('id') if isinstance(order_data, dict) else order_data.id

            # Link payment to order
            t3 = time.time()
            await payment_service.link_payment_to_order(
                db=db,
                payment_transaction_id=payment_transaction.id,
                order_id=order_id
            )
            print(f"⏱️  Payment linking took {time.time() - t3:.2f}s")

            # Update order with payment details - fetch the actual order object
            from sqlalchemy import select
            from app.models.order import Order as OrderModel
            from app.models.invoice import Invoice as InvoiceModel
            
            result = await db.execute(
                select(OrderModel).where(OrderModel.id == order_id)
            )
            order_obj = result.scalars().first()
            
            if order_obj:
                order_obj.payment_type = payment_transaction.payment_type.value
                order_obj.activation_type = payment_transaction.activation_type.value
                order_obj.razorpay_order_id = payment_data.razorpay_order_id
                order_obj.razorpay_payment_id = payment_data.razorpay_payment_id
                order_obj.paid_at = payment_transaction.paid_at
                order_obj.order_status = 'completed'
                order_obj.payment_status = 'paid'
                
                # Update associated invoice
                invoice_result = await db.execute(
                    select(InvoiceModel).where(InvoiceModel.order_id == order_id)
                )
                invoice_obj = invoice_result.scalars().first()
                if invoice_obj:
                    invoice_obj.payment_status = 'paid'
                    invoice_obj.status = 'paid'
                    invoice_obj.amount_paid = invoice_obj.total_amount
                    invoice_obj.balance_due = 0
                    invoice_obj.payment_date = payment_transaction.paid_at
                    invoice_obj.paid_at = payment_transaction.paid_at
                    invoice_obj.payment_method = 'razorpay'
                    invoice_obj.payment_reference = payment_data.razorpay_payment_id
                
                await db.commit()

        # Distribute commission if applicable (skip for subscription payments)
        commission_earnings = []
        if payment_transaction.requires_commission() and payment_transaction.payment_type != PaymentType.SUBSCRIPTION:
            t4 = time.time()
            commission_earnings = await commission_service.distribute_commission(
                db=db,
                payment_transaction_id=payment_transaction.id
            )
            print(f"⏱️  Commission distribution took {time.time() - t4:.2f}s")

        # 🆕 Auto-create server if this is a server purchase
        server_created = None
        if payment_transaction.payment_type == PaymentType.SERVER and plan_id:
            try:
                t5 = time.time()
                from app.services.server_service import ServerService
                from app.schemas.server import ServerCreate
                from sqlalchemy import select
                from app.models.plan import HostingPlan

                server_service = ServerService()

                # Get plan details
                result = await db.execute(select(HostingPlan).filter(HostingPlan.id == plan_id))
                plan = result.scalar_one_or_none()

                if plan:
                    # Extract server config from payment metadata
                    server_metadata = payment_transaction.payment_metadata or {}

                    server_data = ServerCreate(
                        server_name=server_metadata.get('server_name', f'{plan.name} Server'),
                        hostname=server_metadata.get('hostname', f'server-{current_user.id}-{order_id}.bidua.com'),
                        server_type='VPS',
                        operating_system=server_metadata.get('os', 'Ubuntu 22.04 LTS'),
                        vcpu=plan.cpu_cores,
                        ram_gb=plan.ram_gb,
                        storage_gb=plan.storage_gb,
                        bandwidth_gb=plan.bandwidth_gb or 1000,
                        plan_id=plan.id,
                        monthly_cost=plan.base_price
                    )

                    server_created = await server_service.create_user_server(db, current_user.id, server_data)
                    print(f"✅ Server {server_created.id} created for user {current_user.id}")
                    print(f"⏱️  Server creation took {time.time() - t5:.2f}s")
            except Exception as e:
                print(f"❌ Server creation failed: {str(e)}")
                print(f"⏱️  Failed server creation took {time.time() - t5:.2f}s")
                # Don't fail payment verification, but log the error
                import traceback
                traceback.print_exc()

        # 🆕 Auto-activate affiliate subscription after server purchase
        affiliate_activated = False
        if payment_transaction.payment_type == PaymentType.SERVER:
            try:
                t6 = time.time()
                from app.services.affiliate_service import AffiliateService
                affiliate_service = AffiliateService()

                # Activate affiliate subscription (free with server purchase)
                affiliate_sub = await affiliate_service.check_and_activate_from_server_purchase(db, current_user.id)
                affiliate_activated = affiliate_sub is not None
                if affiliate_activated:
                    print(f"✅ Affiliate subscription activated for user {current_user.id}")
                print(f"⏱️  Affiliate activation took {time.time() - t6:.2f}s")
            except Exception as e:
                print(f"❌ Affiliate activation failed: {str(e)}")
                import traceback
                traceback.print_exc()

        print(f"✅ Total payment verification took {time.time() - start_time:.2f}s")

        # Build response based on payment type
        response = {
            "success": True,
            "message": "Payment verified successfully! Welcome to BIDUA Hosting Affiliate Program!" if payment_transaction.payment_type == PaymentType.SUBSCRIPTION else "Payment verified and processed successfully",
            "payment": {
                "transaction_id": payment_transaction.id,
                "payment_id": payment_data.razorpay_payment_id,
                "amount": float(payment_transaction.total_amount),
                "status": payment_transaction.payment_status.value,
                "payment_type": payment_transaction.payment_type.value,
                "payment_method": payment_transaction.payment_method
            }
        }
        
        # Add order info if available
        if order_data:
            response["order"] = {
                "id": order_data.get('id') if isinstance(order_data, dict) else order_data.id,
                "order_number": order_data.get('order_number') if isinstance(order_data, dict) else order_data.order_number,
                "status": order_data.get('order_status') if isinstance(order_data, dict) else order_data.order_status,
                "is_subscription": order_data.get('is_subscription', False)
            }
        
        # Add commission info for server payments
        if payment_transaction.payment_type != PaymentType.SUBSCRIPTION:
            response["commission"] = {
                "distributed": payment_transaction.commission_distributed,
                "earnings_count": len(commission_earnings),
                "total_distributed": sum(float(e.commission_amount) for e in commission_earnings)
            }
        
        # Add server info for server payments
        if payment_transaction.payment_type == PaymentType.SERVER:
            response["server"] = {
                "created": server_created is not None,
                "server_id": server_created.id if server_created else None,
                "hostname": server_created.hostname if server_created else None
            }
            response["affiliate"] = {
                "activated": affiliate_activated
            }
        
        # Add affiliate info for subscription payments
        if payment_transaction.payment_type == PaymentType.SUBSCRIPTION:
            response["affiliate"] = {
                "activated": True,
                "subscription_type": "premium",
                "message": "🎉 Your affiliate account is now active! Start referring and earning today!"
            }
        
        return response

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Payment verification failed: {str(e)}"
        )


# --------------------------------------------------------
# ✅ Razorpay Webhook Handler
# --------------------------------------------------------
@router.post("/razorpay-webhook")
async def razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_razorpay_signature: Optional[str] = Header(None)
):
    """
    Handle Razorpay webhooks for payment events
    
    This is called by Razorpay for events like:
    - payment.authorized
    - payment.captured
    - payment.failed
    - order.paid
    """
    payment_service = PaymentService()
    commission_service = CommissionService()

    try:
        # Get webhook payload
        payload = await request.json()
        
        # Verify webhook signature
        from app.services.razorpay_service import RazorpayService
        razorpay_service = RazorpayService()
        
        is_valid = await razorpay_service.process_webhook(
            payload=payload,
            signature=x_razorpay_signature
        )

        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

        # Process webhook event
        event = payload.get('event')
        
        if event == 'payment.captured':
            # Payment was successful
            payment_entity = payload.get('payload', {}).get('payment', {}).get('entity', {})
            order_id = payment_entity.get('order_id')
            payment_id = payment_entity.get('id')

            # Find and update payment transaction
            payment_transaction = await payment_service.get_payment_by_razorpay_order_id(
                db=db,
                razorpay_order_id=order_id
            )

            if payment_transaction and payment_transaction.payment_status == PaymentStatus.INITIATED:
                payment_transaction.razorpay_payment_id = payment_id
                payment_transaction.payment_status = PaymentStatus.PAID
                payment_transaction.paid_at = datetime.utcnow()
                await db.commit()

                # Trigger commission distribution if needed
                if payment_transaction.requires_commission():
                    await commission_service.distribute_commission(
                        db=db,
                        payment_transaction_id=payment_transaction.id
                    )

        elif event == 'payment.failed':
            # Payment failed
            payment_entity = payload.get('payload', {}).get('payment', {}).get('entity', {})
            order_id = payment_entity.get('order_id')
            error_description = payment_entity.get('error_description', 'Payment failed')

            await payment_service.mark_payment_failed(
                db=db,
                razorpay_order_id=order_id,
                reason=error_description
            )

        return {"status": "success", "event": event}

    except Exception as e:
        print(f"❌ Webhook processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------------
# ✅ Get Payment Status
# --------------------------------------------------------
@router.get("/payment-status/{razorpay_order_id}")
async def get_payment_status(
    razorpay_order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get payment transaction status
    """
    payment_service = PaymentService()

    payment_transaction = await payment_service.get_payment_by_razorpay_order_id(
        db=db,
        razorpay_order_id=razorpay_order_id
    )

    if not payment_transaction:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Verify user owns this payment
    if payment_transaction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "success": True,
        "payment": {
            "id": payment_transaction.id,
            "razorpay_order_id": payment_transaction.razorpay_order_id,
            "razorpay_payment_id": payment_transaction.razorpay_payment_id,
            "amount": float(payment_transaction.total_amount),
            "status": payment_transaction.payment_status.value,
            "payment_type": payment_transaction.payment_type.value,
            "activation_type": payment_transaction.activation_type.value,
            "commission_distributed": payment_transaction.commission_distributed,
            "created_at": payment_transaction.created_at.isoformat(),
            "paid_at": payment_transaction.paid_at.isoformat() if payment_transaction.paid_at else None
        }
    }
