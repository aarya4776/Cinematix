import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { tmdb } from '../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie, style }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!movie) return null; // Allow rendering even if poster is missing
  const posterUrl = movie.poster_path ? tmdb.getImageUrl(movie.poster_path) : null;
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div className="movie-card" style={style}>
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className={`movie-poster-wrapper ${imageLoaded ? 'loaded' : 'shimmering'}`}>
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className={`movie-poster ${imageLoaded ? 'loaded' : ''}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="movie-poster placeholder" />
          )}
          <div className="movie-overlay">
            <div className="movie-overlay-content">
              <span className="view-details">View Details</span>
            </div>
          </div>
          <div className="movie-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{rating}</span>
          </div>
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{releaseYear}</p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
