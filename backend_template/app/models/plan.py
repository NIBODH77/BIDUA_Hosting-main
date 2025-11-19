# from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.core.database import Base

# class HostingPlan(Base):
#     __tablename__ = "hosting_plans"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String(255), nullable=False)
#     description = Column(Text, nullable=True)
#     plan_type = Column(String(50), nullable=False)
    
#     # Specifications
#     cpu_cores = Column(Integer, nullable=False)
#     ram_gb = Column(Integer, nullable=False)
#     storage_gb = Column(Integer, nullable=False)
#     bandwidth_gb = Column(Integer, nullable=False)
    
#     # Pricing
#     base_price = Column(Numeric(10, 2), nullable=False)
#     monthly_price = Column(Numeric(10, 2), nullable=False)
#     quarterly_price = Column(Numeric(10, 2), nullable=False)
#     annual_price = Column(Numeric(10, 2), nullable=False)
#     biennial_price = Column(Numeric(10, 2), nullable=False)
#     triennial_price = Column(Numeric(10, 2), nullable=False)
    
#     # Status
#     is_active = Column(Boolean, default=True)
#     is_featured = Column(Boolean, default=False)
    
#     # Additional features
#     features = Column(JSON, nullable=True)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     servers = relationship("Server", back_populates="plan")
#     orders = relationship("Order", back_populates="plan")








from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class HostingPlan(Base):
    __tablename__ = "hosting_plans"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    plan_type = Column(String(50), nullable=False)  # vps, dedicated, cloud, shared
    
    # Specifications
    cpu_cores = Column(Integer, nullable=False)
    ram_gb = Column(Integer, nullable=False)
    storage_gb = Column(Integer, nullable=False)
    bandwidth_gb = Column(Integer, nullable=False)
    
    # Pricing
    base_price = Column(Numeric(10, 2), nullable=False)
    monthly_price = Column(Numeric(10, 2), nullable=False)
    quarterly_price = Column(Numeric(10, 2), nullable=False)
    annual_price = Column(Numeric(10, 2), nullable=False)
    biennial_price = Column(Numeric(10, 2), nullable=False)
    triennial_price = Column(Numeric(10, 2), nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Additional features
    features = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    servers = relationship(
        "Server", 
        back_populates="plan",
        cascade="all, delete-orphan"
    )
    
    orders = relationship(
        "Order", 
        back_populates="plan",
        cascade="all, delete-orphan"
    )

    # 🔹 Indexes for better performance
    __table_args__ = (
        Index('idx_plan_type_status', 'plan_type', 'is_active'),
        Index('idx_plan_price', 'monthly_price'),
        Index('idx_plan_active_featured', 'is_active', 'is_featured'),
        Index('idx_plan_created', 'created_at'),
    )

    def __repr__(self):
        return f"<HostingPlan(id={self.id}, name='{self.name}', type='{self.plan_type}')>"