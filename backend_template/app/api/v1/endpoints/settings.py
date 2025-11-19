from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.utils.security_utils import verify_password
from app.services.settings_service import SettingsService
from app.schemas.settings import UserSettings, UserSettingsUpdate, SecuritySettings, ProfileUpdate
from app.schemas.users import User

router = APIRouter()

@router.get("/profile", response_model=UserSettings)
async def get_user_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings_service: SettingsService = Depends()
):
    """
    Get user settings
    """
    settings = await settings_service.get_user_settings(db, current_user.id)
    if not settings:
        # Create default settings if not exists
        settings = await settings_service.create_default_settings(db, current_user.id)
    return settings

@router.put("/profile", response_model=UserSettings)
async def update_profile_settings(
    settings_update: UserSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings_service: SettingsService = Depends()
):
    """
    Update profile settings
    """
    return await settings_service.update_user_settings(db, current_user.id, settings_update)

@router.put("/profile/info")
async def update_profile_info(
    profile_update: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings_service: SettingsService = Depends()
):
    """
    Update user profile information
    """
    from app.services.user_service import UserService
    user_service = UserService()
    
    user = await user_service.update_user_profile(db, current_user.id, profile_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Profile updated successfully", "user": user}

@router.post("/security/password")
async def change_password(
    security_data: SecuritySettings,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Change user password
    """
    from app.services.user_service import UserService
    user_service = UserService()
    
    # Verify current password (now async)
    if not await verify_password(security_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )
    
    # Update password
    success = await user_service.update_password(
        db, current_user.id, security_data.new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to update password"
        )
    
    return {"message": "Password updated successfully"}

@router.post("/security/two-factor")
async def toggle_two_factor(
    enable: bool,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings_service: SettingsService = Depends()
):
    """
    Toggle two-factor authentication
    """
    settings = await settings_service.toggle_two_factor(db, current_user.id, enable)
    return {
        "message": f"Two-factor authentication {'enabled' if enable else 'disabled'}",
        "two_factor_enabled": settings.two_factor_enabled
    }

@router.get("/notifications")
async def get_notification_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings_service: SettingsService = Depends()
):
    """
    Get notification settings
    """
    settings = await settings_service.get_user_settings(db, current_user.id)
    if not settings:
        settings = await settings_service.create_default_settings(db, current_user.id)
    
    return {
        "email_notifications": settings.email_notifications,
        "push_notifications": settings.push_notifications,
        "sms_notifications": settings.sms_notifications,
        "server_alerts": True,  # From billing settings
        "billing_alerts": True,  # From billing settings
        "maintenance_alerts": True  # From billing settings
    }

@router.put("/notifications")
async def update_notification_settings(
    notification_settings: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings_service: SettingsService = Depends()
):
    """
    Update notification settings
    """
    settings = await settings_service.update_notification_settings(db, current_user.id, notification_settings)
    return {"message": "Notification settings updated successfully", "settings": settings}

@router.get("/preferences")
async def get_user_preferences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings_service: SettingsService = Depends()
):
    """
    Get all user preferences and settings
    """
    settings = await settings_service.get_user_settings(db, current_user.id)
    if not settings:
        settings = await settings_service.create_default_settings(db, current_user.id)
    
    from app.services.billing_service import BillingService
    billing_service = BillingService()
    billing_settings = await billing_service.get_user_billing_settings(db, current_user.id)
    
    return {
        "profile_settings": {
            "language": settings.language,
            "timezone": settings.timezone,
            "date_format": settings.date_format
        },
        "security_settings": {
            "two_factor_enabled": settings.two_factor_enabled,
            "login_alerts": settings.login_alerts
        },
        "notification_settings": {
            "email_notifications": settings.email_notifications,
            "push_notifications": settings.push_notifications,
            "sms_notifications": settings.sms_notifications
        },
        "billing_settings": {
            "auto_renewal": billing_settings.auto_renewal if billing_settings else True,
            "email_notifications": billing_settings.email_notifications if billing_settings else True,
            "server_alerts": billing_settings.server_alerts if billing_settings else True,
            "billing_alerts": billing_settings.billing_alerts if billing_settings else True,
            "maintenance_alerts": billing_settings.maintenance_alerts if billing_settings else True
        }
    }
