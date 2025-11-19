"""
Countries Service
Handles business logic for country operations
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.countries import Country
from app.schemas.countries import CountryResponse, CountrySimple


class CountriesService:
    """Service class for country-related operations"""
    
    @staticmethod
    async def get_all_countries_simple(db: Session) -> List[Dict[str, str]]:
        """Get all countries in simple format for dropdowns"""
        try:
            countries = db.query(Country).order_by(Country.name).all()
            return [
                {
                    "name": country.name,
                    "code": country.iso_alpha2,
                    "flag": country.flag_emoji
                }
                for country in countries
            ]
        except Exception as e:
            raise Exception(f"Error fetching countries: {str(e)}")
    
    @staticmethod
    async def get_country_by_code(db: Session, country_code: str) -> Optional[Country]:
        """Get country by ISO alpha-2 code"""
        try:
            return db.query(Country).filter(
                func.upper(Country.iso_alpha2) == country_code.upper()
            ).first()
        except Exception as e:
            raise Exception(f"Error fetching country by code: {str(e)}")
    
    @staticmethod
    async def get_countries_count(db: Session) -> int:
        """Get total count of countries"""
        try:
            return db.query(Country).count()
        except Exception as e:
            raise Exception(f"Error counting countries: {str(e)}")
    
    @staticmethod
    async def search_countries(
        db: Session, 
        search_term: str, 
        limit: int = 50
    ) -> List[Country]:
        """Search countries by name"""
        try:
            return db.query(Country).filter(
                Country.name.ilike(f"%{search_term}%")
            ).order_by(Country.name).limit(limit).all()
        except Exception as e:
            raise Exception(f"Error searching countries: {str(e)}")