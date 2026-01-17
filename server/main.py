from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, SessionLocal
from routes import bookings, movies, auth
import models


app = FastAPI(title="ShowTimeX_Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
models.Base.metadata.create_all(bind=engine)


# Include routers
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(movies.router)
app.include_router(movies.public_router)

@app.get("/")
def root():
    return {"message": "Welcome to ShowTimeX Backend"}


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "ShowTimeX Backend is running"
    }
