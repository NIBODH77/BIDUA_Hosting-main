"""add_cpu_to_addon_category_enum

Revision ID: 1378acccf36f
Revises: e9f8a7b6c5d4
Create Date: 2025-11-20 09:10:07.987849

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1378acccf36f'
down_revision: Union[str, None] = 'e9f8a7b6c5d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE addoncategory ADD VALUE IF NOT EXISTS 'cpu'")


def downgrade() -> None:
    pass
