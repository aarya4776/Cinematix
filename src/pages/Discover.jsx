import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tmdb } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import './Discover.css';

// In-memory module-level cache: persists when navigating to a movie and returning
export let discoverCache = {
  query: null,
  genre: null,
  movies: null,
  totalPages: 1,
  sectionTitle: '',
  isFallback: false,
  loadedMaxPage: 1,
  scrollY: 0,
};

export const clearDiscoverCache = () => {
  discoverCache = {
    query: null,
    genre: null,
    movies: null,
    totalPages: 1,
    sectionTitle: '',
    isFallback: false,
    loadedMaxPage: 1,
    scrollY: 0,
  };
  try {
    sessionStorage.removeItem('cinematix_discover_scroll');
  } catch {
    // sessionStorage unavailable
  }
};

const getCinematicGenreHeading = (genreId) => {
  switch (genreId) {
    case 28: return 'Action Blockbusters';
    case 12: return 'Epic Adventures';
    case 16: return 'Animated Wonders';
    case 35: return 'Comedy Hits';
    case 80: return 'Crime Thrillers';
    case 99: return 'Insightful Documentaries';
    case 18: return 'Gripping Dramas';
    case 10751: return 'Family-Friendly Favorites';
    case 14: return 'Fantasy Epics';
    case 36: return 'Historical Epics';
    case 27: return 'Supernatural Horror';
    case 10402: return 'Musical Journeys';
    case 9648: return 'Intriguing Mysteries';
    case 10749: return 'Romantic Favorites';
    case 878: return 'Sci-Fi Adventures';
    case 10770: return 'TV Movie Highlights';
    case 53: return 'Dark Thrillers';
    case 10752: return 'War Epics';
    case 37: return 'Classic Westerns';
    default: return 'Curated Movie Discovery';
  }
};

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const genreParam = searchParams.get('genre') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const navigate = useNavigate();

  // Synchronously resolve current genre ID from URL parameter (never stale, prevents cross-genre leakage)
  const currentGenreId = genreParam ? tmdb.getGenreIdByName(genreParam) : null;

  // Check if we have valid cached data matching current query and genre
  const hasValidCache = Boolean(
    discoverCache.movies &&
    discoverCache.movies.length > 0 &&
    discoverCache.query === query &&
    discoverCache.genre === genreParam
  );

  const [movies, setMovies] = useState(() => (hasValidCache ? discoverCache.movies : []));
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(() => !hasValidCache);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFallback, setIsFallback] = useState(() => (hasValidCache ? discoverCache.isFallback : false));
  const [sectionTitle, setSectionTitle] = useState(() => (hasValidCache ? discoverCache.sectionTitle : ''));
  const [totalPages, setTotalPages] = useState(() => (hasValidCache ? discoverCache.totalPages : 1));

  // Keep track of the active parameters we loaded movies for
  const lastLoadedParams = useRef({
    query: hasValidCache ? query : null,
    genre: hasValidCache ? genreParam : null,
    loadedMaxPage: hasValidCache ? discoverCache.loadedMaxPage : 0,
  });

  // Fetch all genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      const data = await tmdb.getGenres();
      if (data && data.genres) {
        setGenres(data.genres);
      }
    };
    fetchGenres();
  }, []);

  // Smooth scroll to results grid when selecting genres (only for fresh genre selections, not cache restores)
  useEffect(() => {
    if (genreParam && pageParam === 1 && !hasValidCache) {
      window.scrollTo({
        top: 280,
        behavior: 'smooth'
      });
    }
  }, [genreParam, pageParam, hasValidCache]);

  // Continuously sync movies and state to discoverCache
  useEffect(() => {
    if (movies.length > 0) {
      discoverCache.query = query;
      discoverCache.genre = genreParam;
      discoverCache.movies = movies;
      discoverCache.totalPages = totalPages;
      discoverCache.sectionTitle = sectionTitle;
      discoverCache.isFallback = isFallback;
      discoverCache.loadedMaxPage = Math.max(pageParam, lastLoadedParams.current.loadedMaxPage || 1);
    }
  }, [movies, query, genreParam, pageParam, totalPages, sectionTitle, isFallback]);

  // Track scroll position continuously
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        discoverCache.scrollY = window.scrollY;
        try {
          sessionStorage.setItem('cinematix_discover_scroll', String(window.scrollY));
        } catch {
          // sessionStorage unavailable
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Restore scroll position when returning from movie poster view
  useEffect(() => {
    const savedScroll = discoverCache.scrollY || parseInt(sessionStorage.getItem('cinematix_discover_scroll') || '0', 10);
    if (hasValidCache && savedScroll > 0) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: savedScroll,
          behavior: 'instant'
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasValidCache]);

  // Core movie fetching effect with reload persistence, duplicate prevention, and search retrieval
  useEffect(() => {
    const fetchMovies = async () => {
      // True param change occurs when we had previous parameters and either query or genre changed
      const isParamChange =
        lastLoadedParams.current.query !== null &&
        (lastLoadedParams.current.query !== query || lastLoadedParams.current.genre !== genreParam);

      if (isParamChange) {
        // Reset loader and states for fresh parameters
        setLoading(true);
        setIsFallback(false);
        setSectionTitle('');
        clearDiscoverCache();

        // If the URL page parameter is already > 1 but we changed parameter, reset page back to 1
        if (pageParam > 1) {
          const newParams = new URLSearchParams(searchParams);
          newParams.set('page', '1');
          setSearchParams(newParams, { replace: true });
          return; // The searchParam change will re-trigger this useEffect
        }
      }

      // If we already have valid cached data for this page and parameters, skip redundant network fetch
      if (hasValidCache && pageParam <= lastLoadedParams.current.loadedMaxPage) {
        return;
      }

      // Fetch helper that queries specific pages cleanly based on parameters
      const fetchPageData = async (targetPage) => {
        if (query) {
          const searchData = await tmdb.searchMovies(query, targetPage);
          return { type: 'movie', data: searchData, fallback: false, title: '' };
        } else if (currentGenreId) {
          const discoverData = await tmdb.discoverByGenre(currentGenreId, targetPage);
          return { type: 'genre', data: discoverData, fallback: false, title: getCinematicGenreHeading(currentGenreId) };
        } else {
          const popularData = await tmdb.getPopular(targetPage);
          return { type: 'popular', data: popularData, fallback: false, title: '' };
        }
      };

      if (isParamChange || lastLoadedParams.current.query === null) {
        // Fresh initial load for query/genre parameter
        if (lastLoadedParams.current.loadedMaxPage === 0 && pageParam > 1) {
          // Fresh page reload recovery for page > 1 (e.g. browser refresh on /discover?page=3)
          setLoading(true);
          const fetchPromises = [];
          for (let p = 1; p <= pageParam; p++) {
            fetchPromises.push(fetchPageData(p));
          }
          const results = await Promise.allSettled(fetchPromises);
          let combinedMovies = [];
          let maxTotalPages = 1;
          let fallback = false;
          let title = '';

          results.forEach((resWrapper, index) => {
            if (resWrapper.status === 'fulfilled') {
              const res = resWrapper.value;
              if (res && res.data && res.data.results) {
                const existingIds = new Set(combinedMovies.map(m => m.id));
                const filtered = res.data.results.filter(m => !existingIds.has(m.id));
                combinedMovies = [...combinedMovies, ...filtered];
                maxTotalPages = Math.max(maxTotalPages, res.data.total_pages || 1);
                if (index === 0) {
                  fallback = res.fallback;
                  title = res.title;
                }
              }
            }
          });

          setMovies(combinedMovies);
          setTotalPages(maxTotalPages);
          setIsFallback(fallback);
          setSectionTitle(title);
          lastLoadedParams.current = { query, genre: genreParam, loadedMaxPage: pageParam };
          setLoading(false);
        } else {
          // Standard page 1 initial load
          if (query) {
            window.scrollTo(0, 0);
          }
          const res = await fetchPageData(1);
          if (res && res.data && res.data.results) {
            setMovies(res.data.results);
            setTotalPages(res.data.total_pages || 1);
            setIsFallback(res.fallback);
            setSectionTitle(res.title);
          } else {
            setMovies([]);
            setTotalPages(1);
          }
          lastLoadedParams.current = { query, genre: genreParam, loadedMaxPage: 1 };
          setLoading(false);
        }
      } else {
        // Same parameters, incremental "Load More" page fetch
        if (pageParam > lastLoadedParams.current.loadedMaxPage) {
          setLoadingMore(true);
          const res = await fetchPageData(pageParam);
          if (res && res.data && res.data.results) {
            setMovies(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const filtered = res.data.results.filter(m => !existingIds.has(m.id));
              return [...prev, ...filtered];
            });
            setTotalPages(res.data.total_pages || 1);
          }
          lastLoadedParams.current.loadedMaxPage = pageParam;
          setLoadingMore(false);
        }
      }
    };

    fetchMovies();
  }, [query, genreParam, pageParam, currentGenreId, hasValidCache]);

  const handleGenreSelect = (genre) => {
    clearDiscoverCache();
    if (genre) {
      const slug = genre.name.toLowerCase().trim().replace(/[\s_]+/g, '-');
      navigate(`/discover?genre=${slug}`);
    } else {
      navigate('/discover');
    }
  };

  const handleLoadMore = () => {
    if (loading || loadingMore) return;
    const nextPage = pageParam + 1;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', nextPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="discover-page container">
      <div className="discover-header">
        <h1>{query ? `Search Results for "${query}"` : 'Discover Movies'}</h1>
        <p>{query ? 'Find your favorite movies' : 'Explore by genre and discover your next favorite cinematic experience.'}</p>
      </div>

      {!query && (
        <div className="genre-filters">
          <button
            className={`genre-chip ${!currentGenreId ? 'active' : ''}`}
            onClick={() => handleGenreSelect(null)}
          >
            All
          </button>

          {genres.map(genre => (
            <button
              key={genre.id}
              className={`genre-chip ${currentGenreId === genre.id ? 'active' : ''}`}
              onClick={() => handleGenreSelect(genre)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-grid">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton movie-card" style={{ height: '300px' }}></div>)}
        </div>
      ) : (
        <>
          {sectionTitle && (
            <div className="discovery-section-header">
              <h2 className="discovery-section-title">{sectionTitle}</h2>
            </div>
          )}
          {movies.length === 0 ? (
            <div className="no-results">
              <h3>No movies found.</h3>
              <p>Try searching for something else or selecting a different genre.</p>
            </div>
          ) : (
            <>
              <div className="movies-grid">
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {/* Pagination controls at the bottom of the grid */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  {pageParam < totalPages ? (
                    <button
                      className="btn-load-more"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <div className="loading-more-spinner"></div>
                          <span>Loading More...</span>
                        </>
                      ) : (
                        <span>Load More Discoveries</span>
                      )}
                    </button>
                  ) : (
                    <div className="end-message">
                      <span>You've reached the end of cinematic discoveries.</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Discover;
