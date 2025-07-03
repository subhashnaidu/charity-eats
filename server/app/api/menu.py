"""
Menu API Endpoints

This module provides endpoints for managing menu items, including listing, creating, updating, and deleting items.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from models.models import MenuItem, Vendor, User, UserRole
from schemas.schemas import MenuItemRead, MenuItemCreate
from api.users import get_current_user
from uuid import UUID
from typing import List

router = APIRouter(prefix="/api/menu", tags=["menu"])

@router.get("/vendor/{vendor_id}", response_model=List[MenuItemRead])
async def list_menu_items(vendor_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    List all menu items for a specific vendor.

    Args:
        vendor_id (UUID): The ID of the vendor.
        db (AsyncSession): The database session dependency.

    Returns:
        List[MenuItemRead]: A list of menu items for the vendor.
    """
    import logging
    logging.getLogger("charityeats").info(f"Menu list accessed at /api/menu/")
    q = await db.execute(select(MenuItem).where(MenuItem.vendor_id == vendor_id))
    return q.scalars().all()

@router.post("/vendor/{vendor_id}", response_model=MenuItemRead)
async def create_menu_item(
    vendor_id: UUID,
    item: MenuItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new menu item for a vendor.

    Args:
        vendor_id (UUID): The ID of the vendor.
        item (MenuItemCreate): The menu item details.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        MenuItemRead: The created menu item.

    Raises:
        HTTPException: If the user is not authorized or the vendor does not exist.
    """
    if current_user.role != UserRole.vendor:
        raise HTTPException(status_code=403, detail="Only vendors can add menu items")
    q = await db.execute(select(Vendor).where(Vendor.id == vendor_id, Vendor.user_id == current_user.id))
    vendor = q.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=403, detail="Not authorized for this vendor")
    db_item = MenuItem(vendor_id=vendor_id, **item.dict())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    import logging
    logging.getLogger("charityeats").info(f"Menu item created by role={current_user.role.value} at /api/menu/")
    return db_item

@router.patch("/{item_id}", response_model=MenuItemRead)
async def update_menu_item(
    item_id: UUID,
    item: MenuItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update an existing menu item.

    Args:
        item_id (UUID): The ID of the menu item to update.
        item (MenuItemCreate): The updated menu item details.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        MenuItemRead: The updated menu item.

    Raises:
        HTTPException: If the menu item is not found or the user is not authorized.
    """
    q = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    db_item = q.scalar_one_or_none()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    if current_user.role != UserRole.vendor or db_item.vendor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this item")
    for k, v in item.dict().items():
        setattr(db_item, k, v)
    await db.commit()
    await db.refresh(db_item)
    import logging
    logging.getLogger("charityeats").info(f"Menu item updated: id=[REDACTED] by role={current_user.role.value} at /api/menu/{item_id}")
    return db_item

@router.delete("/{item_id}", status_code=204)
async def delete_menu_item(
    item_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a menu item.

    Args:
        item_id (UUID): The ID of the menu item to delete.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Raises:
        HTTPException: If the menu item is not found or the user is not authorized.
    """
    q = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    db_item = q.scalar_one_or_none()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    if current_user.role != UserRole.vendor or db_item.vendor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")
    await db.delete(db_item)
    await db.commit()
    import logging
    logging.getLogger("charityeats").info(f"Menu item deleted: id=[REDACTED] by role={current_user.role.value} at /api/menu/{item_id}")
    return
