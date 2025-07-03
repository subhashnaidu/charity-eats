from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from models.models import Vendor, User, UserRole
from schemas.schemas import VendorRead, VendorCreate
from api.users import get_current_user
from uuid import UUID
from typing import List

router = APIRouter(prefix="/api/vendors", tags=["vendors"])

@router.get("/", response_model=List[VendorRead])
async def list_vendors(db: AsyncSession = Depends(get_db)):
    import logging
    logging.getLogger("charityeats").info(f"Vendor list accessed at /api/vendors/")
    q = await db.execute(select(Vendor))
    return q.scalars().all()

@router.get("/{vendor_id}", response_model=VendorRead)
async def get_vendor(vendor_id: UUID, db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    vendor = q.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.post("/profile", response_model=VendorRead)
async def create_vendor_profile(
    vendor: VendorCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != UserRole.vendor:
        raise HTTPException(status_code=403, detail="Only vendors can create a profile")
    q = await db.execute(select(Vendor).where(Vendor.user_id == current_user.id))
    if q.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Vendor profile already exists")
    db_vendor = Vendor(user_id=current_user.id, **vendor.dict())
    db.add(db_vendor)
    await db.commit()
    await db.refresh(db_vendor)
    import logging
    logging.getLogger("charityeats").info(f"Vendor profile created by role={current_user.role.value} at /api/vendors/profile")
    return db_vendor

@router.get("/profile/me", response_model=VendorRead)
async def get_own_vendor_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != UserRole.vendor:
        raise HTTPException(status_code=403, detail="Only vendors can access this endpoint")
    resp = await db.execute(select(Vendor).where(Vendor.user_id == current_user.id))
    vendor = resp.scalar_one_or_none()
    if vendor:
        import logging
        logging.getLogger("charityeats").info(f"Vendor profile accessed by role={current_user.role.value} at /api/vendors/profile/me")
    return vendor
