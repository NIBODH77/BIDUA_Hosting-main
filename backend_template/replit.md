# RAMAERA Hosting Platform API

## Overview
This is a FastAPI-based backend API for the RAMAERA Hosting Platform. It provides endpoints for managing hosting services, billing, invoices, servers, user authentication, and more.

**Project Type:** Backend API (FastAPI + PostgreSQL)  
**Version:** 1.0.0  
**Status:** Running on Replit

## Tech Stack
- **Framework:** FastAPI 0.104.1
- **Server:** Uvicorn (ASGI server)
- **Database:** PostgreSQL (AsyncPG driver)
- **ORM:** SQLAlchemy 2.0.23 (Async)
- **Migrations:** Alembic 1.12.1
- **Authentication:** JWT (python-jose)
- **Password Hashing:** Bcrypt + Passlib

## Project Structure
```
app/
├── api/v1/
│   ├── endpoints/      # API route handlers
│   │   ├── auth.py     # Authentication endpoints
│   │   ├── billing.py  # Billing management
│   │   ├── invoices.py # Invoice management
│   │   ├── orders.py   # Order management
│   │   ├── plans.py    # Hosting plans
│   │   ├── servers.py  # Server management
│   │   └── ...
│   └── api.py         # API router aggregation
├── core/
│   ├── config.py      # Application settings
│   ├── database.py    # Database connection
│   └── security.py    # Security utilities
├── models/            # SQLAlchemy models
├── schemas/           # Pydantic schemas
├── services/          # Business logic layer
└── utils/             # Helper utilities

alembic/               # Database migrations
tests/                 # Test files
```

## API Endpoints
- **Root:** `GET /` - API information
- **Health Check:** `GET /health` - Server health status
- **API Docs:** `GET /docs` - Interactive Swagger UI
- **ReDoc:** `GET /redoc` - Alternative API documentation
- **API Routes:** `/api/v1/*` - All versioned API endpoints

## Recent Changes
- **2024-11-11:** Comprehensive Payment System Implementation
  - **Payment Transaction System:**
    - Created PaymentTransaction model with payment_type (SUBSCRIPTION/SERVER), activation_type (DIRECT/REFERRAL)
    - Razorpay integration with order creation, payment verification, and webhook handling
    - User-specific discount calculation (discount_percent field on UserProfile)
    - Tax calculation (18% GST) on discounted amount
    - Refund tracking (refunded_amount, razorpay_refund_ids)
  
  - **Referral Commission System:**
    - ReferralCommissionRate configuration table for level-wise commission rates
    - CommissionService for automated L1, L2, L3 commission distribution
    - Idempotent commission distribution (commission_distributed flag)
    - Commission calculated on eligible amount (subtotal - discount)
    - Automatic referrer balance updates and earning records
  
  - **Payment Services:**
    - PaymentService: Orchestrates payment creation, discount application, and verification
    - CommissionService: Handles level-wise commission distribution
    - RazorpayService: Razorpay API integration
  
  - **Payment Endpoints:**
    - POST /api/v1/payments/create-order - Create payment order (subscription or server)
    - POST /api/v1/payments/verify-payment - Verify and complete payment
    - POST /api/v1/payments/razorpay-webhook - Webhook handler
    - GET /api/v1/payments/payment-status/{razorpay_order_id} - Get payment status
  
  - **Database Updates:**
    - UserProfile: Added activation_type, discount_percent fields
    - Order: Added payment_type, activation_type, payment relationships
    - New tables: payment_transactions, referral_commission_rates

- **2024-11-11:** Initial Replit setup
  - Installed Python 3.11 and all dependencies
  - Configured PostgreSQL database with AsyncPG
  - Updated CORS and allowed hosts for Replit's proxy environment
  - Fixed database URL handling (auto-converts to asyncpg and removes unsupported sslmode parameter)
  - Added SQLite fallback support for local testing (uses aiosqlite)
  - Applied database migrations (initial_tables)
  - Configured backend to run on localhost:8000
  - Moved Razorpay API keys to environment variables for security
  - Fixed model relationships (removed non-existent PaymentModel and SubscriptionModel references)

## Configuration
The application uses environment variables for configuration:
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
- `SECRET_KEY` - JWT secret key (set to default, should be changed in production)
- `RAZORPAY_KEY_ID` - Razorpay API key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API secret

## Payment System Architecture

### Payment Types
1. **SUBSCRIPTION** - Monthly 499 plan payments
2. **SERVER** - Server purchase payments

### Activation Types
1. **DIRECT** - User signed up directly (no referrer)
2. **REFERRAL** - User signed up via referral code

### Payment Flow
1. **Create Order** - User initiates payment
   - PaymentService creates PaymentTransaction record
   - Applies user-specific discount (discount_percent)
   - Calculates tax (18% GST on discounted amount)
   - Creates Razorpay order
   - Returns order details to frontend

2. **Payment Verification** - After user completes payment on Razorpay
   - Verify Razorpay signature
   - Update PaymentTransaction to PAID status
   - Create Order record in database
   - Link Order to PaymentTransaction
   - Trigger commission distribution

3. **Commission Distribution** (if user activated via referral)
   - Fetch referral chain (L1, L2, L3)
   - Get commission rates from ReferralCommissionRate table
   - Calculate commission on eligible amount (subtotal - discount)
   - Create ReferralEarning records
   - Update referrer balances
   - Mark commission_distributed = true (idempotent)

### Commission Rates (Configurable)
**Subscription Payments:**
- L1 (Direct referrer): 10%
- L2 (Referrer's referrer): 5%
- L3 (Third level): 2%

**Server Payments:**
- L1 (Direct referrer): 8%
- L2 (Referrer's referrer): 4%
- L3 (Third level): 2%

### Key Features
- **Discount System:** User-specific discounts via discount_percent field
- **Refund Tracking:** refunded_amount and razorpay_refund_ids fields
- **Idempotent Commission:** commission_distributed flag prevents duplicate payouts
- **Webhook Support:** Razorpay webhook handler for automated payment processing
- **Transaction Safety:** All operations use database transactions

## Database
- Uses Replit's built-in PostgreSQL database (Neon-backed)
- Async SQLAlchemy with AsyncPG driver
- Migrations managed by Alembic
- Initial schema includes tables for: users, plans, servers, orders, invoices, billing, referrals, support tickets, settings, payment_transactions, referral_commission_rates

## Running the Application
The application runs automatically via the configured workflow:
- **Command:** `python -m uvicorn app.main:app --host localhost --port 8000 --reload`
- **Port:** 8000 (backend only, not exposed to public)
- **Auto-reload:** Enabled for development

## Database Migrations
Run migrations with:
```bash
alembic upgrade head
```

Create new migration:
```bash
alembic revision --autogenerate -m "description"
```

## Development Notes
- The backend is configured to run on `localhost:8000` (not publicly accessible)
- CORS is configured to allow all origins for Replit's proxy environment
- TrustedHost middleware allows all hosts to work with Replit's iframe preview
- The API uses async/await patterns throughout for better performance
- All database operations are asynchronous

## Security Notes
- Change `SECRET_KEY` in production
- Razorpay API keys are stored in environment variables
- Default admin email: admin@ramaera.com
- JWT tokens expire after 30 minutes

## Testing
Test basic functionality:
```bash
curl http://localhost:8000/
curl http://localhost:8000/health
```

Access API documentation at `/docs` or `/redoc`
