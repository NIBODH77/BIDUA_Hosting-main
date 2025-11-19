"""add ticket_messages table for threading

Revision ID: add_ticket_messages
Revises: 
Create Date: 2025-01-14 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_ticket_messages'
down_revision = '1343fa765ac1'  # Update this to your last migration revision
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create ticket_messages table
    op.create_table(
        'ticket_messages',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('ticket_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_internal_note', sa.Boolean(), default=False, nullable=False),
        sa.Column('is_staff_reply', sa.Boolean(), default=False, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['ticket_id'], ['support_tickets.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users_profiles.id'], ondelete='CASCADE'),
    )
    
    # Create indexes for better performance
    op.create_index('idx_ticket_messages_ticket_id', 'ticket_messages', ['ticket_id'])
    op.create_index('idx_ticket_messages_user_id', 'ticket_messages', ['user_id'])
    op.create_index('idx_ticket_messages_created_at', 'ticket_messages', ['created_at'])
    
    # Update support_tickets table to allow 'support' role assignment
    # (Already supports this through assigned_to field)


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_ticket_messages_created_at', table_name='ticket_messages')
    op.drop_index('idx_ticket_messages_user_id', table_name='ticket_messages')
    op.drop_index('idx_ticket_messages_ticket_id', table_name='ticket_messages')
    
    # Drop table
    op.drop_table('ticket_messages')
