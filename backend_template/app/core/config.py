from pydantic_settings import BaseSettings
from typing import List, Optional
from pydantic import validator
import os

class Settings(BaseSettings):
    # 🔹 Basic App Info
    PROJECT_NAME: str = "BIDUA Hosting Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # 🔹 Database
    DATABASE_URL: str

    # 🔹 Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 🔹 CORS - Allow all origins for Replit environment
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # 🔹 Hosts - Allow all hosts for Replit proxy
    ALLOWED_HOSTS: List[str] = ["*"]

    @validator("ALLOWED_HOSTS", pre=True)
    def assemble_allowed_hosts(cls, v):
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v

    # 🔹 Admin
    DEFAULT_ADMIN_EMAIL: str = "admin@bidua.com"

    # 🔹 Razorpay settings
    APP_NAME: str = "Razorpay Payment Gateway"
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra env variables

# ✅ Dependency injection ke liye function
def get_settings() -> Settings:
    return Settings()

# ✅ Create a global settings instance
settings = get_settings()
