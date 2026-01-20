"""
Add seat_number and qr_code columns to bookings table
Revision ID: 20260120_add_seat_and_qr_to_bookings
Revises: d058d9fc9999
Create Date: 2026-01-20
"""

revision = '20260120_add_seat_and_qr_to_bookings'
down_revision = 'd058d9fc9999'

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('bookings', sa.Column('seat_number', sa.String(), nullable=False, server_default='A1'))
    op.add_column('bookings', sa.Column('qr_code', sa.String(), nullable=False, server_default=''))

def downgrade():
    op.drop_column('bookings', 'seat_number')
    op.drop_column('bookings', 'qr_code')
