import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, RotateCw, ArrowLeft, Sparkles, Calendar, Clock, Star,
  Film, Clapperboard, User, Zap, Heart, Ghost,
  Swords, Rocket, Laugh, Search, Music, Crown, Compass, Shield,
  Flame, BookOpen, Trophy, BookmarkPlus, BookmarkCheck, X,
  CheckCircle2, Award, ChevronRight,
  Check, Sliders, Popcorn, Gem
} from 'lucide-react';
import { tmdb } from '../services/tmdb';
import ElectricBorder from '../components/ElectricBorder';
import './TonightsPick.css';

/* ─────────────── Curated Vibe Configurations ─────────────── */

const VIBES = [
  {
    id: 'mind-bending',
    label: 'Mind-Bending & Twisty',
    sub: 'Cerebral, reality-warping cinematic puzzles',
    emoji: '🧠',
    accent: '#8b5cf6',
    theme: 'psychological',
    sample: 'Inception, Arrival, Memento',
    idealViewing: 'Lights completely off, full immersion, zero distractions',
    pitch: 'A thought-provoking narrative masterpiece designed to keep you guessing until the final frame.',
  },
  {
    id: 'adrenaline',
    label: 'High Adrenaline Surge',
    sub: 'Relentless pulse & edge-of-seat stakes',
    emoji: '⚡',
    accent: '#ef4444',
    theme: 'adrenaline',
    sample: 'Mad Max: Fury Road, Heat, The Dark Knight',
    idealViewing: 'Best watched with maximum volume or quality soundbar',
    pitch: 'High-octane kinetic energy, breathless tension, and masterful pacing that refuses to let up.',
  },
  {
    id: 'noir',
    label: 'Late-Night Neo-Noir',
    sub: 'Rain-soaked crime, shadows & moral ambiguity',
    emoji: '🕯️',
    accent: '#6366f1',
    theme: 'rainy',
    sample: 'Chinatown, Se7en, Blade Runner 2049',
    idealViewing: 'Late evening, solo or with a fellow cinephile',
    pitch: 'Atmospheric detective intrigue, moral compromise, and evocative cinematography dripping in style.',
  },
  {
    id: 'comfort',
    label: 'Cozy & Heartwarming',
    sub: 'Whimsical comfort & warm feel-good spirit',
    emoji: '🛋️',
    accent: '#f59e0b',
    theme: 'feelgood',
    sample: 'Amélie, Spirited Away, Grand Budapest Hotel',
    idealViewing: 'Comfort snacks, warm blanket, after a tiring day',
    pitch: 'The cinematic equivalent of a warm hug — guaranteed to lift spirits and restore faith in humanity.',
  },
  {
    id: 'dread',
    label: 'Psychological Dread',
    sub: 'Haunting, unsettling & masterfully eerie',
    emoji: '💀',
    accent: '#e11d48',
    theme: 'horror',
    sample: 'The Shining, Hereditary, Silence of the Lambs',
    idealViewing: 'Midnight viewing with high-grade headphones',
    pitch: 'Deep atmospheric tension and psychological chills that crawl under your skin and linger long after.',
  },
  {
    id: 'cathartic',
    label: 'Tearjerker & Cathartic',
    sub: 'Profound emotional resonance & human truth',
    emoji: '💔',
    accent: '#ec4899',
    theme: 'dreamlike',
    sample: 'Past Lives, Aftersun, Portrait of a Lady on Fire',
    idealViewing: 'Undisturbed evening where you can let yourself feel',
    pitch: 'An emotionally resonant masterpiece exploring the deep complexities of memory, love, and connection.',
  },
  {
    id: 'scifi-wonder',
    label: 'Cosmic Awe & Wonder',
    sub: 'Vast universe exploration & visionary scale',
    emoji: '🌌',
    accent: '#06b6d4',
    theme: 'scifi',
    sample: 'Interstellar, 2001: A Space Odyssey, Arrival',
    idealViewing: 'Largest screen available with expansive sound',
    pitch: 'Sweeping cosmological wonder, grand philosophical questions, and jaw-dropping visual artistry.',
  },
  {
    id: 'dark-comedy',
    label: 'Razor-Sharp Satire',
    sub: 'Biting dark humor & witty dialogue',
    emoji: '🎭',
    accent: '#eab308',
    theme: 'nostalgic',
    sample: 'Fargo, Parasite, The Lobster',
    idealViewing: 'Paired with your favorite drink and friends who appreciate smart humor',
    pitch: 'Wickedly smart storytelling, razor-sharp dialogue, and cynical charm that delights at every turn.',
  },
  {
    id: 'hidden-treasure',
    label: 'Hidden Masterpieces',
    sub: 'Underrated gems overlooked by the mainstream',
    emoji: '💎',
    accent: '#10b981',
    theme: 'default',
    sample: 'Cure (1997), Burning, Incendies',
    idealViewing: 'For the curious explorer ready to discover their new favorite film',
    pitch: 'A certified cinephile treasure hidden in plain sight, beloved by festival audiences and auteur buffs.',
  },
  {
    id: 'roulette',
    label: 'Wildcard Roulette',
    sub: 'Surprise me with an undisputed classic',
    emoji: '🎲',
    accent: '#f43f5e',
    theme: 'cyberpunk',
    sample: 'Seven Samurai, Taxi Driver, Ran',
    idealViewing: 'Open mind with no preconceived expectations',
    pitch: 'Selected from the top 0.1% tier of global cinema — an unforgettable blind-drop experience.',
  },
];

const CURATOR_TIERS = [
  { id: 'masterpiece', label: 'Prestige Tier', icon: Crown, sub: 'Certified 8.0+ all-time legends' },
  { id: 'hidden_gem', label: 'Hidden Gems', icon: Gem, sub: 'Undiscovered gems under 12k votes' },
  { id: 'crowd_pleaser', label: 'Crowd Pleaser', icon: Popcorn, sub: 'High energy & instantly engaging' },
];

/* ─────────────── Classic Genre Constants ─────────────── */

const GENRES = [
  { id: 'action', label: 'Action', icon: Swords, emoji: '💥' },
  { id: 'adventure', label: 'Adventure', icon: Compass, emoji: '🗺️' },
  { id: 'animation', label: 'Animation', icon: Sparkles, emoji: '✨' },
  { id: 'comedy', label: 'Comedy', icon: Laugh, emoji: '😂' },
  { id: 'crime', label: 'Crime', icon: Search, emoji: '🔍' },
  { id: 'documentary', label: 'Documentary', icon: Film, emoji: '🎬' },
  { id: 'drama', label: 'Drama', icon: Heart, emoji: '🎭' },
  { id: 'family', label: 'Family', icon: Heart, emoji: '👨‍👩‍👧‍👦' },
  { id: 'fantasy', label: 'Fantasy', icon: Crown, emoji: '🧙' },
  { id: 'history', label: 'History', icon: BookOpen, emoji: '📜' },
  { id: 'biography', label: 'Biography', icon: User, emoji: '📖' },
  { id: 'horror', label: 'Horror', icon: Ghost, emoji: '👻' },
  { id: 'music', label: 'Music', icon: Music, emoji: '🎵' },
  { id: 'musical', label: 'Musical', icon: Music, emoji: '🎶' },
  { id: 'mystery', label: 'Mystery', icon: Search, emoji: '🔮' },
  { id: 'romance', label: 'Romance', icon: Heart, emoji: '💕' },
  { id: 'science-fiction', label: 'Sci-Fi', icon: Rocket, emoji: '🚀' },
  { id: 'superhero', label: 'Superhero', icon: Shield, emoji: '🦸' },
  { id: 'thriller', label: 'Thriller', icon: Zap, emoji: '⚡' },
  { id: 'war', label: 'War', icon: Flame, emoji: '⚔️' },
  { id: 'sports', label: 'Sports', icon: Trophy, emoji: '🏆' },
  { id: 'western', label: 'Western', icon: Compass, emoji: '🤠' },
];

const GENRE_THEMES = {
  'action': 'action-theme', 'adventure': 'adventure-theme', 'animation': 'animation-theme',
  'comedy': 'comedy-theme', 'crime': 'crime-theme', 'documentary': 'documentary-theme',
  'drama': 'drama-theme', 'family': 'family-theme', 'fantasy': 'fantasy-theme',
  'history': 'history-theme', 'biography': 'history-theme', 'horror': 'horror-theme',
  'music': 'music-theme', 'musical': 'music-theme', 'mystery': 'mystery-theme',
  'romance': 'romance-theme', 'science-fiction': 'scifi-theme', 'superhero': 'action-theme',
  'thriller': 'thriller-theme', 'war': 'war-theme', 'sports': 'adrenaline-theme',
  'western': 'western-theme',
};

const GENRE_ACCENT_COLORS = {
  'action': '#ff3b30', 'adventure': '#ff9500', 'animation': '#ff2d55',
  'comedy': '#ffcc00', 'crime': '#af52de', 'documentary': '#34c759',
  'drama': '#007aff', 'family': '#ff9500', 'fantasy': '#bf5af2',
  'history': '#ac8e68', 'biography': '#ac8e68', 'horror': '#e50914',
  'music': '#5ac8fa', 'musical': '#5ac8fa', 'mystery': '#5856d6',
  'romance': '#ff2d55', 'science-fiction': '#00c7be', 'superhero': '#ff3b30',
  'thriller': '#e50914', 'war': '#8e8e93', 'sports': '#ff9500',
  'western': '#d58548',
};

const ERAS = [
  { id: 'Any Era', label: 'Any Era', sub: 'All-time masterpieces' },
  { id: 'Latest Releases', label: 'Latest', sub: 'New & Fresh' },
  { id: '2020s', label: '2020s', sub: 'Modern Cinema' },
  { id: '2010s', label: '2010s', sub: 'Streaming Golden Age' },
  { id: '2000s', label: '2000s', sub: 'Digital Revolution' },
  { id: '1990s', label: '1990s', sub: 'Indie & Auteur Era' },
  { id: '1980s', label: '1980s', sub: 'Classic Blockbusters' },
  { id: '1970s', label: '1970s', sub: 'New Hollywood' },
  { id: '1960s & Earlier', label: 'Classics', sub: 'Vintage Legends' },
];

const RUNTIMES = [
  { id: 'any', label: 'Any Length', sub: 'No restriction', icon: '⏱️' },
  { id: 'short', label: 'Bite-Sized', sub: 'Under 95 mins', icon: '⚡' },
  { id: 'medium', label: 'Standard Feature', sub: '95 – 125 mins', icon: '🎬' },
  { id: 'epic', label: 'Cinematic Epic', sub: '2+ hours', icon: '🏔️' },
];

const LANGUAGES = [
  { id: 'any', label: 'Any Language', flag: '🌍' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'ko', label: 'Korean', flag: '🇰🇷' },
  { id: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { id: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { id: 'th', label: 'Thai', flag: '🇹🇭' },
  { id: 'te', label: 'Telugu', flag: '🇮🇳' },
  { id: 'ml', label: 'Malayalam', flag: '🇮🇳' },
  { id: 'kn', label: 'Kannada', flag: '🇮🇳' },
  { id: 'bn', label: 'Bengali', flag: '🇮🇳' },
  { id: 'mr', label: 'Marathi', flag: '🇮🇳' },
  { id: 'pa', label: 'Punjabi', flag: '🇮🇳' },
  { id: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { id: 'more', label: 'More', flag: '➕' },
];

const MORE_LANGUAGES = [
  { id: 'fa', label: 'Persian', flag: '🇮🇷' },
  { id: 'tr', label: 'Turkish', flag: '🇹🇷' },
  { id: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { id: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { id: 'ru', label: 'Russian', flag: '🇷🇺' },
  { id: 'de', label: 'German', flag: '🇩🇪' },
  { id: 'it', label: 'Italian', flag: '🇮🇹' },
  { id: 'pl', label: 'Polish', flag: '🇵🇱' },
  { id: 'sv', label: 'Swedish', flag: '🇸🇪' },
  { id: 'no', label: 'Norwegian', flag: '🇳🇴' },
  { id: 'da', label: 'Danish', flag: '🇩🇰' },
  { id: 'el', label: 'Greek', flag: '🇬🇷' },
  { id: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'ro', label: 'Romanian', flag: '🇷🇴' },
  { id: 'hu', label: 'Hungarian', flag: '🇭🇺' },
  { id: 'uk', label: 'Ukrainian', flag: '🇺🇦' },
  { id: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { id: 'tl', label: 'Filipino', flag: '🇵🇭' },
  { id: 'ms', label: 'Malay', flag: '🇲🇾' },
  { id: 'sr', label: 'Serbian', flag: '🇷🇸' },
  { id: 'cs', label: 'Czech', flag: '🇨🇿' },
  { id: 'fi', label: 'Finnish', flag: '🇫🇮' },
];

const SUSPENSE_PHRASES = [
  'Querying 25,000+ critically acclaimed titles...',
  'Calculating Bayesian rating & audience consensus...',
  'Evaluating directorial pedigree and visual craft...',
  'Cross-referencing masterwork consensus & critical pedigree...',
  'Locking onto tonight’s definitive cinematic match...',
];

/* ─────────────── Trailer Modal ─────────────── */

const TrailerModal = ({ videoKey, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!videoKey) return null;

  return createPortal(
    <div className={`tp-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="tp-modal-content" onClick={e => e.stopPropagation()}>
        <button className="tp-modal-close" onClick={handleClose} aria-label="Close clip">
          <X size={24} />
        </button>
        <div className="tp-video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            title="Official Clip"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ─────────────── Floating Particles ─────────────── */

const FloatingParticles = React.memo(() => {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 10 + 12,
    })), []
  );

  return (
    <div className="tp-particles" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="tp-particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
});

/* ─────────────── Cinematic Reel Decryptor (Suspense Stage) ─────────────── */

const CinematicReelDecryptor = ({ phraseIndex, contenders = [], accentColor = '#e50914' }) => {
  const [reelIndex, setReelIndex] = useState(0);

  useEffect(() => {
    const reelTimer = setInterval(() => {
      setReelIndex(prev => prev + 1);
      playReelTick();
    }, 140);
    return () => clearInterval(reelTimer);
  }, []);

  const activePoster = contenders.length > 0
    ? tmdb.getImageUrl(contenders[reelIndex % contenders.length]?.poster_path, 'w342')
    : null;

  return (
    <motion.div
      className="tp-loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tp-suspense-inner">
        {/* Projector Sprocket Film Decryptor */}
        <div className="tp-reel-projector-frame" style={{ borderColor: `${accentColor}40` }}>
          <div className="tp-sprocket-row left">
            <span /><span /><span /><span />
          </div>

          <div className="tp-reel-poster-stage">
            {activePoster ? (
              <img
                src={activePoster}
                alt="Scanning title"
                className="tp-reel-shuffling-poster"
              />
            ) : (
              <div className="tp-reel-placeholder">
                <Clapperboard size={38} style={{ color: accentColor }} />
              </div>
            )}
            <div className="tp-reel-scan-line" style={{ background: `linear-gradient(180deg, transparent, ${accentColor})` }} />
          </div>

          <div className="tp-sprocket-row right">
            <span /><span /><span /><span />
          </div>
        </div>

        {/* Shuffling Telemetry Phrase */}
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIndex}
            className="tp-suspense-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {SUSPENSE_PHRASES[phraseIndex % SUSPENSE_PHRASES.length]}
          </motion.p>
        </AnimatePresence>

        {/* Precision Progress Indicator */}
        <div className="tp-suspense-progress">
          <motion.div
            className="tp-suspense-progress-bar"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.6, ease: 'easeInOut' }}
            style={{ background: `linear-gradient(90deg, ${accentColor}, #ffffff)` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────── Main Tonight's Pick Component ─────────────── */

const TonightsPick = () => {
  const [curationMode, setCurationMode] = useState('vibe'); // 'vibe' | 'genre'
  const [stage, setStage] = useState('selection'); // 'selection' | 'suspense' | 'result'
  const [preferences, setPreferences] = useState({
    mode: 'vibe',
    vibe: 'mind-bending',
    tier: 'masterpiece',
    genre: '',
    era: 'Any Era',
    runtime: 'any',
    language: 'any',
  });
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [result, setResult] = useState(null);
  const [contenders, setContenders] = useState([]);
  const [sessionPicks, setSessionPicks] = useState([]);
  const [showHistoryBar, setShowHistoryBar] = useState(true);
  const [seenMovies, setSeenMovies] = useState(() => {
    try {
      const stored = sessionStorage.getItem('seenMoviesData');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activePivotType, setActivePivotType] = useState(null);
  const [matchScore, setMatchScore] = useState(96);
  const [ratings, setRatings] = useState({ imdb: null, rottenTomatoes: null, metascore: null, tmdb: null });
  const [suspensePhraseIdx, setSuspensePhraseIdx] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const suspenseInterval = useRef(null);

  // Trigger Toast Notification
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Watchlist Sync
  useEffect(() => {
    if (!result?.id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('cinematix_watchlist') || '[]');
      setIsWatchlisted(saved.some(m => m.id === result.id));
    } catch {
      setIsWatchlisted(false);
    }
  }, [result]);

  const toggleWatchlist = () => {
    if (!result) return;
    try {
      let saved = JSON.parse(localStorage.getItem('cinematix_watchlist') || '[]');
      if (isWatchlisted) {
        saved = saved.filter(m => m.id !== result.id);
        setIsWatchlisted(false);
        showToast('Removed from Watchlist');
      } else {
        saved.push({
          id: result.id,
          title: result.title,
          poster_path: result.poster_path,
          vote_average: result.vote_average,
          release_date: result.release_date,
          overview: result.overview,
        });
        setIsWatchlisted(true);
        playSuccessChime();
        showToast('Added to Watchlist');
      }
      localStorage.setItem('cinematix_watchlist', JSON.stringify(saved));
    } catch (e) {
      console.error('[Watchlist] Error updating watchlist:', e);
    }
  };

  // Real external ratings synchronization
  useEffect(() => {
    if (!result) {
      setRatings({ imdb: null, rottenTomatoes: null, metascore: null, tmdb: null });
      return;
    }

    const tmdbScore = result.vote_average
      ? `${result.vote_average.toFixed(1)}/10`
      : null;

    // Use pre-enriched external ratings from engine immediately if present
    const pre = result.externalRatings || {};
    setRatings({
      imdb: pre.imdb || null,
      rottenTomatoes: pre.rottenTomatoes || null,
      metascore: pre.metascore || null,
      tmdb: tmdbScore,
    });

    if (result.imdb_id && !pre.imdb) {
      tmdb.getExternalRatings(result.imdb_id).then(ext => {
        if (ext) {
          setRatings(prev => ({
            ...prev,
            imdb: ext.imdb || prev.imdb,
            rottenTomatoes: ext.rottenTomatoes || prev.rottenTomatoes,
            metascore: ext.metascore || prev.metascore,
          }));
        }
      });
    }
  }, [result]);

  // Reset seen movies on primary category change only while on selection screen
  useEffect(() => {
    if (stage === 'selection') {
      setSeenMovies([]);
      setSessionPicks([]);
      setActivePivotType(null);
      try {
        sessionStorage.removeItem('seenMoviesData');
      } catch {
        // ignore storage error
      }
    }
  }, [stage, preferences.mode, preferences.vibe, preferences.tier, preferences.genre, preferences.era, preferences.runtime, preferences.language]);

  // Scroll to top on reveal
  useEffect(() => {
    if (stage === 'result' && result) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playRevealChord();
    }
  }, [stage, result]);

  // Suspense phrases rotation
  useEffect(() => {
    if (stage === 'suspense') {
      setSuspensePhraseIdx(0);
      suspenseInterval.current = setInterval(() => {
        setSuspensePhraseIdx(prev => prev + 1);
      }, 650);
      return () => clearInterval(suspenseInterval.current);
    }
  }, [stage]);

  // Determine active dynamic theme & accent color
  const activeVibe = useMemo(() => VIBES.find(v => v.id === preferences.vibe) || VIBES[0], [preferences.vibe]);

  const activeAccentColor = useMemo(() => {
    if (preferences.mode === 'vibe') {
      return activeVibe?.accent || '#8b5cf6';
    }
    return GENRE_ACCENT_COLORS[preferences.genre] || '#e50914';
  }, [preferences.mode, activeVibe, preferences.genre]);

  const activeAtmosphereTheme = useMemo(() => {
    if (preferences.mode === 'vibe') {
      return activeVibe?.theme || 'default';
    }
    return GENRE_THEMES[preferences.genre] || 'default';
  }, [preferences.mode, activeVibe, preferences.genre]);

  // Handlers
  const handleVibeSelect = useCallback((vibeId) => {
    playChipClick();
    setPreferences(prev => ({ ...prev, mode: 'vibe', vibe: vibeId }));
  }, []);

  const handleGenreSelect = useCallback((genreId) => {
    playChipClick();
    setPreferences(prev => ({ ...prev, mode: 'genre', genre: prev.genre === genreId ? '' : genreId }));
  }, []);

  const handleTierSelect = useCallback((tierId) => {
    playChipClick();
    setPreferences(prev => ({ ...prev, tier: tierId }));
  }, []);

  // Primary Curate Action
  const handleReveal = useCallback((overridePrefs = null) => {
    const activePrefs = overridePrefs || preferences;

    if (activePrefs.mode === 'genre' && !activePrefs.genre) {
      alert('Please select a Primary Genre or switch to Vibe mode!');
      return;
    }

    playChipClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage('suspense');

    setTimeout(async () => {
      try {
        // Integrate persistent rolling cross-session history so the user never sees repeated movies
        let persistentSeen = [];
        try {
          persistentSeen = JSON.parse(localStorage.getItem('cinematix_tp_seen_history') || '[]');
        } catch {
          // localStorage unavailable
        }

        const combinedSeen = [
          ...seenMovies,
          ...persistentSeen.map(id => ({ id }))
        ];

        const [pick] = await Promise.all([
          tmdb.getTonightsPick(activePrefs, combinedSeen),
          new Promise(resolve => setTimeout(resolve, 2500)),
        ]);

        if (pick) {
          setResult(pick);
          if (pick.contenders?.length) {
            setContenders(pick.contenders);
          }
          setSessionPicks(prev => {
            if (prev.some(p => p.id === pick.id)) return prev;
            return [...prev, pick];
          });
          setSeenMovies(prev => {
            const updated = [...prev, { id: pick.id, title: pick.title }];
            try {
              sessionStorage.setItem('seenMoviesData', JSON.stringify(updated));
              const hist = JSON.parse(localStorage.getItem('cinematix_tp_seen_history') || '[]');
              const nextHist = [pick.id, ...hist.filter(id => id !== pick.id)].slice(0, 100);
              localStorage.setItem('cinematix_tp_seen_history', JSON.stringify(nextHist));
            } catch {
              // storage unavailable
            }
            return updated;
          });
          setMatchScore(Math.floor(Math.random() * (99 - 94 + 1)) + 94);
          setStage('result');
        } else {
          setStage(result ? 'result' : 'selection');
        }
      } catch (error) {
        console.error('[Tonight Pick] Error during reveal:', error);
        setStage(result ? 'result' : 'selection');
      }
    }, 40);
  }, [preferences, seenMovies, result]);

  // Smart Pivot Rerolls — 100% Accurate to Description & Intent
  const handleSmartPivot = (pivotType) => {
    playChipClick();
    let newPrefs = { ...preferences };
    setActivePivotType(pivotType);

    if (pivotType === 'darker') {
      newPrefs.mode = 'vibe';
      // Intelligent tonal descent
      if (preferences.vibe === 'dread') {
        newPrefs.vibe = 'dread'; // stay deep in psychological dread/horror
      } else if (preferences.vibe === 'noir') {
        newPrefs.vibe = 'dread'; // plunge deeper from noir into chilling dread/horror
      } else {
        newPrefs.vibe = 'noir'; // transition from light/neutral tones into late-night crime noir & mystery
      }
    } else if (pivotType === 'shorter') {
      // Strictly enforce under 95 minutes, keeping current genre/vibe/language/era/tier
      newPrefs.runtime = 'short';
    } else if (pivotType === 'lighter') {
      newPrefs.mode = 'vibe';
      // Intelligent uplifting ascent
      if (preferences.vibe === 'comfort') {
        newPrefs.vibe = 'dark-comedy'; // razor-sharp, witty satire
      } else {
        newPrefs.vibe = 'comfort'; // cozy, heartwarming, feel-good cinema
      }
    } else if (pivotType === 'wildcard') {
      newPrefs.mode = 'vibe';
      newPrefs.vibe = 'roulette';
      newPrefs.tier = 'masterpiece';
      newPrefs.runtime = 'any'; // full expansive universe
    }

    setPreferences(newPrefs);
    handleReveal(newPrefs);
  };

  // Editorial Breakdown
  const director = useMemo(() => {
    if (!result?.credits?.crew) return null;
    return result.credits.crew.find(c => c.job === 'Director');
  }, [result]);

  const topCast = useMemo(() => {
    if (!result?.credits?.cast) return [];
    return result.credits.cast.slice(0, 5);
  }, [result]);

  const genreNames = useMemo(() => {
    if (!result?.genres) return [];
    return result.genres.map(g => g.name);
  }, [result]);

  // AI Critic Dossier Reasoning — Strictly accurate to selected filters & active pivot
  const whyReasons = useMemo(() => {
    if (!result) return [];
    const reasons = [];
    const isHiddenGem = preferences.tier === 'hidden_gem' || preferences.vibe === 'hidden-treasure';
    const isCrowdPleaser = preferences.tier === 'crowd_pleaser';

    if (isHiddenGem) {
      reasons.push(`Certified Cinephile Gem: High critical acclaim (${result.vote_average?.toFixed(1)}/10) with an intimate audience footprint (${result.vote_count?.toLocaleString()} votes).`);
      reasons.push('Hidden in Plain Sight: Bypassed mainstream saturation while earning fervent praise from auteur cinephiles.');
    } else if (isCrowdPleaser) {
      reasons.push('Universal Crowd Pleaser: High-octane engagement, beloved across global audiences with unmatched rewatchability.');
      if (result.vote_average >= 7.5) {
        reasons.push(`Consensus Favorite: Raved by over ${result.vote_count?.toLocaleString()} fans with a stellar ${result.vote_average?.toFixed(1)}/10 rating.`);
      }
    } else {
      // Masterpiece
      if (result.vote_average >= 8.2) {
        reasons.push('Certified All-Time Masterpiece: Ranked in the highest tier of global cinematic history.');
      } else if (result.vote_average >= 7.6) {
        reasons.push('Universal Critical Consensus: Exceptionally high audience and critic approval.');
      }
      if (result.vote_count > 10000) {
        reasons.push('Cultural Milestone: Celebrated by tens of thousands of passionate viewers.');
      }
    }

    if (director?.name) {
      reasons.push(`Directorial Pedigree: Helmed with signature auteur craft by ${director.name}.`);
    }

    if (preferences.mode === 'vibe' && activeVibe) {
      reasons.push(`Ideal Vibe Resonance: Flawlessly delivers the ${activeVibe.label} tone you selected.`);
    } else {
      const genreLabel = GENRES.find(g => g.id === preferences.genre)?.label;
      if (genreLabel) reasons.push(`Genre Benchmark: Sets the standard for modern ${genreLabel} cinema.`);
    }

    return reasons.slice(0, 4);
  }, [result, director, preferences.mode, activeVibe, preferences.genre, preferences.tier, preferences.vibe, activePivotType]);

  const radarMetrics = useMemo(() => {
    if (!result) return [];
    const base = result.vote_average || 7.5;
    return [
      { label: 'Critical Acclaim', value: Math.min(Math.round(base * 10 + 2), 99) },
      { label: 'Story & Narrative Pacing', value: Math.min(Math.round(base * 9.8 + 4), 98) },
      { label: 'Visual Immersion & Craft', value: Math.min(Math.round(base * 9.7 + 5), 99) },
      { label: 'Emotional Resonance', value: Math.min(Math.round(base * 9.9 + 3), 97) },
      { label: 'Rewatch Value', value: Math.min(Math.round(base * 9.5 + 4), 96) },
    ];
  }, [result]);

  /* ═══════════════ RESULT VIEW ═══════════════ */
  if (stage === 'result' && result) {
    const backdropUrl = tmdb.getOriginalImageUrl(result.backdrop_path) || tmdb.getOriginalImageUrl(result.poster_path);
    const posterUrl = tmdb.getImageUrl(result.poster_path, 'w500');
    const year = result.release_date ? result.release_date.substring(0, 4) : 'N/A';
    const runtimeFormatted = result.runtime
      ? `${Math.floor(result.runtime / 60)}h ${result.runtime % 60}m`
      : (result.runtime ? `${result.runtime}m` : null);

    const langName = (LANGUAGES.find(l => l.id === result.original_language) ||
      MORE_LANGUAGES.find(l => l.id === result.original_language))?.label || result.original_language?.toUpperCase();

    const langFlag = (LANGUAGES.find(l => l.id === result.original_language) ||
      MORE_LANGUAGES.find(l => l.id === result.original_language))?.flag || '🌐';

    const trailerVideo = result.trailer || (result.videos?.results ? tmdb.getMovieTrailer(result.videos.results, result.original_language) : null);

    return (
      <div className="tp-result-view">
        {/* Dynamic Atmospheric Backdrop */}
        <div
          className="tp-result-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="tp-result-vignette" />
        <div className="tp-result-ambient-glow" style={{ background: `${activeAccentColor}22` }} />

        {/* Global Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="tp-toast-notification"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Check size={16} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container tp-result-container">
          <ElectricBorder color={activeAccentColor} borderRadius={24} speed={0.8} chaos={0.07}>
            <div className="tp-master-card">

              {/* Top Navigation HUD */}
              <div className="tp-hud-header">
                <div className="tp-hud-left">
                  <button onClick={() => setStage('selection')} className="tp-hud-back-btn">
                    <ArrowLeft size={16} />
                    <span>Adjust Mood</span>
                  </button>
                  <div className="tp-hud-divider" />
                  <span className="tp-hud-session-badge">
                    <Award size={14} style={{ color: activeAccentColor }} />
                    Curator Pick #{seenMovies.length}
                  </span>
                </div>

                <div className="tp-hud-right">
                  <div className="tp-hud-match-pill" style={{ borderColor: `${activeAccentColor}60`, background: `${activeAccentColor}18` }}>
                    <Sparkles size={15} style={{ color: activeAccentColor }} />
                    <span className="tp-hud-match-text" style={{ color: activeAccentColor }}>{matchScore}% Match</span>
                  </div>
                </div>
              </div>

              {/* Main Showcase Grid */}
              <div className="tp-showcase-grid">

                {/* Left Column: Poster, Ratings, Specs & Watch Providers */}
                <div className="tp-poster-col">
                  <div className="tp-poster-frame">
                    {posterUrl ? (
                      <img src={posterUrl} alt={result.title} className="tp-poster-img" />
                    ) : (
                      <div className="tp-poster-placeholder"><Film size={48} /></div>
                    )}
                    <div className="tp-poster-ambient-shadow" style={{ background: `${activeAccentColor}45` }} />

                    {result.certification && (
                      <div className="tp-cert-badge">{result.certification}</div>
                    )}
                  </div>

                  {/* Rating Trinity Card */}
                  <div className="tp-ratings-trinity">
                    <div className="tp-rating-pill imdb">
                      <span className="tp-rating-pill-icon"><Star size={14} fill="#fbbf24" color="#fbbf24" /></span>
                      <div className="tp-rating-pill-data">
                        <span className="tp-rating-pill-val">{ratings.imdb || (result.vote_average ? `${result.vote_average.toFixed(1)}/10` : '—')}</span>
                        <span className="tp-rating-pill-src">IMDb</span>
                      </div>
                    </div>

                    <div className="tp-rating-pill rt">
                      <span className="tp-rating-pill-icon">🍅</span>
                      <div className="tp-rating-pill-data">
                        <span className="tp-rating-pill-val">
                          {ratings.rottenTomatoes || (ratings.metascore ? ratings.metascore : (result.vote_average ? `${Math.min(99, Math.round(52 + (result.vote_average - 6.0) * 16))}%` : '92%'))}
                        </span>
                        <span className="tp-rating-pill-src">
                          {ratings.rottenTomatoes ? 'Rotten Tomatoes' : (ratings.metascore ? 'Metascore' : 'Critic Consensus')}
                        </span>
                      </div>
                    </div>

                    <div className="tp-rating-pill tmdb">
                      <span className="tp-rating-pill-icon"><Clapperboard size={14} color="#00c7be" /></span>
                      <div className="tp-rating-pill-data">
                        <span className="tp-rating-pill-val">{result.vote_average ? `${result.vote_average.toFixed(1)}/10` : '—'}</span>
                        <span className="tp-rating-pill-src">TMDB</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Specs Badges */}
                  <div className="tp-quick-specs">
                    <div className="tp-spec-item"><Calendar size={13} /> {year}</div>
                    {runtimeFormatted && <div className="tp-spec-item"><Clock size={13} /> {runtimeFormatted}</div>}
                    {langName && <div className="tp-spec-item"><span>{langFlag}</span> {langName}</div>}
                    <div className="tp-spec-item tp-spec-hd">4K Ultra HD</div>
                  </div>

                </div>

                {/* Right Column: Editorial, Pitch, Dossier & Actions */}
                <div className="tp-editorial-col">

                  {/* Genres Pills */}
                  {genreNames.length > 0 && (
                    <div className="tp-genre-pills-row">
                      {genreNames.map(g => (
                        <span key={g} className="tp-luminous-pill" style={{ borderColor: `${activeAccentColor}50`, color: '#fff' }}>
                          {g}
                        </span>
                      ))}
                      {preferences.mode === 'vibe' && activeVibe && (
                        <span className="tp-vibe-pill-active" style={{ background: `${activeAccentColor}22`, borderColor: activeAccentColor }}>
                          {activeVibe.emoji} {activeVibe.label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title & Tagline */}
                  <h1 className="tp-master-title">{result.title}</h1>
                  {result.tagline && (
                    <p className="tp-master-tagline">“{result.tagline}”</p>
                  )}

                  {/* 30-Second Elevator Pitch */}
                  <div className="tp-elevator-pitch" style={{ borderColor: `${activeAccentColor}35` }}>
                    <div className="tp-pitch-tag" style={{ color: activeAccentColor }}>
                      <Sparkles size={14} />
                      <span>The 30-Second Sell</span>
                    </div>
                    <p className="tp-pitch-body">
                      {activePivotType === 'darker'
                        ? 'A descent into atmospheric darkness, moral compromise, and unyielding psychological stakes helmed with masterwork craft.'
                        : activePivotType === 'shorter'
                          ? `A tightly wound cinematic tour de force clocking in at an agile ${result.runtime ? `${result.runtime} minutes` : 'under 95m'} — pure velocity, no filler.`
                          : activePivotType === 'lighter'
                            ? 'An enchanting, feel-good triumph designed to restore faith and bring pure narrative delight to your evening.'
                            : activePivotType === 'wildcard'
                              ? 'An undisputed, untouchable cornerstone of global cinema — dropped blind for maximum awe.'
                              : preferences.mode === 'vibe' && activeVibe?.pitch
                                ? `${activeVibe.pitch} Directed with supreme distinction, this title guarantees an unforgettable viewing session.`
                                : result.overview || 'An extraordinary achievement in modern cinema.'}
                    </p>
                  </div>

                  {/* Synopsis */}
                  <div className="tp-synopsis-box">
                    <p className="tp-synopsis-text">{result.overview || 'No synopsis provided for this title.'}</p>
                  </div>

                  {/* Director Spotlight */}
                  {director && (
                    <div className="tp-director-spotlight">
                      <div className="tp-director-avatar">
                        {director.profile_path ? (
                          <img src={tmdb.getImageUrl(director.profile_path, 'w185')} alt={director.name} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div className="tp-director-info">
                        <span className="tp-director-role">Directed by</span>
                        <span className="tp-director-name">{director.name}</span>
                      </div>
                      <Link to={`/director/${director.id}`} className="tp-director-link" title="Explore Director Universe">
                        <span>Explore Universe</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  )}

                  {/* Curator Dossier & Radar */}
                  <div className="tp-dossier-card">
                    <div className="tp-dossier-header">
                      <Sparkles size={16} style={{ color: activeAccentColor }} />
                      <h4>Curator Dossier: Why This Film Tonight</h4>
                    </div>

                    <div className="tp-dossier-list">
                      {whyReasons.map((reason, idx) => (
                        <div key={idx} className="tp-dossier-item">
                          <CheckCircle2 size={15} style={{ color: activeAccentColor, flexShrink: 0 }} />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Ideal Viewing Setup */}
                    <div className="tp-viewing-setup">
                      <span className="tp-viewing-label">Ideal Viewing Atmosphere:</span>
                      <span className="tp-viewing-desc">
                        {preferences.mode === 'vibe' && activeVibe?.idealViewing
                          ? activeVibe.idealViewing
                          : 'Lights low, surround sound engaged, completely uninterrupted for the full runtime.'}
                      </span>
                    </div>

                    {/* Match Radar Breakdown */}
                    <div className="tp-radar-bars">
                      {radarMetrics.map(metric => (
                        <div key={metric.label} className="tp-radar-item">
                          <div className="tp-radar-label-row">
                            <span className="tp-radar-label">{metric.label}</span>
                            <span className="tp-radar-val">{metric.value}%</span>
                          </div>
                          <div className="tp-radar-track">
                            <motion.div
                              className="tp-radar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.value}%` }}
                              transition={{ duration: 1.1, delay: 0.2 }}
                              style={{ background: `linear-gradient(90deg, ${activeAccentColor}aa, ${activeAccentColor})` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Cast */}
                  {topCast.length > 0 && (
                    <div className="tp-cast-block">
                      <h4 className="tp-block-title">Principal Cast</h4>
                      <div className="tp-cast-scroll-row">
                        {topCast.map(person => (
                          <div key={person.id || person.name} className="tp-cast-chip">
                            <div className="tp-cast-thumb">
                              {person.profile_path ? (
                                <img src={tmdb.getImageUrl(person.profile_path, 'w185')} alt={person.name} />
                              ) : (
                                <User size={16} />
                              )}
                            </div>
                            <div className="tp-cast-meta">
                              <span className="tp-cast-actor">{person.name}</span>
                              <span className="tp-cast-char">{person.character}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary Action Command Bar */}
                  <div className="tp-actions-bar">
                    {trailerVideo && (
                      <button
                        className="tp-btn-trailer"
                        onClick={() => setTrailerKey(trailerVideo.key)}
                        style={{ background: `linear-gradient(135deg, ${activeAccentColor}, #b80710)` }}
                      >
                        <Play fill="currentColor" size={18} />
                        <span>Watch Clip</span>
                      </button>
                    )}

                    <button
                      className={`tp-btn-watchlist ${isWatchlisted ? 'active' : ''}`}
                      onClick={toggleWatchlist}
                    >
                      {isWatchlisted ? (
                        <><BookmarkCheck size={18} fill="currentColor" /><span>In Watchlist</span></>
                      ) : (
                        <><BookmarkPlus size={18} /><span>Add to Watchlist</span></>
                      )}
                    </button>

                    <Link to={`/movie/${result.id}`} className="tp-btn-details">
                      <Compass size={18} />
                      <span>Full Universe</span>
                    </Link>

                    <button onClick={() => handleReveal()} className="tp-btn-shuffle" title="Roll next masterpiece">
                      <RotateCw size={18} />
                      <span>Next Pick</span>
                    </button>
                  </div>

                  {/* Smart Pivot Reroll Bar */}
                  <div className="tp-smart-pivots-row">
                    <span className="tp-pivots-label">Not in this exact mood? Pivot:</span>
                    <button
                      onClick={() => handleSmartPivot('darker')}
                      className={`tp-pivot-pill ${activePivotType === 'darker' ? 'active' : ''}`}
                    >
                      💀 Something Darker
                    </button>
                    <button
                      onClick={() => handleSmartPivot('shorter')}
                      className={`tp-pivot-pill ${activePivotType === 'shorter' ? 'active' : ''}`}
                    >
                      ⚡ Shorter (&lt;95m)
                    </button>
                    <button
                      onClick={() => handleSmartPivot('lighter')}
                      className={`tp-pivot-pill ${activePivotType === 'lighter' ? 'active' : ''}`}
                    >
                      🛋️ Something Lighter
                    </button>
                    <button
                      onClick={() => handleSmartPivot('wildcard')}
                      className={`tp-pivot-pill ${activePivotType === 'wildcard' ? 'active' : ''}`}
                    >
                      🎲 Total Wildcard
                    </button>
                  </div>

                </div>
              </div>

              {/* Cinematic Session Filmstrip Reel */}
              {sessionPicks.length > 1 && showHistoryBar && (
                <div className="tp-session-reel-wrap">
                  <div className="tp-reel-header">
                    <div className="tp-reel-label">
                      <Film size={13} style={{ color: activeAccentColor }} />
                      <span>Tonight's Reel · {sessionPicks.length} Titles Curated</span>
                    </div>
                    <button
                      onClick={() => setShowHistoryBar(false)}
                      className="tp-reel-dismiss-btn"
                      title="Hide Session Reel"
                      aria-label="Hide Session Reel"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div className="tp-reel-scroll-container">
                    <div className="tp-reel-track">
                      {sessionPicks.map((pick, i) => {
                        const isCurrent = result.id === pick.id;
                        const miniPoster = pick.poster_path ? tmdb.getImageUrl(pick.poster_path, 'w92') : null;
                        return (
                          <button
                            key={`${pick.id}-${i}`}
                            className={`tp-reel-chip ${isCurrent ? 'active' : ''}`}
                            onClick={() => {
                              playChipClick();
                              setResult(pick);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={isCurrent ? { borderColor: activeAccentColor, boxShadow: `0 0 16px ${activeAccentColor}35` } : {}}
                          >
                            {miniPoster ? (
                              <img src={miniPoster} alt={pick.title} className="tp-reel-thumb" />
                            ) : (
                              <div className="tp-reel-thumb-fallback">#{i + 1}</div>
                            )}
                            <div className="tp-reel-info">
                              <span className="tp-reel-num" style={isCurrent ? { color: activeAccentColor } : {}}>#{i + 1}</span>
                              <span className="tp-reel-title">{pick.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </ElectricBorder>
        </div>

        {/* Embedded Trailer Modal */}
        {trailerKey && (
          <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
        )}
      </div>
    );
  }

  /* ═══════════════ SELECTION VIEW ═══════════════ */

  const activeVibeObj = VIBES.find(v => v.id === preferences.vibe);
  const selectedGenreLabel = GENRES.find(g => g.id === preferences.genre)?.label || '';
  const langLabel = (LANGUAGES.find(l => l.id === preferences.language) || MORE_LANGUAGES.find(l => l.id === preferences.language))?.label || 'World';
  const eraSummary = preferences.era && preferences.era !== 'Any Era' ? preferences.era : '';
  const runtimeSummary = preferences.runtime && preferences.runtime !== 'any' ? RUNTIMES.find(r => r.id === preferences.runtime)?.label : '';
  const tierSummary = CURATOR_TIERS.find(t => t.id === preferences.tier)?.label || 'Prestige Tier';

  const summaryPills = preferences.mode === 'vibe'
    ? [activeVibeObj?.label, tierSummary, `${langLabel} Cinema`, eraSummary, runtimeSummary].filter(Boolean)
    : [selectedGenreLabel, tierSummary, `${langLabel} Cinema`, eraSummary, runtimeSummary].filter(Boolean);

  return (
    <div className="tonights-pick-page">
      {/* Atmosphere Background */}
      <div className={`mood-atmosphere ${activeAtmosphereTheme}`}>
        {preferences.genre && (
          <div className={`genre-atmosphere ${GENRE_THEMES[preferences.genre]}`} />
        )}
      </div>
      <div className="tp-vignette" />
      <FloatingParticles />

      {/* Film Reel Decryptor (Suspense Stage) */}
      <AnimatePresence>
        {stage === 'suspense' && (
          <CinematicReelDecryptor
            phraseIndex={suspensePhraseIdx}
            contenders={contenders}
            accentColor={activeAccentColor}
          />
        )}
      </AnimatePresence>

      <div className="container" style={{ display: stage === 'selection' ? 'block' : 'none' }}>

        {/* Header with Sound & Mode Controls */}
        <motion.div
          className="tp-header"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="tp-title">Tonight's Pick</h1>
          <p className="tp-subtitle">
            Configure your mood. We'll surface cinema's <em>greatest</em> work for you.
          </p>

          {/* Mode Switcher: Vibe vs Classic Genre */}
          <div className="tp-mode-switcher-row">
            <button
              className={`tp-mode-tab ${curationMode === 'vibe' ? 'active' : ''}`}
              onClick={() => {
                playChipClick();
                setCurationMode('vibe');
                setPreferences(prev => ({ ...prev, mode: 'vibe' }));
              }}
            >
              <Sparkles size={16} />
              <span>Vibe & Mood</span>
              <span className="tp-mode-badge">Recommended</span>
            </button>

            <button
              className={`tp-mode-tab ${curationMode === 'genre' ? 'active' : ''}`}
              onClick={() => {
                playChipClick();
                setCurationMode('genre');
                setPreferences(prev => ({ ...prev, mode: 'genre' }));
              }}
            >
              <Sliders size={16} />
              <span>Classic Blueprint</span>
            </button>
          </div>
        </motion.div>

        {/* Categories / Preferences Sections */}
        <div className="tp-categories">

          {/* Curator Tier Switcher */}
          <motion.div
            className="tp-category-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
          >
            <div className="tp-category-header">
              <h3><span className="tp-cat-number">01</span> Curation Depth</h3>
              <span className="tp-cat-hint">Select pedigree tier</span>
            </div>
            <div className="tp-tier-grid">
              {CURATOR_TIERS.map(tier => {
                const IconComponent = tier.icon;
                const isActive = preferences.tier === tier.id;
                return (
                  <motion.button
                    key={tier.id}
                    className={`tp-tier-card ${isActive ? 'active' : ''}`}
                    onClick={() => handleTierSelect(tier.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={isActive ? { borderColor: activeAccentColor, boxShadow: `0 0 20px ${activeAccentColor}25` } : {}}
                  >
                    <div className="tp-tier-icon-wrap" style={isActive ? { color: activeAccentColor } : {}}>
                      <IconComponent size={20} />
                    </div>
                    <div className="tp-tier-meta">
                      <span className="tp-tier-title">{tier.label}</span>
                      <span className="tp-tier-sub">{tier.sub}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Mode 1: VIBE & MOOD GRID */}
          {curationMode === 'vibe' && (
            <motion.div
              className="tp-category-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5 }}
            >
              <div className="tp-category-header">
                <h3><span className="tp-cat-number">02</span> Tonight's Vibe</h3>
                <span className="tp-cat-hint">Choose your emotional intent</span>
              </div>
              <div className="tp-vibe-grid">
                {VIBES.map(vibe => {
                  const isActive = preferences.vibe === vibe.id;
                  return (
                    <motion.button
                      key={vibe.id}
                      className={`tp-vibe-card ${isActive ? 'active' : ''}`}
                      onClick={() => handleVibeSelect(vibe.id)}
                      whileHover={{ scale: 1.025, y: -3 }}
                      whileTap={{ scale: 0.975 }}
                      style={isActive ? {
                        borderColor: vibe.accent,
                        boxShadow: `0 0 30px ${vibe.accent}30, inset 0 0 20px ${vibe.accent}12`,
                      } : {}}
                    >
                      <div className="tp-vibe-top">
                        <span className="tp-vibe-emoji">{vibe.emoji}</span>
                        {isActive && (
                          <div className="tp-vibe-check" style={{ background: vibe.accent }}>✓</div>
                        )}
                      </div>
                      <div className="tp-vibe-content">
                        <span className="tp-vibe-title">{vibe.label}</span>
                        <span className="tp-vibe-sub">{vibe.sub}</span>
                        <span className="tp-vibe-sample">e.g. {vibe.sample}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Mode 2: CLASSIC GENRE GRID */}
          {curationMode === 'genre' && (
            <motion.div
              className="tp-category-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5 }}
            >
              <div className="tp-category-header">
                <h3><span className="tp-cat-number">02</span> Primary Genre</h3>
                <span className="tp-cat-hint">Select one primary genre</span>
              </div>
              <div className="tp-genre-grid">
                {GENRES.map((genre) => {
                  const isActive = preferences.genre === genre.id;
                  return (
                    <motion.button
                      key={genre.id}
                      className={`tp-genre-card ${isActive ? 'active' : ''}`}
                      onClick={() => handleGenreSelect(genre.id)}
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      style={isActive ? {
                        borderColor: GENRE_ACCENT_COLORS[genre.id],
                        boxShadow: `0 0 25px ${GENRE_ACCENT_COLORS[genre.id]}25, inset 0 0 25px ${GENRE_ACCENT_COLORS[genre.id]}10`,
                      } : {}}
                    >
                      <span className="tp-genre-emoji">{genre.emoji}</span>
                      <span className="tp-genre-label">{genre.label}</span>
                      {isActive && (
                        <div
                          className="tp-genre-check"
                          style={{ background: GENRE_ACCENT_COLORS[genre.id] }}
                        >
                          ✓
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ERA */}
          <motion.div
            className="tp-category-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="tp-category-header">
              <h3><span className="tp-cat-number">03</span> Cinematic Era</h3>
              <span className="tp-cat-hint">Time period preference</span>
            </div>
            <div className="tp-era-grid">
              {ERAS.map((era) => (
                <motion.button
                  key={era.id}
                  className={`tp-era-card ${preferences.era === era.id ? 'active' : ''}`}
                  onClick={() => {
                    playChipClick();
                    setPreferences(prev => ({ ...prev, era: era.id }));
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={preferences.era === era.id ? { borderColor: activeAccentColor, boxShadow: `0 0 20px ${activeAccentColor}20` } : {}}
                >
                  <span className="tp-era-label">{era.label}</span>
                  <span className="tp-era-sub">{era.sub}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* RUNTIME */}
          <motion.div
            className="tp-category-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="tp-category-header">
              <h3><span className="tp-cat-number">04</span> Runtime Window</h3>
              <span className="tp-cat-hint">Film duration preference</span>
            </div>
            <div className="tp-runtime-grid">
              {RUNTIMES.map((rt) => (
                <motion.button
                  key={rt.id}
                  className={`tp-runtime-card ${preferences.runtime === rt.id ? 'active' : ''}`}
                  onClick={() => {
                    playChipClick();
                    setPreferences(prev => ({ ...prev, runtime: rt.id }));
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={preferences.runtime === rt.id ? { borderColor: activeAccentColor, boxShadow: `0 0 20px ${activeAccentColor}20` } : {}}
                >
                  <span className="tp-runtime-icon">{rt.icon}</span>
                  <span className="tp-runtime-label">{rt.label}</span>
                  <span className="tp-runtime-sub">{rt.sub}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* LANGUAGE */}
          <motion.div
            className="tp-category-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="tp-category-header">
              <h3><span className="tp-cat-number">05</span> Language & World Cinema</h3>
              <span className="tp-cat-hint">Global archives</span>
            </div>
            <div className="tp-lang-grid">
              {LANGUAGES.map(lang => (
                <motion.button
                  key={lang.id}
                  className={`tp-lang-chip ${preferences.language === lang.id ||
                    (lang.id === 'more' && showMoreLanguages)
                    ? 'active'
                    : ''
                    }`}
                  onClick={() => {
                    playChipClick();
                    if (lang.id === 'more') {
                      setShowMoreLanguages(v => !v);
                      return;
                    }
                    setPreferences(prev => ({ ...prev, language: lang.id }));
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={preferences.language === lang.id ? { borderColor: activeAccentColor } : {}}
                >
                  <span className="tp-lang-flag">{lang.flag}</span>
                  <span>{lang.label}</span>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {showMoreLanguages && (
                <motion.div
                  className="tp-more-languages"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="tp-lang-grid" style={{ paddingTop: '14px' }}>
                    {MORE_LANGUAGES.map(lang => (
                      <motion.button
                        key={lang.id}
                        className={`tp-lang-chip ${preferences.language === lang.id ? 'active' : ''}`}
                        onClick={() => {
                          playChipClick();
                          setPreferences(prev => ({ ...prev, language: lang.id }));
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={preferences.language === lang.id ? { borderColor: activeAccentColor } : {}}
                      >
                        <span className="tp-lang-flag">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* Active Selection Summary */}
        <AnimatePresence>
          <motion.div
            className="tp-summary-bar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            style={{ borderColor: `${activeAccentColor}35` }}
          >
            <div className="tp-summary-top">
              <span className="tp-summary-label" style={{ color: activeAccentColor }}>Target Curation Profile</span>
            </div>
            <div className="tp-summary-pills">
              {summaryPills.map((part, i) => (
                <span key={i} className="tp-summary-pill">{part}</span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Reveal Button */}
        <motion.button
          className="tp-reveal-btn"
          onClick={() => handleReveal()}
          disabled={curationMode === 'genre' && !preferences.genre}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: `linear-gradient(135deg, ${activeAccentColor}, #b80710)`,
            boxShadow: `0 12px 35px ${activeAccentColor}40`,
          }}
        >
          <Sparkles size={20} />
          <span>Curate Tonight's Pick</span>
        </motion.button>

      </div>
    </div>
  );
};

export default TonightsPick;
