# # from fastapi import APIRouter, Depends, HTTPException
# # from sqlalchemy.orm import Session
# # from sqlalchemy.ext.asyncio import AsyncSession
# # from typing import List

# # # from app.database.session import get_db
# # from app.core.database import get_db

# # from app.core.security import get_current_user
# # from app.services.billing_service import BillingService
# # from app.schemas.billing import PaymentMethod, PaymentMethodCreate, BillingSettings
# # from app.schemas.users import User

# # router = APIRouter()

# # @router.get("/payment-methods", response_model=List[PaymentMethod])
# # async def get_payment_methods(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Get user's payment methods
# #     """
# #     return billing_service.get_user_payment_methods(db, current_user.id)

# # @router.post("/payment-methods", response_model=PaymentMethod)
# # async def create_payment_method(
# #     payment_method: PaymentMethodCreate,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Add new payment method
# #     """
# #     return billing_service.create_payment_method(db, current_user.id, payment_method)

# # @router.put("/payment-methods/{method_id}/default")
# # async def set_default_payment_method(
# #     method_id: int,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Set payment method as default
# #     """
# #     success = billing_service.set_default_payment_method(db, current_user.id, method_id)
# #     if not success:
# #         raise HTTPException(status_code=404, detail="Payment method not found")
# #     return {"message": "Payment method set as default"}

# # @router.delete("/payment-methods/{method_id}")
# # async def delete_payment_method(
# #     method_id: int,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Delete payment method
# #     """
# #     success = billing_service.delete_payment_method(db, current_user.id, method_id)
# #     if not success:
# #         raise HTTPException(status_code=404, detail="Payment method not found")
# #     return {"message": "Payment method deleted successfully"}

# # @router.get("/settings", response_model=BillingSettings)
# # async def get_billing_settings(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Get billing settings
# #     """
# #     settings = billing_service.get_user_billing_settings(db, current_user.id)
# #     if not settings:
# #         # Create default settings if not exists
# #         settings = billing_service.create_default_billing_settings(db, current_user.id)
# #     return settings

# # @router.put("/settings", response_model=BillingSettings)
# # async def update_billing_settings(
# #     settings_update: BillingSettings,
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Update billing settings
# #     """
# #     return billing_service.update_billing_settings(db, current_user.id, settings_update)

# # @router.get("/current-balance")
# # async def get_current_balance(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Get current account balance
# #     """
# #     from app.services.invoice_service import InvoiceService
# #     invoice_service = InvoiceService()
    
# #     balance = invoice_service.get_user_current_balance(db, current_user.id)
# #     return {
# #         "balance": float(balance),
# #         "currency": "INR",
# #         "outstanding_invoices": invoice_service.get_user_pending_invoices_count(db, current_user.id)
# #     }

# # @router.post("/auto-renewal/toggle")
# # async def toggle_auto_renewal(
# #     db: AsyncSession = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# #     billing_service: BillingService = Depends()
# # ):
# #     """
# #     Toggle auto-renewal setting
# #     """
# #     settings = billing_service.toggle_auto_renewal(db, current_user.id)
# #     return {
# #         "message": "Auto-renewal setting updated",
# #         "auto_renewal": settings.auto_renewal
# #     }




# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List

# from app.core.database import get_db
# from app.core.security import get_current_user
# from app.services.billing_service import BillingService
# from app.schemas.billing import PaymentMethod, PaymentMethodCreate, BillingSettings
# from app.schemas.users import User

# router = APIRouter()

# # ---------------------- PAYMENT METHODS ----------------------

# @router.get("/payment-methods", response_model=List[PaymentMethod])
# async def get_payment_methods(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Get user's payment methods"""
#     return await billing_service.get_user_payment_methods(db, current_user.id)


# @router.post("/payment-methods", response_model=PaymentMethod)
# async def create_payment_method(
#     payment_method: PaymentMethodCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Add new payment method"""
#     return await billing_service.create_payment_method(db, current_user.id, payment_method)


# @router.put("/payment-methods/{method_id}/default")
# async def set_default_payment_method(
#     method_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Set payment method as default"""
#     success = await billing_service.set_default_payment_method(db, current_user.id, method_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Payment method not found")
#     return {"message": "Payment method set as default"}


# @router.delete("/payment-methods/{method_id}")
# async def delete_payment_method(
#     method_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Delete payment method"""
#     success = await billing_service.delete_payment_method(db, current_user.id, method_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Payment method not found")
#     return {"message": "Payment method deleted successfully"}


# # ---------------------- BILLING SETTINGS ----------------------

# @router.get("/settings", response_model=BillingSettings)
# async def get_billing_settings(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Get billing settings"""
#     settings = await billing_service.get_user_billing_settings(db, current_user.id)
#     if not settings:
#         # Create default settings if not exists
#         settings = await billing_service.create_default_billing_settings(db, current_user.id)
#     return settings


# @router.put("/settings", response_model=BillingSettings)
# async def update_billing_settings(
#     settings_update: BillingSettings,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Update billing settings"""
#     return await billing_service.update_billing_settings(db, current_user.id, settings_update)


# # ---------------------- ACCOUNT BALANCE ----------------------

# @router.get("/current-balance")
# async def get_current_balance(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Get current account balance"""
#     from app.services.invoice_service import InvoiceService
#     invoice_service = InvoiceService()

#     balance = await invoice_service.get_user_current_balance(db, current_user.id)
#     count = await invoice_service.get_user_pending_invoices_count(db, current_user.id)
    
#     return {
#         "balance": float(balance),
#         "currency": "INR",
#         "outstanding_invoices": count
#     }


# # ---------------------- AUTO-RENEWAL ----------------------

# @router.post("/auto-renewal/toggle")
# async def toggle_auto_renewal(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     billing_service: BillingService = Depends()
# ):
#     """Toggle auto-renewal setting"""
#     settings = await billing_service.toggle_auto_renewal(db, current_user.id)
#     return {
#         "message": "Auto-renewal setting updated",
#         "auto_renewal": settings.auto_renewal
#     }




from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.billing_service import BillingService
from app.schemas.billing import PaymentMethod, PaymentMethodCreate, BillingSettings, BillingSettingsUpdate
from app.schemas.users import User

router = APIRouter()

# ---------------------- PAYMENT METHODS ----------------------

@router.get("/payment-methods", response_model=List[PaymentMethod])
async def get_payment_methods(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Get user's payment methods"""
    return await billing_service.get_user_payment_methods(db, current_user.id)


@router.post("/payment-methods", response_model=PaymentMethod)
async def create_payment_method(
    payment_method: PaymentMethodCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Add new payment method"""
    return await billing_service.create_payment_method(db, current_user.id, payment_method)


@router.put("/payment-methods/{method_id}/default")
async def set_default_payment_method(
    method_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Set payment method as default"""
    success = await billing_service.set_default_payment_method(db, current_user.id, method_id)
    if not success:
        raise HTTPException(status_code=404, detail="Payment method not found")
    return {"message": "Payment method set as default"}


@router.delete("/payment-methods/{method_id}")
async def delete_payment_method(
    method_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Delete payment method"""
    success = await billing_service.delete_payment_method(db, current_user.id, method_id)
    if not success:
        raise HTTPException(status_code=404, detail="Payment method not found")
    return {"message": "Payment method deleted successfully"}


# ---------------------- BILLING SETTINGS ----------------------

@router.get("/settings", response_model=BillingSettings)
async def get_billing_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Get billing settings"""
    settings = await billing_service.get_user_billing_settings(db, current_user.id)
    if not settings:
        # Create default settings if not exists
        settings = await billing_service.create_default_billing_settings(db, current_user.id)
    return settings


@router.put("/settings", response_model=BillingSettings)
async def update_billing_settings(
    settings_update: BillingSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Update billing settings"""
    return await billing_service.update_billing_settings(db, current_user.id, settings_update)


# ---------------------- ACCOUNT BALANCE ----------------------

@router.get("/current-balance")
async def get_current_balance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Get current account balance"""
    from app.services.invoice_service import InvoiceService
    invoice_service = InvoiceService()

    balance = await invoice_service.get_user_current_balance(db, current_user.id)
    count = await invoice_service.get_user_pending_invoices_count(db, current_user.id)
    
    return {
        "balance": float(balance),
        "currency": "INR",
        "outstanding_invoices": count
    }


# ---------------------- AUTO-RENEWAL ----------------------

@router.post("/auto-renewal/toggle")
async def toggle_auto_renewal(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    billing_service: BillingService = Depends()
):
    """Toggle auto-renewal setting"""
    settings = await billing_service.toggle_auto_renewal(db, current_user.id)
    return {
        "message": "Auto-renewal setting updated",
        "auto_renewal": settings.auto_renewal
    }
