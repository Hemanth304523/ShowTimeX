import '../styles/MovieCard.css';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  image_url?: string;
}

interface MovieCardProps {
  movie: Movie;
  onBooking: () => void;
}

function MovieCard({ movie, onBooking }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div
        className="movie-poster-container"
        style={{
          height: '260px',
          width: '100%',
          background: '#eaeaea',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        <img
          src={movie.image_url && movie.image_url.trim() !== '' ? movie.image_url : "/image1.png"}
          alt={movie.title}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            display: 'block',
            background: '#222',
            margin: '0 auto',
          }}
          onError={e => { (e.target as HTMLImageElement).src = "/image1.png"; }}
        />
        <div className="movie-rating" style={{position: 'absolute', top: 12, right: 12}}>
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
