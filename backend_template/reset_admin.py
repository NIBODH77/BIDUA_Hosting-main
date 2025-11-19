#!/usr/bin/env python3
"""
Reset/Create admin account with proper async password hashing
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text, select
from app.utils.security_utils import get_password_hash
from app.models.users import UserProfile
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("❌ DATABASE_URL not found in .env")
    exit(1)

async def setup_admin():
    """Create or reset admin account"""
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        try:
            # Email and password for admin
            admin_email = "admin1234@test.com"
            admin_password = "654321"  # This is what you're using
            
            print(f"\n🔐 Setting up admin account")
            print(f"  Email: {admin_email}")
            print(f"  Password: {admin_password}")
            
            # Hash the password using async function
            print(f"\n🔄 Hashing password...")
            hashed_password = await get_password_hash(admin_password)
            print(f"✅ Password hashed (length: {len(hashed_password)})")
            
            # Check if admin already exists
            print(f"\n🔍 Checking if admin exists...")
            result = await session.execute(
                select(UserProfile).where(UserProfile.email == admin_email)
            )
            admin = result.scalar_one_or_none()
            
            if admin:
                print(f"✅ Admin found (ID: {admin.id})")
                print(f"📝 Updating password...")
                admin.hashed_password = hashed_password
                admin.role = "admin"
                admin.account_status = "active"
            else:
                print(f"❌ Admin not found, creating new...")
                admin = UserProfile(
                    email=admin_email,
                    hashed_password=hashed_password,
                    full_name="Admin User",
                    role="admin",
                    account_status="active",
                    phone=None,
                    company=None,
                    referral_code="ADMIN_001",
                    referred_by=None,
                    subscription_status="active",
                    total_referrals=0,
                    l1_referrals=0,
                    l2_referrals=0,
                    l3_referrals=0,
                    total_earnings=0.0,
                    available_balance=0.0,
                    total_withdrawn=0.0,
                )
                session.add(admin)
            
            # Commit changes
            await session.commit()
            print(f"\n✅ Admin account updated/created successfully!")
            print(f"\n📋 Details:")
            print(f"  ID: {admin.id}")
            print(f"  Email: {admin.email}")
            print(f"  Role: {admin.role}")
            print(f"  Account Status: {admin.account_status}")
            print(f"  Password Hash Length: {len(admin.hashed_password)}")
            
            # Try to verify the password
            from app.utils.security_utils import verify_password
            is_valid = await verify_password(admin_password, admin.hashed_password)
            print(f"\n🔑 Password Verification Test: {'✅ PASS' if is_valid else '❌ FAIL'}")
            
            if not is_valid:
                print("⚠️  Password verification failed!")
                return False
            
            print(f"\n🎉 All done! You can now login with:")
            print(f"  Email: {admin_email}")
            print(f"  Password: {admin_password}")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False
        finally:
            await engine.dispose()
    
    return True

if __name__ == "__main__":
    result = asyncio.run(setup_admin())
    exit(0 if result else 1)
