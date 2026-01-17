import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI } from '../utils/api';
import MovieCard from '../components/MovieCard.tsx';
import Footer from '../components/footer.tsx';
import Navbar from '../components/navbar.tsx';
import '../styles/Home.css';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  poster_image?: string;
}

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (parsedUser?.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [parsedUser, navigate]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAll();
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (movieId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${movieId}`);
  };

  return (
    <div className="home-container">
      <Navbar isAdmin={parsedUser?.role === 'admin'} />

      <div className="home-content">
        <section className="hero">
          <h2>Now Showing</h2>
          <p>Book your tickets for the latest movies</p>
        </section>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="no-movies">No movies available at the moment</div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBooking={() => handleBooking(movie.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
