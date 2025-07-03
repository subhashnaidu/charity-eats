import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_wallet_flow():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Signup/login as user
        await ac.post("/api/auth/signup", json={
            "name": "WalletUser",
            "email": "walletuser@example.com",
            "password": "walletpass",
            "role": "customer"
        })
        resp = await ac.post("/api/auth/login", json={
            "email": "walletuser@example.com",
            "password": "walletpass",
            "name": "WalletUser",
            "role": "customer"
        })
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        # Deposit to wallet
        resp = await ac.post("/api/wallet/deposit", json={"amount": 50.0}, headers=headers)
        assert resp.status_code == 200
        assert float(resp.json()["balance"]) >= 50.0
        # Get wallet balance
        resp = await ac.get("/api/wallet/", headers=headers)
        assert resp.status_code == 200
        assert float(resp.json()["balance"]) >= 50.0
