from fastapi import FastAPI, Request
from api.auth import router as auth_router
from api.users import router as users_router
from api.vendors import router as vendors_router
from api.menu import router as menu_router
from api.orders import router as orders_router
from api.wallet import router as wallet_router
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
import logging
from core.database import async_engine
from models.models import Base

app = FastAPI()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("charityeats")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log request metadata (no PII)
        logger.info(f"Request: {request.method} {request.url.path}")
        response = await call_next(request)
        logger.info(f"Response: {request.method} {request.url.path} - Status {response.status_code}")
        return response

app.add_middleware(LoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins for better security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(vendors_router)
app.include_router(menu_router)
app.include_router(orders_router)
app.include_router(wallet_router)

async def init_async_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def on_startup():
    await init_async_db()

@app.get("/")
def read_root():
    return {"message": "CharityEats API is running"}
