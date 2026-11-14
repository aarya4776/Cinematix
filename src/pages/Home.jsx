import { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import MovieRow from '../components/MovieRow';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

// In-memory module-level cache: persists during SPA navigation but resets on full page refresh
let cachedHeroMovie = null;

const Home = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [hiddenGemsMovies, setHiddenGemsMovies] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Generate random start page between 1 and 4 for Hidden Gems
        const randomStartPage = Math.floor(Math.random() * 4) + 1;

        const results = await Promise.allSettled([
          tmdb.getTrending('day'),
          tmdb.getTrending('week', 1),
          tmdb.getTrending('week', 2),
          tmdb.getPopular(1),
          tmdb.getPopular(2),
          tmdb.getTopRated(1),
          tmdb.getTopRated(2),
          tmdb.getHiddenGems(randomStartPage),
          tmdb.getHiddenGems(randomStartPage + 1)
        ]);

        const safeData = results.map(r => r.status === 'fulfilled' ? r.value : null);
        const [
          heroData,
          trendingP1, trendingP2,
          popularP1, popularP2,
          topRatedP1, topRatedP2,
          hiddenGemsP1, hiddenGemsP2
        ] = safeData;

        const seenIds = new Set();

        // 1. Build a deep candidates pool (80+ potential entries before filtering)
        const rawCandidates = [
          ...(heroData?.results || []),
          ...(trendingP1?.results || []),
          ...(trendingP2?.results || []),
          ...(popularP1?.results || []),
          ...(popularP2?.results || [])
        ];

        // Deduplicate raw candidates by ID
        const candidatesMap = new Map();
        rawCandidates.forEach(movie => {
          if (movie && movie.id) {
            candidatesMap.set(movie.id, movie);
          }
        });
        const uniqueCandidates = Array.from(candidatesMap.values());

        // Apply strict curation filters: high backdrop quality, overview length, high popularity, acclaim
        let curatedCandidates = uniqueCandidates.filter(movie => {
          return (
            movie.backdrop_path &&
            movie.overview &&
            movie.overview.length >= 85 &&
            movie.vote_average >= 7.0 &&
            movie.popularity >= 100
          );
        });

        // Fallback curation tiers to ensure we always have healthy selections under dynamic data
        if (curatedCandidates.length < 5) {
          curatedCandidates = uniqueCandidates.filter(movie => {
            return (
              movie.backdrop_path &&
              movie.overview &&
              movie.overview.length >= 70 &&
              movie.vote_average >= 6.5 &&
              movie.popularity >= 70
            );
          });
        }
        if (curatedCandidates.length < 3) {
          curatedCandidates = uniqueCandidates.filter(movie => {
            return (
              movie.backdrop_path &&
              movie.overview &&
              movie.overview.length >= 50
            );
          });
        }

        let selectedHero = null;

        // Session-stable hero selection (in-memory, resets on hard refresh)
        if (curatedCandidates.length > 0) {
          if (cachedHeroMovie) {
            // Ensure the cached hero is still in the curated pool (extra safety)
            const foundCached = curatedCandidates.find(movie => String(movie.id) === String(cachedHeroMovie.id));
            if (foundCached) {
              selectedHero = foundCached;
            }
          }

          if (!selectedHero) {
            // Pick a random, high-quality candidate from the pool
            const randomIndex = Math.floor(Math.random() * curatedCandidates.length);
            selectedHero = curatedCandidates[randomIndex];
            if (selectedHero) {
              cachedHeroMovie = selectedHero;
            }
          }
        }

        // Final fallback if pool is empty
        if (!selectedHero && uniqueCandidates.length > 0) {
          selectedHero = uniqueCandidates[0];
        }

        if (selectedHero) {
          setHeroMovie(selectedHero);
          seenIds.add(selectedHero.id);
        }

        // Helper to merge pages, deduplicate sequentially, and slice to 20-25 items
        const processCategory = (page1, page2, maxItems = 25, extraFilter = null) => {
          const combined = [
            ...(page1?.results || []),
            ...(page2?.results || [])
          ];

          const filtered = combined.filter(movie => {
            if (!movie.id || seenIds.has(movie.id)) return false;
            if (extraFilter && !extraFilter(movie)) return false;
            seenIds.add(movie.id);
            return true;
          });

          return filtered.slice(0, maxItems);
        };

        // 2. Process rows sequentially to avoid duplicate movies across sections
        const cleanTrending = processCategory(trendingP1, trendingP2);
        const cleanPopular = processCategory(popularP1, popularP2);
        const cleanTopRated = processCategory(topRatedP1, topRatedP2);
        const cleanHiddenGems = processCategory(hiddenGemsP1, hiddenGemsP2, 25, (movie) => {
          const votes = movie.vote_count || 0;
          const pop = movie.popularity || 0;
          const rating = movie.vote_average || 0;
          return votes <= 3500 && pop <= 70 && rating >= 7.4;
        });

        setTrendingMovies(cleanTrending);
        setPopularMovies(cleanPopular);
        setTopRatedMovies(cleanTopRated);
        setHiddenGemsMovies(cleanHiddenGems);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      {heroMovie && (
        <div className="hero-banner">
          <div className="hero-backdrop" style={{ backgroundImage: `url(${tmdb.getOriginalImageUrl(heroMovie.backdrop_path)})` }}>
            <div className="hero-vignette"></div>
          </div>
          <div className="hero-content container">
            <div className="hero-genres">
              {heroMovie.genre_ids?.slice(0, 3).map(id => {
                const name = tmdb.getGenreNameById(id);
                if (!name) return null;
                const slug = name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link key={id} to={`/discover?genre=${slug}`} className="hero-genre-tag">
                    {name}
                  </Link>
                );
              })}
            </div>
            <h1 className="hero-title">{heroMovie.title}</h1>
            <p className="hero-overview">{heroMovie.overview}</p>
            <div className="hero-actions">
              <Link to={`/movie/${heroMovie.id}`} className="btn-primary">
                <Play fill="currentColor" size={20} /> Watch Clip
              </Link>
              <Link to={`/movie/${heroMovie.id}`} className="btn-secondary">
                <Info size={20} /> More Info
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Movie Rows */}
      <div className="rows-wrapper">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Popular" movies={popularMovies} />
        <MovieRow title="Top Rated" movies={topRatedMovies} />
        <MovieRow 
          title="Hidden Gems" 
          subtitle="Critically loved films beyond the mainstream." 
          movies={hiddenGemsMovies} 
        />
      </div>
    </div>
  );
};

export default Home;
