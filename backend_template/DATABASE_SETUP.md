# RAMAERA Hosting Platform - Database Setup Guide

## Project Overview

This is a complete **hosting management platform** backend with the following features:
- User authentication and authorization
- Multi-level referral system (3 levels deep)
- Hosting plan management (VPS, Dedicated, Cloud)
- Server provisioning and management
- Order and invoice processing
- Payment integration with Razorpay
- Support ticket system
- Billing and payment method management

## Database Tables

The project will create **13 tables** in your PostgreSQL database:

1. **users_profiles** - User accounts and referral data
2. **hosting_plans** - Available hosting packages
3. **servers** - Server instances for customers
4. **orders** - Customer orders
5. **invoices** - Billing invoices
6. **payment_transactions** - Razorpay payment tracking
7. **payment_methods** - Customer payment methods
8. **billing_settings** - User billing preferences
9. **referral_payouts** - Referral commission payouts
10. **referral_earnings** - Referral commission tracking
11. **referral_commission_rates** - Commission rate configuration
12. **support_tickets** - Customer support system
13. **user_settings** - User preferences

## Prerequisites

1. **PostgreSQL** must be installed and running
2. **Python 3.9+** installed
3. A PostgreSQL database and user with proper permissions

## Setup Instructions

### Step 1: Update Database Credentials

Edit the `.env` file with your PostgreSQL credentials:

```bash
DATABASE_URL="postgresql+asyncpg://YOUR_USER:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE"
SECRET_KEY="your-secret-key-here"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
```

**Example:**
```bash
DATABASE_URL="postgresql+asyncpg://postgres:mypassword@localhost:5432/ramaera_hosting"
SECRET_KEY="super-secret-key-change-this"
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="your_secret_xxxxx"
```

**Note:** If your password contains special characters like `@`, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`

### Step 2: Activate Virtual Environment

```bash
cd "/Users/dev/Downloads/Dev Folder/BIDUA Industries/BIDUA Hosting/BIDUA Hostin Live/BIDUA Hosting/backend_template"
source venv/bin/activate
```

### Step 3: Test Database Connection

Run the setup script to verify your database connection:

```bash
./venv/bin/python3 setup_database.py
```

This script will:
- Test your PostgreSQL connection
- Check if the database exists (create if needed)
- Show existing tables
- Guide you through the migration process

### Step 4: Create Database Tables

#### Option A: Using Alembic (Recommended)

```bash
# 1. Generate migration file
alembic revision --autogenerate -m "Initial database setup"

# 2. Apply migration to create all tables
alembic upgrade head
```

#### Option B: Direct Table Creation

```bash
./venv/bin/python3 -c "
import asyncio
from app.core.database import init_db
asyncio.run(init_db())
print('✅ All tables created successfully!')
"
```

### Step 5: Verify Setup

Check that all tables were created:

```bash
./venv/bin/python3 -c "
import asyncio
import asyncpg
from urllib.parse import unquote
import os
from dotenv import load_dotenv
import re

load_dotenv()
db_url = os.getenv('DATABASE_URL')
match = re.match(r'postgresql\+asyncpg://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
user, password, host, port, database = match.groups()
password = unquote(password)

async def check():
    conn = await asyncpg.connect(user=user, password=password, database=database, host=host, port=int(port))
    tables = await conn.fetch(\"SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename\")
    print(f'\\n✅ Database: {database}')
    print(f'📊 Total Tables Created: {len(tables)}\\n')
    for i, table in enumerate(tables, 1):
        print(f'  {i}. {table[\"tablename\"]}')
    await conn.close()

asyncio.run(check())
"
```

### Step 6: Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## Troubleshooting

### Issue: "password authentication failed"

**Solution:**
1. Update the `.env` file with correct PostgreSQL credentials
2. Make sure PostgreSQL is running:
   ```bash
   # For macOS (Homebrew)
   brew services start postgresql
   
   # For Linux
   sudo systemctl start postgresql
   ```

### Issue: "database does not exist"

**Solution:**
```bash
# Create database manually
createdb -U postgres ramaera_hosting

# Or use psql
psql -U postgres -c "CREATE DATABASE ramaera_hosting;"
```

### Issue: "permission denied"

**Solution:**
```bash
# Grant permissions to your user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ramaera_hosting TO your_user;"
```

### Issue: "Alembic command not found"

**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Or use full path
./venv/bin/alembic revision --autogenerate -m "Initial setup"
```

## Database Schema Overview

### Users & Authentication
- Multi-level referral tracking (3 levels)
- Role-based access control
- Subscription and activation tracking

### Hosting Management
- Multiple hosting plan types (VPS, Dedicated, Cloud, Shared)
- Server lifecycle management
- Resource specifications (CPU, RAM, Storage, Bandwidth)

### Billing & Payments
- Razorpay integration
- Multiple billing cycles (monthly, quarterly, annual, etc.)
- Invoice generation and tracking
- Payment method management

### Referral System
- Three-level deep referral tracking
- Commission rate configuration
- Automatic earning calculations
- Payout management with tax handling

## Next Steps

After successful setup:

1. **Create Admin User** - You'll need to create an admin account
2. **Configure Hosting Plans** - Add your hosting packages
3. **Set Referral Rates** - Configure commission percentages
4. **Test Payment Integration** - Verify Razorpay integration
5. **Start Development** - Begin building your features

## Support

If you encounter any issues:
1. Check the `.env` file for correct credentials
2. Verify PostgreSQL is running
3. Check database permissions
4. Review Alembic migration logs

## Project Structure

```
backend_template/
├── app/
│   ├── models/          # Database models (14 tables)
│   ├── schemas/         # Pydantic schemas
│   ├── api/            # API routes
│   ├── core/           # Configuration
│   └── services/       # Business logic
├── alembic/            # Database migrations
├── .env                # Environment variables
└── requirements.txt    # Python dependencies
```

---

**Ready to start development!** 🚀
