from fastapi import APIRouter, Depends, HTTPException, status, Header, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from core.security import decode_access_token
from models.models import User, UserRole
from schemas.schemas import UserRead, UserBase
# from jose import JWTError
from uuid import UUID
from typing import List

router = APIRouter(prefix="/api/users", tags=["users"])

async def get_current_user(Authorization: str = Header(...), db: AsyncSession = Depends(get_db)):
    if not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = Authorization.split(" ", 1)[1]
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        if not user_id or not role:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    q = await db.execute(select(User).where(User.id == UUID(user_id)))
    user = q.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/me", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/", response_model=List[UserRead])
async def list_users(current_user: User = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    import logging
    logging.getLogger("charityeats").info(f"User list accessed by role={current_user.role.value} at /api/users/")
    q = await db.execute(select(User))
    users = q.scalars().all()
    return users

@router.patch("/{user_id}", response_model=UserRead)
async def update_user(user_id: UUID, user_update: UserBase, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.admin and str(current_user.id) != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    q = await db.execute(select(User).where(User.id == user_id))
    user = q.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.name = user_update.name
    user.email = user_update.email
    user.role = user_update.role
    await db.commit()
    await db.refresh(user)
    import logging
    logging.getLogger("charityeats").info(f"User updated: id=[REDACTED] by role={current_user.role.value} at /api/users/{user_id}")
    return user

@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.admin and str(current_user.id) != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    q = await db.execute(select(User).where(User.id == user_id))
    user = q.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(user)
    await db.commit()
    import logging
    logging.getLogger("charityeats").info(f"User deleted: id=[REDACTED] by role={current_user.role.value} at /api/users/{user_id}")
    return
