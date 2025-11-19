#!/usr/bin/env python3
"""
Quick PostgreSQL Connection Test
Helps you find the right credentials for your PostgreSQL database
"""
import asyncio
import asyncpg
import sys
from getpass import getpass

async def test_connection(host, port, user, password, database='postgres'):
    """Test a PostgreSQL connection"""
    try:
        conn = await asyncpg.connect(
            user=user,
            password=password,
            database=database,
            host=host,
            port=port,
            timeout=5
        )
        version = await conn.fetchval('SELECT version()')
        print(f"\n✅ SUCCESS! Connection works!")
        print(f"   PostgreSQL version: {version[:60]}...")
        
        # Check if target database exists
        if database != 'ramaera_hosting':
            dbs = await conn.fetch("SELECT datname FROM pg_database")
            db_names = [db['datname'] for db in dbs]
            if 'ramaera_hosting' in db_names:
                print(f"   ✅ Database 'ramaera_hosting' exists")
            else:
                print(f"   ⚠️  Database 'ramaera_hosting' NOT found")
                print(f"   Available databases: {', '.join(db_names)}")
        
        await conn.close()
        return True
    except asyncpg.InvalidPasswordError:
        print(f"\n❌ FAILED: Invalid password for user '{user}'")
        return False
    except asyncpg.InvalidCatalogNameError:
        print(f"\n❌ FAILED: Database '{database}' does not exist")
        print(f"   Try connecting to 'postgres' database first")
        return False
    except Exception as e:
        print(f"\n❌ FAILED: {str(e)}")
        return False


async def main():
    print("=" * 70)
    print("  PostgreSQL Connection Tester")
    print("=" * 70)
    print("\nThis will help you find the correct credentials.\n")
    
    # Get credentials
    print("Enter your PostgreSQL credentials:")
    host = input("  Host [localhost]: ").strip() or "localhost"
    port = input("  Port [5432]: ").strip() or "5432"
    user = input("  Username [postgres]: ").strip() or "postgres"
    password = getpass("  Password: ")
    
    try:
        port = int(port)
    except:
        print("Invalid port number")
        return
    
    print(f"\nTesting connection...")
    print(f"  Connecting to: {user}@{host}:{port}")
    
    # Test with default postgres database first
    success = await test_connection(host, port, user, password, 'postgres')
    
    if success:
        print("\n" + "=" * 70)
        print("✅ Your credentials are correct!")
        print("=" * 70)
        
        # Generate the DATABASE_URL
        from urllib.parse import quote_plus
        encoded_password = quote_plus(password)
        
        print(f"\nUpdate your .env file with:")
        print(f'DATABASE_URL="postgresql+asyncpg://{user}:{encoded_password}@{host}:{port}/ramaera_hosting"')
        print()
        
        # Ask if they want to create the database
        create_db = input("Do you want to create the 'ramaera_hosting' database now? (yes/no): ").strip().lower()
        if create_db == 'yes':
            try:
                conn = await asyncpg.connect(
                    user=user, password=password,
                    database='postgres', host=host, port=port
                )
                await conn.execute('CREATE DATABASE ramaera_hosting')
                print("✅ Database 'ramaera_hosting' created successfully!")
                await conn.close()
            except asyncpg.DuplicateDatabaseError:
                print("ℹ️  Database 'ramaera_hosting' already exists")
            except Exception as e:
                print(f"❌ Could not create database: {e}")
    else:
        print("\n" + "=" * 70)
        print("❌ Connection failed!")
        print("=" * 70)
        print("\nTroubleshooting:")
        print("  1. Make sure PostgreSQL is running")
        print("  2. Check if the username and password are correct")
        print("  3. Verify the host and port")
        print("\nCommon issues:")
        print("  • macOS (Homebrew): brew services start postgresql")
        print("  • Linux: sudo systemctl start postgresql")
        print("  • Default postgres user might not have a password")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nCancelled by user")
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
