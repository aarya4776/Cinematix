import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Eye, Compass } from 'lucide-react';
import { tmdb } from '../services/tmdb';
import {
  getDirectorProfile,
  inferLanguageFromFilmography,
  trackSeen,
} from '../services/directorEngine';
import MovieRow from '../components/MovieRow';
import './DirectorUniverse.css';

const FILMOGRAPHY_TITLES = [
  "Complete Filmography",
  "Full Cinematic Archive",
  "The Complete Works",
  "Every Feature Film",
  "Chronological Filmography",
  "The Director’s Archive"
];

const DirectorUniverse = () => {
  const { id } = useParams();
  
  // ─── 1. CORE STATE DECLARATIONS ──────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [director, setDirector] = useState(null);
  const [essentialFilms, setEssentialFilms] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [completeFilmography, setCompleteFilmography] = useState([]);

  const filmographyTitle = useMemo(() => {
    if (!id) return "Complete Filmography";
    const num = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return FILMOGRAPHY_TITLES[num % FILMOGRAPHY_TITLES.length];
  }, [id]);

  // ─── COMBINED MOVIE + TV DIRECTING CREDITS ─────────────────────────────────
  // Fetches BOTH film and TV directing credits from TMDB combined_credits.
  // Performs high-accuracy filtering, validation, and strict deduplication.
  const fetchFullFilmography = async (directorId) => {
    try {
      const combined = await tmdb.getDirectorCombinedCredits(directorId);
      if (!combined) {
        console.warn('[DirectorUniverse] combined_credits returned null.');
        return [];
      }

      const crewList = Array.isArray(combined.crew) ? combined.crew : [];

      // Helper to check if a job title represents a genuine, primary director role
      const isGenuineDirector = (job) => {
        if (!job) return false;
        const j = job.toLowerCase().trim();
        
        // Must contain 'director'
        if (!j.includes('director')) return false;

        // Strict exclusions for assistant, unit, art, creative, etc.
        const excludedSubwords = [
          'assistant', 'associate', 'second unit', '2nd unit', 'third unit', '3rd unit',
          'art', 'casting', 'photography', 'photo', 'technical', 'stage', 
          'musical', 'music', 'video', 'creative', 'adviser', 'advisor', 
          'consultant', 'advisory', 'additional', 'utility', 'lighting', 
          'effects', 'dubbing', 'voice', 'dialogue', 'action director', 
          'choreo', 'stunt', 'wardrobe', 'production', 'post-production',
          'executive', 'technical director', 'animation director' // usually supervisor level
        ];
        
        return !excludedSubwords.some(word => j.includes(word));
      };

      // Helper to filter out promotional / behind-the-scenes / making-of featurettes
      const isPromotionalOrBehindTheScenes = (title) => {
        if (!title) return false;
        const t = title.toLowerCase();
        const promoKeywords = [
          'making of', 'behind the scenes', 'bonus feature', 'deleted scenes',
          'retrospective', 'tribute', 'extra features', 'promo', 'trailer',
          'interview', 'press conference', 'featurette', 'teaser', 'sneak peek'
        ];
        return promoKeywords.some(keyword => t.includes(keyword));
      };

      // 1. First Pass: Strict Directing Filter & Basic Validation
      const rawDirected = crewList.filter(c => {
        if (!c || !c.id) return false;
        
        // Strictly require genuine director job
        if (!isGenuineDirector(c.job)) return false;

        // Require valid title/name
        const title = c.title || c.name || '';
        if (!title.trim() || title.toLowerCase() === 'untitled') return false;

        // Filter out promotional/BTS materials
        if (isPromotionalOrBehindTheScenes(title)) return false;

        // Exclude adult titles
        if (c.adult) return false;

        return true;
      });

      // 2. Second Pass: Deduplication by ID & Title+Year Match
      const deduplicated = [];
      const seenIds = new Set();
      const seenTitles = new Map(); // normalizedTitle -> { year, id }

      const normalizeTitle = (title) => {
        if (!title) return '';
        return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      };

      // Sort by metadata quality first, so that the best version of duplicate titles is preserved
      const candidates = rawDirected.map(item => {
        const mediaType = item.media_type || 'movie';
        const dateStr = item.release_date || item.first_air_date || '';
        const year = dateStr ? parseInt(dateStr.substring(0, 4), 10) : 0;
        const title = item.title || item.name || '';
        const normalizedTitle = normalizeTitle(title);
        
        // Calculate quality score
        let quality = 0;
        if (item.poster_path) quality += 10;
        if (item.backdrop_path) quality += 5;
        if (item.overview && item.overview.length > 50) quality += 5;
        if (item.vote_count) quality += Math.min(item.vote_count / 100, 10);
        if (item.popularity) quality += Math.min(item.popularity, 5);

        return {
          ...item,
          media_type: mediaType,
          _normalizedDate: dateStr,
          _year: year,
          _title: title,
          _normalizedTitle: normalizedTitle,
          _quality: quality
        };
      }).sort((a, b) => b._quality - a._quality);

      candidates.forEach(item => {
        // Strict ID deduplication
        if (seenIds.has(item.id)) return;

        // Title + Year deduplication (prevent duplicate entries with same/similar title within 1 year)
        if (item._normalizedTitle) {
          const match = seenTitles.get(item._normalizedTitle);
          if (match) {
            const yearDiff = Math.abs(item._year - match.year);
            if (yearDiff <= 1) {
              return;
            }
          } else {
            seenTitles.set(item._normalizedTitle, {
              year: item._year,
              id: item.id
            });
          }
        }

        seenIds.add(item.id);
        deduplicated.push(item);
      });

      // 3. Third Pass: TV Episode & Anthology segment filtering
      const finalFilmography = deduplicated.filter(item => {
        if (item.media_type === 'tv') return true;

        // Check if this movie entry is actually just a TV episode masquerading as a movie
        const titleLower = item._title.toLowerCase();
        const hasEpisodeIndicator = titleLower.includes('episode') || 
                                    titleLower.includes('season') || 
                                    (titleLower.includes('part') && /\d/.test(titleLower)) || 
                                    (titleLower.includes('vol') && /\d/.test(titleLower));
        
        if (hasEpisodeIndicator) {
          // Check if we have the parent TV show or another main title that covers this
          const words = item._normalizedTitle.split(' ');
          const firstThreeWords = words.slice(0, 3).join(' ');
          
          const hasParentShow = deduplicated.some(other => {
            if (other.id === item.id) return false;
            return other.media_type === 'tv' && normalizeTitle(other._title).includes(firstThreeWords);
          });

          if (hasParentShow) {
            return false;
          }
        }

        return true;
      });

      // Sort chronologically oldest → newest. Undated items (year === 0) go to the end
      const sorted = finalFilmography.sort((a, b) => {
        if (a._year === 0 && b._year === 0) return 0;
        if (a._year === 0) return 1;
        if (b._year === 0) return -1;
        
        if (a._normalizedDate !== b._normalizedDate) {
          return a._normalizedDate.localeCompare(b._normalizedDate);
        }
        return a._title.localeCompare(b._title);
      });

      return sorted;
    } catch (e) {
      console.error('[DirectorUniverse] Failed to fetch full filmography:', e);
      return [];
    }
  };

  // ─── CONTENT TYPE CLASSIFICATION ───────────────────────────────────────────
  // Returns one of: 'Documentary' | 'Short' | 'TV' | 'Film'
  const getContentTypeTag = (item) => {
    if (!item) return 'Film';
    if (item.media_type === 'tv') return 'TV';
    const genres = Array.isArray(item.genre_ids) ? item.genre_ids : [];
    if (genres.includes(99)) return 'Documentary';
    // Runtime heuristic: TMDB sometimes includes runtime on crew credits
    if (item.runtime && item.runtime < 40) return 'Short';
    return 'Film';
  };

  // ─── PORTRAIT FALLBACK RESOLVER ─────────────────────────────────────────────
  // Checks TMDB main profile → alternate profiles → null (triggers initials fallback)
  const resolvePortraitUrl = (directorData) => {
    if (!directorData) return null;
    // 1. Primary profile image
    if (directorData.profile_path) {
      return tmdb.getImageUrl(directorData.profile_path, 'h632');
    }
    // 2. Alternate TMDB profile images (only available with append_to_response=images)
    const profiles = directorData.images?.profiles;
    if (Array.isArray(profiles) && profiles.length > 0) {
      const alt = profiles.find(p => p.file_path) || profiles[0];
      if (alt?.file_path) return tmdb.getImageUrl(alt.file_path, 'h632');
    }
    // 3. null → component renders initials fallback
    return null;
  };

  // Load full combined filmography independently after director details are confirmed
  useEffect(() => {
    if (!director) return;
    let isCurrent = true;
    (async () => {
      const films = await fetchFullFilmography(id);
      if (isCurrent) {
        setCompleteFilmography(films);
      }
    })();
    return () => { isCurrent = false; };
  }, [director, id]);

  // ─── 2. DECOUPLED FETCH & RESOLUTION WITH TRY/CATCH ───────────────────────────
  useEffect(() => {
    let isMounted = true;
    
    const fetchUniverse = async () => {
      setLoading(true);
      setError(false);

      // ── MODULE 1: Primary Fetch (Details, Movies, Gems) ──────────────────
      let directorData = null;
      let directedMovies = [];
      let directorHiddenGems = [];

      try {
        const [detailsRes, moviesRes, hiddenGemsRes] = await Promise.allSettled([
          tmdb.getDirectorDetails(id),
          tmdb.getDirectorMovies(id),
          tmdb.getDirectorHiddenGems(id),
        ]);

        directorData = detailsRes.status === 'fulfilled' ? detailsRes.value : null;
        directedMovies = moviesRes.status === 'fulfilled' ? moviesRes.value : [];
        directorHiddenGems = hiddenGemsRes.status === 'fulfilled' ? hiddenGemsRes.value : [];
      } catch (err) {
        console.error('[DirectorUniverse] Critical error in primary fetch module:', err);
      }

      if (!isMounted) return;

      // Fail-safe exit: If we can't get the director details, we cannot render the page
      if (!directorData) {
        console.error('[DirectorUniverse] Missing core director details. Redirecting to error view.');
        setError(true);
        setLoading(false);
        return;
      }

      setDirector(directorData);
      
      const safeMoviesList = Array.isArray(directedMovies) ? directedMovies : [];
      const safeGemsList = Array.isArray(directorHiddenGems) ? directorHiddenGems : [];

      setEssentialFilms(safeMoviesList.slice(0, 8));
      setHiddenGems(safeGemsList.slice(0, 8));

      // ── MODULE 2: Profile & DNA Parsing (Independent Failures) ───────────
      let curatedProfile;
      try {
        const detectedLang = inferLanguageFromFilmography(safeMoviesList, 'en');

        // Collect production countries for fallback profile accuracy
        const countryCounts = {};
        safeMoviesList.forEach(m => {
          if (m && Array.isArray(m.production_countries)) {
            m.production_countries.forEach(c => {
              if (c && c.iso_3166_1) {
                countryCounts[c.iso_3166_1] = (countryCounts[c.iso_3166_1] || 0) + 1;
              }
            });
          }
        });
        const productionCountries = Object.entries(countryCounts).map(([code, count]) => ({ code, count }));

        curatedProfile = getDirectorProfile(
          directorData.name,
          safeMoviesList,
          detectedLang,
          productionCountries
        );
      } catch (err) {
        console.error('[DirectorUniverse] Non-fatal error computing profile DNA:', err);
        // Resilient fallback profile
        curatedProfile = {
          id: id,
          name: directorData.name,
          language: 'en',
          ecosystem: 'english',
          ecosystemLabel: 'World Cinema',
          themes: ['Cinematic Expression'],
          identity: 'Auteur Filmmaker',
          signatureStyle: 'A distinguished cinematic voice.',
          atmosphere: { 
            accent: '#e50914', 
            glow: 'rgba(229,9,20,0.2)', 
            wash: 'rgba(69,20,24,0.68)', 
            mist: 'rgba(255,255,255,0.08)' 
          },
          dna: { topGenres: [], totalFilms: safeMoviesList.length }
        };
      }

      setProfile(curatedProfile);
      setLoading(false);

      // Track current director in session seen lists
      try {
        trackSeen(id);
      } catch (e) {
        console.error('[DirectorUniverse] Non-fatal trackSeen error:', e);
      }

      if (!isMounted) return;
    };

    fetchUniverse();
    window.scrollTo(0, 0);
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="director-loading container">
        <h2>Opening the filmmaker's artistic world…</h2>
      </div>
    );
  }

  // ─── 3. RELAX ERROR MOUNT AND INJECT SAFE PROFILE FALLBACK ─────────────────────
  if (error || !director) {
    return (
      <div className="director-error container">
        <h2>Cinematic archive unavailable.</h2>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  const safeProfile = profile || {
    name: director?.name || 'Unknown Filmmaker',
    language: 'en',
    ecosystemLabel: 'World Cinema',
    signatureStyle: 'A celebrated cinematic voice.',
    themes: ['Directing', 'Cinema'],
    atmosphere: { 
      accent: '#e50914', 
      glow: 'rgba(229,9,20,0.2)', 
      wash: 'rgba(69,20,24,0.68)', 
      mist: 'rgba(255,255,255,0.08)' 
    }
  };

  const safeEssentialFilms = Array.isArray(essentialFilms) ? essentialFilms : [];
  const safeHiddenGems = Array.isArray(hiddenGems) ? hiddenGems : [];

  const heroMovie = safeEssentialFilms.find(m => m && m.backdrop_path) || safeHiddenGems.find(m => m && m.backdrop_path);
  const portraitUrl = resolvePortraitUrl(director);
  const backdropUrl = heroMovie ? tmdb.getOriginalImageUrl(heroMovie.backdrop_path) : null;

  const mostAccessibleMovie = [...safeEssentialFilms].sort((a, b) => {
    const va = a && typeof a.vote_average === 'number' ? a.vote_average : 0;
    const vb = b && typeof b.vote_average === 'number' ? b.vote_average : 0;
    return vb - va;
  })[0];
  
  const hiddenGemMovie = safeHiddenGems[0];

  // Build Identity Chips from Profile Data (Tone, Pacing, Style)
  const isLowConfidence = (safeProfile.confidence !== undefined && safeProfile.confidence < 0.5);
  const identityChips = [
    ...[...(safeProfile.visualStyle || [])].slice(0, 2),
    safeProfile.tone ? safeProfile.tone.replace(/-/g, ' ') : null,
    !isLowConfidence && safeProfile.pacing ? (safeProfile.pacing + ' pacing') : null,
    !isLowConfidence && safeProfile.movement && safeProfile.movement !== 'contemporary' ? safeProfile.movement.replace(/-/g, ' ') : null,
  ].filter(Boolean).slice(0, 4);

  // Director initials for portrait fallback
  const directorInitials = director?.name
    ? director.name.split(' ').map(w => w ? w[0] : '').join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      className="director-universe-page"
      style={{
        '--director-accent': safeProfile.atmosphere?.accent || '#e50914',
        '--director-glow':   safeProfile.atmosphere?.glow   || 'rgba(229,9,20,0.2)',
        '--director-wash':   safeProfile.atmosphere?.wash   || 'rgba(69,20,24,0.68)',
        '--director-mist':   safeProfile.atmosphere?.mist   || 'rgba(255,255,255,0.08)',
      }}
    >
      {/* ── ATMOSPHERIC HERO ─────────────────────────── */}
      <section className="director-hero">
        {backdropUrl && (
          <div className="director-hero-backdrop" style={{ backgroundImage: `url(${backdropUrl})` }} />
        )}
        <div className="director-hero-vignette" />

        <div className="director-hero-content container">
          <Link to="/" className="director-back-link">
            <ArrowLeft size={16} /> Return to Archives
          </Link>

          <div className="director-hero-layout">
            <div className="director-hero-copy">
              <div className="director-kicker">
                <Compass size={16} /> Auteur Discovery
              </div>
              
              <h1>{director.name}</h1>
              
              <div className="director-identity-label">
                {safeProfile.identity || `${safeProfile.ecosystemLabel || 'World Cinema'} Visionary`}
              </div>
              
              <p className="director-signature">{safeProfile.signatureStyle}</p>

              <div className="director-identity-chips">
                {Array.isArray(identityChips) ? identityChips.map((chip, idx) => (
                  <span key={idx} className="director-chip">{chip}</span>
                )) : null}
              </div>
            </div>

            {/* Portrait with initials fallback so the hero never has an empty container */}
            <div className="director-portrait-container">
              {portraitUrl ? (
                <img src={portraitUrl} alt={director.name} className="director-portrait" />
              ) : (
                <div className="director-portrait-initials">
                  <span>{directorInitials}</span>
                </div>
              )}
              <div className="portrait-mask-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC TRAITS & THEMES ─────────────────── */}
      <section className="director-dna-section container">
        <div className="director-section-heading">
          <span className="director-section-kicker">Filmmaking Language</span>
          <h2>Recurring Motifs & Themes</h2>
        </div>
        <div className="director-theme-chips">
          {Array.isArray(safeProfile.themes) ? safeProfile.themes.map(theme => (
            <span key={theme} className="director-theme-chip">{theme}</span>
          )) : null}
        </div>
      </section>

      {/* ── ENTRY POINTS ─────────────────────── */}
      {safeEssentialFilms.length > 2 && (
        <section className="entry-points-section container">
           <div className="director-section-heading">
            <span className="director-section-kicker">Start Here</span>
            <h2>Entry Points to Their Cinema</h2>
          </div>
          <div className="entry-points-grid">
             {mostAccessibleMovie && (
                <Link 
                  to={`/${mostAccessibleMovie.media_type === 'tv' ? 'tv' : 'movie'}/${mostAccessibleMovie.id}`} 
                  className="entry-point-card"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="ep-backdrop" style={{backgroundImage: `url(${tmdb.getImageUrl(mostAccessibleMovie.backdrop_path, 'w780')})`}}></div>
                  <div className="ep-content">
                    <span className="ep-label"><PlayCircle size={14}/> Most Accessible</span>
                    <h4>{mostAccessibleMovie.title || mostAccessibleMovie.name}</h4>
                    <span className="ep-arrow">↗</span>
                  </div>
                </Link>
             )}
             {hiddenGemMovie && (
                <Link 
                  to={`/${hiddenGemMovie.media_type === 'tv' ? 'tv' : 'movie'}/${hiddenGemMovie.id}`} 
                  className="entry-point-card"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="ep-backdrop" style={{backgroundImage: `url(${tmdb.getImageUrl(hiddenGemMovie.backdrop_path, 'w780')})`}}></div>
                  <div className="ep-content">
                    <span className="ep-label"><Eye size={14}/> Hidden Gem</span>
                    <h4>{hiddenGemMovie.title || hiddenGemMovie.name}</h4>
                    <span className="ep-arrow">↗</span>
                  </div>
                </Link>
             )}
          </div>
        </section>
      )}

      {/* ── FILM ROWS ─────────────────────── */}
      {safeEssentialFilms.length > 0 && (
        <MovieRow
          title="Must Watch"
          subtitle="The essential, defining masterpieces that you must watch to truly understand their cinematic vision."
          movies={safeEssentialFilms}
        />
      )}
      
      {/* ── COMPLETE FILMOGRAPHY ARCHIVE ─────────────────── */}
      {(Array.isArray(completeFilmography) && completeFilmography.length > 0) && (() => {
        // Group by decade for timeline navigation
        const decadeGroups = {};
        completeFilmography.forEach(item => {
          const year = item._year || 0;
          const decade = year > 0 ? Math.floor(year / 10) * 10 : 0;
          const key = decade > 0 ? `${decade}s` : 'Undated';
          if (!decadeGroups[key]) decadeGroups[key] = [];
          decadeGroups[key].push(item);
        });
        const decadeKeys = Object.keys(decadeGroups).sort((a, b) => {
          if (a === 'Undated') return 1;
          if (b === 'Undated') return -1;
          return parseInt(a) - parseInt(b);
        });

        return (
          <section className="filmography-archive-section container">
            <div className="director-section-heading">
              <span className="director-section-kicker">Complete Archive</span>
              <h2>{filmographyTitle}</h2>
              <p className="section-context">
                Every directing credit in {director.name ? `${director.name}'s` : 'their'} cinematic body of work — film, television, and documentary.
              </p>
            </div>

            {decadeKeys.map(decade => (
              <div key={decade} className="filmography-decade-group">
                <div className="filmography-decade-label">{decade}</div>
                <div className="filmography-timeline-grid">
                  {decadeGroups[decade].map(item => {
                    const typeTag = getContentTypeTag(item);
                    const tagClass = typeTag === 'TV' ? 'tag-tv'
                      : typeTag === 'Documentary' ? 'tag-documentary'
                      : typeTag === 'Short' ? 'tag-short'
                      : '';
                    const mediaPath = item.media_type === 'tv' ? 'tv' : 'movie';
                    const posterUrl = item.poster_path ? tmdb.getImageUrl(item.poster_path, 'w342') : null;
                    const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
                    const displayYear = item._year > 0 ? item._year : null;

                    return (
                      <Link
                        key={`${item.media_type}:${item.id}`}
                        to={`/${mediaPath}/${item.id}`}
                        className="ftc-card"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <div className="ftc-poster-wrap">
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={item._title}
                              className="ftc-poster"
                              loading="lazy"
                            />
                          ) : (
                            <div className="ftc-poster-placeholder">
                              <span className="ftc-poster-placeholder-icon">🎬</span>
                            </div>
                          )}
                          {/* Content type badge */}
                          <span className={`ftc-type-tag ${tagClass}`}>{typeTag}</span>
                          {/* Hover overlay */}
                          <div className="ftc-poster-overlay" />
                          {/* Rating on hover */}
                          {rating && <span className="ftc-rating">★ {rating}</span>}
                        </div>
                        <div className="ftc-info">
                          {displayYear && <span className="ftc-year">{displayYear}</span>}
                          <span className="ftc-title">{item._title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        );
      })()}
    </div>
  );
};

export default DirectorUniverse;
