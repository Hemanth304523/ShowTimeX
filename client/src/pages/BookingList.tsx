import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../utils/api';
import Footer from '../components/footer.tsx';
import Navbar from '../components/navbar.tsx';
import '../styles/BookingList.css';

interface Booking {
  id: number;
  Movies_id: number;
  user_id: number;
  customer_name: string;
  tickets_booked: number;
  Status: boolean;
  created_at: string;
}

function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAll();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-list-container">
      <Navbar />

      <div className="bookings-content">
        <h2>My Bookings</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings yet</p>
            <button onClick={() => navigate('/')}>Browse Movies</button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>Booking #{booking.id}</h3>
                  <span className={`status ${booking.Status ? 'confirmed' : 'cancelled'}`}>
                    {booking.Status ? 'Confirmed' : 'Cancelled'}
                  </span>
                </div>
                <div className="booking-details">
                  <p><strong>Customer:</strong> {booking.customer_name}</p>
                  <p><strong>Movie ID:</strong> {booking.Movies_id}</p>
                  <p><strong>Tickets:</strong> {booking.tickets_booked}</p>
                  <p><strong>Total Price:</strong> ₹{booking.tickets_booked * 250}</p>
                  <p><strong>Booked on:</strong> {new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BookingList;
