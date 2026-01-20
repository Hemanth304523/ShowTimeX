import { useEffect, useState, type ReactNode } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../utils/api';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import '../styles/BookingList.css';
interface Booking {
  seat_number: string;
  qr_code: any;
  id: number;
  uuid: string;
  Movies_id: number;
  user_id: number;
  customer_name: string;
  tickets_booked: number;
  ticket_slot: string;
  ticket_type: string;
  ticket_price: number;
  Status: boolean;
  created_at: string;
  movie_name?: string;
}

function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const pageSize = 8;

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
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings by search (movie name or uuid)
  const filteredBookings = bookings.filter(b => {
    const searchLower = search.toLowerCase();
    return (
      (b.movie_name && b.movie_name.toLowerCase().includes(searchLower)) ||
      (b.uuid && b.uuid.toLowerCase().includes(searchLower))
    );
  });

  const total = filteredBookings.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + pageSize);

  const handleDeleteBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsAPI.delete(bookingId);
      const updated = bookings.filter(b => b.id !== bookingId);
      setBookings(updated);

      if ((page - 1) * pageSize >= updated.length && page > 1) {
        setPage(page - 1);
      }
    } catch {
      setError('Failed to delete booking');
    }
  };

  return (
    <div className="booking-list-container">
      <Navbar />

      <div className="bookings-content">
        <h2>My Bookings</h2>

        {/* Search Bar */}
        <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search by movie name or booking reference..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              width: '350px',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #aaa',
              fontSize: '1rem',
            }}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading your bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings found</p>
            <button onClick={() => navigate('/')}>Browse Movies</button>
          </div>
        ) : (
          <>
            <div className="bookings-list">
              {paginatedBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div
                    className="booking-header"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h3>Booking ID</h3>
                      <small style={{ color: '#777' }}>{booking.uuid}</small>
                      <div
                        className={`status ${
                          booking.Status ? 'confirmed' : 'cancelled'
                        }`}
                      >
                        {booking.Status ? 'Confirmed' : 'Cancelled'}
                      </div>
                    </div>

                    {booking.Status && (
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#d9534f',
                          fontSize: '1.2rem',
                        }}
                        title="Cancel Booking"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  <div className="booking-details">
                    <p><strong>Customer:</strong> {booking.customer_name}</p>
                    <p><strong>Movie:</strong> {booking.movie_name || booking.Movies_id}</p>
                    <p><strong>Ticket Type:</strong> {booking.ticket_type}</p>
                    <p><strong>Time Slot:</strong> {booking.ticket_slot}</p>
                    <p><strong>Tickets:</strong> {booking.tickets_booked}</p>
                    <p><strong>Seat Number:</strong> {booking.seat_number}</p>
                    <p><strong>Total Price:</strong> ₹{booking.ticket_price}</p>
                    <p>
                      <strong>Booked on:</strong>{' '}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                    {booking.qr_code && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>QR Code:</strong><br />
                        <img src={booking.qr_code} alt="QR Code" style={{ width: '120px', height: '120px' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '2rem 0',
              }}
            >
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: '20px',
                  border: '1px solid #888',
                  marginRight: '1rem',
                  background: page === 1 ? '#eee' : '#fff',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Prev
              </button>

              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                Page {page} of {Math.ceil(total / pageSize)}
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * pageSize >= total}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: '20px',
                  border: '1px solid #888',
                  marginLeft: '1rem',
                  background: page * pageSize >= total ? '#eee' : '#fff',
                  cursor:
                    page * pageSize >= total ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BookingList;
