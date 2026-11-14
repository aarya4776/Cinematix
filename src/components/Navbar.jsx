import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Clapperboard, Menu, X, Star, User, TrendingUp, Film } from 'lucide-react';
import { clearDiscoverCache } from '../pages/Discover';
import { tmdb } from '../services/tmdb';
import './Navbar.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/';

// Genre intent map — if query exactly matches a genre keyword, offer a Browse chip
const GENRE_QUICK = {
  action: 28, horror: 27, comedy: 35, drama: 18, thriller: 53,
  animation: 16, romance: 10749, mystery: 9648, fantasy: 14,
  documentary: 99, 'sci-fi': 878, western: 37, crime: 80, war: 10752,
  adventure: 12
};

// ─── Dropdown Component ───────────────────────────────────────────────────────
const LiveSearchDropdown = ({
  results, person, correctedQuery, query, trending,
  onSelect, onDirectorClick, onGenreBrowse,
  activeIdx, visible
}) => {
  if (!visible) return null;

  const showTrending = !query && trending.length > 0;
  const hasContent = showTrending || results.length > 0 || person;
  if (!hasContent && !correctedQuery) return null;

  // Genre intent detection
  const lowerQ = query.toLowerCase().trim();
  const genreMatch = GENRE_QUICK[lowerQ];

  // Flat item list for keyboard-index tracking
  const movieStartIdx = person ? 1 : 0;

  return (
    <div className="ns-dropdown" role="listbox">
      {/* Typo correction notice */}
      {correctedQuery && (
        <div className="ns-correction">
          <Search size={11} /> Showing results for <strong>"{correctedQuery}"</strong>
        </div>
      )}

      {/* Genre browse chip */}
      {genreMatch && !showTrending && (
        <button
          className="ns-genre-chip"
          onMouseDown={() => onGenreBrowse(lowerQ)}
        >
          <Film size={13} />
          Browse all <strong>{lowerQ.charAt(0).toUpperCase() + lowerQ.slice(1)}</strong> →
        </button>
      )}

      {/* Trending (shown when input empty + focused) */}
      {showTrending && (
        <>
          <div className="ns-section-label"><TrendingUp size={11} /> Trending Now</div>
          {trending.map((movie, i) => (
            <button
              key={movie.id}
              className={`ns-movie-row${activeIdx === i ? ' ns-active' : ''}`}
              style={{ '--ns-delay': `${i * 28}ms` }}
              onMouseDown={() => onSelect(movie.id, movie.title)}
              role="option"
            >
              <div className="ns-poster">
                {movie.poster_path
                  ? <img src={`${IMG_BASE}w92${movie.poster_path}`} alt={movie.title} loading="lazy" />
                  : <div className="ns-poster-placeholder"><Clapperboard size={15} /></div>}
              </div>
              <div className="ns-movie-info">
                <span className="ns-movie-title">{movie.title}</span>
                <span className="ns-movie-meta">
                  {movie.release_date?.slice(0, 4)}
                  {movie.genre_ids?.length > 0 && <span className="ns-dot">·</span>}
                  {(movie.genre_ids || []).slice(0, 2).map(id => tmdb.getGenreNameById(id)).filter(Boolean).join(' / ')}
                </span>
              </div>
              {(movie.vote_average > 0) && (
                <div className="ns-rating">
                  <Star size={10} fill="currentColor" strokeWidth={0} />
                  {movie.vote_average.toFixed(1)}
                </div>
              )}
            </button>
          ))}
        </>
      )}

      {/* Director match — always first */}
      {!showTrending && person && (
        <button
          className={`ns-person-row${activeIdx === 0 ? ' ns-active' : ''}`}
          style={{ '--ns-delay': '0ms' }}
          onMouseDown={() => onDirectorClick(person.id, person.name)}
          role="option"
        >
          <div className="ns-person-avatar">
            {person.profile_path
              ? <img src={`${IMG_BASE}w45${person.profile_path}`} alt={person.name} loading="lazy" />
              : <User size={16} />}
          </div>
          <div className="ns-person-info">
            <span className="ns-person-name">{person.name}</span>
            <span className="ns-person-dept">
              {person.department}
              {person.topMovies.length > 0 && ` · ${person.topMovies.slice(0, 2).join(', ')}`}
            </span>
          </div>
          <span className="ns-person-badge">Director</span>
        </button>
      )}

      {/* Movie results */}
      {!showTrending && results.map((movie, i) => {
        const idx = movieStartIdx + i;
        return (
          <button
            key={movie.id}
            className={`ns-movie-row${activeIdx === idx ? ' ns-active' : ''}`}
            style={{ '--ns-delay': `${(i + (person ? 1 : 0)) * 32}ms` }}
            onMouseDown={() => onSelect(movie.id, movie.title)}
            role="option"
          >
            <div className="ns-poster">
              {movie.poster_path
                ? <img src={`${IMG_BASE}w92${movie.poster_path}`} alt={movie.title} loading="lazy" />
                : <div className="ns-poster-placeholder"><Clapperboard size={15} /></div>}
            </div>
            <div className="ns-movie-info">
              <span className="ns-movie-title">{movie.title}</span>
              <span className="ns-movie-meta">
                {movie.year && <span>{movie.year}</span>}
                {movie.genres?.length > 0 && <><span className="ns-dot">·</span><span>{movie.genres.slice(0, 2).join(' / ')}</span></>}
              </span>
            </div>
            {movie.vote_average > 0 && (
              <div className="ns-rating">
                <Star size={10} fill="currentColor" strokeWidth={0} />
                {movie.vote_average.toFixed(1)}
              </div>
            )}
          </button>
        );
      })}

      {/* No results message */}
      {!showTrending && results.length === 0 && !person && query.length > 1 && (
        <div className="ns-empty">
          <Search size={18} />
          <span>No results for <em>"{query}"</em></span>
        </div>
      )}

      {/* Footer hint */}
      {!showTrending && (results.length > 0 || person) && (
        <div className="ns-footer">
          Press <kbd>Enter</kbd> to see all results
        </div>
      )}
    </div>
  );
};

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setMobileMenu]   = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [dropdownData, setDropdownData]     = useState({ movies: [], person: null, correctedQuery: null });
  const [trending, setTrending]             = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isFetching, setIsFetching]         = useState(false);
  const [activeIdx, setActiveIdx]           = useState(-1);
  const [isFocused, setIsFocused]           = useState(false);

  const searchRef  = useRef(null);
  const inputRef   = useRef(null);
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQ = searchParams.get('q') || '';
  const [submittedQuery, setSubmittedQuery] = useState(urlQ.trim());
  const [prevUrlQ, setPrevUrlQ]             = useState(urlQ);

  // Sync input with URL without cascading render in effect
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setSearchQuery(urlQ);
    setSubmittedQuery(urlQ.trim());
    setDropdownVisible(false);
    setIsFocused(false);
  }

  const debouncedQuery = useDebounce(searchQuery, 190);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pre-fetch trending on mount (shown when focused but empty)
  useEffect(() => {
    tmdb.getTrending('week', 1).then(data => {
      if (data?.results) setTrending(data.results.slice(0, 6));
    }).catch(() => {});
  }, []);

  // Live search: only appears when user is actively searching
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q || q.length < 2 || !isFocused || q === submittedQuery) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setIsFetching(true);
    }, 0);

    tmdb.searchBarLive(q).then(data => {
      clearTimeout(timer);
      if (!cancelled) {
        setDropdownData(data || { movies: [], person: null, correctedQuery: null });
        if (isFocused && q !== submittedQuery) {
          setDropdownVisible(true);
        } else {
          setDropdownVisible(false);
        }
        setIsFetching(false);
      }
    }).catch(() => {
      clearTimeout(timer);
      if (!cancelled) setIsFetching(false);
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [debouncedQuery, isFocused, submittedQuery]);

  // Click outside → close
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownVisible(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const totalItems = (() => {
    if (!searchQuery.trim() && trending.length) return trending.length;
    return (dropdownData.person ? 1 : 0) + dropdownData.movies.length;
  })();

  const handleKeyDown = (e) => {
    if (!dropdownVisible) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      if (!searchQuery.trim() && trending.length) {
        const m = trending[activeIdx];
        if (m) handleMovieSelect(m.id, m.title);
      } else {
        const hasPerson = !!dropdownData.person;
        if (hasPerson && activeIdx === 0) {
          handleDirectorSelect(dropdownData.person.id, dropdownData.person.name);
        } else {
          const mIdx = hasPerson ? activeIdx - 1 : activeIdx;
          const m = dropdownData.movies[mIdx];
          if (m) handleMovieSelect(m.id, m.title);
        }
      }
    } else if (e.key === 'Escape') {
      setDropdownVisible(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setSubmittedQuery(q);
      setDropdownVisible(false);
      setIsFocused(false);
      clearDiscoverCache();
      navigate(`/discover?q=${encodeURIComponent(q)}`);
      setMobileMenu(false);
      inputRef.current?.blur();
    }
  };

  const handleMovieSelect = useCallback((id, title) => {
    setSubmittedQuery(title);
    setDropdownVisible(false);
    setIsFocused(false);
    setSearchQuery(title);
    navigate(`/movie/${id}`);
    setMobileMenu(false);
    inputRef.current?.blur();
  }, [navigate]);

  const handleDirectorSelect = useCallback((id, name) => {
    setSubmittedQuery(name);
    setDropdownVisible(false);
    setIsFocused(false);
    setSearchQuery(name);
    navigate(`/director/${id}`);
    setMobileMenu(false);
    inputRef.current?.blur();
  }, [navigate]);

  const handleGenreBrowse = useCallback((genre) => {
    setSubmittedQuery(genre);
    setDropdownVisible(false);
    setIsFocused(false);
    setSearchQuery('');
    clearDiscoverCache();
    navigate(`/discover?genre=${encodeURIComponent(genre)}`);
    setMobileMenu(false);
    inputRef.current?.blur();
  }, [navigate]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenu(false)}>
          <Clapperboard className="logo-icon" />
          <span>Cinematix</span>
        </Link>

        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
          <Link to="/tonights-pick" className="nav-accent-link" onClick={() => setMobileMenu(false)}>
            <span className="accent-glow"></span>
            <span className="nav-tonight-desktop">Tonight's Pick</span>
            <span className="nav-tonight-mobile">Tonight</span>
          </Link>
          <Link to="/movie-dna" className="nav-dna-link" onClick={() => setMobileMenu(false)}>
            <span className="nav-dna-dot"></span>
            Movie DNA
          </Link>
          <Link to="/discover" onClick={() => { clearDiscoverCache(); setMobileMenu(false); }}>Discover</Link>
          <Link to="/watchlist" onClick={() => setMobileMenu(false)}>Watchlist</Link>

          {/* ── Search ── */}
          <div className={`ns-wrap ${isFocused ? 'ns-focused' : ''}`} ref={searchRef}>
            <form
              className={`navbar-search${isFetching ? ' ns-loading' : ''}`}
              onSubmit={handleSearch}
              role="search"
            >
              <Search className="search-icon" size={17} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                autoComplete="off"
                spellCheck="false"
                onChange={(e) => {
                  setSubmittedQuery('');
                  setSearchQuery(e.target.value);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  const q = searchQuery.trim();
                  if (!q && trending.length > 0) {
                    setDropdownVisible(true);
                  } else if (q.length >= 2 && q !== submittedQuery) {
                    setDropdownVisible(true);
                  }
                }}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="ns-clear-btn"
                  aria-label="Clear search"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSubmittedQuery('');
                    setSearchQuery('');
                    setDropdownData({ movies: [], person: null, correctedQuery: null });
                    setActiveIdx(-1);
                    if (trending.length > 0) {
                      setDropdownVisible(true);
                    } else {
                      setDropdownVisible(false);
                    }
                    inputRef.current?.focus();
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </form>

            <LiveSearchDropdown
              results={dropdownData.movies}
              person={dropdownData.person}
              correctedQuery={dropdownData.correctedQuery}
              query={searchQuery}
              trending={trending}
              onSelect={handleMovieSelect}
              onDirectorClick={handleDirectorSelect}
              onGenreBrowse={handleGenreBrowse}
              activeIdx={activeIdx}
              visible={dropdownVisible}
            />
          </div>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
