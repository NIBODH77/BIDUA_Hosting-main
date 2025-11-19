from sqlalchemy import Column, String, Integer, DateTime, Boolean, Index
from sqlalchemy.sql import func
from app.core.database import Base


class Country(Base):
    __tablename__ = "countries"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(3), nullable=False, unique=True, index=True)  # ISO 3166-1 alpha-2 code
    alpha3_code = Column(String(3), nullable=True, index=True)  # ISO 3166-1 alpha-3 code
    numeric_code = Column(String(3), nullable=True)  # ISO 3166-1 numeric code
    phone_code = Column(String(10), nullable=True)  # International dialing code
    currency_code = Column(String(3), nullable=True)  # ISO 4217 currency code
    currency_name = Column(String(50), nullable=True)
    flag_emoji = Column(String(10), nullable=True)  # Unicode flag emoji
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes for better performance
    __table_args__ = (
        Index('idx_country_name', 'name'),
        Index('idx_country_code', 'code'),
        Index('idx_country_active', 'is_active'),
        Index('idx_country_search', 'name', 'code', 'alpha3_code'),
    )

    def __repr__(self):
        return f"<Country(id={self.id}, name='{self.name}', code='{self.code}')>"