# BIDUA Hosting Platform

A comprehensive hosting management platform with React PWA frontend and FastAPI backend.

## Project Overview

**Status:** ✅ Frontend Running | ⚠️ Backend Needs Database Setup  
**Frontend URL:** Running on port 5000 (check Webview)  
**Backend API:** Will run on localhost:8000 (requires database setup)

## Project Structure

- **BIDUA_Hosting-main/** - React frontend (TypeScript + Vite + Tailwind CSS)
- **backend_template/** - FastAPI backend (Python 3.11 + PostgreSQL)

## ✅ Completed Setup

### Frontend
- ✅ Node.js 20 installed
- ✅ Dependencies installed (`npm install`)
- ✅ Vite configured for port 5000 and host 0.0.0.0 (Replit compatible)
- ✅ API proxy configured (proxies `/api` requests to backend)
- ✅ Workflow configured and running

### Backend
- ✅ Python 3.11 installed
- ✅ Dependencies installed (`pip install -r requirements.txt`)
- ✅ Database migration created to fix enum issue
- ✅ Environment variables template ready

### Bug Fixes
- ✅ Fixed addon category enum error - Added `CPU` category to `AddonCategory` enum
- ✅ Created Alembic migration to add 'cpu' value to PostgreSQL enum

## ⚠️ Database Setup Required

The error you encountered (`invalid input value for enum addoncategory: "cpu"`) has been fixed in the code and migration, but you need to:

### 1. Set Up PostgreSQL Database

You'll need to set up a PostgreSQL database. You can either:
- Use Replit's built-in PostgreSQL database
- Use an external PostgreSQL service (Neon, Supabase, etc.)

### 2. Configure Backend Environment

Edit `backend_template/.env` and update:

```bash
# Update with your actual database URL
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database

# Generate a secure secret key
SECRET_KEY=your-super-secret-jwt-key-change-this

# Add Razorpay credentials (get from https://razorpay.com)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Run Database Migrations

Once you have a database configured, run:

```bash
cd backend_template
alembic upgrade head
```

This will:
- Create all database tables
- Add the 'cpu' value to the addon category enum (fixing your error)

### 4. Start Backend Server

Create a workflow or run manually:

```bash
cd backend_template
python -m uvicorn app.main:app --host localhost --port 8000 --reload
```

## Frontend-Backend Communication

The frontend is configured to communicate with the backend through:
- **Vite Proxy:** All `/api` requests are proxied to `http://localhost:8000`
- **Environment:** `VITE_API_URL` is empty (uses relative paths via proxy)

This setup ensures the frontend can reach the backend even in Replit's containerized environment.

## Tech Stack

### Frontend
- React 18.3.1 + TypeScript 5.5.3
- Vite 5.4.2 (build tool)
- Tailwind CSS 3.4.1
- React Router 7.9.3
- Lucide React (icons)

### Backend
- FastAPI 0.104.1
- Python 3.11
- PostgreSQL + AsyncPG
- SQLAlchemy 2.0.36 (async ORM)
- Alembic 1.12.1 (migrations)
- JWT Authentication
- Razorpay Payment Integration

## Features

- 🔐 User Authentication & Authorization (JWT)
- 💰 Razorpay Payment Gateway Integration
- 🖥️ Server Management & Provisioning
- 📊 Admin Dashboard
- 🎫 Support Ticket System
- 👥 Referral & Affiliate System
- 💳 Billing & Invoicing
- 📱 Progressive Web App (PWA)
- 📝 Comprehensive API Documentation

## API Documentation

Once the backend is running, access:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Recent Changes (Replit Setup)

**2025-11-20:** Initial Replit Environment Setup
- Installed Node.js 20 and Python 3.11
- Configured Vite for port 5000 with proper host binding
- Added API proxy to Vite config for frontend-backend communication
- Fixed addon category enum issue by adding CPU category
- Created database migration to update PostgreSQL enum
- Set up frontend workflow on port 5000

## Next Steps

1. **Set up PostgreSQL database** (Replit DB or external service)
2. **Update backend/.env** with database credentials and secrets
3. **Run migrations:** `cd backend_template && alembic upgrade head`
4. **Start backend server** on port 8000
5. **Test the application** - Frontend should connect to backend via proxy

## Development Commands

### Frontend
```bash
cd BIDUA_Hosting-main
npm run dev          # Start dev server (already running)
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend
```bash
cd backend_template
alembic upgrade head                           # Run migrations
alembic revision --autogenerate -m "message"   # Create migration
python -m uvicorn app.main:app --reload        # Start server
```

## Troubleshooting

### Frontend can't reach backend
- Ensure backend is running on port 8000
- Check Vite proxy configuration in `vite.config.ts`
- Verify `VITE_API_URL` is empty or not set

### Database connection errors
- Verify `DATABASE_URL` in backend/.env
- Ensure PostgreSQL is running and accessible
- Check database credentials

### Enum error persists
- Run `alembic upgrade head` to apply the CPU enum migration
- Verify migration was applied: `alembic current`

## Support

For issues or questions:
- Check the comprehensive documentation in `/docs` route on frontend
- Review API documentation at `/docs` endpoint on backend
- Examine error logs in workflow outputs
