import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from passlib.context import CryptContext

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database URL
DATABASE_URL = "postgresql+asyncpg://postgres:hardik123@localhost:5432/ramaera_hosting"

async def fix_passwords():
    # Create async engine
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    # Create session
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # First, check current hashes
        result = await session.execute(
            text("""
                SELECT id, email, LENGTH(hashed_password) as hash_length, 
                       LEFT(hashed_password, 30) as preview
                FROM users_profiles 
                WHERE email IN ('admin1234@test.com', 'user1234@test.com')
            """)
        )
        
        print("\n📋 Current password hashes in database:")
        for row in result:
            print(f"  {row.email}: ID={row.id}, Length={row.hash_length}, Preview={row.preview}...")
        
        # Generate new proper hashes
        password = "1234"
        new_hash = pwd_context.hash(password)
        
        print(f"\n🔑 New hash details:")
        print(f"  Length: {len(new_hash)} bytes")
        print(f"  Hash: {new_hash}")
        print(f"  Verify test: {pwd_context.verify(password, new_hash)}")
        
        # Update both users
        await session.execute(
            text("""
                UPDATE users_profiles 
                SET hashed_password = :new_hash
                WHERE email IN ('admin1234@test.com', 'user1234@test.com')
            """),
            {"new_hash": new_hash}
        )
        
        await session.commit()
        
        # Verify update
        result = await session.execute(
            text("""
                SELECT email, LENGTH(hashed_password) as hash_length
                FROM users_profiles 
                WHERE email IN ('admin1234@test.com', 'user1234@test.com')
            """)
        )
        
        print(f"\n✅ Updated password hashes:")
        for row in result:
            print(f"  {row.email}: Length={row.hash_length} bytes")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(fix_passwords())
