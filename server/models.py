import enum
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
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # admin who created movie
    created_at = Column(DateTime, default=datetime.utcnow)

class Bookings(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Movies_id = Column(Integer, ForeignKey('movies.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # user who booked
    customer_name = Column(String, nullable=False)
    tickets_booked = Column(Integer, nullable=False)
    Status = Column(Boolean, default=True)  # True for confirmed, False for cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
   