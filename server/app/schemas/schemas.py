from pydantic import BaseModel, EmailStr, UUID4, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    customer = "customer"
    vendor = "vendor"
    admin = "admin"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

class WalletRead(BaseModel):
    id: UUID4
    user_id: UUID4
    balance: Decimal
    updated_at: datetime

class WalletDeposit(BaseModel):
    amount: Decimal

class VendorBase(BaseModel):
    restaurant_name: str
    address: Optional[str] = None
    phone: str

class VendorCreate(VendorBase):
    pass

class VendorRead(VendorBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str]
    price: Decimal
    image_url: Optional[str]
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemRead(MenuItemBase):
    id: UUID4
    vendor_id: UUID4
    created_at: datetime
    updated_at: datetime

class OrderStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    preparing = "preparing"
    ready = "ready"
    completed = "completed"
    cancelled = "cancelled"

class OrderItemBase(BaseModel):
    menu_item_id: UUID4
    quantity: int
    price: Decimal

class OrderItemCreate(BaseModel):
    menu_item_id: UUID4
    quantity: int

class OrderItemRead(OrderItemBase):
    id: UUID4
    order_id: UUID4

class OrderBase(BaseModel):
    vendor_id: UUID4
    items: List[OrderItemCreate]

class OrderCreate(OrderBase):
    pass

class OrderRead(BaseModel):
    id: UUID4
    customer_id: UUID4
    vendor_id: UUID4
    status: OrderStatus
    total_price: Decimal
    created_at: datetime
    updated_at: datetime
    order_items: List[OrderItemRead]

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"

class PaymentBase(BaseModel):
    order_id: UUID4
    payment_method: str

class PaymentCreate(PaymentBase):
    pass

class PaymentRead(BaseModel):
    id: UUID4
    order_id: UUID4
    user_id: UUID4
    amount: Decimal
    status: PaymentStatus
    payment_method: str
    created_at: datetime

class FavoriteBase(BaseModel):
    menu_item_id: UUID4

class FavoriteRead(FavoriteBase):
    id: UUID4
    user_id: UUID4

class UserLogin(BaseModel):
    email: EmailStr
    password: str
