"""
Authentication API Endpoints

This module provides endpoints for user authentication, including signup and login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from core.security import hash_password, verify_password, create_access_token
from models.models import User, UserRole
from schemas.schemas import UserCreate, UserRead, UserLogin, UserRole
from models.models import Vendor
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=UserRead, status_code=201)
async def signup(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new user account.

    Args:
        user (UserCreate): The user details for signup.
        db (AsyncSession): The database session dependency.

    Returns:
        UserRead: The created user details.

    Raises:
        HTTPException: If the email is already registered.
    """
    hashed_pw = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw,
        role=user.role
    )
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)

        # If the user is a vendor, create a corresponding vendor entry
        if db_user.role == UserRole.vendor:
            # Provide placeholder values for required vendor fields
            db_vendor = Vendor(
                user_id=db_user.id,
                restaurant_name="Placeholder Restaurant Name",
                address="Placeholder Address",
                phone="Placeholder Phone"
            )
            db.add(db_vendor)
            await db.commit()
            # No need to refresh db_vendor if not returning it

    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    return db_user

@router.post("/login")
async def login(form: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Authenticate a user and return an access token.

    Args:
        form (UserLogin): The user login details.
        db (AsyncSession): The database session dependency.

    Returns:
        dict: A dictionary containing the access token and token type.

    Raises:
        HTTPException: If the credentials are invalid.
    """
    q = await db.execute(select(User).where(User.email == form.email))
    user = q.scalar_one_or_none()
    if not user or not verify_password(form.password, user.password_hash):
        # Log failed login attempt (no PII)
        import logging
        logging.getLogger("charityeats").info(f"Failed login attempt for email: [REDACTED] at /api/auth/login")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    # Log successful login (no PII)
    import logging
    logging.getLogger("charityeats").info(f"User login: role={user.role.value} at /api/auth/login")
    return {"access_token": token, "token_type": "bearer"}
