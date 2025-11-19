from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_db
from app.services.country_service import CountryService
from app.schemas.countries import CountryResponse, CountrySimpleResponse
from app.models.countries import Country

router = APIRouter(prefix="/countries", tags=["countries"])
country_service = CountryService()


@router.get("/simple", response_model=List[CountrySimpleResponse])
async def get_countries_simple(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """
    Get countries in a simple format for dropdowns and selection lists.
    Returns a list with country code, name, phone code, and currency.
    """
    try:
        countries = await country_service.get_all_countries(
            db, 
            active_only=active_only,
            order_by_name=True
        )
        
        simple_countries = [
            CountrySimpleResponse(
                value=country.code,
                label=f"{country.flag_emoji} {country.name}" if country.flag_emoji else country.name,
                phone_code=country.phone_code,
                currency=country.currency_code
            ) for country in countries
        ]
        
        return simple_countries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch countries: {str(e)}")


@router.get("", response_model=List[CountryResponse])
async def get_countries(
    search: Optional[str] = Query(None, description="Search countries by name"),
    active_only: bool = Query(True, description="Return only active countries"),
    limit: int = Query(50, ge=1, le=200, description="Number of countries to return"),
    skip: int = Query(0, ge=0, description="Number of countries to skip"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get countries with search, filtering, and pagination support.
    """
    try:
        if search:
            countries = await country_service.search_countries(db, search)
            # Apply pagination to search results
            countries = countries[skip:skip + limit]
        else:
            countries = await country_service.get_all_countries(db, active_only=active_only)
            # Apply pagination
            countries = countries[skip:skip + limit]
        
        return [CountryResponse.from_orm(country) for country in countries]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch countries: {str(e)}")


@router.get("/code/{country_code}", response_model=CountryResponse)
async def get_country_by_code(
    country_code: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific country by its ISO code (alpha-2 or alpha-3).
    """
    try:
        country = await country_service.get_country_by_code(db, country_code)
        if not country:
            raise HTTPException(status_code=404, detail="Country not found")
        
        return CountryResponse.from_orm(country)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch country: {str(e)}")


@router.get("/name/{country_name}", response_model=CountryResponse)
async def get_country_by_name(
    country_name: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific country by its name (case insensitive).
    """
    try:
        country = await country_service.get_country_by_name(db, country_name)
        if not country:
            raise HTTPException(status_code=404, detail="Country not found")
        
        return CountryResponse.from_orm(country)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch country: {str(e)}")


@router.get("/count")
async def get_countries_count(
    active_only: bool = Query(True, description="Count only active countries"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get the total number of countries.
    """
    try:
        count = await country_service.get_countries_count(db, active_only=active_only)
        return {
            "total": count,
            "active_only": active_only
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to count countries: {str(e)}")