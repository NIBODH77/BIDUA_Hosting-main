# from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.core.database import Base

# class Server(Base):
#     __tablename__ = "servers"
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
#     server_name = Column(String(255), nullable=False)
#     hostname = Column(String(255), nullable=False)
#     ip_address = Column(String(45), nullable=True)
#     server_status = Column(String(50), default='provisioning')
#     server_type = Column(String(50), nullable=False)
    
#     # Server specifications
#     vcpu = Column(Integer, nullable=False)
#     ram_gb = Column(Integer, nullable=False)
#     storage_gb = Column(Integer, nullable=False)
#     bandwidth_gb = Column(Integer, nullable=False)
#     operating_system = Column(String(255), nullable=False)
    
#     # Plan information
#     plan_id = Column(Integer, ForeignKey('hosting_plans.id'), nullable=False)
#     plan_name = Column(String(255), nullable=False)
    
#     # Billing information
#     monthly_cost = Column(Numeric(10, 2), nullable=False)
#     created_date = Column(DateTime(timezone=True), server_default=func.now())
#     expiry_date = Column(DateTime(timezone=True), nullable=False)
    
#     # Additional details
#     specs = Column(JSON, nullable=True)
#     notes = Column(Text, nullable=True)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     user = relationship("UserProfile", back_populates="servers")
#     plan = relationship("HostingPlan", back_populates="servers")




from sqlalchemy import Column, String, Integer, DateTime, Boolean, Numeric, ForeignKey, Text, JSON, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Server(Base):
    __tablename__ = "servers"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id'), nullable=False)
    
    # 🔹 Now properly linked to HostingPlan
    plan_id = Column(Integer, ForeignKey('hosting_plans.id'), nullable=False)
    
    server_name = Column(String(255), nullable=False)
    hostname = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=True)
    server_status = Column(String(50), default='provisioning')  # provisioning, active, suspended, terminated
    server_type = Column(String(50), nullable=False)  # vps, dedicated, cloud, etc.
    
    # Server specifications (can be overridden from plan)
    vcpu = Column(Integer, nullable=False)
    ram_gb = Column(Integer, nullable=False)
    storage_gb = Column(Integer, nullable=False)
    bandwidth_gb = Column(Integer, nullable=False)
    operating_system = Column(String(255), nullable=False)
    
    # Keep plan_name for reference (optional)
    plan_name = Column(String(255), nullable=True)
    
    # Billing information
    monthly_cost = Column(Numeric(10, 2), nullable=False)
    billing_cycle = Column(String(50), default='monthly')  # monthly, quarterly, semiannually, annually, etc.
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    expiry_date = Column(DateTime(timezone=True), nullable=False)
    
    # Additional details
    specs = Column(JSON, nullable=True)  # Can store addon details, configurations, etc.
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship(
        "UserProfile", 
        back_populates="servers"
    )
    
    plan = relationship(
        "HostingPlan", 
        back_populates="servers",
        foreign_keys=[plan_id]
    )

    # 🔹 Indexes for better performance
    __table_args__ = (
        Index('idx_server_user_status', 'user_id', 'server_status'),
        Index('idx_server_plan', 'plan_id'),
        Index('idx_server_status', 'server_status'),
        Index('idx_server_expiry', 'expiry_date'),
        Index('idx_server_created', 'created_at'),
    )

    def __repr__(self):
        return f"<Server(id={self.id}, name='{self.server_name}', status='{self.server_status}')>"