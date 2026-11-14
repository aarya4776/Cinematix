import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Star, Clock, Calendar, BookmarkPlus, BookmarkCheck, ArrowLeft, Compass } from 'lucide-react';
import { tmdb } from '../services/tmdb';
import MovieRow from '../components/MovieRow';
import './MovieDetails.css';

const TrailerModal = ({ videoKey, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250); // Matches the CSS transition duration
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isClosing]);

  if (!videoKey) return null;

  return createPortal(
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="video-container">
          <iframe 
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`} 
            title="Clip" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>,
    document.body
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/discover');
    }
  };
  const [trailerKey, setTrailerKey] = useState(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recHeading, setRecHeading] = useState('You Might Also Like');

  useEffect(() => {
    const fetchDetails = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      const data = await tmdb.getMovieDetails(id);
      
      if (data) {
        setMovie(data);
        
        // --- High-Fidelity Recommendation Scoring Engine ---
        // Select the actual primary lead actor (highest order billed and acting department)
        const leadActor = data.credits?.cast?.find(c => c.order === 0 && c.known_for_department === 'Acting')
                       || data.credits?.cast?.find(c => c.order === 0)
                       || data.credits?.cast?.[0];

        const director = data.credits?.crew?.find(c => c.job === 'Director');
        const currentMovieGenres = data.genres || [];
        const currentGenreIds = new Set(currentMovieGenres.map(g => g.id));
        const primaryGenreName = currentMovieGenres[0]?.name || '';

        // Fetch lead actor and director movie credits concurrently
        const [actorRes, directorRes] = await Promise.allSettled([
          leadActor && leadActor.id ? tmdb.getPersonMovieCredits(leadActor.id) : Promise.resolve(null),
          director ? tmdb.getPersonMovieCredits(director.id) : Promise.resolve(null)
        ]);

        const actorData = actorRes.status === 'fulfilled' ? actorRes.value : null;
        const directorData = directorRes.status === 'fulfilled' ? directorRes.value : null;

        // Scoring helper mapping matching genres and recency
        const getScore = (m, baseScore = 50) => {
          let score = baseScore + (m.popularity || 0);
          if (m.genre_ids) {
            m.genre_ids.forEach(gId => {
              if (currentGenreIds.has(gId)) {
                score += 30; // Strong genre match overlap
              }
            });
          }
          if (m.release_date && data.release_date) {
            const y1 = parseInt(m.release_date.substring(0, 4), 10);
            const y2 = parseInt(data.release_date.substring(0, 4), 10);
            const diff = Math.abs(y1 - y2);
            if (diff <= 5) score += 15;
            else if (diff <= 10) score += 5;
          }
          return score;
        };

        // Specialized scoring for actor credit prominence (billing order bias)
        const getActorScore = (m, baseScore = 50) => {
          let score = baseScore + (m.popularity || 0);
          
          // Prominence Bias based on billing order (0 is primary lead, high values are minor cameos)
          if (typeof m.order === 'number') {
            if (m.order === 0) score += 50;      // Leading role
            else if (m.order <= 2) score += 30; // Primary co-star
            else if (m.order <= 5) score += 15; // Supporting co-star
            else if (m.order >= 10) score -= 25; // Bit-part / cameo penalty
          }

          if (m.genre_ids) {
            m.genre_ids.forEach(gId => {
              if (currentGenreIds.has(gId)) {
                score += 30;
              }
            });
          }
          if (m.release_date && data.release_date) {
            const y1 = parseInt(m.release_date.substring(0, 4), 10);
            const y2 = parseInt(data.release_date.substring(0, 4), 10);
            const diff = Math.abs(y1 - y2);
            if (diff <= 5) score += 15;
            else if (diff <= 10) score += 5;
          }
          return score;
        };

        let finalRecs = [];
        let finalHeading = 'You Might Also Like';

        // Priority 1: Same Lead Actor filmography
        if (leadActor && actorData && actorData.cast) {
          const normalizeTitle = (title) => {
            if (!title) return '';
            return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
          };

          // Filter out uncredited, background, archive, and promotional entries
          const rawActorMovies = actorData.cast.filter(m => {
            if (!m || !m.id || !m.poster_path || !m.title) return false;
            if (m.id === data.id) return false;

            const characterName = (m.character || '').trim();
            if (!characterName) return false; // Verify actor presence via non-empty character name

            const characterLower = characterName.toLowerCase();
            const isUnwantedRole = characterLower.includes('uncredited') || 
                                   characterLower.includes('archive') || 
                                   characterLower.includes('himself (archive)') || 
                                   characterLower.includes('herself (archive)') || 
                                   characterLower.includes('cameo') ||
                                   characterLower.includes('background') || 
                                   characterLower.includes('extra') || 
                                   characterLower.includes('special appearance') ||
                                   characterLower === 'self' ||
                                   characterLower === 'himself' ||
                                   characterLower === 'herself';
            if (isUnwantedRole) return false;

            return true;
          });

          // Deduplicate strictly by ID and Title + Year to ensure accuracy
          const deduplicatedActorMovies = [];
          const seenActorIds = new Set();
          const seenActorTitles = new Map();

          // Map with prominence-based scoring, and sort high -> low
          const actorMovieCandidates = rawActorMovies.map(m => {
            const dateStr = m.release_date || '';
            const year = dateStr ? parseInt(dateStr.substring(0, 4), 10) : 0;
            const normalizedTitle = normalizeTitle(m.title);
            const score = getActorScore(m, 50);

            return {
              ...m,
              _year: year,
              _normalizedTitle: normalizedTitle,
              score
            };
          }).sort((a, b) => b.score - a.score);

          actorMovieCandidates.forEach(item => {
            if (seenActorIds.has(item.id)) return;

            if (item._normalizedTitle) {
              const match = seenActorTitles.get(item._normalizedTitle);
              if (match) {
                const yearDiff = Math.abs(item._year - match.year);
                if (yearDiff <= 1) return; // Deduplicate duplicate titles in same era
              } else {
                seenActorTitles.set(item._normalizedTitle, { year: item._year, id: item.id });
              }
            }

            seenActorIds.add(item.id);
            deduplicatedActorMovies.push(item);
          });

          if (deduplicatedActorMovies.length >= 4) {
            finalRecs = deduplicatedActorMovies.slice(0, 10);
            
            let genreAdjective;
            if (primaryGenreName === 'Action') genreAdjective = 'Action Thrillers';
            else if (primaryGenreName === 'Science Fiction' || primaryGenreName === 'Sci-Fi') genreAdjective = 'Sci-Fi Hits';
            else if (primaryGenreName === 'Horror') genreAdjective = 'Horror Favorites';
            else if (primaryGenreName === 'Comedy') genreAdjective = 'Comedy Favorites';
            else if (primaryGenreName === 'Drama') genreAdjective = 'Cinematic Dramas';
            else genreAdjective = 'Cinematic Favorites';
            
            finalHeading = `More ${leadActor.name} ${genreAdjective}`;
          }
        }

        // Priority 2: Same Director filmography
        if (finalRecs.length < 4 && directorData && directorData.crew) {
          const directorMovies = directorData.crew
            .filter(m => m.id !== data.id && m.job === 'Director' && m.poster_path)
            .map(m => ({ ...m, score: getScore(m, 60) }))
            .sort((a, b) => b.score - a.score);

          if (directorMovies.length >= 3) {
            finalRecs = directorMovies.slice(0, 10);
            finalHeading = `More Masterpieces Directed by ${director.name}`;
          }
        }

        // Priority 3: Strong Genre overlap (TMDB Similar + Recommendations)
        if (finalRecs.length < 4) {
          const rawSimilar = [
            ...(data.similar?.results || []),
            ...(data.recommendations?.results || [])
          ];
          
          const seenIds = new Set();
          const uniqueSimilar = [];
          rawSimilar.forEach(m => {
            if (m.id !== data.id && m.poster_path && !seenIds.has(m.id)) {
              seenIds.add(m.id);
              uniqueSimilar.push(m);
            }
          });

          // Strictly filter out mismatching genres to ensure thematic alignment
          const genreRecs = uniqueSimilar
            .map(m => ({ ...m, score: getScore(m, 40) }))
            .filter(m => m.genre_ids?.some(gId => currentGenreIds.has(gId)))
            .sort((a, b) => b.score - a.score);

          if (genreRecs.length >= 4) {
            finalRecs = genreRecs.slice(0, 10);
            
            if (currentGenreIds.has(27)) finalHeading = 'More Supernatural Horror';
            else if (currentGenreIds.has(878)) finalHeading = 'Epic Space & Sci-Fi Adventures';
            else if (currentGenreIds.has(53) && currentGenreIds.has(80)) finalHeading = 'Gritty Crime Thrillers';
            else if (currentGenreIds.has(35)) finalHeading = 'Feel-Good Comedy Hits';
            else if (currentGenreIds.has(18)) finalHeading = 'Gripping Psychological Dramas';
            else if (currentGenreIds.has(14)) finalHeading = 'Epic Fantasy Blockbusters';
            else if (currentGenreIds.has(28)) finalHeading = 'High-Octane Action Blockbusters';
            else finalHeading = 'You Might Also Like';
          }
        }

        // Priority 4: Trending fallback matching at least one genre
        if (finalRecs.length < 4) {
          const trendingData = await tmdb.getTrending('day');
          if (trendingData && trendingData.results) {
            const matchedTrending = trendingData.results
              .filter(m => m.id !== data.id && m.poster_path && m.genre_ids?.some(gId => currentGenreIds.has(gId)))
              .map(m => ({ ...m, score: getScore(m, 30) }))
              .sort((a, b) => b.score - a.score);
              
            finalRecs = matchedTrending.slice(0, 10);
            finalHeading = 'Trending Movie Recommendations';
          }
        }

        // Final fallback if still empty
        if (finalRecs.length === 0 && data.similar?.results) {
          finalRecs = data.similar.results.slice(0, 10);
          finalHeading = 'You Might Also Like';
        }

        setRecommendations(finalRecs);
        setRecHeading(finalHeading);
      }
      setLoading(false);

      // Check watchlist status
      const saved = JSON.parse(localStorage.getItem('cinematix_watchlist') || '[]');
      setIsWatchlisted(saved.some(m => m.id === parseInt(id, 10)));
    };
    fetchDetails();
  }, [id]);

  const toggleWatchlist = () => {
    if (!movie) return;
    let saved = JSON.parse(localStorage.getItem('cinematix_watchlist') || '[]');
    if (isWatchlisted) {
      saved = saved.filter(m => m.id !== movie.id);
    } else {
      saved.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
    }
    localStorage.setItem('cinematix_watchlist', JSON.stringify(saved));
    setIsWatchlisted(!isWatchlisted);
  };

  if (loading) {
    return <div className="loading-state container" style={{paddingTop: '120px'}}><h2>Loading cinematic experience...</h2></div>;
  }

  if (!movie) {
    return <div className="error-state container" style={{paddingTop: '120px'}}><h2>Movie not found.</h2><Link to="/" className="btn-primary">Return Home</Link></div>;
  }

  const trailer = tmdb.getMovieTrailer(movie.videos?.results, movie.original_language);
  const director = movie.credits?.crew?.find(c => c.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="movie-details-page">
      <div className="details-backdrop" style={{ backgroundImage: `url(${tmdb.getOriginalImageUrl(movie.backdrop_path)})` }}>
        <div className="details-vignette"></div>
      </div>

      <div className="container details-content">
        <button 
          onClick={handleBack} 
          className="back-link" 
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} /> Back to Discover
        </button>
        
        <div className="details-grid">
          <div className="details-poster-col">
            <img src={tmdb.getImageUrl(movie.poster_path, 'w500')} alt={movie.title} className="details-poster" />
          </div>
          
          <div className="details-info-col">
            <h1 className="details-title">{movie.title}</h1>
            {movie.tagline && <p className="details-tagline">{movie.tagline}</p>}
            
            <div className="details-meta">
              <span className="meta-item rating"><Star size={18} fill="currentColor" /> {movie.vote_average?.toFixed(1)}</span>
              <span className="meta-item"><Clock size={18} /> {movie.runtime} min</span>
              <span className="meta-item"><Calendar size={18} /> {movie.release_date?.substring(0,4)}</span>
            </div>
            
            <div className="details-genres">
              {movie.genres?.map(g => {
                const slug = g.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link key={g.id} to={`/discover?genre=${slug}`} className="genre-pill">
                    {g.name}
                  </Link>
                );
              })}
            </div>

            <p className="details-overview">{movie.overview}</p>

            <div className="details-actions">
              {trailer && (
                <button className="btn-primary" onClick={() => setTrailerKey(trailer.key)}>
                  <Play fill="currentColor" size={20} /> Watch Clip
                </button>
              )}
              <button className="btn-secondary" onClick={toggleWatchlist}>
                {isWatchlisted ? <><BookmarkCheck fill="currentColor" size={20} /> In Watchlist</> : <><BookmarkPlus size={20} /> Add to Watchlist</>}
              </button>
            </div>

            <div className="details-credits">
              {director && <div className="credit-group"><strong>Director:</strong> {director.name}</div>}
              <div className="credit-group">
                <strong>Cast:</strong> {cast.map(c => c.name).join(', ')}
              </div>
            </div>

            {director && (
              <Link to={`/director/${director.id}`} className="director-universe-entry">
                <Compass size={20} />
                <span>Explore {director.name}'s Universe</span>
              </Link>
            )}
          </div>
        </div>

      </div>

      {recommendations.length > 0 && (
        <MovieRow title={recHeading} movies={recommendations} />
      )}

      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />}
    </div>
  );
};

export default MovieDetails;
