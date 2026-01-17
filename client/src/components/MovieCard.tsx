import '../styles/MovieCard.css';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number;
}

interface MovieCardProps {
  movie: Movie;
  onBooking: () => void;
}

function MovieCard({ movie, onBooking }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        <img src="/image1.png" alt={movie.title} className="movie-poster" />
        <div className="movie-rating">
          <span className="rating-value">⭐ {movie.rating}</span>
        </div>
      </div>
      <div className="movie-card-content">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <p className="movie-duration">Duration: {movie.duration} mins</p>
        <button className="book-ticket-btn" onClick={onBooking}>
          Book Ticket
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
