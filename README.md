# ShowTimeX

ShowTimeX is a full-stack web application for movie ticket booking, featuring a React + TypeScript frontend and a Python backend. It allows users to browse movies, book tickets, and manage bookings, with an admin dashboard for managing movies and bookings.

## Features

- User authentication (signup, login)
- Movie browsing and advanced search
- Ticket booking and booking management
- Admin dashboard for managing movies and bookings
- Responsive UI with modern design

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS Modules

### Backend
- Python (FastAPI or Flask)
- SQLite (or other database)

## Project Structure

```
client/           # Frontend (React)
  src/
    components/   # Reusable UI components
    pages/        # Page components
    styles/       # CSS files
    utils/        # Utility functions (API calls, etc.)
server/           # Backend (Python)
  routes/         # API route handlers
  models.py       # Database models
  schemas.py      # Pydantic schemas
  database.py     # Database connection
  main.py         # App entry point
```

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.8+

### Frontend Setup
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. (Optional) Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```

## Usage
- Access the frontend at `http://localhost:5173` (default Vite port)
- The backend runs on `http://localhost:8000` (or as configured)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
