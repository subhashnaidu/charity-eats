"""
Orders API Endpoints

This module provides endpoints for managing orders, including placing, listing, updating, and deleting orders.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from models.models import Order, OrderItem, MenuItem, Vendor, User, UserRole, OrderStatus
from schemas.schemas import OrderCreate, OrderRead, OrderItemRead
from api.users import get_current_user
from uuid import UUID
from typing import List
from decimal import Decimal

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=OrderRead, status_code=201)
async def place_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Place a new order.

    Args:
        order (OrderCreate): The order details.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        OrderRead: The created order details.

    Raises:
        HTTPException: If the user is not authorized or the menu item is not available.
    """
    if current_user.role != UserRole.customer:
        raise HTTPException(status_code=403, detail="Only customers can place orders")
    # Calculate total price
    total_price = Decimal(0)
    order_items = []
    for item in order.items:
        q = await db.execute(select(MenuItem).where(MenuItem.id == item.menu_item_id, MenuItem.vendor_id == order.vendor_id))
        menu_item = q.scalar_one_or_none()
        if not menu_item or not menu_item.is_available:
            raise HTTPException(status_code=400, detail="Menu item not available")
        total_price += menu_item.price * item.quantity
        order_items.append((menu_item, item.quantity, menu_item.price))
    db_order = Order(
        customer_id=current_user.id,
        vendor_id=order.vendor_id,
        status=OrderStatus.pending,
        total_price=total_price
    )
    db.add(db_order)
    await db.flush()  # get order id
    for menu_item, quantity, price in order_items:
        db_item = OrderItem(order_id=db_order.id, menu_item_id=menu_item.id, quantity=quantity, price=price)
        db.add(db_item)
    await db.commit()
    await db.refresh(db_order)
    await db.refresh(db_order, attribute_names=["order_items"])
    import logging
    logging.getLogger("charityeats").info(f"Order created by role={current_user.role.value} at /api/orders/")
    return db_order

@router.get("/customer", response_model=List[OrderRead])
async def list_customer_orders(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    List all orders for the current customer.

    Args:
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        List[OrderRead]: A list of orders for the customer.

    Raises:
        HTTPException: If the user is not authorized.
    """
    if current_user.role != UserRole.customer:
        raise HTTPException(status_code=403, detail="Only customers can view their orders")
    q = await db.execute(select(Order).where(Order.customer_id == current_user.id))
    import logging
    logging.getLogger("charityeats").info(f"Order list accessed by role={current_user.role.value} at /api/orders/")
    return q.scalars().all()

@router.get("/vendor", response_model=List[OrderRead])
async def list_vendor_orders(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    List all orders for the current vendor.

    Args:
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        List[OrderRead]: A list of orders for the vendor.

    Raises:
        HTTPException: If the user is not authorized.
    """
    if current_user.role != UserRole.vendor:
        raise HTTPException(status_code=403, detail="Only vendors can view their orders")
    q = await db.execute(select(Order).where(Order.vendor_id == current_user.vendor.id))
    return q.scalars().all()

@router.patch("/{order_id}/status", response_model=OrderRead)
async def update_order_status(order_id: UUID, status: OrderStatus, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Update the status of an order.

    Args:
        order_id (UUID): The ID of the order to update.
        status (OrderStatus): The new status of the order.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        OrderRead: The updated order details.

    Raises:
        HTTPException: If the order is not found or the user is not authorized.
    """
    if current_user.role != UserRole.vendor:
        raise HTTPException(status_code=403, detail="Only vendors can update order status")
    q = await db.execute(select(Order).where(Order.id == order_id, Order.vendor_id == current_user.vendor.id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    await db.commit()
    await db.refresh(order)
    return order

@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Retrieve the details of a specific order.

    Args:
        order_id (UUID): The ID of the order to retrieve.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        OrderRead: The order details.

    Raises:
        HTTPException: If the order is not found or the user is not authorized.
    """
    q = await db.execute(select(Order).where(Order.id == order_id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role == UserRole.customer and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    if current_user.role == UserRole.vendor and order.vendor_id != current_user.vendor.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    return order

@router.patch("/{order_id}", response_model=OrderRead)
async def update_order(order_id: UUID, order: OrderCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Update the details of an order.

    Args:
        order_id (UUID): The ID of the order to update.
        order (OrderCreate): The updated order details.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Returns:
        OrderRead: The updated order details.

    Raises:
        HTTPException: If the order is not found or the user is not authorized.
    """
    if current_user.role != UserRole.vendor:
        raise HTTPException(status_code=403, detail="Only vendors can update orders")
    q = await db.execute(select(Order).where(Order.id == order_id, Order.vendor_id == current_user.vendor.id))
    db_order = q.scalar_one_or_none()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Update order details
    updated_fields = order.dict(exclude_unset=True)
    for key, value in updated_fields.items():
        setattr(db_order, key, value)
    await db.commit()
    await db.refresh(db_order)
    import logging
    logging.getLogger("charityeats").info(f"Order updated: id=[REDACTED] by role={current_user.role.value} at /api/orders/{order_id}")
    return db_order

@router.delete("/{order_id}", status_code=204)
async def delete_order(order_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Delete an order.

    Args:
        order_id (UUID): The ID of the order to delete.
        current_user (User): The current authenticated user.
        db (AsyncSession): The database session dependency.

    Raises:
        HTTPException: If the order is not found or the user is not authorized.
    """
    if current_user.role != UserRole.vendor:
        raise HTTPException(status_code=403, detail="Only vendors can delete orders")
    q = await db.execute(select(Order).where(Order.id == order_id, Order.vendor_id == current_user.vendor.id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    await db.delete(order)
    await db.commit()
    import logging
    logging.getLogger("charityeats").info(f"Order deleted: id=[REDACTED] by role={current_user.role.value} at /api/orders/{order_id}")
    return
