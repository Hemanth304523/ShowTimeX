# BookMyShow - Movie Booking Frontend

A beautiful React-based movie booking web application with BookMyShow-inspired design.

## Features

- 🎬 Browse movies with detailed information
- 🔐 User authentication (Login/Signup)
- 🎟️ Book movie tickets with seat selection
- 📋 View booking history
- 🎨 Modern, responsive UI design
- 🔒 Secure token-based authentication

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Home.tsx     # Movie listing homepage
│   ├── Login.tsx    # User login page
│   ├── Signup.tsx   # User registration page
│   ├── BookingForm.tsx    # Booking form
│   └── BookingList.tsx    # User's bookings
├── components/      # Reusable components
│   └── MovieCard.tsx      # Movie card display
├── styles/          # CSS files
│   ├── Auth.css
│   ├── Home.css
│   ├── MovieCard.css
│   ├── BookingForm.css
│   └── BookingList.css
├── utils/           # Utilities
│   └── api.ts       # API client with Axios
├── App.tsx          # Main app with routing
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Backend server running on `http://localhost:8000`

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL if needed in `src/utils/api.ts`

### Running the Application

Development mode:
```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Features Implemented

### 1. **Home Page**
- Displays all available movies
- Movie cards with poster, title, genre, duration, and rating
- "Book Ticket" button to initiate booking
- Authentication-aware header with login/logout buttons

### 2. **Authentication**
- **Login Page**: Email and password authentication
- **Signup Page**: Create new user account
- Token stored in localStorage for persistent sessions

### 3. **Booking System**
- **Booking Form**: Select number of tickets (1-10)
- Price calculation: ₹250 per ticket
- Movie details display with poster image
- Booking confirmation

### 4. **My Bookings**
- View all user bookings
- Booking status display
- Booking date and ticket count
- Total price calculation

## Styling

The application uses BookMyShow-inspired design with:
- Purple gradient color scheme (#667eea to #764ba2)
- Smooth hover effects and transitions
- Responsive grid layout for movie cards
- Mobile-friendly design

### Colors
- Primary: #667eea (Blue-Purple)
- Secondary: #764ba2 (Dark Purple)
- Background: #f5f5f5 (Light Gray)
- Text: #333 (Dark Gray)

## Public Assets

Place your movie poster images in the `public/` folder:
- `image1.png` - Movie poster 1
- `image2.png` - Movie poster 2
- And so on...

The MovieCard component uses `/image1.png` by default. Update the image path in `src/components/MovieCard.tsx` to use different images.

## API Endpoints Used

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/{id}` - Get single movie

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{id}` - Get booking details

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Seat selection UI
- Payment gateway integration
- Email confirmations
- Advanced filtering (genre, rating, etc.)
- User profile management
- Booking cancellation
- Ratings and reviews

## Environment Variables

Update the API URL in `src/utils/api.ts` if your backend is running on a different port:

```typescript
const API_URL = 'http://localhost:8000'; // Change this if needed
```

## License

MIT License - See LICENSE file for details
