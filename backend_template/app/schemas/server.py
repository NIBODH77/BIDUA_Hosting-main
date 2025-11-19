from pydantic import BaseModel, validator, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from decimal import Decimal

class ServerBase(BaseModel):
    server_name: str
    hostname: str
    server_type: str
    operating_system: str
    vcpu: int
    ram_gb: int
    storage_gb: int
    bandwidth_gb: int

class ServerCreate(ServerBase):
    plan_id: int
    monthly_cost: Decimal
    billing_cycle: Optional[str] = "monthly"
    addons: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    services: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

    @validator('vcpu')
    def validate_vcpu(cls, v):
        if v < 1:
            raise ValueError('vCPU must be at least 1')
        return v

    @validator('ram_gb')
    def validate_ram(cls, v):
        if v < 1:
            raise ValueError('RAM must be at least 1GB')
        return v

class ServerUpdate(BaseModel):
    server_name: Optional[str] = None
    server_status: Optional[str] = None
    notes: Optional[str] = None

class Server(ServerBase):
    id: int
    user_id: int
    plan_id: int
    plan_name: str
    ip_address: Optional[str] = None
    server_status: str = "provisioning"
    monthly_cost: Decimal
    billing_cycle: str = "monthly"
    created_date: datetime
    expiry_date: datetime
    specs: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ServerAction(BaseModel):
    action: str  # start, stop, restart, terminate

    @validator('action')
    def validate_action(cls, v):
        valid_actions = ['start', 'stop', 'restart', 'terminate']
        if v not in valid_actions:
            raise ValueError(f'Action must be one of: {", ".join(valid_actions)}')
        return v

class ServerStats(BaseModel):
    total_servers: int
    active_servers: int
    stopped_servers: int
    provisioning_servers: int
    total_bandwidth_used: Decimal
    average_monthly_cost: Decimal