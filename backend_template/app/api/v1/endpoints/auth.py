from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import HTTPBearer
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.core.database import get_db
# from app.core.utils import get_password_hash,verify_token
from app.utils.security_utils import  verify_password

from app.core.security import (
    verify_password, create_access_token,
    get_current_user, verify_token
)
from app.services.user_service import UserService
from sqlalchemy import select
from app.models.affiliate import AffiliateSubscription
from app.models.users import UserProfile
from app.schemas.users import User, UserCreate, LoginRequest, Token, PasswordChange,SubscriptionInfo, SubscriptionActivate

router = APIRouter()
security = HTTPBearer()








# @router.post("/register", response_model=Token)
# async def register(
#     user_data: UserCreate,
#     db: AsyncSession = Depends(get_db),
#     user_service: UserService = Depends()
# ):
#     """
#     Register a new user
#     """
#     # Check if user already exists
#     existing_user = await user_service.get_user_by_email(db, user_data.email)
#     if existing_user:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="User with this email already exists"
#         )
    
#     # Validate referral code if provided
#     if user_data.referral_code:
#         referral_user = await user_service.get_user_by_referral_code(db, user_data.referral_code)
#         if not referral_user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid referral code"
#             )
    
#     try:
#         # Create new user
#         user = await user_service.create_user(db, user_data)
        
#         # Generate access token
#         access_token = create_access_token(
#             subject=str(user.id),
#             expires_delta=timedelta(minutes=30)
#         )
        
#         return {
#             "access_token": access_token,
#             "token_type": "bearer",
#             "user": user
#         }
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error creating user: {str(e)}"
#         )
    

@router.post("/register", response_model=Token)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends()
):
    """
    Register a new user
    """
    try:
        # Check if user already exists
        existing_user = await user_service.get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Validate referral code if provided (accept both AffiliateSubscription codes and legacy UserProfile codes)
        referrer_code_to_track: str | None = None
        provided_code = user_data.referral_code
        if provided_code:
            # 1) Check affiliate subscription codes (primary)
            aff_result = await db.execute(
                select(AffiliateSubscription).where(
                    AffiliateSubscription.referral_code == provided_code
                )
            )
            aff_sub = aff_result.scalar_one_or_none()
            if aff_sub and aff_sub.is_active:
                referrer_code_to_track = aff_sub.referral_code
            else:
                # 2) Check legacy user referral codes and map to their affiliate code if active
                legacy_user = await user_service.get_user_by_referral_code(db, provided_code)
                if legacy_user:
                    # Try to fetch the user's affiliate subscription to get canonical code
                    aff_result2 = await db.execute(
                        select(AffiliateSubscription).where(
                            AffiliateSubscription.user_id == legacy_user.id
                        )
                    )
                    aff_sub2 = aff_result2.scalar_one_or_none()
                    if aff_sub2 and aff_sub2.is_active:
                        referrer_code_to_track = aff_sub2.referral_code
                    else:
                        # No active affiliate program for this referrer; proceed without blocking signup
                        referrer_code_to_track = None
                else:
                    # Invalid code provided; do not block signup, just ignore
                    referrer_code_to_track = None
        
        # Create new user without referral_code (we'll track via AffiliateService separately)
        user = await user_service.create_user(db, user_data)
        
        # ⚠️ IMPORTANT: Capture all user attributes NOW while session is active
        # before doing any other operations that might change session context
        from datetime import datetime
        user_dict_base = {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "account_status": user.account_status,
            "phone": user.phone if hasattr(user, 'phone') else "",
            "company": user.company if hasattr(user, 'company') else "",
            "referral_code": user.referral_code,
            "referred_by": user.referred_by,  # Will be None initially
            "subscription_status": user.subscription_status,
            "subscription_start": user.subscription_start,
            "subscription_end": user.subscription_end,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "total_referrals": user.total_referrals if hasattr(user, 'total_referrals') else 0,
            "l1_referrals": user.l1_referrals if hasattr(user, 'l1_referrals') else 0,
            "l2_referrals": user.l2_referrals if hasattr(user, 'l2_referrals') else 0,
            "l3_referrals": user.l3_referrals if hasattr(user, 'l3_referrals') else 0,
            "total_earnings": float(user.total_earnings) if user.total_earnings else 0.00,
            "available_balance": float(user.available_balance) if user.available_balance else 0.00,
            "total_withdrawn": float(user.total_withdrawn) if user.total_withdrawn else 0.00,
        }
        
        # 🆕 Track affiliate referral if a valid code was provided/mapped
        # This happens AFTER we've captured all attributes
        if referrer_code_to_track:
            try:
                from app.services.affiliate_service import AffiliateService
                affiliate_service = AffiliateService()
                await affiliate_service.track_referral(
                    db, referrer_code_to_track, user.id, signup_ip=None
                )
                # Update the referred_by in our captured dict
                user_dict_base["referred_by"] = (await user_service.get_user_by_id(db, user.id)).referred_by if await user_service.get_user_by_id(db, user.id) else None
            except Exception as aff_error:
                # Log error but don't fail registration
                print(f"⚠️ Affiliate referral tracking error: {str(aff_error)}")
        
        # Generate access token
        access_token = create_access_token(
            subject=str(user.id),
            expires_delta=timedelta(minutes=30)
        )
        
        # Ensure all required fields are present for response validation
        from datetime import datetime as dt
        user_dict = {
            **user_dict_base,
            "created_at": user_dict_base["created_at"] or dt.utcnow(),
            "updated_at": user_dict_base["updated_at"] or dt.utcnow(),
        }
        # Return minimal user info (don't include hashed_password or other sensitive fields)
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_dict
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Log the actual error for debugging
        print(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends()
):
    """
    Login user and return access token
    """
    # Add await here since authenticate_user is an async method
    user = await user_service.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if user.account_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or inactive"
        )
    
    # Generate access token
    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(minutes=30)
    )
    
    # Build response dict IMMEDIATELY while user object is still attached to session
    user_dict = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "account_status": user.account_status,
        "phone": user.phone,
        "company": user.company,
        "referral_code": user.referral_code,
        "referred_by": user.referred_by,
        "subscription_status": user.subscription_status,
        "subscription_start": user.subscription_start,
        "subscription_end": user.subscription_end,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "total_referrals": user.total_referrals,
        "l1_referrals": user.l1_referrals,
        "l2_referrals": user.l2_referrals,
        "l3_referrals": user.l3_referrals,
        "total_earnings": float(user.total_earnings) if user.total_earnings else 0.00,
        "available_balance": float(user.available_balance) if user.available_balance else 0.00,
        "total_withdrawn": float(user.total_withdrawn) if user.total_withdrawn else 0.00,
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user: User = Depends(get_current_user)
):
    """
    Refresh access token
    """
    access_token = create_access_token(
        subject=str(current_user.id),
        expires_delta=timedelta(minutes=30)
    )
    
    # Build response dict IMMEDIATELY while user object is still attached to session
    user_dict = {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "account_status": current_user.account_status,
        "phone": current_user.phone,
        "company": current_user.company,
        "referral_code": current_user.referral_code,
        "referred_by": current_user.referred_by,
        "subscription_status": current_user.subscription_status,
        "subscription_start": current_user.subscription_start,
        "subscription_end": current_user.subscription_end,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
        "total_referrals": current_user.total_referrals,
        "l1_referrals": current_user.l1_referrals,
        "l2_referrals": current_user.l2_referrals,
        "l3_referrals": current_user.l3_referrals,
        "total_earnings": float(current_user.total_earnings) if current_user.total_earnings else 0.00,
        "available_balance": float(current_user.available_balance) if current_user.available_balance else 0.00,
        "total_withdrawn": float(current_user.total_withdrawn) if current_user.total_withdrawn else 0.00,
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict
    }

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends()
):
    """
    Change user password
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    # success = user_service.update_password(
    #     db, current_user.id, password_data.new_password
    # )

    success = await user_service.update_password(
        db, current_user.id, password_data.new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password"
        )
    
    return {"message": "Password updated successfully"}



@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information
    """
    return current_user


@router.get("/me/inviter")
async def get_my_inviter(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends()
):
    """
    Get current user's inviter information (if they were referred)
    """
    if not current_user.referred_by:
        return {"referred_by": None, "inviter": None}
    
    # Fetch inviter's basic info
    inviter = await user_service.get_user_by_id(db, current_user.referred_by)
    if not inviter:
        return {"referred_by": current_user.referred_by, "inviter": None}
    
    return {
        "referred_by": current_user.referred_by,
        "inviter": {
            "id": inviter.id,
            "full_name": inviter.full_name,
            "email": inviter.email,
            "referral_code": inviter.referral_code
        }
    }


@router.post("/logout")
async def logout():
    """
    Logout user (client should remove token)
    """
    return {"message": "Successfully logged out"}





# ================================ Subscription Endpoints ================================


# # 🔹 1. Check subscription status (for user dashboard)
# @router.get("/status", response_model=SubscriptionInfo)
# async def get_subscription_status(
#     db: AsyncSession = Depends(get_db),
#     current_user=Depends(get_current_user)
# ):
#     user = await UserService.get_user_by_id(db, current_user.id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user


# # 🔹 2. Activate subscription (after successful payment)
# @router.post("/activate")
# async def activate_subscription(
#     subscription: SubscriptionActivate,
#     db: AsyncSession = Depends(get_db)
# ):
#     result = await UserService.activate_subscription(
#         db=db,
#         user_id=subscription.user_id,
#         plan_name=subscription.plan_name,
#         amount=subscription.amount
#     )
#     return {"success": True, **result}





@router.get("/status")
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends()
):
    user = await user_service.get_user_by_id(db, current_user.id)
    return {
        "subscription_status": user.subscription_status,
        "subscription_start": user.subscription_start,
        "subscription_end": user.subscription_end,
    }
# 🔹 2. Activate subscription (after successful payment)


@router.post("/activate")
async def activate_subscription(
    subscription: SubscriptionActivate,
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends()
):
    result = await user_service.activate_subscription(
        db=db,
        user_id=subscription.user_id,
        plan_name=subscription.plan_name,
        amount=subscription.amount
    )
    return {"success": True, **result}








# from fastapi import APIRouter, Depends, HTTPException, status
# from app.core.security import HTTPBearer
# from sqlalchemy.orm import Session
# from sqlalchemy.ext.asyncio import AsyncSession
# from datetime import timedelta

# from app.core.database import get_db
# # from app.core.utils import get_password_hash,verify_token
# from app.utils.security_utils import get_password_hash, verify_password

# from app.core.security import (
#     verify_password, create_access_token,
#     get_current_user, verify_token
# )
# from app.services.user_service import UserService 
# from app.schemas.users import User, UserCreate, LoginRequest, Token, PasswordChange,SubscriptionActivate, SubscriptionInfo

# router = APIRouter()
# security = HTTPBearer()


# @router.post("/register", response_model=Token)
# async def register(
#     user_data: UserCreate,
#     db: AsyncSession = Depends(get_db),
#     user_service: UserService = Depends()
# ):
#     """
#     Register a new user
#     """
#     try:
#         # Check if user already exists
#         existing_user = await user_service.get_user_by_email(db, user_data.email)
#         if existing_user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="User with this email already exists"
#             )
        
#         # Validate referral code if provided
#         if user_data.referral_code:
#             referral_user = await user_service.get_user_by_referral_code(db, user_data.referral_code)
#             if not referral_user:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail="Invalid referral code"
#                 )
        
#         # Create new user
#         user = await user_service.create_user(db, user_data)
        
#         # Generate access token
#         access_token = create_access_token(
#             subject=str(user.id),
#             expires_delta=timedelta(minutes=30)
#         )
        
#         return {
#             "access_token": access_token,
#             "token_type": "bearer",
#             "user": user
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         # Log the actual error for debugging
#         print(f"Registration error: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An error occurred during registration"
#         )


# # @router.post("/login", response_model=Token)
# # async def login(
# #     login_data: LoginRequest,
# #     db: AsyncSession = Depends(get_db),
# #     user_service: UserService = Depends()
# # ):
# #     user = await user_service.authenticate_user(db, login_data.email, login_data.password)
# #     if not user:
# #         raise HTTPException(
# #             status_code=status.HTTP_401_UNAUTHORIZED,
# #             detail="Incorrect email or password"
# #         )

# #     # For customers, check if account is active
# #     if user.role == "customer" and user.account_status != "active":
# #         raise HTTPException(
# #             status_code=status.HTTP_403_FORBIDDEN,
# #             detail="Account inactive — please subscribe to activate your account"
# #         )

# #     # For admin, account must be active (already enforced during registration)
# #     if user.role == "admin" and user.account_status != "active":
# #         raise HTTPException(
# #             status_code=status.HTTP_403_FORBIDDEN,
# #             detail="Admin account is inactive - please contact system administrator"
# #         )

# #     token = create_access_token(str(user.id), timedelta(minutes=30))
# #     return {"access_token": token, "token_type": "bearer", "user": user}





# @router.post("/login", response_model=Token)
# async def login(
#     login_data: LoginRequest,
#     db: AsyncSession = Depends(get_db),
#     user_service: UserService = Depends()
# ):
#     try:
#         print(f"🔄 Login attempt for: {login_data.email}")  # Debug
        
#         # Authenticate user
#         user = await user_service.authenticate_user(db, login_data.email, login_data.password)
        
#         if not user:
#             print("❌ Authentication failed")  # Debug
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Incorrect email or password"
#             )

#         print(f"✅ User authenticated: {user.email}, Role: {user.role}, Status: {user.account_status}")  # Debug

#         # Check account status based on role
#         if user.role == "customer":
#             if user.account_status != "active":
#                 raise HTTPException(
#                     status_code=status.HTTP_403_FORBIDDEN,
#                     detail="Account inactive — please subscribe to activate your account"
#                 )
        
#         elif user.role == "admin":
#             if user.account_status != "active":
#                 raise HTTPException(
#                     status_code=status.HTTP_403_FORBIDDEN,
#                     detail="Admin account is inactive - please contact system administrator"
#                 )

#         # Create access token
#         token = create_access_token(str(user.id), timedelta(minutes=30))
        
#         print("✅ Login successful")  # Debug
        
#         return {
#             "access_token": token, 
#             "token_type": "bearer", 
#             "user": user
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Login error: {str(e)}")  # Debug
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Internal server error during login"
#         )





# @router.post("/refresh", response_model=Token)
# async def refresh_token(
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Refresh access token
#     """
#     access_token = create_access_token(
#         subject=str(current_user.id),
#         expires_delta=timedelta(minutes=30)
#     )
    
#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "user": current_user
#     }

# @router.post("/change-password")
# async def change_password(
#     password_data: PasswordChange,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Change user password
#     """
#     # Verify current password
#     if not verify_password(password_data.current_password, current_user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Current password is incorrect"
#         )
#     # Update to new password

#     success = await user_service.update_password(
#         db, current_user.id, password_data.new_password
#     )
    
#     if not success:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to update password"
#         )
    
#     return {"message": "Password updated successfully"}



# @router.get("/me", response_model=User)
# async def get_current_user_info(
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Get current user information
#     """
#     return current_user



# # ================================ Subscription Endpoints ================================


# # 🔹 1. Check subscription status (for user dashboard)
# @router.get("/status", response_model=SubscriptionInfo)
# async def get_subscription_status(
#     db: AsyncSession = Depends(get_db),
#     current_user=Depends(get_current_user)
# ):
#     user = await UserService.get_user_by_id(db, current_user.id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user


# # 🔹 2. Activate subscription (after successful payment)
# @router.post("/activate")
# async def activate_subscription(
#     subscription: SubscriptionActivate,
#     db: AsyncSession = Depends(get_db)
# ):
#     result = await UserService.activate_subscription(
#         db=db,
#         user_id=subscription.user_id,
#         plan_name=subscription.plan_name,
#         amount=subscription.amount
#     )
#     return {"success": True, **result}





# @router.post("/logout")
# async def logout():
#     """
#     Logout user (client should remove token)
#     """
#     return {"message": "Successfully logged out"}

























