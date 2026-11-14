import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { BookmarkMinus } from 'lucide-react';
import './Discover.css'; // Reuse some grid styles
import './Watchlist.css';

const Watchlist = () => {
  const [savedMovies, setSavedMovies] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cinematix_watchlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const removeFromWatchlist = (id) => {
    const updated = savedMovies.filter(m => m.id !== id);
    setSavedMovies(updated);
    localStorage.setItem('cinematix_watchlist', JSON.stringify(updated));
  };

  return (
    <div className="discover-page container">
      <div className="discover-header">
        <h1>Your Watchlist</h1>
        <p>Movies you want to watch later.</p>
      </div>

      {savedMovies.length === 0 ? (
        <div className="no-results">
          <div className="empty-state-icon">
            <BookmarkMinus size={64} opacity={0.5} />
          </div>
          <h3>Your watchlist is empty</h3>
          <p>Explore our library and save movies to watch later.</p>
          <Link to="/discover" className="btn-primary" style={{marginTop: '20px'}}>
            Discover Movies
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {savedMovies.map(movie => (
            <div key={movie.id} className="watchlist-item-wrapper">
              <MovieCard movie={movie} />
              <button 
                className="remove-btn"
                onClick={() => removeFromWatchlist(movie.id)}
                title="Remove from watchlist"
              >
                <BookmarkMinus size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
