import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_order_flow():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Signup/login as vendor and create menu item
        await ac.post("/api/auth/signup", json={
            "name": "OrderVendor",
            "email": "ordervendor@example.com",
            "password": "vendorpass",
            "role": "vendor"
        })
        resp = await ac.post("/api/auth/login", json={
            "email": "ordervendor@example.com",
            "password": "vendorpass",
            "name": "OrderVendor",
            "role": "vendor"
        })
        vtoken = resp.json()["access_token"]
        vheaders = {"Authorization": f"Bearer {vtoken}"}
        resp = await ac.post("/api/vendors/profile", json={
            "restaurant_name": "OrderTestaurant",
            "address": "789 Main St",
            "phone": "555-9999"
        }, headers=vheaders)
        vendor_id = resp.json()["id"]
        resp = await ac.post(f"/api/menu/vendor/{vendor_id}", json={
            "name": "Pizza",
            "description": "Cheesy",
            "price": 15.00,
            "image_url": None,
            "is_available": True
        }, headers=vheaders)
        item_id = resp.json()["id"]
        # Signup/login as customer
        await ac.post("/api/auth/signup", json={
            "name": "OrderCustomer",
            "email": "ordercustomer@example.com",
            "password": "custpass",
            "role": "customer"
        })
        resp = await ac.post("/api/auth/login", json={
            "email": "ordercustomer@example.com",
            "password": "custpass",
            "name": "OrderCustomer",
            "role": "customer"
        })
        ctoken = resp.json()["access_token"]
        cheaders = {"Authorization": f"Bearer {ctoken}"}
        # Place order
        resp = await ac.post("/api/orders/", json={
            "vendor_id": vendor_id,
            "items": [{"menu_item_id": item_id, "quantity": 2}]
        }, headers=cheaders)
        assert resp.status_code == 201
        order_id = resp.json()["id"]
        # Customer views their orders
        resp = await ac.get("/api/orders/customer", headers=cheaders)
        assert resp.status_code == 200
        # Vendor views their orders
        resp = await ac.get("/api/orders/vendor", headers=vheaders)
        assert resp.status_code == 200
        # Vendor updates order status
        resp = await ac.patch(f"/api/orders/{order_id}/status?status=preparing", headers=vheaders)
        assert resp.status_code == 200
        # Customer gets order details
        resp = await ac.get(f"/api/orders/{order_id}", headers=cheaders)
        assert resp.status_code == 200
