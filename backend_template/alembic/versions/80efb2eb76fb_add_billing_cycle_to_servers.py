"""add_billing_cycle_to_servers

Revision ID: 80efb2eb76fb
Revises: 31a4000cff9a
Create Date: 2025-11-15 23:05:06.138658

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '80efb2eb76fb'
down_revision: Union[str, None] = '31a4000cff9a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add billing_cycle column to servers table
    op.add_column('servers', sa.Column('billing_cycle', sa.String(50), server_default='monthly', nullable=True))
    
    # Update existing records to have 'monthly' as default
    op.execute("UPDATE servers SET billing_cycle = 'monthly' WHERE billing_cycle IS NULL")


def downgrade() -> None:
    # Remove billing_cycle column
    op.drop_column('servers', 'billing_cycle')
