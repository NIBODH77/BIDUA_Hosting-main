"""
Test script to verify countries API endpoints work correctly
"""
import asyncio
import json
from app.services.country_service import CountryService
from app.models.countries import Country
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from app.core.database import DATABASE_URL


async def test_country_service():
    """Test the country service methods"""
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.begin() as conn:
        session = AsyncSession(bind=conn, expire_on_commit=False)
        service = CountryService()
        
        print("🧪 Testing Country Service...")
        
        # Test 1: Get all countries (simple format)
        print("\n1️⃣ Testing get_countries_simple():")
        countries_simple = await service.get_countries_simple(session)
        print(f"   Retrieved {len(countries_simple)} countries")
        print("   Sample countries:")
        for country in countries_simple[:5]:
            print(f"     • {country['name']} ({country['code']})")
        
        # Test 2: Get countries with pagination
        print("\n2️⃣ Testing get_countries() with pagination:")
        countries_paginated = await service.get_countries(session, skip=0, limit=10)
        print(f"   Retrieved {len(countries_paginated)} countries (page 1, limit 10)")
        
        # Test 3: Search countries
        print("\n3️⃣ Testing search functionality:")
        search_results = await service.get_countries(session, search="United", skip=0, limit=5)
        print(f"   Search 'United' found {len(search_results)} countries:")
        for country in search_results:
            print(f"     • {country.name} ({country.code})")
        
        # Test 4: Get country by code
        print("\n4️⃣ Testing get_country_by_code():")
        us_country = await service.get_country_by_code(session, "US")
        if us_country:
            print(f"   Found: {us_country.name} - {us_country.currency_name} ({us_country.currency_code})")
        
        # Test 5: Get total count
        print("\n5️⃣ Testing get_countries_count():")
        total_count = await service.get_countries_count(session)
        print(f"   Total countries in database: {total_count}")
        
        print("\n✅ All tests completed successfully!")
        
        await session.close()
    
    await engine.dispose()


async def simulate_api_response():
    """Simulate what the API endpoints would return"""
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.begin() as conn:
        session = AsyncSession(bind=conn, expire_on_commit=False)
        service = CountryService()
        
        print("\n🌐 Simulating API Responses:")
        
        # Simulate GET /api/v1/countries/simple
        print("\n📡 GET /api/v1/countries/simple")
        countries = await service.get_countries_simple(session)
        response = {
            "status": "success",
            "data": countries[:5],  # Show first 5
            "total": len(countries)
        }
        print("Response:", json.dumps(response, indent=2))
        
        # Simulate GET /api/v1/countries?search=United&limit=3
        print("\n📡 GET /api/v1/countries?search=United&limit=3")
        search_results = await service.get_countries(session, search="United", limit=3)
        total_count = await service.get_countries_count(session, search="United")
        response = {
            "status": "success",
            "data": [
                {
                    "id": country.id,
                    "name": country.name,
                    "code": country.code,
                    "phone_code": country.phone_code,
                    "currency_code": country.currency_code,
                    "flag_emoji": country.flag_emoji
                } for country in search_results
            ],
            "pagination": {
                "total": total_count,
                "limit": 3,
                "skip": 0,
                "has_more": total_count > 3
            }
        }
        print("Response:", json.dumps(response, indent=2))
        
        await session.close()
    
    await engine.dispose()


async def main():
    """Run all tests"""
    await test_country_service()
    await simulate_api_response()


if __name__ == "__main__":
    asyncio.run(main())