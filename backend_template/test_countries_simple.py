"""
Simple test script to verify countries functionality
"""
import asyncio
from app.services.country_service import CountryService
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from app.core.database import DATABASE_URL


async def test_countries():
    """Test the country service methods"""
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.begin() as conn:
        session = AsyncSession(bind=conn, expire_on_commit=False)
        service = CountryService()
        
        print("🧪 Testing Countries Database...")
        
        # Test 1: Get all countries
        print("\n1️⃣ Testing get_all_countries():")
        all_countries = await service.get_all_countries(session)
        print(f"   Retrieved {len(all_countries)} countries")
        print("   Sample countries:")
        for country in all_countries[:5]:
            print(f"     • {country.flag_emoji} {country.name} ({country.code}) - {country.currency_name}")
        
        # Test 2: Get country by code
        print("\n2️⃣ Testing get_country_by_code():")
        us_country = await service.get_country_by_code(session, "US")
        if us_country:
            print(f"   Found: {us_country.flag_emoji} {us_country.name}")
            print(f"   Phone: {us_country.phone_code}, Currency: {us_country.currency_name}")
        
        # Test 3: Search countries
        print("\n3️⃣ Testing search_countries():")
        search_results = await service.search_countries(session, "United")
        print(f"   Search 'United' found {len(search_results)} countries:")
        for country in search_results:
            print(f"     • {country.flag_emoji} {country.name} ({country.code})")
        
        # Test 4: Get total count
        print("\n4️⃣ Testing get_countries_count():")
        total_count = await service.get_countries_count(session)
        print(f"   Total active countries: {total_count}")
        
        # Test 5: Countries for dropdown (simple format)
        print("\n5️⃣ Countries for frontend dropdown:")
        dropdown_countries = await service.get_all_countries(session)
        dropdown_data = [
            {
                "value": country.code,
                "label": f"{country.flag_emoji} {country.name}",
                "phone_code": country.phone_code,
                "currency": country.currency_code
            } 
            for country in dropdown_countries[:10]  # First 10 for display
        ]
        
        print("   Sample dropdown data:")
        for item in dropdown_data[:5]:
            print(f"     • {item}")
        
        print("\n✅ All tests completed successfully!")
        print(f"\n📊 Summary: {total_count} countries loaded and ready for API use")
        
        await session.close()
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(test_countries())