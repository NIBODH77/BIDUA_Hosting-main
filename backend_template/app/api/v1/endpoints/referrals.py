# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List

# from app.core.database import get_db
# from app.core.security import get_current_user, get_current_admin_user
# from app.services.referral_service import ReferralService
# from app.schemas.referrals import (
#     ReferralPayout, ReferralPayoutCreate, ReferralPayoutAction,
#     ReferralEarning, ReferralStats, BankAccountDetails
# )
# from app.schemas.users import User

# router = APIRouter()

# @router.get("/stats", response_model=ReferralStats)
# async def get_referral_stats(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get user's referral statistics
#     """
#     return referral_service.get_user_referral_stats(db, current_user.id)

# @router.get("/earnings", response_model=List[ReferralEarning])
# async def get_referral_earnings(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get user's referral earnings
#     """
#     return referral_service.get_user_earnings(db, current_user.id)

# @router.get("/payouts", response_model=List[ReferralPayout])
# async def get_referral_payouts(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get user's referral payouts
#     """
#     return referral_service.get_user_payouts(db, current_user.id)

# @router.post("/payouts/request", response_model=ReferralPayout)
# async def request_payout(
#     payout_data: ReferralPayoutCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Request referral payout
#     """
#     # Check if user has sufficient balance
#     stats = referral_service.get_user_referral_stats(db, current_user.id)
#     if stats.available_balance < payout_data.gross_amount:
#         raise HTTPException(
#             status_code=400,
#             detail="Insufficient balance for payout"
#         )
    
#     if payout_data.gross_amount < 500:  # Minimum payout amount
#         raise HTTPException(
#             status_code=400,
#             detail="Minimum payout amount is ₹500"
#         )
    
#     return referral_service.request_payout(db, current_user.id, payout_data)

# @router.get("/referrals/list")
# async def get_referral_list(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get list of referred users
#     """
#     return referral_service.get_referred_users(db, current_user.id)

# @router.get("/admin/payouts", response_model=List[ReferralPayout])
# async def get_all_payouts(
#     status: str = "all",
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get all referral payouts (Admin only)
#     """
#     return referral_service.get_all_payouts(db, status)

# @router.post("/admin/payouts/{payout_id}/approve")
# async def approve_payout(
#     payout_id: int,
#     action: ReferralPayoutAction,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Approve referral payout (Admin only)
#     """
#     success = referral_service.approve_payout(db, payout_id, action.payment_reference)
#     if not success:
#         raise HTTPException(status_code=404, detail="Payout not found or already processed")
#     return {"message": "Payout approved successfully"}

# @router.post("/admin/payouts/{payout_id}/reject")
# async def reject_payout(
#     payout_id: int,
#     action: ReferralPayoutAction,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Reject referral payout (Admin only)
#     """
#     success = referral_service.reject_payout(db, payout_id, action.reject_reason)
#     if not success:
#         raise HTTPException(status_code=404, detail="Payout not found or already processed")
#     return {"message": "Payout rejected successfully"}

# @router.get("/admin/stats")
# async def get_admin_referral_stats(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get admin referral statistics (Admin only)
#     """
#     return referral_service.get_admin_referral_stats(db)

# @router.get("/commission-structure")
# async def get_commission_structure():
#     """
#     Get referral commission structure
#     """
#     return {
#         "recurring_plans": {
#             "level_1": "5%",
#             "level_2": "1%", 
#             "level_3": "1%"
#         },
#         "long_term_plans": {
#             "level_1": "15%",
#             "level_2": "3%",
#             "level_3": "2%"
#         },
#         "payout_info": {
#             "minimum_payout": "₹500",
#             "tds": "10%",
#             "service_tax": "18%",
#             "processing_time": "7-10 business days"
#         }
#     }





# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List

# from app.core.database import get_db
# from app.core.security import get_current_user, get_current_admin_user
# from app.services.referral_service import ReferralService
# from app.schemas.referrals import (
#     ReferralPayout, ReferralPayoutCreate, ReferralPayoutAction,
#     ReferralEarning, ReferralStats
# )
# from app.schemas.users import User

# router = APIRouter()


# # -------------------------------------------------------------
# # USER ENDPOINTS
# # -------------------------------------------------------------

# @router.get("/stats", response_model=ReferralStats)
# async def get_referral_stats(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get user's referral statistics
#     """
#     return await referral_service.get_user_referral_stats(db, current_user.id)


# @router.get("/earnings", response_model=List[ReferralEarning])
# async def get_referral_earnings(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get user's referral earnings
#     """
#     return await referral_service.get_user_earnings(db, current_user.id)


# @router.get("/payouts", response_model=List[ReferralPayout])
# async def get_referral_payouts(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get user's referral payouts
#     """
#     return await referral_service.get_user_payouts(db, current_user.id)


# @router.post("/payouts/request", response_model=ReferralPayout)
# async def request_payout(
#     payout_data: ReferralPayoutCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Request referral payout
#     """
#     # Get user's referral stats
#     stats = await referral_service.get_user_referral_stats(db, current_user.id)

#     # Check available balance
#     if stats.available_balance < payout_data.gross_amount:
#         raise HTTPException(
#             status_code=400,
#             detail="Insufficient balance for payout"
#         )

#     # Minimum payout amount check
#     if payout_data.gross_amount < 500:
#         raise HTTPException(
#             status_code=400,
#             detail="Minimum payout amount is ₹500"
#         )

#     # Proceed with payout request
#     return await referral_service.request_payout(db, current_user.id, payout_data)


# @router.get("/referrals/list")
# async def get_referral_list(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get list of referred users
#     """
#     return await referral_service.get_referred_users(db, current_user.id)


# # -------------------------------------------------------------
# # ADMIN ENDPOINTS
# # -------------------------------------------------------------

# @router.get("/admin/payouts", response_model=List[ReferralPayout])
# async def get_all_payouts(
#     status: str = "all",
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get all referral payouts (Admin only)
#     """
#     return await referral_service.get_all_payouts(db, status)


# @router.post("/admin/payouts/{payout_id}/approve")
# async def approve_payout(
#     payout_id: int,
#     action: ReferralPayoutAction,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Approve referral payout (Admin only)
#     """
#     success = await referral_service.approve_payout(db, payout_id, action.payment_reference)
#     if not success:
#         raise HTTPException(status_code=404, detail="Payout not found or already processed")
#     return {"message": "Payout approved successfully"}


# @router.post("/admin/payouts/{payout_id}/reject")
# async def reject_payout(
#     payout_id: int,
#     action: ReferralPayoutAction,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Reject referral payout (Admin only)
#     """
#     success = await referral_service.reject_payout(db, payout_id, action.reject_reason)
#     if not success:
#         raise HTTPException(status_code=404, detail="Payout not found or already processed")
#     return {"message": "Payout rejected successfully"}


# @router.get("/admin/stats")
# async def get_admin_referral_stats(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     referral_service: ReferralService = Depends()
# ):
#     """
#     Get admin referral statistics (Admin only)
#     """
#     return await referral_service.get_admin_referral_stats(db)


# # -------------------------------------------------------------
# # COMMISSION STRUCTURE
# # -------------------------------------------------------------

# @router.get("/commission-structure")
# async def get_commission_structure():
#     """
#     Get referral commission structure
#     """
#     return {
#         "recurring_plans": {
#             "level_1": "5%",
#             "level_2": "1%", 
#             "level_3": "1%"
#         },
#         "long_term_plans": {
#             "level_1": "15%",
#             "level_2": "3%",
#             "level_3": "2%"
#         },
#         "payout_info": {
#             "minimum_payout": "₹500",
#             "tds": "10%",
#             "service_tax": "18%",
#             "processing_time": "7-10 business days"
#         }
#     }





from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.services.referral_service import ReferralService
from app.schemas.referrals import (
    ReferralPayout, ReferralPayoutCreate, ReferralPayoutAction,
    ReferralEarning, ReferralStats
)
from app.schemas.users import User

router = APIRouter()


# -------------------------------------------------------------
# USER ENDPOINTS
# -------------------------------------------------------------

@router.get("/stats", response_model=ReferralStats)
async def get_referral_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    referral_service: ReferralService = Depends()
):
    """Get user's referral statistics"""
    return await referral_service.get_user_referral_stats(db, current_user.id)


@router.get("/earnings", response_model=List[ReferralEarning])
async def get_referral_earnings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    referral_service: ReferralService = Depends()
):
    """Get user's referral earnings"""
    return await referral_service.get_user_earnings(db, current_user.id)


@router.get("/payouts", response_model=List[ReferralPayout])
async def get_referral_payouts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    referral_service: ReferralService = Depends()
):
    """Get user's referral payout requests"""
    return await referral_service.get_user_payouts(db, current_user.id)


@router.post("/payouts/request", response_model=ReferralPayout)
async def request_payout(
    payout_data: ReferralPayoutCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    referral_service: ReferralService = Depends()
):
    """Request referral payout"""
    stats = await referral_service.get_user_referral_stats(db, current_user.id)

    if stats.available_balance < payout_data.gross_amount:
        raise HTTPException(status_code=400, detail="Insufficient balance for payout")

    if payout_data.gross_amount < 500:
        raise HTTPException(status_code=400, detail="Minimum payout amount is ₹500")

    return await referral_service.request_payout(db, current_user.id, payout_data)


@router.get("/referrals/list")
async def get_referral_list(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    referral_service: ReferralService = Depends()
):
    """Get list of referred users"""
    return await referral_service.get_referred_users(db, current_user.id)


# -------------------------------------------------------------
# ADMIN ENDPOINTS
# -------------------------------------------------------------

@router.get("/admin/payouts", response_model=List[ReferralPayout])
async def get_all_payouts(
    status: str = "all",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    referral_service: ReferralService = Depends()
):
    """Admin: View all referral payouts"""
    return await referral_service.get_all_payouts(db, status)


@router.post("/admin/payouts/{payout_id}/approve")
async def approve_payout(
    payout_id: int,
    action: ReferralPayoutAction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    referral_service: ReferralService = Depends()
):
    """Admin: Approve referral payout"""
    success = await referral_service.approve_payout(db, payout_id, action.payment_reference)
    if not success:
        raise HTTPException(status_code=404, detail="Payout not found or already processed")
    return {"message": "Payout approved successfully"}


@router.post("/admin/payouts/{payout_id}/reject")
async def reject_payout(
    payout_id: int,
    action: ReferralPayoutAction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    referral_service: ReferralService = Depends()
):
    """Admin: Reject referral payout"""
    success = await referral_service.reject_payout(db, payout_id, action.reject_reason)
    if not success:
        raise HTTPException(status_code=404, detail="Payout not found or already processed")
    return {"message": "Payout rejected successfully"}


@router.post("/admin/payouts/{payout_id}/complete")
async def complete_payout(
    payout_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    referral_service: ReferralService = Depends()
):
    """
    Admin: Mark payout as completed after successful transfer
    (updates referral_earnings and marks payout as 'completed')
    """
    success = await referral_service.complete_payout(db, payout_id)
    if not success:
        raise HTTPException(status_code=404, detail="Payout not found or not approved yet")
    return {"message": "Payout marked as completed"}


@router.get("/admin/stats")
async def get_admin_referral_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    referral_service: ReferralService = Depends()
):
    """Admin: Overall referral statistics"""
    return await referral_service.get_admin_referral_stats(db)


# -------------------------------------------------------------
# COMMISSION STRUCTURE & SYSTEM
# -------------------------------------------------------------

@router.get("/commission-structure")
async def get_commission_structure():
    """Get global referral commission structure"""
    return {
        "recurring_plans": {"level_1": "5%", "level_2": "1%", "level_3": "1%"},
        "long_term_plans": {"level_1": "15%", "level_2": "3%", "level_3": "2%"},
        "payout_info": {
            "minimum_payout": "₹500",
            "tds": "10%",
            "service_tax": "18%",
            "processing_time": "7–10 business days"
        }
    }


# -------------------------------------------------------------
# INTERNAL ENDPOINT (Optional: For Admin Testing / Manual Entry)
# -------------------------------------------------------------

@router.post("/admin/record-commission/{order_id}")
async def record_commission_earnings(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    referral_service: ReferralService = Depends()
):
    """
    Admin: Manually trigger referral commission for a given order (useful for testing)
    """
    try:
        result = await referral_service.record_commission_earnings(db, order_id)
        return {"message": "Referral commission recorded successfully", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
