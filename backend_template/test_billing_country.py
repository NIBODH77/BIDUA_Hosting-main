#!/usr/bin/env python3

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_db
from app.models.billing import BillingSettings
from app.models.users import UserProfile
from sqlalchemy import select

async def test_billing_country():
    """Test that country names can be stored and retrieved from billing settings"""
    
    # Get database session
    async for db in get_db():
        try:
            # Find a user to test with (or create one if needed)
            result = await db.execute(select(UserProfile).limit(1))
            user = result.scalar_one_or_none()
            
            if not user:
                print("❌ No users found in database. Please create a user first.")
                return
            
            print(f"✅ Found user: {user.email} (ID: {user.id})")
            
            # Check if billing settings already exist
            result = await db.execute(
                select(BillingSettings).where(BillingSettings.user_id == user.id)
            )
            billing_settings = result.scalar_one_or_none()
            
            # Test countries to save
            test_countries = [
                "United States",
                "India", 
                "United Kingdom",
                "Germany",
                "Japan",
                "Australia"
            ]
            
            for country in test_countries:
                if billing_settings:
                    # Update existing settings
                    billing_settings.country = country
                    billing_settings.city = f"Test City for {country}"
                    billing_settings.state = f"Test State for {country}"
                    billing_settings.street = f"123 Test Street, {country}"
                else:
                    # Create new settings
                    billing_settings = BillingSettings(
                        user_id=user.id,
                        country=country,
                        city=f"Test City for {country}",
                        state=f"Test State for {country}",
                        street=f"123 Test Street, {country}",
                        postal_code="12345",
                        company_name="Test Company"
                    )
                    db.add(billing_settings)
                
                await db.commit()
                await db.refresh(billing_settings)
                
                print(f"✅ Successfully saved country: {billing_settings.country}")
                print(f"   Address: {billing_settings.street}, {billing_settings.city}, {billing_settings.state}")
                print(f"   Company: {billing_settings.company_name}")
                print()
            
            print(f"🎉 All country names stored successfully!")
            
            # Test retrieval
            result = await db.execute(
                select(BillingSettings).where(BillingSettings.user_id == user.id)
            )
            final_settings = result.scalar_one_or_none()
            
            if final_settings:
                print(f"📋 Final stored data:")
                print(f"   User ID: {final_settings.user_id}")
                print(f"   Country: {final_settings.country}")
                print(f"   City: {final_settings.city}")
                print(f"   State: {final_settings.state}")
                print(f"   Street: {final_settings.street}")
                print(f"   Company: {final_settings.company_name}")
                print(f"   Postal Code: {final_settings.postal_code}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
        
        break

if __name__ == "__main__":
    asyncio.run(test_billing_country())