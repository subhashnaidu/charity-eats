import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_signup_and_login():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Signup
        resp = await ac.post("/api/auth/signup", json={
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "testpassword",
            "role": "customer"
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "testuser@example.com"
        # Login
        resp = await ac.post("/api/auth/login", json={
            "email": "testuser@example.com",
            "password": "testpassword",
            "name": "Test User",
            "role": "customer"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
