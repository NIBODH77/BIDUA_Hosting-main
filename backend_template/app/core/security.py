# from datetime import datetime, timedelta
# from typing import Any, Union, Optional
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from fastapi import Depends, HTTPException, status
# from fastapi.security import HTTPBearer
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.services.user_service import UserService
# from app.core.config import settings
# from app.core.database import get_db
# from app.models.users import UserProfile
# # from app.schemas.users import User
# from app.utils.security_utils import get_password_hash, verify_password


# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# security = HTTPBearer()


# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)


# def get_password_hash(password: str) -> str:
#     return pwd_context.hash(password)

# def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(
#             minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
#         )
#     to_encode = {"exp": expire, "sub": str(subject)}
#     encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
#     return encoded_jwt

# def verify_token(token: str) -> Optional[str]:
#     try:
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#         user_id: str = payload.get("sub")
#         if user_id is None:
#             return None
#         return user_id
#     except JWTError:
#         return None

# # async def get_current_user(
# #     credentials: HTTPAuthorizationCredentials = Depends(security),
# #     db: Session = Depends(get_db)
# # ) -> UserProfile:
# #     credentials_exception = HTTPException(
# #         status_code=status.HTTP_401_UNAUTHORIZED,
# #         detail="Could not validate credentials",
# #         headers={"WWW-Authenticate": "Bearer"},
# #     )
    
# #     user_id = verify_token(credentials.credentials)
# #     if user_id is None:
# #         raise credentials_exception
    
# #     user = db.query(UserProfile).filter(UserProfile.id == int(user_id)).first()
# #     if user is None:
# #         raise credentials_exception
    
# #     if user.account_status != "active":
# #         raise HTTPException(
# #             status_code=status.HTTP_403_FORBIDDEN,
# #             detail="Account is suspended or inactive"
# #         )
    
# #     return user


# # Your existing security functions...

# async def get_current_user(
#     db: AsyncSession = Depends(get_db),
#     token: str = Depends(security)
# ) -> UserProfile:
#     try:
#         payload = verify_token(token)
#         user_id = payload.get("sub")
#         if user_id is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid authentication credentials"
#             )
        
#         user_service = UserService()
#         user = await user_service.get_user_by_id(db, int(user_id))
#         if user is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="User not found"
#             )
        
#         if user.account_status != "active":
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Account is suspended or inactive"
#             )
            
#         return user
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid authentication credentials"
#         )


# async def get_current_active_user(
#     current_user: UserProfile = Depends(get_current_user)
# ) -> UserProfile:
#     if current_user.account_status != "active":
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Account is suspended or inactive"
#         )
#     return current_user

# async def get_current_admin_user(
#     current_user: UserProfile = Depends(get_current_user)
# ) -> UserProfile:
#     if current_user.role not in ["admin", "super_admin"]:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Not enough permissions"
#         )
#     return current_user






from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.users import UserProfile
from app.utils.security_utils import get_password_hash, verify_password


security = HTTPBearer()


def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(security)
) -> UserProfile:
    from app.services.user_service import UserService  # moved inside to prevent circular import

    print(f"=== GET_CURRENT_USER ===")
    print(f"Token object: {token}")
    print(f"Token type: {type(token)}")
    if hasattr(token, 'credentials'):
        print(f"Token credentials: {token.credentials[:50] if token.credentials else 'None'}...")
    
    payload = verify_token(token.credentials)
    print(f"Payload: {payload}")
    
    if not payload or "sub" not in payload:
        print("ERROR: Invalid payload or missing 'sub'")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    user_service = UserService()
    user = await user_service.get_user_by_id(db, int(payload["sub"]))
    if not user:
        print(f"ERROR: User not found for id {payload['sub']}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    if user.account_status != "active":
        print(f"ERROR: User account not active: {user.account_status}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or inactive",
        )

    print(f"SUCCESS: User authenticated: {user.email}")
    return user


async def get_current_active_user(
    current_user: UserProfile = Depends(get_current_user)
) -> UserProfile:
    if current_user.account_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or inactive",
        )
    return current_user


async def get_current_admin_user(
    current_user: UserProfile = Depends(get_current_user)
) -> UserProfile:
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user

