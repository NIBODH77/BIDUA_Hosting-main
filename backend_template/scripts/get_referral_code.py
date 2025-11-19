import asyncio
import sys
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.users import UserProfile
from app.models.affiliate import AffiliateSubscription


async def fetch(email: str):
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(UserProfile).where(UserProfile.email == email))
        user = res.scalar_one_or_none()
        if not user:
            print(f"USER_NOT_FOUND: {email}")
            return
        print(f"USER: id={user.id}, email={user.email}, name={user.full_name}")
        print(f"LEGACY_REFERRAL_CODE: {user.referral_code}")

        res2 = await db.execute(select(AffiliateSubscription).where(AffiliateSubscription.user_id == user.id))
        aff = res2.scalar_one_or_none()
        if aff:
            print(f"AFFILIATE_ACTIVE: {aff.is_active}, TYPE: {aff.subscription_type}")
            print(f"AFFILIATE_REFERRAL_CODE: {aff.referral_code}")
        else:
            print("AFFILIATE_REFERRAL_CODE: NONE")


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/get_referral_code.py <email>")
        sys.exit(1)
    email = sys.argv[1]
    asyncio.run(fetch(email))


if __name__ == "__main__":
    main()
