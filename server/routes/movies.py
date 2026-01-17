from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from starlette.requests import Request
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas
from typing import List
from routes.auth import get_current_user

router = APIRouter(prefix="/admin/movies", tags=["movies"])
public_router = APIRouter(prefix="/movies", tags=["movies"])
security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Depends(get_db)

def admin_required(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header required")
    try:
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        current_user = get_current_user(token)
        if current_user["role"] != "admin":
            raise HTTPException(status_code=403, detail="Admin privileges required")
        return current_user
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/", response_model=schemas.MovieResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(security)])
def create_movie(movie: schemas.MovieCreate, db: Session = db_dependency, current_user: dict = Depends(admin_required)):
    db_movie = models.Movies(
        title=movie.title,
        genre=movie.genre,
        duration=movie.duration,
        rating=movie.rating,
        user_id=current_user["user_id"]
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.get("/", response_model=List[schemas.MovieResponse], dependencies=[Depends(security)])
def read_movies(skip: int = 0, limit: int = 10, db: Session = db_dependency, current_user: dict = Depends(admin_required)):
    return db.query(models.Movies).offset(skip).limit(limit).all()

@router.get("/{movie_id}", response_model=schemas.MovieResponse, dependencies=[Depends(security)])
def read_movie(movie_id: int, db: Session = db_dependency, current_user: dict = Depends(admin_required)):
    movie = db.query(models.Movies).filter(models.Movies.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@router.put("/{movie_id}", response_model=schemas.MovieResponse, dependencies=[Depends(security)])
def update_movie(movie_id: int, movie: schemas.MovieCreate, db: Session = db_dependency, current_user: dict = Depends(admin_required)):
    db_movie = db.query(models.Movies).filter(models.Movies.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    if db_movie.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Can only update your own movies")
    for key, value in movie.dict().items():
        setattr(db_movie, key, value)
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(security)])
def delete_movie(movie_id: int, db: Session = db_dependency, current_user: dict = Depends(admin_required)):
    db_movie = db.query(models.Movies).filter(models.Movies.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    if db_movie.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Can only delete your own movies")
    db.delete(db_movie)
    db.commit()
    return None

# Public endpoints for browsing movies
@public_router.get("/", response_model=List[schemas.MovieResponse])
def get_all_movies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all movies - public endpoint"""
    return db.query(models.Movies).offset(skip).limit(limit).all()

@public_router.get("/{movie_id}", response_model=schemas.MovieResponse)
def get_movie_details(movie_id: int, db: Session = Depends(get_db)):
    """Get movie details - public endpoint"""
    movie = db.query(models.Movies).filter(models.Movies.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie