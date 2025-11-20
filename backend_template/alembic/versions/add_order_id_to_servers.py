
"""add order_id to servers table

Revision ID: e9f8a7b6c5d4
Revises: 80efb2eb76fb
Create Date: 2025-01-XX

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e9f8a7b6c5d4'
down_revision = '80efb2eb76fb'
branch_labels = None
depends_on = None


def upgrade():
    # Add order_id column to servers table
    op.add_column('servers', sa.Column('order_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_servers_order_id',
        'servers', 'orders',
        ['order_id'], ['id']
    )
    op.create_index('idx_servers_order_id', 'servers', ['order_id'])


def downgrade():
    op.drop_index('idx_servers_order_id', table_name='servers')
    op.drop_constraint('fk_servers_order_id', 'servers', type_='foreignkey')
    op.drop_column('servers', 'order_id')
