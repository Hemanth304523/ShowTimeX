import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI } from '../utils/api';
import Footer from '../components/footer.tsx';
import Navbar from '../components/navbar.tsx';
import '../styles/AdminDashboard.css';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number;
}

function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    duration: '',
    rating: '',
  });

  useEffect(() => {
    const parsedUser = user ? JSON.parse(user) : null;
    if (!parsedUser || parsedUser.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchMovies();
  }, [user, navigate]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.title || !formData.genre || !formData.duration || !formData.rating) {
      setError('All fields are required');
      return;
    }

    try {
      const movieData = {
        title: formData.title,
        genre: formData.genre,
        duration: parseInt(formData.duration),
        rating: parseFloat(formData.rating),
      };

      if (editingId) {
        await moviesAPI.update(editingId, movieData);
        setSuccessMessage('Movie updated successfully!');
        setEditingId(null);
      } else {
        await moviesAPI.create(movieData);
        setSuccessMessage('Movie added successfully!');
      }
      setFormData({ title: '', genre: '', duration: '', rating: '' });
      setShowForm(false);
      fetchMovies();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save movie');
    }
  };

  const handleEditMovie = (movie: Movie) => {
    setFormData({
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration.toString(),
      rating: movie.rating.toString(),
    });
    setEditingId(movie.id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', genre: '', duration: '', rating: '' });
    setShowForm(false);
  };

  const handleDeleteMovie = async (movieId: number) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await moviesAPI.delete(movieId);
        setMovies(movies.filter(m => m.id !== movieId));
        setSuccessMessage('Movie deleted successfully!');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to delete movie');
      }
    }
  };

  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <div className="admin-container">
      <Navbar isAdmin={true} />

      <div className="admin-content">
        <div className="admin-section">
          <div className="section-header">
            <h2>Movie Management</h2>
            <button 
              className="add-movie-btn"
              onClick={() => editingId ? handleCancelEdit() : setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add New Movie'}
            </button>
          </div>

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {showForm && (
            <form className="add-movie-form" onSubmit={handleAddMovie}>
              <h3>{editingId ? 'Edit Movie' : 'Add New Movie'}</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Movie Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter movie title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Genre</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Animation">Animation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="120"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating (0-10)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="8.5"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">
                {editingId ? 'Update Movie' : 'Add Movie'}
              </button>
            </form>
          )}

          {loading ? (
            <div className="loading">Loading movies...</div>
          ) : movies.length === 0 ? (
            <div className="no-movies">No movies added yet. Add your first movie!</div>
          ) : (
            <div className="movies-grid">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-card-image">
                    <img src="/image1.png" alt={movie.title} />
                  </div>
                  <div className="movie-card-content">
                    <h3>{movie.title}</h3>
                    <p className="genre">{movie.genre}</p>
                    <p className="duration">⏱ {movie.duration} min</p>
                    <p className="rating">⭐ {movie.rating}/10</p>
                    <div className="movie-card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditMovie(movie)}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMovie(movie.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Movies</h3>
            <p className="stat-number">{movies.length}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
