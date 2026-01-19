from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Literal


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    password: str
    role: Literal['user', 'admin'] = 'user'


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str


# Movie Schemas
class MovieBase(BaseModel):
    title: str
    genre: str
    duration: int
    rating: Optional[float] = None
    image_url: Optional[str] = None


class MovieCreate(MovieBase):
    pass


class MovieResponse(MovieBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Booking Schemas
class BookingBase(BaseModel):
    Movies_id: int
    customer_name: str
    tickets_booked: int
    Status: Optional[bool] = True


class BookingCreate(BaseModel):
    Movies_id: int
    tickets_booked: int


class BookingResponse(BookingBase):
    id: int
    user_id: int
    created_at: datetime
    movie_name: str = None

    class Config:
        from_attributes = True