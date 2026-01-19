import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI, moviesAPI } from '../utils/api';
import '../styles/BookingForm.css';

function BookingForm() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const response = await moviesAPI.getById(Number(movieId));
      setMovie(response.data);
    } catch (err) {
      setError('Failed to load movie details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await bookingsAPI.create(Number(movieId), numberOfTickets);
      alert('Booking successful! Booking ID: ' + response.data.id);
      navigate('/my-bookings');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Movies
      </button>

      <div className="booking-card">
        <h1>Book Tickets</h1>

        {movie && (
          <div className="movie-info" style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', marginBottom: '24px' }}>
            <div className="movie-poster" style={{ flex: '0 0 220px', maxWidth: '220px', maxHeight: '320px', overflow: 'hidden', borderRadius: '12px', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={movie.image_url || "/image1.png"}
                alt={movie.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  background: '#222',
                  display: 'block',
                }}
                onError={e => { (e.target as HTMLImageElement).src = "/image1.png"; }}
              />
            </div>
            <div className="movie-details" style={{ flex: 1 }}>
              <h2>{movie.title}</h2>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Duration:</strong> {movie.duration} mins</p>
              <p><strong>Rating:</strong> ⭐ {movie.rating}/10</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Number of Tickets</label>
            <div className="ticket-selector">
              <button
                type="button"
                onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                className="ticket-btn"
              >
                -
              </button>
              <input
                type="number"
                value={numberOfTickets}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(10, Number(e.target.value)));
                  setNumberOfTickets(val);
                }}
                min="1"
                max="10"
                className="ticket-input"
              />
              <button
                type="button"
                onClick={() => setNumberOfTickets(Math.min(10, numberOfTickets + 1))}
                className="ticket-btn"
              >
                +
              </button>
            </div>
            <p className="ticket-price">₹{numberOfTickets * 250} (₹250 per ticket)</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading} className="book-btn">
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
