"""add_countries_table_properly

Revision ID: countries_v1
Revises: 34e09dd9aec1
Create Date: 2025-11-15 01:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'countries_v1'
down_revision: Union[str, None] = '34e09dd9aec1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create countries table
    op.create_table('countries',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('code', sa.String(length=2), nullable=False),
        sa.Column('alpha3_code', sa.String(length=3), nullable=True),
        sa.Column('numeric_code', sa.String(length=3), nullable=True),
        sa.Column('phone_code', sa.String(length=10), nullable=True),
        sa.Column('currency_code', sa.String(length=3), nullable=True),
        sa.Column('currency_name', sa.String(length=50), nullable=True),
        sa.Column('flag_emoji', sa.String(length=10), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default=sa.text('true')),
        sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code'),
        sa.UniqueConstraint('alpha3_code'),
    )
    
    # Create indexes
    op.create_index('idx_countries_name', 'countries', ['name'])
    op.create_index('idx_countries_code', 'countries', ['code'])
    op.create_index('idx_countries_active', 'countries', ['is_active'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_countries_active', 'countries')
    op.drop_index('idx_countries_code', 'countries')
    op.drop_index('idx_countries_name', 'countries')
    
    # Drop table
    op.drop_table('countries')