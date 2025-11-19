from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, Dict, Any

from app.models.settings import UserSettings
from app.schemas.settings import UserSettingsUpdate

class SettingsService:
    async def get_user_settings(self, db: AsyncSession, user_id: int) -> Optional[UserSettings]:
        result = await db.execute(
            select(UserSettings).where(UserSettings.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def create_default_settings(self, db: AsyncSession, user_id: int) -> UserSettings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
        return settings
    
    async def update_user_settings(self, db: AsyncSession, user_id: int, settings_update: UserSettingsUpdate) -> UserSettings:
        settings = await self.get_user_settings(db, user_id)
        if not settings:
            settings = await self.create_default_settings(db, user_id)
        
        update_data = settings_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        
        await db.commit()
        await db.refresh(settings)
        return settings
    
    async def toggle_two_factor(self, db: AsyncSession, user_id: int, enable: bool) -> UserSettings:
        settings = await self.get_user_settings(db, user_id)
        if not settings:
            settings = await self.create_default_settings(db, user_id)
        
        settings.two_factor_enabled = enable
        await db.commit()
        await db.refresh(settings)
        return settings
    
    async def update_notification_settings(self, db: AsyncSession, user_id: int, notification_settings: Dict[str, Any]) -> UserSettings:
        settings = await self.get_user_settings(db, user_id)
        if not settings:
            settings = await self.create_default_settings(db, user_id)
        
        for field, value in notification_settings.items():
            if hasattr(settings, field):
                setattr(settings, field, value)
        
        await db.commit()
        await db.refresh(settings)
        return settings
    
    async def get_user_preferences(self, db: AsyncSession, user_id: int) -> Dict[str, Any]:
        settings = await self.get_user_settings(db, user_id)
        if not settings:
            settings = await self.create_default_settings(db, user_id)
        
        from app.services.billing_service import BillingService
        billing_service = BillingService()
        billing_settings = await billing_service.get_user_billing_settings(db, user_id)
        
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