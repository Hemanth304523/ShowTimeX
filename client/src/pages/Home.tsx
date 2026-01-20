import { useEffect, useState } from 'react';
import AdvancedSearchBar from '../components/AdvancedSearchBar';
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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState('');
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
    // eslint-disable-next-line
  }, [page, search, genre, minRating]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params: any = {
        skip: (page - 1) * pageSize,
        limit: pageSize,
      };
      if (search) params.search = search;
      if (genre) params.genre = genre;
      if (minRating) params.min_rating = minRating;
      const response = await moviesAPI.getAll(params);
      setMovies(response.data.movies);
      setTotal(response.data.total);
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

  // No need to filter on frontend, backend handles it

  return (
    <div className="home-container">
      <Navbar isAdmin={parsedUser?.role === 'admin'} />

      <div className="home-content">
        <section className="hero">
          <h2>Featured Movies</h2>
          <p>Browse and book tickets for movies currently in theatres</p>
        </section>

        {/* Advanced Search Bar Component */}
        <AdvancedSearchBar
          search={search}
          setSearch={val => { setSearch(val); setPage(1); }}
          genre={genre}
          setGenre={val => { setGenre(val); setPage(1); }}
          minRating={minRating}
          setMinRating={val => { setMinRating(val); setPage(1); }}
          genres={[...new Set(movies.map(m => m.genre))]}
        />

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="no-movies">No movies match your search/filter</div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onBooking={() => handleBooking(movie.id)}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.5rem 1.2rem', borderRadius: '20px', border: '1px solid #888', marginRight: '1rem', background: page === 1 ? '#eee' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
              <span style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 1rem' }}>Page {page} of {Math.ceil(total / pageSize) || 1}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total} style={{ padding: '0.5rem 1.2rem', borderRadius: '20px', border: '1px solid #888', marginLeft: '1rem', background: page * pageSize >= total ? '#eee' : '#fff', cursor: page * pageSize >= total ? 'not-allowed' : 'pointer' }}>Next</button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
