import os
import sys
from logging.config import fileConfig

from sqlalchemy import create_engine, pool
from sqlalchemy.engine import Connection
from alembic import context
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ✅ Ensure project root is in sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# ✅ Alembic Config object
config = context.config

# ✅ Configure logging
if config.config_file_name and os.path.exists(config.config_file_name):
    try:
        fileConfig(config.config_file_name)
        print("✅ Logging configured successfully")
    except Exception as e:
        print(f"❌ Error configuring logging: {e}")

# ✅ Import Base AFTER sys.path is updated
from app.models.base import Base

# ✅ Set target metadata
target_metadata = Base.metadata

# ✅ Get database URL from environment and convert for sync use
import re
raw_db_url = os.getenv("DATABASE_URL", "sqlite:///./ramaera_hosting.db")

# Convert async PostgreSQL URL to sync for Alembic
if raw_db_url.startswith("postgresql+asyncpg://"):
    # Use psycopg (v3) driver for modern PostgreSQL support
    sync_url = raw_db_url.replace("postgresql+asyncpg://", "postgresql+psycopg://")
elif raw_db_url.startswith("postgresql://"):
    sync_url = "postgresql+psycopg://" + raw_db_url.split("://")[1]
elif "sqlite+aiosqlite" in raw_db_url:
    sync_url = raw_db_url.replace("+aiosqlite", "")
elif "sqlite" in raw_db_url:
    sync_url = raw_db_url
else:
    sync_url = "sqlite:///./ramaera_hosting.db"

# Remove sslmode parameter for sync PostgreSQL driver
sync_url = re.sub(r'[?&]sslmode=[^&]*', '', sync_url)

# Escape % signs for ConfigParser (% -> %%)
escaped_url = sync_url.replace('%', '%%')

# Override the sqlalchemy.url in alembic.ini
config.set_main_option("sqlalchemy.url", escaped_url)
print(f"📊 Using database: {'PostgreSQL' if 'postgresql' in sync_url else 'SQLite'}")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = create_engine(sync_url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        do_run_migrations(connection)


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()