# from fastapi import APIRouter, Depends, HTTPException, Query
# # from sqlalchemy.orm import Session

# from sqlalchemy.ext.asyncio import AsyncSession

# from typing import List, Optional

# from app.core.database import get_db
# from app.core.security import get_current_admin_user
# from app.services.user_service import UserService
# from app.schemas.users import User, UserCreate, UserUpdate, UserStats

# router = APIRouter()

# @router.get("/", response_model=List[User])
# async def get_users(
#     skip: int = 0,
#     limit: int = 100,
#     search: Optional[str] = None,
#     role: Optional[str] = None,
#     status: Optional[str] = None,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Get all users (Admin only)
#     """
#     return user_service.get_users(
#         db, skip=skip, limit=limit, 
#         search=search, role=role, status=status
#     )

# @router.get("/stats", response_model=UserStats)
# async def get_user_stats(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Get user statistics (Admin only)
#     """
#     return user_service.get_user_stats(db)

# @router.get("/{user_id}", response_model=User)
# async def get_user(
#     user_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Get user by ID (Admin only)
#     """
#     user = user_service.get_user_by_id(db, user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user

# @router.post("/", response_model=User)
# async def create_user(
#     user_data: UserCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Create new user (Admin only)
#     """
#     # Check if user already exists
#     existing_user = user_service.get_user_by_email(db, user_data.email)
#     if existing_user:
#         raise HTTPException(
#             status_code=400,
#             detail="User with this email already exists"
#         )
    
#     return user_service.create_user(db, user_data)




# @router.put("/{user_id}", response_model=User)
# async def update_user(
#     user_id: int,
#     user_update: UserUpdate,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Update user (Admin only)
#     """
#     user = user_service.update_user(db, user_id, user_update)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user

# @router.delete("/{user_id}")
# async def delete_user(
#     user_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Delete user (Admin only)
#     """
#     success = user_service.delete_user(db, user_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"message": "User deleted successfully"}

# @router.post("/{user_id}/suspend")
# async def suspend_user(
#     user_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Suspend user account (Admin only)
#     """
#     user = user_service.update_user_status(db, user_id, "suspended")
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"message": "User suspended successfully"}

# @router.post("/{user_id}/activate")
# async def activate_user(
#     user_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_admin_user),
#     user_service: UserService = Depends()
# ):
#     """
#     Activate user account (Admin only)
#     """
#     user = user_service.update_user_status(db, user_id, "active")
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"message": "User activated successfully"}






from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.services.user_service import UserService
from app.schemas.users import User, UserCreate, UserUpdate, UserStats

router = APIRouter()

@router.get("/", response_model=List[User])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Get all users (Admin only)
    """
    return await user_service.get_users(
        db, skip=skip, limit=limit,
        search=search, role=role, status=status
    )


@router.get("/stats", response_model=UserStats)
async def get_user_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Get user statistics (Admin only)
    """
    return await user_service.get_user_stats(db)


@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Get user by ID (Admin only)
    """
    user = await user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=User)
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Create new user (Admin only)
    """
    # Check if user already exists
    existing_user = await user_service.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    return await user_service.create_user(db, user_data)


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Update user (Admin only)
    """
    user = await user_service.update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Delete user (Admin only)
    """
    success = await user_service.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@router.post("/{user_id}/suspend")
async def suspend_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Suspend user account (Admin only)
    """
    
    user = await user_service.update_user_status(db, user_id, "suspended")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User suspended successfully"}


@router.post("/{user_id}/activate")
async def activate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    user_service: UserService = Depends()
):
    """
    Activate user account (Admin only)
    """
    user = await user_service.update_user_status(db, user_id, "active")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User activated successfully"}
