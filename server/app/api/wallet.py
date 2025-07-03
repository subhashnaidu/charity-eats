from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from models.models import Wallet, User
from schemas.schemas import WalletRead, WalletDeposit
from api.users import get_current_user
from decimal import Decimal

router = APIRouter(prefix="/api/wallet", tags=["wallet"])

@router.get("/", response_model=WalletRead)
async def get_wallet(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    import logging
    logging.getLogger("charityeats").info(f"Wallet accessed by role={current_user.role.value} at /api/wallet/")
    
    q = await db.execute(select(Wallet).where(Wallet.user_id == current_user.id))
    wallet = q.scalar_one_or_none()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet

@router.post("/deposit", response_model=WalletRead)
async def deposit_wallet(
    deposit: WalletDeposit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if deposit.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be positive")
    q = await db.execute(select(Wallet).where(Wallet.user_id == current_user.id))
    wallet = q.scalar_one_or_none()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance=Decimal(0))
        db.add(wallet)
        await db.flush()
    wallet.balance += deposit.amount
    await db.commit()
    await db.refresh(wallet)
    
    import logging
    logging.getLogger("charityeats").info(f"Deposit made by role={current_user.role.value} at /api/wallet/deposit")
    
    return wallet

@router.post("/withdraw")
async def withdraw(amount: float, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    import logging
    logging.getLogger("charityeats").info(f"Withdraw made by role={current_user.role.value} at /api/wallet/withdraw")
    
    # Withdraw logic here

    return {"message": "Withdraw successful"}
