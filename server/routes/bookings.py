from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from starlette.requests import Request
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas
from routes.auth import get_current_user
import uuid
import random , string, qrcode, io, base64

router = APIRouter(prefix="/user/bookings", tags=["bookings"])


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
        token = auth_header.split(" ")[1]
        return get_current_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Random seat number generator

def generate_seat_number():
    letter = random.choice(string.ascii_uppercase[:8])  # Rows A-H
    number = random.randint(1, 30)  # Seats 1-30
    return f"{letter}{number}"


# QR code generator

def generate_qr_code(data: str) -> str:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill='red', back_color='white')
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    qr_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    return f"data:image/png;base64,{qr_b64}"


# ---------------- CREATE BOOKING ----------------
@router.post("/", response_model=schemas.BookingResponse, status_code=201)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = db_dependency,
    current_user: dict = Depends(user_required),
):
    movie = db.query(models.Movies).filter(
        models.Movies.id == booking.Movies_id
    ).first()

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    if booking.ticket_slot not in models.Bookings.TIME_SLOTS:
        raise HTTPException(status_code=400, detail="Invalid time slot")

    ticket_type_enum = models.Bookings.TicketType(booking.ticket_type)

    ticket_price = (
        models.Bookings.TICKET_PRICES[ticket_type_enum]
        * booking.tickets_booked
    )

    # To get seat details in QR 
    seat_number = generate_seat_number()
    ticket_data = f"Movie: {movie.title}, Seat: {seat_number}, Slot: {booking.ticket_slot}, Name: {current_user['username']}"
    qr_code = generate_qr_code(ticket_data)

    db_booking = models.Bookings(
        uuid=str(uuid.uuid4()),
        Movies_id=booking.Movies_id,
        user_id=current_user["user_id"],
        customer_name=current_user["username"],
        tickets_booked=booking.tickets_booked,
        ticket_slot=booking.ticket_slot,
        ticket_type=ticket_type_enum.value,
        ticket_price=ticket_price,
        Status=True,
        seat_number=seat_number,  # Add this field to your model
        qr_code=qr_code           # Add this field to your model
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    response_data = db_booking.__dict__.copy()
    response_data["movie_name"] = movie.title if movie else None
    return response_data

# ---------------- GET USER BOOKINGS ----------------
@router.get("/", response_model=List[schemas.BookingResponse])
def read_bookings(
    skip: int = 0,
    limit: int = 10,
    db: Session = db_dependency,
    current_user: dict = Depends(user_required),
):
    bookings = (
        db.query(models.Bookings)
        .filter(models.Bookings.user_id == current_user["user_id"])
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for booking in bookings:
        movie = (
            db.query(models.Movies)
            .filter(models.Movies.id == booking.Movies_id)
            .first()
        )

        data = booking.__dict__.copy()
        data["movie_name"] = movie.title if movie else "Unknown"
        result.append(data)

    return result


# ---------------- GET SINGLE BOOKING ----------------
@router.get("/{booking_id}", response_model=schemas.BookingResponse)
def read_booking(
    booking_id: int,
    db: Session = db_dependency,
    current_user: dict = Depends(user_required),
):
    booking = db.query(models.Bookings).filter(
        models.Bookings.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")

    return booking


# ---------------- UPDATE BOOKING ----------------
@router.put("/{booking_id}", response_model=schemas.BookingResponse)
def update_booking(
    booking_id: int,
    booking: schemas.BookingCreate,
    db: Session = db_dependency,
    current_user: dict = Depends(user_required),
):
    db_booking = db.query(models.Bookings).filter(
        models.Bookings.id == booking_id
    ).first()

    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if db_booking.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")

    db_booking.Movies_id = booking.Movies_id
    db_booking.tickets_booked = booking.tickets_booked

    db.commit()
    db.refresh(db_booking)

    return db_booking


# ---------------- CANCEL BOOKING ----------------
@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: int,
    db: Session = db_dependency,
    current_user: dict = Depends(user_required),
):
    booking = db.query(models.Bookings).filter(
        models.Bookings.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")

    booking.Status = False
    db.commit()
