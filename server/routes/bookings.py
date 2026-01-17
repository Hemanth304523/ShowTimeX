from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from starlette.requests import Request
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas
from routes.auth import get_current_user

router = APIRouter(prefix="/user/bookings", tags=["bookings"])
security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Depends(get_db)

def user_required(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header required")
    try:
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        current_user = get_current_user(token)
        return current_user
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(security)])
def create_booking(booking: schemas.BookingCreate, db: Session = db_dependency, current_user: dict = Depends(user_required)):
    # Verify movie exists
    movie = db.query(models.Movies).filter(models.Movies.id == booking.Movies_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db_booking = models.Bookings(
        Movies_id=booking.Movies_id,
        user_id=current_user["user_id"],
        customer_name=f"{current_user.get('username', 'User')}",
        tickets_booked=booking.tickets_booked,
        Status=True
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/", response_model=List[schemas.BookingResponse], dependencies=[Depends(security)])
def read_bookings(skip: int = 0, limit: int = 10, db: Session = db_dependency, current_user: dict = Depends(user_required)):
    # Users can only see their own bookings
    bookings = db.query(models.Bookings).filter(models.Bookings.user_id == current_user["user_id"]).offset(skip).limit(limit).all()
    return bookings

@router.get("/{booking_id}", response_model=schemas.BookingResponse, dependencies=[Depends(security)])
def read_booking(booking_id: int, db: Session = db_dependency, current_user: dict = Depends(user_required)):
    booking = db.query(models.Bookings).filter(models.Bookings.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Can only view your own bookings")
    return booking

@router.put("/{booking_id}", response_model=schemas.BookingResponse, dependencies=[Depends(security)])
def update_booking(booking_id: int, booking: schemas.BookingCreate, db: Session = db_dependency, current_user: dict = Depends(user_required)):
    db_booking = db.query(models.Bookings).filter(models.Bookings.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    if db_booking.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Can only update your own bookings")
    
    db_booking.Movies_id = booking.Movies_id
    db_booking.tickets_booked = booking.tickets_booked
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(security)])
def delete_booking(booking_id: int, db: Session = db_dependency, current_user: dict = Depends(user_required)):
    db_booking = db.query(models.Bookings).filter(models.Bookings.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    if db_booking.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Can only delete your own bookings")
    db_booking.Status = False  # Mark as cancelled
    db.commit()
    return None