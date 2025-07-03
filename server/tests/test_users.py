import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_user_crud_flow():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Signup as admin
        resp = await ac.post("/api/auth/signup", json={
            "name": "Admin",
            "email": "admin@example.com",
            "password": "adminpass",
            "role": "admin"
        })
        assert resp.status_code == 201
        # Login as admin
        resp = await ac.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "adminpass",
            "name": "Admin",
            "role": "admin"
        })
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        # List users (admin)
        resp = await ac.get("/api/users", headers=headers)
        assert resp.status_code == 200
        # Update self
        resp = await ac.patch(f"/api/users/{resp.json()[0]['id']}", json={
            "name": "Admin Updated",
            "email": "admin@example.com",
            "role": "admin"
        }, headers=headers)
        assert resp.status_code == 200
        # Delete self
        resp = await ac.delete(f"/api/users/{resp.json()['id']}", headers=headers)
        assert resp.status_code == 204
