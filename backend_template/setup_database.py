"""
Database Setup Script for BIDUA Hosting Platform

This script will help you:
1. Test PostgreSQL connection
2. Create database if needed
3. Run Alembic migrations to create all tables
"""
import asyncio
import asyncpg
import sys
import os
from pathlib import Path

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


async def test_postgres_connection(host, port, user, password, database=None):
    """Test PostgreSQL connection"""
    try:
        conn = await asyncpg.connect(
            user=user,
            password=password,
            database=database or 'postgres',  # Connect to default db first
            host=host,
            port=port
        )
        print(f"{GREEN}✅ PostgreSQL Connection Successful!{RESET}")
        version = await conn.fetchval('SELECT version()')
        print(f"{BLUE}Version: {version[:80]}...{RESET}")
        await conn.close()
        return True
    except Exception as e:
        print(f"{RED}❌ Connection Error: {str(e)}{RESET}")
        return False


async def check_database_exists(host, port, user, password, database):
    """Check if database exists"""
    try:
        conn = await asyncpg.connect(
            user=user,
            password=password,
            database='postgres',
            host=host,
            port=port
        )
        result = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", database
        )
        await conn.close()
        return result is not None
    except Exception as e:
        print(f"{RED}Error checking database: {str(e)}{RESET}")
        return False


async def create_database(host, port, user, password, database):
    """Create database"""
    try:
        conn = await asyncpg.connect(
            user=user,
            password=password,
            database='postgres',
            host=host,
            port=port
        )
        await conn.execute(f'CREATE DATABASE {database}')
        print(f"{GREEN}✅ Database '{database}' created successfully!{RESET}")
        await conn.close()
        return True
    except Exception as e:
        print(f"{RED}❌ Error creating database: {str(e)}{RESET}")
        return False


async def get_existing_tables(host, port, user, password, database):
    """Get list of existing tables"""
    try:
        conn = await asyncpg.connect(
            user=user,
            password=password,
            database=database,
            host=host,
            port=port
        )
        tables = await conn.fetch(
            "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
        )
        await conn.close()
        return [table['tablename'] for table in tables]
    except Exception as e:
        print(f"{RED}Error getting tables: {str(e)}{RESET}")
        return []


async def main():
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(f"{BLUE}  BIDUA Hosting Platform - Database Setup{RESET}")
    print(f"{BLUE}{'='*70}{RESET}\n")

    # Load from .env file
    from dotenv import load_dotenv
    load_dotenv()

    # Get database credentials
    db_url = os.getenv("DATABASE_URL", "")
    
    print(f"{YELLOW}Current DATABASE_URL from .env:{RESET}")
    print(f"  {db_url}\n")

    # Parse connection details
    # Format: postgresql+asyncpg://user:password@host:port/database
    import re
    match = re.match(r'postgresql\+asyncpg://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
    
    if not match:
        print(f"{RED}❌ Invalid DATABASE_URL format in .env file{RESET}")
        print("Expected format: postgresql+asyncpg://user:password@host:port/database")
        return

    user, password, host, port, database = match.groups()
    # Decode URL-encoded password
    from urllib.parse import unquote
    password = unquote(password)
    port = int(port)

    print(f"{YELLOW}Connection Details:{RESET}")
    print(f"  Host:     {host}")
    print(f"  Port:     {port}")
    print(f"  User:     {user}")
    print(f"  Database: {database}")
    print(f"  Password: {'*' * len(password)}\n")

    # Step 1: Test connection to PostgreSQL server
    print(f"{BLUE}Step 1: Testing PostgreSQL Server Connection...{RESET}")
    if not await test_postgres_connection(host, port, user, password):
        print(f"\n{RED}Cannot connect to PostgreSQL server.{RESET}")
        print(f"{YELLOW}Please check:{RESET}")
        print("  1. PostgreSQL is installed and running")
        print("  2. Host and port are correct")
        print("  3. Username and password are correct")
        print(f"\n{YELLOW}To update credentials, edit the .env file{RESET}")
        return

    print()

    # Step 2: Check if database exists
    print(f"{BLUE}Step 2: Checking if database exists...{RESET}")
    db_exists = await check_database_exists(host, port, user, password, database)
    
    if not db_exists:
        print(f"{YELLOW}⚠️  Database '{database}' does not exist{RESET}")
        create = input(f"Do you want to create it? (yes/no): ").strip().lower()
        if create == 'yes':
            if await create_database(host, port, user, password, database):
                print()
            else:
                return
        else:
            print(f"{RED}Cannot proceed without database. Exiting.{RESET}")
            return
    else:
        print(f"{GREEN}✅ Database '{database}' exists{RESET}\n")

    # Step 3: Check existing tables
    print(f"{BLUE}Step 3: Checking existing tables...{RESET}")
    tables = await get_existing_tables(host, port, user, password, database)
    
    if tables:
        print(f"{YELLOW}Found {len(tables)} existing tables:{RESET}")
        for table in tables:
            print(f"  - {table}")
        print()
        proceed = input(f"{YELLOW}Do you want to proceed with migration? This may modify existing tables. (yes/no): {RESET}").strip().lower()
        if proceed != 'yes':
            print(f"{YELLOW}Migration cancelled by user.{RESET}")
            return
    else:
        print(f"{GREEN}✅ No existing tables found. Ready for fresh migration.{RESET}\n")

    # Step 4: Run Alembic migration
    print(f"{BLUE}Step 4: Running Alembic migration...{RESET}")
    print(f"{YELLOW}This will create all necessary tables for BIDUA Hosting Platform{RESET}\n")
    
    print("Tables to be created:")
    expected_tables = [
        "users_profiles", "hosting_plans", "servers", "orders", "invoices",
        "payment_methods", "billing_settings", "referral_payouts", "referral_earnings",
        "support_tickets", "user_settings", "payment_transactions", "referral_commission_rates"
    ]
    for table in expected_tables:
        print(f"  ✓ {table}")
    
    print()
    proceed = input(f"Run migration now? (yes/no): ").strip().lower()
    if proceed == 'yes':
        print(f"\n{BLUE}Running Alembic commands...{RESET}\n")
        print(f"{YELLOW}Use these commands in your terminal:{RESET}")
        print(f"  cd \"{Path.cwd()}\"")
        print(f"  source venv/bin/activate")
        print(f"  alembic revision --autogenerate -m \"Initial migration\"")
        print(f"  alembic upgrade head")
        print()
    else:
        print(f"{YELLOW}Migration skipped. You can run it later using Alembic commands.{RESET}")

    print(f"\n{GREEN}{'='*70}{RESET}")
    print(f"{GREEN}  Setup Complete!{RESET}")
    print(f"{GREEN}{'='*70}{RESET}\n")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Setup cancelled by user{RESET}")
    except Exception as e:
        print(f"\n{RED}Unexpected error: {str(e)}{RESET}")
        import traceback
        traceback.print_exc()
