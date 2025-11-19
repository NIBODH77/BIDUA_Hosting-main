from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional

from app.models.countries import Country
from app.schemas.countries import CountryCreate, CountryUpdate


class CountryService:
    async def get_all_countries(
        self, 
        db: AsyncSession, 
        active_only: bool = True,
        order_by_name: bool = True
    ) -> List[Country]:
        """Get all countries, optionally filtered by active status"""
        query = select(Country)
        
        if active_only:
            query = query.where(Country.is_active.is_(True))
        
        if order_by_name:
            query = query.order_by(Country.name)
        else:
            query = query.order_by(Country.id)
        
        result = await db.execute(query)
        return result.scalars().all()

    async def get_country_by_id(self, db: AsyncSession, country_id: int) -> Optional[Country]:
        """Get a country by ID"""
        result = await db.execute(select(Country).where(Country.id == country_id))
        return result.scalar_one_or_none()

    async def get_country_by_code(self, db: AsyncSession, country_code: str) -> Optional[Country]:
        """Get a country by ISO code (alpha-2 or alpha-3)"""
        result = await db.execute(
            select(Country).where(
                (Country.code == country_code.upper()) | 
                (Country.alpha3_code == country_code.upper())
            )
        )
        return result.scalar_one_or_none()

    async def get_country_by_name(self, db: AsyncSession, country_name: str) -> Optional[Country]:
        """Get a country by name (case insensitive)"""
        result = await db.execute(
            select(Country).where(func.lower(Country.name) == country_name.lower())
        )
        return result.scalar_one_or_none()

    async def create_country(self, db: AsyncSession, country_data: CountryCreate) -> Country:
        """Create a new country"""
        country = Country(**country_data.dict())
        db.add(country)
        await db.commit()
        await db.refresh(country)
        return country

    async def update_country(
        self, 
        db: AsyncSession, 
        country_id: int, 
        country_data: CountryUpdate
    ) -> Optional[Country]:
        """Update an existing country"""
        country = await self.get_country_by_id(db, country_id)
        if not country:
            return None

        for field, value in country_data.dict(exclude_unset=True).items():
            setattr(country, field, value)

        await db.commit()
        await db.refresh(country)
        return country

    async def delete_country(self, db: AsyncSession, country_id: int) -> bool:
        """Soft delete a country (set is_active to False)"""
        country = await self.get_country_by_id(db, country_id)
        if not country:
            return False

        country.is_active = False
        await db.commit()
        return True

    async def get_countries_count(self, db: AsyncSession, active_only: bool = True) -> int:
        """Get total count of countries"""
        query = select(func.count(Country.id))
        
        if active_only:
            query = query.where(Country.is_active.is_(True))
        
        result = await db.execute(query)
        return result.scalar() or 0

    async def search_countries(
        self, 
        db: AsyncSession, 
        search_term: str,
        active_only: bool = True,
        limit: int = 20
    ) -> List[Country]:
        """Search countries by name or code"""
        query = select(Country).where(
            (func.lower(Country.name).like(f"%{search_term.lower()}%")) |
            (func.lower(Country.code).like(f"%{search_term.upper()}%")) |
            (func.lower(Country.alpha3_code).like(f"%{search_term.upper()}%"))
        )
        
        if active_only:
            query = query.where(Country.is_active.is_(True))
        
        query = query.order_by(Country.name).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()

    async def bulk_create_countries(
        self, 
        db: AsyncSession, 
        countries_data: List[CountryCreate]
    ) -> List[Country]:
        """Bulk create countries"""
        countries = [Country(**country_data.dict()) for country_data in countries_data]
        db.add_all(countries)
        await db.commit()
        
        # Refresh all countries to get their IDs
        for country in countries:
            await db.refresh(country)
        
        return countries