import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_vendor_profile_and_listing():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Signup and login as vendor
        await ac.post("/api/auth/signup", json={
            "name": "Vendor",
            "email": "vendor@example.com",
            "password": "vendorpass",
            "role": "vendor"
        })
        resp = await ac.post("/api/auth/login", json={
            "email": "vendor@example.com",
            "password": "vendorpass",
            "name": "Vendor",
            "role": "vendor"
        })
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        # Create vendor profile
        resp = await ac.post("/api/vendors/profile", json={
            "restaurant_name": "Testaurant",
            "address": "123 Main St",
            "phone": "555-1234"
        }, headers=headers)
        assert resp.status_code == 200
        # Get own profile
        resp = await ac.get("/api/vendors/profile/me", headers=headers)
        assert resp.status_code == 200
        # List all vendors
        resp = await ac.get("/api/vendors")
        assert resp.status_code == 200
        assert any(v["restaurant_name"] == "Testaurant" for v in resp.json())
