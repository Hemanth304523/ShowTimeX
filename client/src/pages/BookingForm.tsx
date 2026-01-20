import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI, moviesAPI } from '../utils/api';
import '../styles/BookingForm.css';

const TICKET_PRICES: Record<string, number> = {
  Regular: 250,
  Premium: 350,
  IMAX: 450,
  '4DX': 600,
};

const TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
  '21:00-24:00',
];

function BookingForm() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [ticketType, setTicketType] = useState('Regular');
  const [ticketSlot, setTicketSlot] = useState(TIME_SLOTS[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<{ seat_number: string; qr_code: string } | null>(null);

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const res = await moviesAPI.getById(Number(movieId));
      setMovie(res.data);
    } catch {
      setError('Failed to load movie details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await bookingsAPI.create({
        Movies_id: Number(movieId),
        tickets_booked: numberOfTickets,
        ticket_type: ticketType,
        ticket_slot: ticketSlot,
      });
      if (res.data && res.data.seat_number && res.data.qr_code) {
        setBookingResult({ seat_number: res.data.seat_number, qr_code: res.data.qr_code });
      }
      alert('Booking successful!');
      // Optionally, you can navigate after showing result
      // navigate('/my-bookings');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = numberOfTickets * TICKET_PRICES[ticketType];

  return (
    <div className="booking-form-container">
      <button className="back-btn" onClick={() => navigate('/')}> 
        ← Back to Movies
      </button>

      <div className="booking-card">
        <h1>Book Tickets</h1>

        {movie && (
          <div className="movie-info">
            <img
              src={movie.image_url || '/image1.png'}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => ((e.target as HTMLImageElement).src = '/image1.png')}
            />
            <div className="movie-details">
              <h2>{movie.title}</h2>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Duration:</strong> {movie.duration} mins</p>
              <p><strong>Rating:</strong> ⭐ {movie.rating}/10</p>
            </div>
          </div>
        )}

        {!bookingResult ? (
          <form onSubmit={handleSubmit}>
            {/* Ticket Type */}
            <div className="form-group">
              <label>Ticket Type</label>
              <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
                {Object.keys(TICKET_PRICES).map(type => (
                  <option key={type} value={type}>
                    {type} (₹{TICKET_PRICES[type]})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot */}
            <div className="form-group">
              <label>Time Slot</label>
              <select value={ticketSlot} onChange={(e) => setTicketSlot(e.target.value)}>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            {/* Ticket Count */}
            <div className="form-group">
              <label>Number of Tickets</label>
              <div className="ticket-selector">
                <button type="button" onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}>-</button>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={numberOfTickets}
                  onChange={(e) =>
                    setNumberOfTickets(Math.max(1, Math.min(10, Number(e.target.value))))
                  }
                />
                <button type="button" onClick={() => setNumberOfTickets(Math.min(10, numberOfTickets + 1))}>+</button>
              </div>
            </div>

            {/* Price */}
            <p className="ticket-price">
              Total: ₹{totalPrice}
            </p>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={loading} className="book-btn">
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        ) : (
          <div className="booking-success">
            <h2>Booking Confirmed!</h2>
            <p><strong>Your Seat Number:</strong> {bookingResult.seat_number}</p>
            <p><strong>Your QR Code:</strong></p>
            <img src={bookingResult.qr_code} alt="QR Code" style={{ width: '150px', height: '150px' }} />
            <button className="book-btn" onClick={() => navigate('/my-bookings')}>Go to My Bookings</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingForm;
