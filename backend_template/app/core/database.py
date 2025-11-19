from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
import os

# Get database URL from environment or settings
DATABASE_URL = os.getenv("DATABASE_URL") or settings.DATABASE_URL

# Create async engine
engine = create_async_engine(
    DATABASE_URL, 
    echo=False,  # Set to True for SQL debugging
    future=True,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=10,  # Connection pool size
    max_overflow=20  # Max connections beyond pool_size
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()

async def get_db():
    """Dependency for getting async database sessions"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Initialize database - create all tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def get_target_metadata():
    """Get metadata for Alembic migrations"""
    return Base.metadata