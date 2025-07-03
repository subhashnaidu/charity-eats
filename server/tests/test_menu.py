import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_menu_crud_flow():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Signup/login as vendor
        await ac.post("/api/auth/signup", json={
            "name": "MenuVendor",
            "email": "menuvendor@example.com",
            "password": "vendorpass",
            "role": "vendor"
        })
        resp = await ac.post("/api/auth/login", json={
            "email": "menuvendor@example.com",
            "password": "vendorpass",
            "name": "MenuVendor",
            "role": "vendor"
        })
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        # Create vendor profile
        resp = await ac.post("/api/vendors/profile", json={
            "restaurant_name": "MenuTestaurant",
            "address": "456 Main St",
            "phone": "555-5678"
        }, headers=headers)
        vendor_id = resp.json()["id"]
        # Add menu item
        resp = await ac.post(f"/api/menu/vendor/{vendor_id}", json={
            "name": "Burger",
            "description": "Tasty",
            "price": 9.99,
            "image_url": None,
            "is_available": True
        }, headers=headers)
        assert resp.status_code == 200
        item_id = resp.json()["id"]
        # List menu items
        resp = await ac.get(f"/api/menu/vendor/{vendor_id}")
        assert resp.status_code == 200
        # Update menu item
        resp = await ac.patch(f"/api/menu/{item_id}", json={
            "name": "Burger Deluxe",
            "description": "Even tastier",
            "price": 12.99,
            "image_url": None,
            "is_available": True
        }, headers=headers)
        assert resp.status_code == 200
        # Delete menu item
        resp = await ac.delete(f"/api/menu/{item_id}", headers=headers)
        assert resp.status_code == 204
