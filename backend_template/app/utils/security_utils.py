from passlib.context import CryptContext
from fastapi.concurrency import run_in_threadpool

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_password_hash(password: str) -> str:
    """Hash a plain text password using bcrypt (async-safe)."""
    return await run_in_threadpool(pwd_context.hash, password)

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password (async-safe)."""
    return await run_in_threadpool(pwd_context.verify, plain_password, hashed_password)
