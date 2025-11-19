# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select
# from typing import List, Optional, Dict, Any

# from app.models.billing import PaymentMethod, BillingSettings
# from app.schemas.billing import PaymentMethodCreate, BillingSettings as BillingSettingsSchema

# class BillingService:
#     async def get_user_payment_methods(self, db: AsyncSession, user_id: int) -> List[PaymentMethod]:
#         result = await db.execute(
#             select(PaymentMethod).where(
#                 PaymentMethod.user_id == user_id,
#                 PaymentMethod.is_active == True
#             )
#         )
#         return result.scalars().all()
    
#     async def create_payment_method(self, db: AsyncSession, user_id: int, payment_method: PaymentMethodCreate) -> PaymentMethod:
#         # If setting as default, unset other defaults
#         if payment_method.is_default:
#             await self._unset_default_payment_methods(db, user_id)
        
#         db_payment_method = PaymentMethod(
#             user_id=user_id,
#             **payment_method.dict()
#         )
        
#         db.add(db_payment_method)
#         await db.commit()
#         await db.refresh(db_payment_method)
#         return db_payment_method
    
#     async def set_default_payment_method(self, db: AsyncSession, user_id: int, method_id: int) -> bool:
#         payment_method = await self.get_user_payment_method(db, user_id, method_id)
#         if not payment_method:
#             return False
        
#         # Unset all other default payment methods
#         await self._unset_default_payment_methods(db, user_id)
        
#         # Set this as default
#         payment_method.is_default = True
#         await db.commit()
#         return True
    
#     async def delete_payment_method(self, db: AsyncSession, user_id: int, method_id: int) -> bool:
#         payment_method = await self.get_user_payment_method(db, user_id, method_id)
#         if not payment_method:
#             return False
        
#         payment_method.is_active = False
#         await db.commit()
#         return True
    
#     async def get_user_payment_method(self, db: AsyncSession, user_id: int, method_id: int) -> Optional[PaymentMethod]:
#         result = await db.execute(
#             select(PaymentMethod).where(
#                 PaymentMethod.id == method_id,
#                 PaymentMethod.user_id == user_id
#             )
#         )
#         return result.scalar_one_or_none()
    
#     async def get_user_billing_settings(self, db: AsyncSession, user_id: int) -> Optional[BillingSettings]:
#         result = await db.execute(
#             select(BillingSettings).where(BillingSettings.user_id == user_id)
#         )
#         return result.scalar_one_or_none()
    
#     async def create_default_billing_settings(self, db: AsyncSession, user_id: int) -> BillingSettings:
#         settings = BillingSettings(user_id=user_id)
#         db.add(settings)
#         await db.commit()
#         await db.refresh(settings)
#         return settings
    
#     async def update_billing_settings(self, db: AsyncSession, user_id: int, settings_update: BillingSettingsSchema) -> BillingSettings:
#         settings = await self.get_user_billing_settings(db, user_id)
#         if not settings:
#             settings = await self.create_default_billing_settings(db, user_id)
        
#         update_data = settings_update.dict(exclude_unset=True)
#         for field, value in update_data.items():
#             setattr(settings, field, value)
        
#         await db.commit()
#         await db.refresh(settings)
#         return settings
    
#     async def toggle_auto_renewal(self, db: AsyncSession, user_id: int) -> BillingSettings:
#         settings = await self.get_user_billing_settings(db, user_id)
#         if not settings:
#             settings = await self.create_default_billing_settings(db, user_id)
        
#         settings.auto_renewal = not settings.auto_renewal
#         await db.commit()
#         await db.refresh(settings)
#         return settings
    
#     async def _unset_default_payment_methods(self, db: AsyncSession, user_id: int):
#         """Unset all default payment methods for a user"""
#         result = await db.execute(
#             select(PaymentMethod).where(
#                 PaymentMethod.user_id == user_id,
#                 PaymentMethod.is_default == True
#             )
#         )
#         default_methods = result.scalars().all()
        
#         for method in default_methods:
#             method.is_default = False
        
#         await db.commit()





from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.models.billing import PaymentMethod, BillingSettings
from app.schemas.billing import (
    PaymentMethodCreate, 
    BillingSettings as BillingSettingsResponse, 
    BillingSettingsUpdate
)


class BillingService:
    # ----------------------
    # Payment Method Methods
    # ----------------------

    async def get_user_payment_methods(
        self, db: AsyncSession, user_id: int
    ) -> List[PaymentMethod]:
        result = await db.execute(
            select(PaymentMethod)
            .where(
                PaymentMethod.user_id == user_id,
                PaymentMethod.is_active.is_(True)
            )
        )
        return result.scalars().all()

    async def get_user_payment_method(
        self, db: AsyncSession, user_id: int, method_id: int
    ) -> Optional[PaymentMethod]:
        result = await db.execute(
            select(PaymentMethod).where(
                PaymentMethod.id == method_id,
                PaymentMethod.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def create_payment_method(
        self, db: AsyncSession, user_id: int, payment_method: PaymentMethodCreate
    ) -> PaymentMethod:
        # Unset other defaults if this one is default
        if payment_method.is_default:
            await self._unset_default_payment_methods(db, user_id)

        db_payment_method = PaymentMethod(
            user_id=user_id,
            **payment_method.dict()
        )

        db.add(db_payment_method)
        await db.commit()
        await db.refresh(db_payment_method)
        return db_payment_method

    async def set_default_payment_method(
        self, db: AsyncSession, user_id: int, method_id: int
    ) -> bool:
        payment_method = await self.get_user_payment_method(db, user_id, method_id)
        if not payment_method:
            return False

        await self._unset_default_payment_methods(db, user_id)
        payment_method.is_default = True
        await db.commit()
        return True

    async def delete_payment_method(
        self, db: AsyncSession, user_id: int, method_id: int
    ) -> bool:
        payment_method = await self.get_user_payment_method(db, user_id, method_id)
        if not payment_method:
            return False

        payment_method.is_active = False
        await db.commit()
        return True

    async def _unset_default_payment_methods(
        self, db: AsyncSession, user_id: int
    ) -> None:
        """Unset all default payment methods for a user"""
        result = await db.execute(
            select(PaymentMethod).where(
                PaymentMethod.user_id == user_id,
                PaymentMethod.is_default.is_(True)
            )
        )
        methods = result.scalars().all()

        for method in methods:
            method.is_default = False

        if methods:
            await db.commit()

    # ----------------------
    # Billing Settings Methods
    # ----------------------

    async def get_user_billing_settings(
        self, db: AsyncSession, user_id: int
    ) -> Optional[BillingSettings]:
        result = await db.execute(
            select(BillingSettings).where(BillingSettings.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def create_default_billing_settings(
        self, db: AsyncSession, user_id: int
    ) -> BillingSettings:
        settings = BillingSettings(user_id=user_id)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
        return settings

    async def update_billing_settings(
        self, db: AsyncSession, user_id: int, settings_update: BillingSettingsUpdate
    ) -> BillingSettings:
        settings = await self.get_user_billing_settings(db, user_id)
        if not settings:
            settings = await self.create_default_billing_settings(db, user_id)

        for field, value in settings_update.dict(exclude_unset=True).items():
            setattr(settings, field, value)

        await db.commit()
        await db.refresh(settings)
        return settings

    async def toggle_auto_renewal(
        self, db: AsyncSession, user_id: int
    ) -> BillingSettings:
        settings = await self.get_user_billing_settings(db, user_id)
        if not settings:
            settings = await self.create_default_billing_settings(db, user_id)

        settings.auto_renewal = not settings.auto_renewal
        await db.commit()
        await db.refresh(settings)
        return settings
