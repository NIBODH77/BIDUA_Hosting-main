from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
import uvicorn
from fastapi.responses import FileResponse
from sqlalchemy.engine import URL
from scalar_fastapi import get_scalar_api_reference

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import engine, Base


app = FastAPI(
    title="BIDUA IT Connect",
    description="Complete hosting management platform API with authentication, payments, server management, and more.",
    version=settings.VERSION,
    docs_url=None,  # Disable default docs
    redoc_url=None,  # Disable redoc
    contact={
        "name": "BIDUA IT Connect Support",
        "url": "https://bidua.com",
        "email": "support@bidua.com",
    },
    license_info={
        "name": "Proprietary License",
        "url": "https://bidua.com/license",
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development Server"
        },
        {
            "url": "https://api.bidua.com",
            "description": "Production Server"
        }
    ],
    openapi_tags=[
        {
            "name": "Introduction",
            "description": "API Overview and Getting Started"
        },
        {
            "name": "Health",
            "description": "System health and status checks"
        },
        {
            "name": "Ping",
            "description": "Connectivity testing endpoints"
        },
        {
            "name": "Time",
            "description": "Server time and timezone information"
        },
        {
            "name": "Auth Module", 
            "description": "User authentication and authorization. Login, signup, token refresh, and password management."
        },
        {
            "name": "User Module", 
            "description": "User profile management. View and update user information, settings, and preferences."
        },
        {
            "name": "Hosting Plans", 
            "description": "Browse and manage hosting plans - VPS, Dedicated Servers, and Cloud hosting with pricing details."
        },
        {
            "name": "Server Module", 
            "description": "Server provisioning and management. Deploy, configure, and monitor your hosting servers."
        },
        {
            "name": "Order Module", 
            "description": "Order processing and tracking. Create new orders and monitor their status."
        },
        {
            "name": "Payment Module", 
            "description": "Payment processing via Razorpay. Handle transactions, payment methods, and payment history."
        },
        {
            "name": "Invoice Module", 
            "description": "Invoice generation and management. View, download, and manage billing invoices."
        },
        {
            "name": "Referral Module", 
            "description": "Referral program management. Track referrals, earnings, and multi-level commission payouts."
        },
        {
            "name": "Support Module", 
            "description": "Customer support ticket system. Create, view, update, and manage support tickets."
        },
        {
            "name": "Admin Module", 
            "description": "Administrative operations. Dashboard analytics, user management, and system configuration."
        },
    ]
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Add no-cache headers middleware
class NoCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

app.add_middleware(NoCacheMiddleware)

# API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Health endpoint under /api/v1 for frontend BackendStatusBanner
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
async def api_health_check():
    """Health check endpoint for frontend monitoring"""
    return {
        "status": "ok",
        "service": "BIDUA IT Connect API",
        "version": settings.VERSION
    }

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Database initialization
async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def on_startup():
    print("🔗 Database connection check...")
    url = engine.url
    safe_url = URL.create(
        drivername=url.drivername,
        username=url.username,
        host=url.host,
        port=url.port,
        database=url.database
    )
    print(f"✅ Connected to database: {safe_url}")
    await init_models()
    print("📦 Tables initialized (if not already present).")

# Root and health check endpoints
@app.get("/", tags=["Introduction"])
async def root():
    return {
        "message": "BIDUA IT Connect API",
        "version": settings.VERSION,
        "documentation": "/swagger",
        "status": "active"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "BIDUA IT Connect",
        "version": settings.VERSION
    }

@app.get("/ping", tags=["Ping"])
async def ping():
    return {"message": "pong"}

# Scalar API Documentation
@app.get("/swagger", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="BIDUA IT Connect API Documentation",
        scalar_favicon_url="https://avatars.githubusercontent.com/u/1834093?s=200&v=4",
    )

# Endpoint for testing payment page (React version)
@app.get("/test-payment", response_class=FileResponse)
async def get_test_payment_page():
    return "app/static/index.html"

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="localhost",
        port=8000,
        reload=settings.DEBUG
    )