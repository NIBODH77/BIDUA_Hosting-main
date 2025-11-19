# # from sqlalchemy.ext.asyncio import AsyncSession
# # from sqlalchemy import func, and_, or_, select
# # from typing import List, Optional, Dict, Any
# # from datetime import datetime, timedelta
# # import secrets
# # import string
# # from decimal import Decimal

# # from app.models.users import UserProfile
# # from app.schemas.users import UserCreate, UserUpdate, UserStats
# # from app.core.security import get_password_hash, verify_password

# # class UserService:
# #     async def get_users(self, db: AsyncSession, skip: int = 0, limit: int = 100, 
# #                        search: Optional[str] = None, role: Optional[str] = None, 
# #                        status: Optional[str] = None) -> List[UserProfile]:
# #         query = select(UserProfile)
        
# #         if search:
# #             query = query.where(
# #                 or_(
# #                     UserProfile.email.ilike(f"%{search}%"),
# #                     UserProfile.full_name.ilike(f"%{search}%")
# #                 )
# #             )
        
# #         if role and role != "all":
# #             query = query.where(UserProfile.role == role)
            
# #         if status and status != "all":
# #             query = query.where(UserProfile.account_status == status)
            
# #         query = query.offset(skip).limit(limit)
# #         result = await db.execute(query)
# #         return result.scalars().all()
    
# #     async def get_user_by_id(self, db: AsyncSession, user_id: int) -> Optional[UserProfile]:
# #         result = await db.execute(
# #             select(UserProfile).where(UserProfile.id == user_id)
# #         )
# #         return result.scalar_one_or_none()
    
# #     async def get_user_by_email(self, db: AsyncSession, email: str) -> Optional[UserProfile]:
# #         result = await db.execute(
# #             select(UserProfile).where(UserProfile.email == email)
# #         )
# #         return result.scalar_one_or_none()
    
# #     async def create_user(self, db: AsyncSession, user_data: UserCreate) -> UserProfile:
# #         # Generate referral code
# #         referral_code = await self._generate_referral_code(db)
        
# #         # Handle referral if provided
# #         referred_by_user = None
# #         if user_data.referral_code:
# #             referred_by_user = await self.get_user_by_referral_code(db, user_data.referral_code)
        
# #         # Create user
# #         db_user = UserProfile(
# #             email=user_data.email,
# #             full_name=user_data.full_name,
# #             role=user_data.role,
# #             account_status=user_data.account_status,
# #             hashed_password=get_password_hash(user_data.password),
# #             referral_code=referral_code,
# #             referred_by=referred_by_user.id if referred_by_user else None,
# #             phone=user_data.phone,
# #             company=user_data.company
# #         )
        
# #         db.add(db_user)
# #         await db.commit()
# #         await db.refresh(db_user)
        
# #         # Update referral hierarchy if referred
# #         if referred_by_user:
# #             await self._update_referral_hierarchy(db, db_user, referred_by_user)
        
# #         return db_user
    
# #     async def update_user(self, db: AsyncSession, user_id: int, user_update: UserUpdate) -> Optional[UserProfile]:
# #         user = await self.get_user_by_id(db, user_id)
# #         if not user:
# #             return None
            
# #         update_data = user_update.dict(exclude_unset=True)
# #         for field, value in update_data.items():
# #             setattr(user, field, value)
            
# #         await db.commit()
# #         await db.refresh(user)
# #         return user
    
# #     async def update_user_profile(self, db: AsyncSession, user_id: int, profile_update: Dict[str, Any]) -> Optional[UserProfile]:
# #         user = await self.get_user_by_id(db, user_id)
# #         if not user:
# #             return None
            
# #         for field, value in profile_update.items():
# #             if hasattr(user, field):
# #                 setattr(user, field, value)
                
# #         await db.commit()
# #         await db.refresh(user)
# #         return user
    
# #     async def update_password(self, db: AsyncSession, user_id: int, new_password: str) -> bool:
# #         user = await self.get_user_by_id(db, user_id)
# #         if not user:
# #             return False
            
# #         user.hashed_password = get_password_hash(new_password)
# #         await db.commit()
# #         return True
    
# #     async def update_user_status(self, db: AsyncSession, user_id: int, status: str) -> Optional[UserProfile]:
# #         user = await self.get_user_by_id(db, user_id)
# #         if not user:
# #             return None
            
# #         user.account_status = status
# #         await db.commit()
# #         await db.refresh(user)
# #         return user
    
# #     async def delete_user(self, db: AsyncSession, user_id: int) -> bool:
# #         user = await self.get_user_by_id(db, user_id)
# #         if not user:
# #             return False
            
# #         await db.delete(user)
# #         await db.commit()
# #         return True
    
# #     async def authenticate_user(self, db: AsyncSession, email: str, password: str) -> Optional[UserProfile]:
# #         user = await self.get_user_by_email(db, email)
# #         if not user:
# #             return None
# #         if not verify_password(password, user.hashed_password):
# #             return None
# #         return user
    
# #     async def get_total_users(self, db: AsyncSession) -> int:
# #         result = await db.execute(select(func.count(UserProfile.id)))
# #         return result.scalar()
    
# #     async def get_active_users_count(self, db: AsyncSession) -> int:
# #         result = await db.execute(
# #             select(func.count(UserProfile.id)).where(UserProfile.account_status == "active")
# #         )
# #         return result.scalar()
    
# #     async def get_new_users_this_month(self, db: AsyncSession) -> int:
# #         start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
# #         result = await db.execute(
# #             select(func.count(UserProfile.id)).where(UserProfile.created_at >= start_of_month)
# #         )
# #         return result.scalar()
    
# #     async def get_new_users_since(self, db: AsyncSession, since_date: datetime) -> int:
# #         result = await db.execute(
# #             select(func.count(UserProfile.id)).where(UserProfile.created_at >= since_date)
# #         )
# #         return result.scalar()
    
# #     async def get_user_stats(self, db: AsyncSession) -> UserStats:
# #         total_users = await self.get_total_users(db)
# #         active_users = await self.get_active_users_count(db)
        
# #         suspended_result = await db.execute(
# #             select(func.count(UserProfile.id)).where(UserProfile.account_status == "suspended")
# #         )
# #         suspended_users = suspended_result.scalar()
        
# #         today = datetime.now().date()
# #         start_of_week = today - timedelta(days=today.weekday())
# #         start_of_month = today.replace(day=1)
        
# #         new_users_today_result = await db.execute(
# #             select(func.count(UserProfile.id)).where(func.date(UserProfile.created_at) == today)
# #         )
# #         new_users_today = new_users_today_result.scalar()
        
# #         new_users_this_week_result = await db.execute(
# #             select(func.count(UserProfile.id)).where(func.date(UserProfile.created_at) >= start_of_week)
# #         )
# #         new_users_this_week = new_users_this_week_result.scalar()
        
# #         new_users_this_month_result = await db.execute(
# #             select(func.count(UserProfile.id)).where(func.date(UserProfile.created_at) >= start_of_month)
# #         )
# #         new_users_this_month = new_users_this_month_result.scalar()
        
# #         return UserStats(
# #             total_users=total_users,
# #             active_users=active_users,
# #             suspended_users=suspended_users,
# #             new_users_today=new_users_today,
# #             new_users_this_week=new_users_this_week,
# #             new_users_this_month=new_users_this_month
# #         )
    
# #     async def get_recent_users(self, db: AsyncSession, limit: int = 5) -> List[UserProfile]:
# #         result = await db.execute(
# #             select(UserProfile).order_by(UserProfile.created_at.desc()).limit(limit)
# #         )
# #         return result.scalars().all()
    
# #     async def get_recent_activity(self, db: AsyncSession, limit: int = 10) -> List[Dict[str, Any]]:
# #         recent_users = await self.get_recent_users(db, limit)
# #         activity = []
        
# #         for user in recent_users:
# #             activity.append({
# #                 "id": f"user-{user.id}",
# #                 "type": "user",
# #                 "message": "New user registration",
# #                 "time": user.created_at.strftime("%Y-%m-%d %H:%M:%S"),
# #                 "user_id": user.id,
# #                 "user_name": user.full_name
# #             })
        
# #         return activity
    
# #     async def get_user_by_referral_code(self, db: AsyncSession, referral_code: str) -> Optional[UserProfile]:
# #         result = await db.execute(
# #             select(UserProfile).where(UserProfile.referral_code == referral_code)
# #         )
# #         return result.scalar_one_or_none()
    
# #     async def _generate_referral_code(self, db: AsyncSession, length: int = 8) -> str:
# #         """Generate a unique referral code"""
# #         characters = string.ascii_uppercase + string.digits
# #         while True:
# #             code = ''.join(secrets.choice(characters) for _ in range(length))
# #             # Check if code already exists
# #             existing_user = await self.get_user_by_referral_code(db, code)
# #             if not existing_user:
# #                 return code
    
# #     async def _update_referral_hierarchy(self, db: AsyncSession, new_user: UserProfile, referrer: UserProfile):
# #         """Update referral hierarchy for multi-level referral system"""
# #         # Level 1 (direct referral)
# #         new_user.referral_level_1 = referrer.id
# #         referrer.l1_referrals += 1
# #         referrer.total_referrals += 1
        
# #         # Level 2 (referrer's referrer)
# #         if referrer.referral_level_1:
# #             level2_user = await self.get_user_by_id(db, referrer.referral_level_1)
# #             if level2_user:
# #                 new_user.referral_level_2 = level2_user.id
# #                 level2_user.l2_referrals += 1
# #                 level2_user.total_referrals += 1
        
# #         # Level 3 (level 2's referrer)
# #         if referrer.referral_level_2:
# #             level3_user = await self.get_user_by_id(db, referrer.referral_level_2)
# #             if level3_user:
# #                 new_user.referral_level_3 = level3_user.id
# #                 level3_user.l3_referrals += 1
# #                 level3_user.total_referrals += 1
        
# #         await db.commit()




from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, or_, select, extract
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import secrets
import string
from decimal import Decimal

from app.models.users import UserProfile
from app.schemas.users import UserCreate, UserUpdate, UserStats
from app.utils.security_utils import get_password_hash, verify_password
from fastapi import HTTPException, status
from sqlalchemy import update

class UserService:
    # ✅ Fetch users with filters
    async def get_users(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100,
        search: Optional[str] = None, 
        role: Optional[str] = None, 
        status: Optional[str] = None
    ) -> List[UserProfile]:
        stmt = select(UserProfile)

        if search:
            stmt = stmt.where(
                or_(
                    UserProfile.email.ilike(f"%{search}%"),
                    UserProfile.full_name.ilike(f"%{search}%")
                )
            )

        if role and role != "all":
            stmt = stmt.where(UserProfile.role == role)

        if status and status != "all":
            stmt = stmt.where(UserProfile.account_status == status)

        stmt = stmt.offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    # ✅ Basic user lookups
    async def get_user_by_id(self, db: AsyncSession, user_id: int) -> Optional[UserProfile]:
        result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
        return result.scalar_one_or_none()

    async def get_user_by_email(self, db: AsyncSession, email: str) -> Optional[UserProfile]:
        result = await db.execute(select(UserProfile).where(UserProfile.email == email))
        return result.scalar_one_or_none()

    async def get_user_by_referral_code(self, db: AsyncSession, referral_code: str) -> Optional[UserProfile]:
        result = await db.execute(select(UserProfile).where(UserProfile.referral_code == referral_code))
        return result.scalar_one_or_none()



    async def create_user(self, db: AsyncSession, user_data: UserCreate) -> UserProfile:
        try:
            print(f"  Create_user: Generating referral code")
            referral_code = await self._generate_referral_code(db)
            # Note: affiliate referral tracking is now handled in auth endpoint via AffiliateService
            # No need to validate user_data.referral_code here (it's for affiliate codes, not legacy user codes)
            
            # Hash password asynchronously to avoid blocking the event loop
            print(f"  Create_user: Hashing password")
            hashed_password = await get_password_hash(user_data.password)
            print(f"  Create_user: Password hashed, creating UserProfile object")
            
            db_user = UserProfile(
                email=user_data.email,
                full_name=user_data.full_name,
                role=user_data.role,
                account_status=user_data.account_status,
                hashed_password=hashed_password,
                referral_code=referral_code,
                referred_by=None,  # Set via AffiliateService.track_referral post-creation
                phone=user_data.phone,
                company=user_data.company,
            )

            print(f"  Create_user: Adding to session and committing")
            db.add(db_user)
            await db.commit()
            print(f"  Create_user: Commit successful, user ID: {db_user.id}")
            
            # Try refresh only if needed
            try:
                print(f"  Create_user: Refreshing user object")
                await db.refresh(db_user)
                print(f"  Create_user: Refresh successful")
            except Exception as refresh_error:
                print(f"  Create_user: Refresh error (non-fatal): {str(refresh_error)}")
                # Refresh failed but user is already created, so we can continue

            print(f"  Create_user: Returning user object")
            return db_user
            
        except Exception as e:
            print(f"  Create_user: Exception occurred: {str(e)}")
            await db.rollback()
            raise e


    # ✅ Update / Delete
    async def update_user(self, db: AsyncSession, user_id: int, user_update: UserUpdate) -> Optional[UserProfile]:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            return None

        for field, value in user_update.dict(exclude_unset=True).items():
            setattr(user, field, value)

        await db.commit()
        await db.refresh(user)
        return user

    async def update_user_profile(self, db: AsyncSession, user_id: int, profile_update: Dict[str, Any]) -> Optional[UserProfile]:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            return None

        for field, value in profile_update.items():
            if hasattr(user, field):
                setattr(user, field, value)

        await db.commit()
        await db.refresh(user)
        return user

    async def update_password(self, db: AsyncSession, user_id: int, new_password: str) -> bool:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            return False

        user.hashed_password = await get_password_hash(new_password)
        await db.commit()
        return True

    async def update_user_status(self, db: AsyncSession, user_id: int, status: str) -> Optional[UserProfile]:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            return None

        user.account_status = status
        await db.commit()
        await db.refresh(user)
        return user

    async def delete_user(self, db: AsyncSession, user_id: int) -> bool:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            return False

        await db.delete(user)
        await db.commit()
        return True

    async def authenticate_user(self, db: AsyncSession, email: str, password: str) -> Optional[UserProfile]:
        try:
            user = await self.get_user_by_email(db, email)
            if not user:
                return None
            
            # Verify password (now async)
            if not await verify_password(password, user.hashed_password):
                return None
            
            return user
            
        except Exception as e:
            # Log the error for debugging
            print(f"Authentication error: {str(e)}")
            return None

    # ✅ Stats (All async-safe)
    async def get_total_users(self, db: AsyncSession) -> int:
        result = await db.execute(select(func.count(UserProfile.id)))
        return result.scalar() or 0

    async def get_active_users_count(self, db: AsyncSession) -> int:
        result = await db.execute(select(func.count(UserProfile.id)).where(UserProfile.account_status == "active"))
        return result.scalar() or 0

    async def get_new_users_this_month(self, db: AsyncSession) -> int:
        start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        result = await db.execute(select(func.count(UserProfile.id)).where(UserProfile.created_at >= start_of_month))
        return result.scalar() or 0

    async def get_user_stats(self, db: AsyncSession) -> UserStats:
        total_users = await self.get_total_users(db)
        active_users = await self.get_active_users_count(db)

        suspended_result = await db.execute(
            select(func.count(UserProfile.id)).where(UserProfile.account_status == "suspended")
        )
        suspended_users = suspended_result.scalar() or 0

        today = datetime.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        start_of_month = today.replace(day=1)

        new_today_result = await db.execute(
            select(func.count(UserProfile.id)).where(func.date(UserProfile.created_at) == today)
        )
        new_users_today = new_today_result.scalar() or 0

        new_week_result = await db.execute(
            select(func.count(UserProfile.id)).where(func.date(UserProfile.created_at) >= start_of_week)
        )
        new_users_this_week = new_week_result.scalar() or 0

        new_month_result = await db.execute(
            select(func.count(UserProfile.id)).where(func.date(UserProfile.created_at) >= start_of_month)
        )
        new_users_this_month = new_month_result.scalar() or 0

        return UserStats(
            total_users=total_users,
            active_users=active_users,
            suspended_users=suspended_users,
            new_users_today=new_users_today,
            new_users_this_week=new_users_this_week,
            new_users_this_month=new_users_this_month,
        )

    # ✅ Recent activity
    async def get_recent_users(self, db: AsyncSession, limit: int = 5) -> List[UserProfile]:
        result = await db.execute(select(UserProfile).order_by(UserProfile.created_at.desc()).limit(limit))
        return result.scalars().all()

    async def get_recent_activity(self, db: AsyncSession, limit: int = 10) -> List[Dict[str, Any]]:
        recent_users = await self.get_recent_users(db, limit)
        return [
            {
                "id": f"user-{u.id}",
                "type": "user",
                "message": "New user registration",
                "time": u.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "user_id": u.id,
                "user_name": u.full_name,
            }
            for u in recent_users
        ]

    # ✅ Referral utilities
    async def _generate_referral_code(self, db: AsyncSession, length: int = 8) -> str:
        chars = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(secrets.choice(chars) for _ in range(length))
            existing_user = await self.get_user_by_referral_code(db, code)
            if not existing_user:
                return code

   

    async def _update_referral_hierarchy(self, db: AsyncSession, new_user: UserProfile, referrer: UserProfile):
        try:
            # Set level 1 referral
            new_user.referral_level_1 = referrer.id
            referrer.l1_referrals += 1
            referrer.total_referrals += 1

            # Set level 2 referral (if exists)
            if referrer.referred_by:
                lvl2_user = await self.get_user_by_id(db, referrer.referred_by)
                if lvl2_user:
                    new_user.referral_level_2 = lvl2_user.id
                    lvl2_user.l2_referrals += 1
                    lvl2_user.total_referrals += 1

                    # Set level 3 referral (if exists)
                    if lvl2_user.referred_by:
                        lvl3_user = await self.get_user_by_id(db, lvl2_user.referred_by)
                        if lvl3_user:
                            new_user.referral_level_3 = lvl3_user.id
                            lvl3_user.l3_referrals += 1
                            lvl3_user.total_referrals += 1

            await db.commit()
            await db.refresh(new_user)
        except Exception as e:
            await db.rollback()
            raise e
        





    async def activate_subscription(self, db: AsyncSession, user_id: int, plan_name: str, amount: float):
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=30)  # Example: 30-day plan

        await db.execute(
            update(UserProfile)
            .where(UserProfile.id == user_id)
            .values(
                subscription_status="active",
                subscription_start=start_date,
                subscription_end=end_date
            )
        )
        await db.commit()

        return {
            "message": f"Subscription activated for {plan_name} plan",
            "plan": plan_name,
            "amount": amount,
            "start_date": start_date,
            "end_date": end_date
        }
