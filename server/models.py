from enum import Enum
from datetime import datetime
from database import Base
from sqlalchemy import Column, Float, Integer, String, Text, Enum as SqlEnum, DateTime, ForeignKey, Boolean

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default='user', nullable=False)  # 'user' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)

class Movies(Base):
    __tablename__ = 'movies'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)  # duration in minutes
    rating = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)  # URL for movie image
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # admin who created movie
    created_at = Column(DateTime, default=datetime.utcnow)

class Bookings(Base):
    __tablename__ = "bookings"

    class TicketType(str, Enum):
        REGULAR = "Regular"
        PREMIUM = "Premium"
        IMAX = "IMAX"
        FOUR_DX = "4DX"

    TICKET_PRICES = {
        TicketType.REGULAR: 250,
        TicketType.PREMIUM: 350,
        TicketType.IMAX: 450,
        TicketType.FOUR_DX: 600,
    }

    TIME_SLOTS = [
        "09:00-12:00",
        "12:00-15:00",
        "15:00-18:00",
        "18:00-21:00",
        "21:00-24:00",
    ]

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, nullable=False, index=True)
    Movies_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    customer_name = Column(String, nullable=False)
    tickets_booked = Column(Integer, nullable=False)
    ticket_slot = Column(String, nullable=False)
    ticket_type = Column(String, nullable=False)
    ticket_price = Column(Integer, nullable=False)
    Status = Column(Boolean, default=True)
    seat_number = Column(String, nullable=False)
    qr_code = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
