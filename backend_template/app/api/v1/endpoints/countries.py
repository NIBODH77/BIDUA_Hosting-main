from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.country_service import CountryService
from app.schemas.countries import Country, CountrySimple, CountryCreate, CountryUpdate
from app.schemas.users import User

router = APIRouter()

# ---------------------- PUBLIC ENDPOINTS ----------------------

@router.get("/", response_model=List[CountrySimple])
async def get_countries(
    active_only: bool = Query(True, description="Only return active countries"),
    search: Optional[str] = Query(None, description="Search countries by name or code"),
    limit: int = Query(250, le=500, description="Maximum number of countries to return"),
    db: AsyncSession = Depends(get_db),
    country_service: CountryService = Depends()
):
    """
    Get list of countries for dropdowns and selection
    This is a public endpoint that doesn't require authentication
    """
    if search:
        countries = await country_service.search_countries(
            db, search_term=search, active_only=active_only, limit=limit
        )
    else:
        countries = await country_service.get_all_countries(
            db, active_only=active_only, order_by_name=True
        )
        
        # Limit results if needed
        if len(countries) > limit:
            countries = countries[:limit]
    
    return countries


@router.get("/simple", response_model=List[CountrySimple])
async def get_countries_simple(
    db: AsyncSession = Depends(get_db),
    country_service: CountryService = Depends()
):
    """
    Get simplified list of countries (id, name, code, flag) for dropdowns
    Public endpoint optimized for frontend usage
    """
    countries = await country_service.get_all_countries(db, active_only=True, order_by_name=True)
    return countries


@router.get("/{country_id}", response_model=Country)
async def get_country(
    country_id: int,
    db: AsyncSession = Depends(get_db),
    country_service: CountryService = Depends()
):
    """Get a specific country by ID"""
    country = await country_service.get_country_by_id(db, country_id)
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country


@router.get("/code/{country_code}", response_model=Country)
async def get_country_by_code(
    country_code: str,
    db: AsyncSession = Depends(get_db),
    country_service: CountryService = Depends()
):
    """Get a country by ISO code (alpha-2 or alpha-3)"""
    country = await country_service.get_country_by_code(db, country_code)
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country


# ---------------------- ADMIN ENDPOINTS ----------------------

@router.post("/", response_model=Country)
async def create_country(
    country_data: CountryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    country_service: CountryService = Depends()
):
    """Create a new country (Admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check if country already exists
    existing = await country_service.get_country_by_code(db, country_data.code)
    if existing:
        raise HTTPException(status_code=400, detail="Country with this code already exists")
    
    existing_name = await country_service.get_country_by_name(db, country_data.name)
    if existing_name:
        raise HTTPException(status_code=400, detail="Country with this name already exists")
    
    return await country_service.create_country(db, country_data)


@router.put("/{country_id}", response_model=Country)
async def update_country(
    country_id: int,
    country_data: CountryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    country_service: CountryService = Depends()
):
    """Update a country (Admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    country = await country_service.update_country(db, country_id, country_data)
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    return country


@router.delete("/{country_id}")
async def delete_country(
    country_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    country_service: CountryService = Depends()
):
    """Soft delete a country (Admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    success = await country_service.delete_country(db, country_id)
    if not success:
        raise HTTPException(status_code=404, detail="Country not found")
    
    return {"message": "Country deleted successfully"}


@router.get("/admin/stats")
async def get_countries_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    country_service: CountryService = Depends()
):
    """Get countries statistics (Admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_countries = await country_service.get_countries_count(db, active_only=False)
    active_countries = await country_service.get_countries_count(db, active_only=True)
    inactive_countries = total_countries - active_countries
    
    return {
        "total_countries": total_countries,
        "active_countries": active_countries,
        "inactive_countries": inactive_countries
    }