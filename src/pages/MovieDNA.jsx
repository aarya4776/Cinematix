import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookmarkPlus, BookmarkCheck, Check, X } from 'lucide-react';
import { DNA_BATTLES, TOTAL_BATTLES, DNA_STATUS_MESSAGES, DNA_MOVIES } from '../data/movieDnaData';
import { DNA_ARCHETYPES } from '../data/dnaArchetypes';
import { DNA_RECOMMENDATIONS } from '../data/dnaRecommendations';
import { CINEMATIC_TWINS } from '../data/cinematicTwins';
import { BLIND_SPOTS } from '../data/blindSpots';
import LiquidEther from '../components/LiquidEther';
import ElectricBorder from '../components/ElectricBorder';
import PixelSnow from '../components/PixelSnow';
import Ferrofluid from '../components/Ferrofluid';
import SoftAurora from '../components/SoftAurora';
import './MovieDNA.css';

/* ─────────────── Embedded Trailer Modal for Results ─────────────── */
const DnaTrailerModal = ({ videoKey, onClose }) => {
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
    <div className={`dna-trailer-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="dna-trailer-modal-content" onClick={e => e.stopPropagation()}>
        <button className="dna-trailer-close-btn" onClick={handleClose} aria-label="Close clip">
          <X size={22} />
        </button>
        <div className="dna-trailer-iframe-wrap">
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Analysis phase â€” rotating messages
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const COMPLETE_ANALYSIS_MSGS = [
  'Analyzing cinematic preferences...',
  'Identifying emotional patterns...',
  'Detecting storytelling bias...',
  'Mapping genre affinities...',
  'Comparing decision pathways...',
  'Evaluating narrative preferences...',
  'Analyzing visual style attraction...',
  'Measuring pacing tolerance...',
  'Building cinematic profile...',
  'Finalizing Movie DNA...',
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Spring / Easing presets
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 };
const SPRING_GENTLE = { type: 'spring', stiffness: 200, damping: 28 };
const EASE_PREMIUM  = [0.22, 1, 0.36, 1];

const wrapperVariants = {
  idle: {
    scale: 1,
    opacity: 1,
  },
  winner: {
    scale: 1.06,
    opacity: 1,
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DNA Progress Bar Component
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DnaProgressBar = ({ battleIndex, isComplete }) => {
  const pct = isComplete
    ? 100
    : Math.round((battleIndex / TOTAL_BATTLES) * 100);

  const [statusIdx, setStatusIdx] = useState(0);
  const [displayPct, setDisplayPct] = useState(pct);

  // Animate numeric percentage
  useEffect(() => {
    const target = pct;
    const start = displayPct;
    if (start === target) return;

    const duration = 700;
    const startTime = performance.now();

    const raf = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPct(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }, [pct]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rotate status messages
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      setStatusIdx(i => (i + 1) % DNA_STATUS_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isComplete]);

  const completionLabel =
    isComplete ? 'DNA Analysis Complete' :
    battleIndex === 0 ? 'Ready to analyze...' :
    `Choice ${battleIndex} logged`;

  return (
    <div className="dna-progress-section">
      <div className="dna-progress-header">
        <span className="dna-progress-label">DNA Analysis</span>
        <span className="dna-progress-percent">{displayPct}%</span>
      </div>

      <div className="dna-progress-bar-track" style={{ width: '100%', maxWidth: 680 }}>
        <motion.div
          className="dna-progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={isComplete ? 'complete' : statusIdx}
          className="dna-progress-status"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
        >
          {isComplete
            ? 'âœ¦ Analysis sequence finalized'
            : battleIndex === 0
            ? DNA_STATUS_MESSAGES[0]
            : DNA_STATUS_MESSAGES[statusIdx]}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={completionLabel}
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: isComplete ? 'rgba(164,143,255,1)' : 'rgba(255,255,255,0.92)',
            textShadow: '0 1px 6px rgba(0,0,0,0.8)',
            marginTop: '0.15rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {completionLabel}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DNA Battle Timeline Component
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DnaBattleTimeline = ({ battleIndex, winners, locked, onDotClick }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [tooltipSide, setTooltipSide] = useState('top');
  const dotRefs = useRef([]);
  const containerRef = useRef(null);

  const handleMouseEnter = (idx) => {
    if (locked) return;
    if (idx >= battleIndex) return; // only completed dots
    // Determine tooltip placement â€” flip if too close to right edge
    const dot = dotRefs.current[idx];
    const container = containerRef.current;
    if (dot && container) {
      const dotRect = dot.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const fromRight = containerRect.right - dotRect.right;
      setTooltipSide(fromRight < 140 ? 'left' : 'top');
    }
    setHoveredIdx(idx);
  };

  const handleMouseLeave = () => setHoveredIdx(null);

  const handleClick = (idx) => {
    if (locked) return;
    if (idx >= battleIndex) return; // can't jump to future
    setHoveredIdx(null);
    onDotClick(idx);
  };

  return (
    <div className="dna-timeline-wrap" ref={containerRef}>
      <div className="dna-timeline-track">
        {/* Connecting line */}
        <div className="dna-timeline-line" />
        <div
          className="dna-timeline-line-fill"
          style={{ width: `${(battleIndex / (TOTAL_BATTLES - 1)) * 100}%` }}
        />

        {/* Dots */}
        {Array.from({ length: TOTAL_BATTLES }, (_, i) => {
          const isCompleted = i < battleIndex;
          const isCurrent   = i === battleIndex;
          const winner      = winners[i];

          return (
            <div
              key={i}
              ref={el => { dotRefs.current[i] = el; }}
              className={[
                'dna-timeline-dot',
                isCompleted ? 'completed' : '',
                isCurrent   ? 'current'   : '',
                locked      ? 'locked'    : '',
              ].join(' ')}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(i)}
              aria-label={`Battle ${i + 1}${
                isCompleted && winner
                  ? `: ${DNA_BATTLES[i].a.title} vs ${DNA_BATTLES[i].b.title} â€” Selected ${winner.movie.title}`
                  : isCurrent ? ' (current)' : ' (upcoming)'
              }`}
              role={isCompleted ? 'button' : 'presentation'}
              tabIndex={isCompleted && !locked ? 0 : -1}
              onKeyDown={e => {
                if (isCompleted && !locked && (e.key === 'Enter' || e.key === ' ')) handleClick(i);
              }}
            >
              {/* Tooltip â€” only on completed dots on hover */}
              {isCompleted && hoveredIdx === i && winner && (
                <div className={`dna-timeline-tooltip tooltip-${tooltipSide}`}>
                  <div className="dna-tt-body">
                    <span className="dna-tt-number">{i + 1} / {TOTAL_BATTLES}</span>
                    <span className="dna-tt-winner">{winner.movie.title}</span>
                    <span className="dna-tt-vs">
                      {DNA_BATTLES[i].a.title} vs {DNA_BATTLES[i].b.title}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Reset Confirmation Modal
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ResetConfirmationModal = ({ targetIndex, currentIndex, onConfirm, onCancel }) => {
  const count = currentIndex - targetIndex;
  return (
    <motion.div
      className="dna-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onCancel}
    >
      <motion.div
        className="dna-modal-box"
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="dna-modal-icon">â®</div>
        <h3 className="dna-modal-title">Revisit Battle {targetIndex + 1}?</h3>
        <p className="dna-modal-body">
          Revisiting this battle will clear{' '}
          <strong>{count} subsequent {count === 1 ? 'choice' : 'choices'}</strong>{' '}
          and recalculate your Cinematic DNA. Continue?
        </p>
        <div className="dna-modal-actions">
          <button className="dna-modal-btn dna-modal-cancel" onClick={onCancel}>
            Keep Current
          </button>
          <button className="dna-modal-btn dna-modal-confirm" onClick={onConfirm}>
            Revisit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Movie Card Component
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MovieCard = ({ movie, side, state, onClick, disabled, borderColor }) => {
  // state: 'idle' | 'winner' | 'loser'
  const isWinner = state === 'winner';

  const cardVariants = {
    idle: {
      scale: 1,
      opacity: 1,
      x: 0,
      filter: 'brightness(1) saturate(1)',
      transition: SPRING_GENTLE,
    },
    winner: {
      scale: 1,
      opacity: 1,
      x: 0,
      filter: 'brightness(1.15) saturate(1.2)',
      transition: SPRING_SNAPPY,
    },
    loser: {
      scale: 1,
      opacity: 1,
      x: 0,
      filter: 'brightness(0.5) saturate(0.3)',
      transition: SPRING_GENTLE,
    },
  };

  return (
    <motion.div
      className={`dna-movie-card card-${side} state-${state}${isWinner ? ' do-shake' : ''}`}
      variants={cardVariants}
      animate={state}
      initial="idle"
      onClick={!disabled ? onClick : undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
      aria-label={`Choose ${movie.title}`}
      whileHover={{}}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        '--battle-color': borderColor,
      }}
    >
      {/* Poster â€” edge-to-edge, anchored per movie */}
      <img
        className="dna-card-poster"
        src={movie.posterLarge}
        alt={movie.title}
        loading="eager"
        draggable="false"
        style={{ objectPosition: movie.posterPosition || 'center center' }}
      />

      {/* Bottom text overlay */}
      <div className="dna-card-overlay">
        <div className="dna-card-title">{movie.title}</div>
        <div className="dna-card-meta">
          {movie.year} {'\u00A0·\u00A0'} {movie.director}
        </div>
      </div>

      {/* Hover choose hint */}
      {state === 'idle' && (
        <div className="dna-card-select-hint">Choose</div>
      )}
    </motion.div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Intro Screen
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const IntroScreen = ({ onBegin }) => {
  return (
    <motion.div
      className="dna-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* WebGL LiquidEther background layer (Layer 1) */}
      <div className="dna-liquid-ether-bg">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B497CF']}
          mouseForce={7}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={37}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce
          autoDemo
          autoSpeed={0.5}
          autoIntensity={5}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          dampening={0.98}
          color0="#5227FF"
          color1="#FF9FFC"
          color2="#B497CF"
        />
      </div>

      {/* Contrast Overlay (Layer 2) */}
      <div className="dna-liquid-ether-overlay" />

      <motion.div
        className="dna-intro-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.2 }}
      >
        {/* Title */}
        <h1 className="dna-intro-title">Movie DNA</h1>

        {/* Tagline */}
        <p className="dna-intro-tagline">
          Discover what kind of movie lover you really are.
        </p>

        {/* Meta pills */}
        <div className="dna-intro-meta">
          <span className="dna-intro-meta-item">10 cinematic choices</span>
          <div className="dna-intro-meta-divider" />
          <span className="dna-intro-meta-item">No right answers</span>
        </div>

        {/* CTA */}
        <motion.button
          className="dna-begin-btn"
          onClick={onBegin}
          whileTap={{ scale: 0.97 }}
          id="dna-begin-analysis"
          aria-label="Begin Movie DNA Analysis"
        >
          Begin Analysis
          <svg
            className="dna-begin-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        <p className="dna-intro-footnote">Takes under 2 minutes</p>
      </motion.div>
    </motion.div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Battle Screen
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BattleScreen = ({ battle, battleIndex, onSelect, cardStates, winners, timelineLocked, onTimelineDotClick }) => {
  const { a, b } = battle;
  const isSelecting = cardStates.a !== 'idle' || cardStates.b !== 'idle';
  const battleColor = battle.color || '#7C3AED';

  return (
    <div className="dna-battle-page">
      {/* Progress */}
      <DnaProgressBar battleIndex={battleIndex} isComplete={false} />

      {/* Battle Timeline */}
      <DnaBattleTimeline
        battleIndex={battleIndex}
        winners={winners}
        locked={timelineLocked}
        onDotClick={onTimelineDotClick}
      />

      {/* Arena */}
      <div className="dna-battle-arena">
        <motion.p
          className="dna-battle-label"
          key={`label-${battle.id}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Which film resonates with you?
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${battle.id}`}
            className="dna-cards-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          >
            {/* Card A */}
            <AnimatePresence>
              {cardStates.a !== 'loser' && (
                <motion.div
                  key={`card-a-${battle.id}`}
                  layout
                  variants={wrapperVariants}
                  animate={cardStates.a}
                  initial="idle"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{
                    layout: { type: 'spring', stiffness: 140, damping: 22 },
                    scale: { type: 'spring', stiffness: 180, damping: 24, delay: 0.15 },
                    default: { duration: 0.2 }
                  }}
                  whileHover={cardStates.a === 'idle' ? { scale: 1.04, transition: { type: 'spring', stiffness: 300, damping: 24 } } : {}}
                  className={`dna-battle-card-wrapper card-a${cardStates.a === 'winner' ? ' is-winner-centered' : ''}`}
                >
                  <ElectricBorder
                    color={battleColor}
                    speed={cardStates.a === 'winner' ? 2.0 : cardStates.a === 'loser' ? 0.0 : 1.2}
                    chaos={cardStates.a === 'winner' ? 0.28 : cardStates.a === 'loser' ? 0.0 : 0.14}
                    borderRadius={38}
                    className={`battle-electric-border card-a state-${cardStates.a}`}
                  >
                    <MovieCard
                      movie={a}
                      side="a"
                      state={cardStates.a}
                      onClick={() => onSelect('a')}
                      disabled={isSelecting}
                      borderColor={battleColor}
                    />
                  </ElectricBorder>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VS */}
            <AnimatePresence>
              {!isSelecting && (
                <motion.div
                  key={`vs-${battle.id}`}
                  className="dna-vs-divider"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                >
                  <span className="dna-vs-text">VS</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card B */}
            <AnimatePresence>
              {cardStates.b !== 'loser' && (
                <motion.div
                  key={`card-b-${battle.id}`}
                  layout
                  variants={wrapperVariants}
                  animate={cardStates.b}
                  initial="idle"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{
                    layout: { type: 'spring', stiffness: 140, damping: 22 },
                    scale: { type: 'spring', stiffness: 180, damping: 24, delay: 0.15 },
                    default: { duration: 0.2 }
                  }}
                  whileHover={cardStates.b === 'idle' ? { scale: 1.04, transition: { type: 'spring', stiffness: 300, damping: 24 } } : {}}
                  className={`dna-battle-card-wrapper card-b${cardStates.b === 'winner' ? ' is-winner-centered' : ''}`}
                >
                  <ElectricBorder
                    color={battleColor}
                    speed={cardStates.b === 'winner' ? 2.0 : cardStates.b === 'loser' ? 0.0 : 1.2}
                    chaos={cardStates.b === 'winner' ? 0.28 : cardStates.b === 'loser' ? 0.0 : 0.14}
                    borderRadius={38}
                    className={`battle-electric-border card-b state-${cardStates.b}`}
                  >
                    <MovieCard
                      movie={b}
                      side="b"
                      state={cardStates.b}
                      onClick={() => onSelect('b')}
                      disabled={isSelecting}
                      borderColor={battleColor}
                    />
                  </ElectricBorder>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};


// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Complete Screen â€” Montage â†’ Analysis
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CompleteScreen = ({ winners, onComplete }) => {
  const [phase, setPhase]             = useState('montage'); // 'montage' | 'analysis'
  const [montageIdx, setMontageIdx]   = useState(0);
  const [msgIdx, setMsgIdx]           = useState(0);
  const [analysisPct, setAnalysisPct] = useState(0);

  // â”€â”€ Montage: cycle winners rapidly â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (phase !== 'montage') return;
    if (!winners || winners.length === 0) {
      const emptyTimer = setTimeout(() => setPhase('analysis'), 0);
      return () => clearTimeout(emptyTimer);
    }

    let i = 0;
    const tick = () => {
      i += 1;
      if (i >= winners.length) {
        setTimeout(() => setPhase('analysis'), 500);
        return;
      }
      setMontageIdx(i);
      setTimeout(tick, 450);
    };
    const t = setTimeout(tick, 450);
    return () => clearTimeout(t);
  }, [phase, winners]);

  // â”€â”€ Analysis: messages + animated progress â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (phase !== 'analysis') return;

    // 300ms fade-in + 1200ms hold + 300ms fade-out = 1800ms per message
    const msgTimer = setInterval(() => {
      setMsgIdx(idx => (idx + 1) % COMPLETE_ANALYSIS_MSGS.length);
    }, 1800);

    let rafId, t0 = null;
    const DURATION = 14000; // 14s â†’ shows ~7-8 messages before 100%
    const animPct = (now) => {
      if (!t0) t0 = now;
      const progress = Math.min((now - t0) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentPct = Math.round(eased * 100);
      setAnalysisPct(currentPct);
      if (progress < 1) {
        rafId = requestAnimationFrame(animPct);
      } else {
        clearInterval(msgTimer); // Stop rotation the instant we hit 100%
        setTimeout(() => {
          onComplete();
        }, 700); // 700ms hold, then transition
      }
    };
    rafId = requestAnimationFrame(animPct);

    return () => { clearInterval(msgTimer); cancelAnimationFrame(rafId); };
  }, [phase, onComplete]);

  const curWinner = winners && winners.length > 0 ? winners[montageIdx] : null;

  return (
    <div className="dna-complete-screen">

      {/* Ferrofluid â€” persists across montage & analysis */}
      <motion.div
        className="dna-ferrofluid-bg"
        animate={{ opacity: phase === 'montage' ? 0.65 : 0.9 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <Ferrofluid
          colors={['#ffffff', '#e2e8f0', '#475569']}
          speed={0.32}
          scale={1.9}
          turbulence={0.75}
          fluidity={0.12}
          rimWidth={0.24}
          sharpness={2.8}
          shimmer={1.6}
          glow={3.4}
          flowDirection="down"
          opacity={0.9}
          mouseInteraction={false}
        />
      </motion.div>
      {/* Dark readability overlay */}
      <div className="dna-ferrofluid-overlay" />

      <AnimatePresence mode="wait">

        {/* â”€â”€ Montage Phase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {phase === 'montage' && curWinner && (
          <motion.div
            key="montage"
            className="dna-montage-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              className="dna-montage-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Reviewing your selections...
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.div
                key={`mc-${montageIdx}`}
                className="dna-montage-card"
                initial={{ opacity: 0, scale: 0.91 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.07 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ '--mc': curWinner.color }}
              >
                <img
                  className="dna-montage-poster"
                  src={curWinner.movie.posterLarge}
                  alt={curWinner.movie.title}
                  draggable="false"
                  style={{ objectPosition: curWinner.movie.posterPosition || 'center center' }}
                />
                <div className="dna-montage-card-footer">
                  {curWinner.movie.title}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="dna-montage-dots">
              {winners.map((_, i) => (
                <div key={i} className={`dna-montage-dot${i <= montageIdx ? ' active' : ''}`} />
              ))}
            </div>
          </motion.div>
        )}

        {/* â”€â”€ Analysis Phase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {phase === 'analysis' && (
          <motion.div
            key="analysis"
            className="dna-analysis-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="dna-analysis-inner">

              {/* Message box â€” fully removed from DOM at 100% */}
              <AnimatePresence>
                {analysisPct < 100 && (
                  <motion.div
                    className="dna-analysis-msg-box"
                    key="msg-box"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={msgIdx}
                        className="dna-analysis-message"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        {COMPLETE_ANALYSIS_MSGS[msgIdx]}
                      </motion.p>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="dna-analysis-progress-wrap">
                <div className="dna-analysis-progress-header" style={{ justifyContent: 'center' }}>
                  <span className="dna-progress-percent">{analysisPct}%</span>
                </div>
                <div className="dna-analysis-progress-track">
                  <div
                    className="dna-analysis-progress-fill"
                    style={{ width: `${analysisPct}%` }}
                  />
                </div>
                {/* Status line: only shows the finalized message at 100% */}
                <AnimatePresence>
                  {analysisPct >= 100 && (
                    <motion.p
                      className="dna-analysis-status-msg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      Analysis sequence finalized
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {analysisPct >= 100 && (
                  <motion.div
                    className="dna-analysis-complete-badge"
                    initial={{ opacity: 0, scale: 0.85, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.15 }}
                  >
                    <div className="dna-complete-icon">
                      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                        <path d="M8 16c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="rgba(164,143,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M16 16v8" stroke="rgba(164,143,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="16" cy="26" r="1.5" fill="rgba(164,143,255,0.9)" />
                        <path d="M10 20c1.5 2 3.5 3 6 3s4.5-1 6-3" stroke="rgba(124,92,252,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h2 className="dna-complete-title">DNA Analysis Complete</h2>
                    <p className="dna-complete-subtitle">{TOTAL_BATTLES} of {TOTAL_BATTLES} choices recorded</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Archetype & Results Logic
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Archetype & Results Logic
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TRAIT_LABELS = {
  imagination: 'Imagination',
  wonder: 'Wonder & Awe',
  complexity: 'Narrative Complexity',
  atmosphere: 'Atmosphere & Mood',
  emotionality: 'Emotional Resonance',
  realism: 'Gritty Realism',
  ambiguity: 'Ambiguity & Grey Areas',
  optimism: 'Optimism & Hope',
  darkness: 'Psychological Darkness',
  spectacle: 'Visual Spectacle',
  characterFocus: 'Character Depth',
  philosophical: 'Philosophical Depth',
  density: 'Narrative Density',
  intimacy: 'Dramatic Intimacy',
  worldbuilding: 'Worldbuilding',
  moralComplexity: 'Moral Complexity',
  narrativeExperimentation: 'Narrative Experimentation',
  psychologicalIntensity: 'Psychological Intensity',
  humanism: 'Humanist Empathy',
  mythicScale: 'Mythic Scale'
};


const TRAIT_ANALYSIS = {
  imagination: {
    like: "You are drawn to visionary concepts, speculative worldbuilding, and unrestrained creative leaps.",
    dislike: "You actively resist fantastical or speculative premises, preferring stories rooted in recognizable human realities."
  },
  wonder: {
    like: "You seek awe-inspiring cinematic moments that evoke poetic grandeur, cosmic mystery, and emotional transcendence.",
    dislike: "You avoid wide-eyed sentimentality or naive awe, prioritizing sober, clear-eyed emotional honesty."
  },
  complexity: {
    like: "You thrive on intricate multi-layered narratives, non-linear structures, and intellectual puzzles that demand active engagement.",
    dislike: "You reject needlessly convoluted structures or puzzle-box plots that distract from emotional truth and character clarity."
  },
  atmosphere: {
    like: "You prioritize sensory immersion, lingering spatial mood, and visual rhythm that speaks louder than expository dialogue.",
    dislike: "You resist slow meditative visual pacing, preferring propulsive momentum, narrative drive, and clear forward action."
  },
  emotionality: {
    like: "You connect deeply with raw emotional stakes, character vulnerability, and powerful cathartic resonance.",
    dislike: "You actively reject manipulative melodrama, forced sentimentality, and manufactured tears in favor of understated dignity."
  },
  realism: {
    like: "You demand authentic textures of lived reality, documentary grit, and unvarnished psychological truth.",
    dislike: "You reject mundane, literal reality in favor of stylized, allegorical, or surreal cinematic expressions."
  },
  ambiguity: {
    like: "You embrace morally grey dilemmas, open-ended conclusions, and profound questions without easy answers.",
    dislike: "You avoid deliberate obscurity, preferring clear moral stakes, narrative accountability, and satisfying dramatic resolution."
  },
  optimism: {
    like: "You are energized by uplifting arcs of human resilience, redemptive hope, and triumph against adversity.",
    dislike: "You consistently reject neat, unearned happy endings and feel-good formulas in favor of hard-edged, uncompromising honesty."
  },
  darkness: {
    like: "You do not shy away from the shadowed corners of human nature, visceral obsession, and grim psychological truths.",
    dislike: "You avoid nihilistic bleakness or gratuitous cruelty that feels unearned or lacks deeper dramatic purpose."
  },
  spectacle: {
    like: "You appreciate grand visual choreography, cinematic scale, and breathtaking technical execution in the frame.",
    dislike: "You reject empty style-over-substance blockbusters that sacrifice character nuance for hollow sensory overload."
  },
  characterFocus: {
    like: "You are fascinated by character interiority, nuanced performances, and intimate psychological examinations.",
    dislike: "You find plot-heavy films without deep character development hollow and emotionally detached."
  },
  philosophical: {
    like: "You love cinema that interrogates existential questions, human morality, memory, and metaphysics.",
    dislike: "You avoid preachy or overly academic films that lecture rather than tell a compelling story."
  },
  density: {
    like: "You appreciate rich narrative density where every frame, motif, and line of dialogue carries weight.",
    dislike: "You avoid over-stuffed scripts, preferring breathing room and visual subtext."
  },
  intimacy: {
    like: "You gravitate toward small-scale chamber dramas, two-person dynamics, and delicate emotional nuances.",
    dislike: "You prefer expansive worldbuilding and wider social canvases over confined intimate spaces."
  },
  worldbuilding: {
    like: "You love immersive environments with distinct cultural lore, architectural detail, and atmospheric rules.",
    dislike: "You prefer character-centric storytelling that does not get bogged down in world rules."
  },
  moralComplexity: {
    like: "You demand flawed, contradictory characters whose motivations mirror the messy contradictions of real life.",
    dislike: "You reject simplistic black-and-white hero vs. villain archetypes."
  },
  narrativeExperimentation: {
    like: "You love films that deconstruct traditional cinematic grammar and invent new ways of telling stories.",
    dislike: "You value classical storytelling discipline and clear dramatic momentum over experimental gimmicks."
  },
  psychologicalIntensity: {
    like: "You seek relentless psychological tension, obsession, paranoia, and characters pushed to their mental limits.",
    dislike: "You avoid films that lack psychological stakes and emotional urgency."
  },
  humanism: {
    like: "You cherish compassionate, deeply empathetic filmmaking that honors the fragility and dignity of everyday lives.",
    dislike: "You reject cold, cynical perspectives that view humanity with detachment or mockery."
  },
  mythicScale: {
    like: "You are moved by epic archetypal journeys, legacy, fate, and grand mythical storytelling traditions.",
    dislike: "You prefer personal, idiosyncratic human stories over grand mythical destinies."
  }
};

const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (const key in vecA) {
    const valA = vecA[key] || 0;
    const valB = vecB[key] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const DECISION_LENSES = [
  {
    id: 'uncertainty',
    territory: 'structural',
    dims: ['ambiguity', 'complexity', 'narrativeExperimentation'],
    pos: {
      title: 'A Drawnness to Open Questions',
      prose: `Your selections suggest an affinity for films that embrace ambiguity and resist tidy resolutions. Rather than requiring immediate closure, you seem to appreciate stories that leave space for reflection, allowing the narrative to linger in the mind long after the credits roll.`
    },
    neg: {
      title: 'An Appreciation for Narrative Structure',
      prose: `Your choices point toward films that respect narrative momentum and structural clarity. You appear to value stories that deliver on their dramatic promises, preferring a well-executed resolution where the filmmaker's intent is clearly realized over deliberate obscurity.`
    }
  },
  {
    id: 'emotional_weight',
    territory: 'emotional',
    dims: ['emotionality', 'humanism', 'intimacy'],
    pos: {
      title: 'A Focus on Empathetic Connection',
      prose: `Your choices lean toward films that get close to their characters, prioritizing emotional vulnerability and human warmth. This suggests you value cinema as an empathetic medium, where characters feel like complex, breathing individuals rather than mere narrative chess pieces.`
    },
    neg: {
      title: 'An Appetite for Intellectual Observation',
      prose: `Your selections suggest a preference for a degree of aesthetic or intellectual distance. You seem to enjoy films that invite you to analyze their themes and character motivations objectively, rather than those that seek to manipulate your feelings directly.`
    }
  },
  {
    id: 'darkness_depth',
    territory: 'psychological',
    dims: ['darkness', 'psychologicalIntensity'],
    pos: {
      title: 'An Interest in Psychological Depths',
      prose: `Your profile indicates a willingness to engage with the darker corners of the human experience — whether through psychological dread, obsession, or moral gray areas. You seem to expect cinema to confront challenging realities rather than simply offering comfortable reassurance.`
    },
    neg: {
      title: 'A Preference for Purposeful Contrast',
      prose: `Your choices show a preference for keeping darkness in balance. While you do not avoid dramatic conflict, you rarely choose films where the prevailing mood is one of unremitting bleakness, favoring instead stories where difficult themes serve a clear narrative purpose.`
    }
  },
  {
    id: 'atmospheric_pull',
    territory: 'atmospheric',
    dims: ['atmosphere'],
    pos: {
      title: 'A Tendency to Linger in Mood',
      prose: `You often select films where the atmosphere — the texture, light, and ambient sound of the environment — feels as significant as the plot. Visual mood and the gradual build-up of feeling seem to engage you more than fast narrative momentum.`
    },
    neg: {
      title: 'A Response to Narrative Momentum',
      prose: `Your choices suggest a preference for films with forward drive and narrative propulsion. You respond to cinema that values events and active developments, where the story moves forward through action and change rather than lingering in a static environment.`
    }
  },
  {
    id: 'imaginative_scope',
    territory: 'worldbuilding',
    dims: ['worldbuilding', 'imagination'],
    pos: {
      title: 'An Attraction to Constructed Worlds',
      prose: `Several of your choices highlight an interest in world-building and speculative landscapes. You are drawn to films that establish their own unique rules, cosmologies, or environments, appreciating the sheer act of visual and narrative invention.`
    },
    neg: {
      title: 'An Anchor in Lived Realities',
      prose: `You tend to choose films anchored in recognizable, everyday settings. You seem to find more power in the textures of real life and familiar struggles than in the elaborate construction of fantasy or science-fiction lore.`
    }
  },
  {
    id: 'character_depth',
    territory: 'character',
    dims: ['characterFocus', 'intimacy'],
    pos: {
      title: 'A Lean Toward Character Portraiture',
      prose: `Your selections suggest that you are drawn to character studies over plot-heavy structures. You seem interested in the quiet observation of human behavior, valuing the exploration of who a character is over the mechanical question of what happens next.`
    },
    neg: {
      title: 'A Value on Narrative Event',
      prose: `You appear to favor films where the plot is active and characters are defined through their choices and actions. For you, the momentum of events is what reveals character, making story progression a key driver of your enjoyment.`
    }
  },
  {
    id: 'philosophical_depth',
    territory: 'philosophical',
    dims: ['philosophical'],
    pos: {
      title: 'An Engagement with Philosophical Ideas',
      prose: `A pattern in your selections suggests that you enjoy cinema that carries intellectual weight. You respond to films that use their stories to explore larger concepts—such as morality, identity, or existence—treating the medium as a space for serious ideas.`
    },
    neg: {
      title: 'A Focus on Concrete Drama',
      prose: `You seem to prefer films where themes are embedded in concrete situations rather than abstract discourse. For you, ideas are most effective when they emerge naturally from character action and immediate human conflict, rather than formal philosophical debate.`
    }
  },
  {
    id: 'hope_vs_darkness',
    territory: 'moral',
    dims: ['moralComplexity', 'optimism'],
    pos: {
      title: 'A Responsive Eye for Hope',
      prose: `Even among your darker choices, you show an interest in films that locate some form of redemption, connection, or wonder. You seem to appreciate hope most when it is hard-won, having survived the difficult realities of the story.`
    },
    neg: {
      title: 'An Appetite for Unsparing Truths',
      prose: `Your selections show an appreciation for films that refuse easy comfort or neat endings. You respect filmmakers who allow their stories to conclude with quiet devastation, ambiguity, or tragedy, finding honesty in their refusal to look away.`
    }
  },
  {
    id: 'reality_anchor',
    territory: 'realism',
    dims: ['realism'],
    pos: {
      title: 'A Preference for Authentic Textures',
      prose: `You tend to choose films that prioritize naturalism and authenticity. You seem to value the documentary grain of realism—finding beauty in ordinary locations and organic, unforced performances over obvious visual polish.`
    },
    neg: {
      title: 'An Appetite for Visual Artifice',
      prose: `Your selections suggest a fondness for highly stylized and constructed imagery. You respond to films where the director's visual signature is prominent, finding pleasure in deliberate design, color-coding, and expressive staging.`
    }
  },
  {
    id: 'narrative_density',
    territory: 'narrative',
    dims: ['density', 'complexity'],
    pos: {
      title: 'A Comfort with Dense Structures',
      prose: `You are drawn to films that feature dense narrative layering—whether through multiple subplots, ensemble casts, or complex structural timelines. You seem to enjoy the active engagement required to trace these complex webs.`
    },
    neg: {
      title: 'A Preference for Narrative Focus',
      prose: `You appear to appreciate narrative economy and focus. You value films that select a single, clear dramatic line and explore it with precision, finding strength in simplicity rather than accumulating extraneous subplots.`
    }
  },
  {
    id: 'visual_spectacle',
    territory: 'visual',
    dims: ['spectacle'],
    pos: {
      title: 'An Appreciation for Grand Scale',
      prose: `You respond to films that embrace the visual scale of cinema. You appreciate grand compositions, deep depth of field, and directors who use the physical space of the frame to create memorable, architecturally impressive images.`
    },
    neg: {
      title: 'A Focus on Intimate Framing',
      prose: `For you, the visual field is most effective when it stays close to the human face and immediate spaces. You prefer close-ups and intimate framing that prioritize the actor's performance over grand, sweeping visual designs.`
    }
  },
  {
    id: 'mythic_dimension',
    territory: 'mythic',
    dims: ['mythicScale', 'wonder'],
    pos: {
      title: 'A Drawnness to Archetypal Resonance',
      prose: `Your selections show an interest in stories that carry mythic or archetypal resonance. You respond to characters who carry the weight of legacy, destiny, or folklore, where the drama feels connected to ancient storytelling traditions.`
    },
    neg: {
      title: 'An Anchor in Modern Humanism',
      prose: `You tend to prefer stories grounded in modern, recognizable human conditions. You respond to characters with personal, relatable stakes rather than those driven by mythic destinies or legendary legacies.`
    }
  },
  {
    id: 'historical_perspective',
    territory: 'historical',
    dims: ['realism', 'density'],
    pos: {
      title: 'An Interest in Historic Textures',
      prose: `You appear drawn to films that are grounded in specific historical epochs. You appreciate how these stories place individual human choices within the context of collective memory, culture, and the passage of time.`
    },
    neg: {
      title: 'A Preference for Universal Settings',
      prose: `You seem to prefer stories that feel timeless or universal, detached from the specifics of a historical era. For you, the core human conflicts are what matter, transcending any particular historical documentation.`
    }
  }
];


const formatDecisionProse = (lens, isPositive, stabilityScore, isContradictory, contradictionText) => {
  const content = isPositive ? lens.pos : lens.neg;
  let title = content.title;
  let prose = content.prose;

  // Adjust title and prose to be less deterministic if stability is low
  if (stabilityScore < 45) {
    title = title
      .replace(/^You Seek/, 'A Soft Inclination Toward')
      .replace(/^You Value/, 'A Flexible Interest in')
      .replace(/^You Prefer/, 'A Subtle Lean Toward')
      .replace(/Outweighed/, 'Occasionally Leans Over')
      .replace(/Consistently/, 'Sometimes');
  }

  // Add contradiction awareness
  if (isContradictory && contradictionText) {
    prose += ` ${contradictionText}`;
  }

  // Add confidence-aware writing
  if (stabilityScore >= 75) {
    prose += " This emerges as a highly consistent and defining pillar of your cinematic taste across your choices.";
  } else if (stabilityScore >= 45) {
    prose += " This represents a visible current in your viewing, though it exists alongside other, more varied cinematic appetites.";
  } else {
    prose += " This inclination is relatively gentle, reflecting a highly eclectic taste that resists being boxed in by singular preferences.";
  }

  return { title, prose };
};

const analyzeDna = (winners) => {
  if (!winners || winners.length === 0) return null;

  const dimensions = Object.keys(TRAIT_LABELS);
  const traitSums = {};
  dimensions.forEach(dim => { traitSums[dim] = 0; });

  winners.forEach(w => {
    const vec = w.movie.vector;
    if (vec) {
      dimensions.forEach(dim => {
        traitSums[dim] += vec[dim] || 0;
      });
    }
  });

  const userDna = {};
  dimensions.forEach(dim => {
    userDna[dim] = Math.round((traitSums[dim] / winners.length) * 100);
  });

  const userDnaDec = {};
  dimensions.forEach(dim => {
    userDnaDec[dim] = userDna[dim] / 100;
  });

  const scoredArchetypes = DNA_ARCHETYPES.map(arch => {
    const similarity = cosineSimilarity(userDnaDec, arch.vector);
    return { ...arch, similarity };
  });
  
  scoredArchetypes.sort((a, b) => b.similarity - a.similarity);

  const primaryArchetype = scoredArchetypes[0];

  // 7. Identity Stability and Profile Complexity
  const primarySimilarity = primaryArchetype.similarity;
  const secondarySimilarity = scoredArchetypes[1]?.similarity || 0;

  const spNorm = Math.min(1.0, Math.max(0.0, (primarySimilarity - 0.5) / 0.45));
  const gapNorm = Math.min(1.0, Math.max(0.0, (primarySimilarity - secondarySimilarity) / 0.15));
  const stabilityScore = Math.round((spNorm * 0.5 + gapNorm * 0.5) * 100);

  const values = Object.values(userDnaDec);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  let complexityLabel;
  if (stdDev >= 0.24) complexityLabel = 'Highly Focused';
  else if (stdDev >= 0.19) complexityLabel = 'Focused';
  else if (stdDev >= 0.16) complexityLabel = 'Balanced';
  else if (stdDev >= 0.14) complexityLabel = 'Diverse';
  else complexityLabel = 'Highly Eclectic';

  const complexityScore = Math.min(100, Math.max(0, Math.round((0.30 - stdDev) / 0.18 * 100)));

  // 8. Key Decisions Engine V3
  const battleDeltas = winners.map(w => {
    const battle = DNA_BATTLES[w.battleIndex];
    if (!battle) return null;
    const winnerVec = w.movie.vector || {};
    const loserMovie = w.side === 'a' ? battle.b : battle.a;
    const loserVec = loserMovie.vector || {};
    const delta = {};
    dimensions.forEach(dim => {
      delta[dim] = (winnerVec[dim] || 0) - (loserVec[dim] || 0);
    });
    return {
      battleIndex: w.battleIndex,
      winnerTitle: w.movie.title,
      loserTitle: loserMovie.title,
      delta
    };
  }).filter(Boolean);

  const scoredLenses = DECISION_LENSES.map(lens => {
    let score = 0;
    let strength = 0;
    battleDeltas.forEach(bd => {
      let contrib = 0;
      lens.dims.forEach(dim => { contrib += bd.delta[dim] || 0; });
      score += contrib;
      strength += Math.abs(contrib);
    });
    return { ...lens, score, strength, isPositive: score >= 0 };
  });

  scoredLenses.sort((a, b) => b.strength - a.strength);

  const topLenses = scoredLenses.slice(0, 5);

  const keyDecisions = topLenses.map(lens => {
    const candidates = battleDeltas
      .map(bd => {
        let contrib = 0;
        lens.dims.forEach(dim => { contrib += bd.delta[dim] || 0; });
        return { ...bd, contrib };
      })
      .filter(bd => lens.isPositive ? bd.contrib > 0.04 : bd.contrib < -0.04)
      .slice(0, 2);

    const { title, prose } = formatDecisionProse(lens, lens.isPositive, stabilityScore, false, "");
    return { title, prose, evidence: candidates.map(c => ({ winner: c.winnerTitle, loser: c.loserTitle })) };
  });

  // 10. Upgraded Recommendations Scoring
  const dominantTraits = dimensions.filter(d => userDnaDec[d] >= 0.7);
  const rejectedTraits = dimensions.filter(d => userDnaDec[d] <= 0.35);

  const scoredRecommendations = DNA_RECOMMENDATIONS.map(rec => {
    const baseSimilarity = cosineSimilarity(userDnaDec, rec.vector);
    const primSim = cosineSimilarity(primaryArchetype.vector, rec.vector);
    
    const archetypeBoost = primSim * 0.12;
    
    let dominantBoost = 0;
    dominantTraits.forEach(d => {
      if ((rec.vector[d] || 0) >= 0.75) dominantBoost += 0.04;
    });

    let rejectedPenalty = 0;
    rejectedTraits.forEach(d => {
      if ((rec.vector[d] || 0) >= 0.7) rejectedPenalty += 0.05;
    });

    const combinedScore = baseSimilarity + archetypeBoost + dominantBoost - rejectedPenalty;
    return { ...rec, similarity: baseSimilarity, combinedScore, primSim };
  });

  scoredRecommendations.sort((a, b) => b.combinedScore - a.combinedScore);

  // ── CINEMATIC SOULMATE ────────────────────────────────────────────────────
  // Composite score: DNA similarity + archetype alignment + dominant trait match + key decision alignment

  // Compute "key decision alignment" per rec: how many top lenses this rec would reinforce
  const topLenseDims = topLenses.flatMap(lens => lens.dims);

  const fullyScored = DNA_RECOMMENDATIONS.map(rec => {
    const baseSimilarity = cosineSimilarity(userDnaDec, rec.vector);
    const primSim = cosineSimilarity(primaryArchetype.vector, rec.vector);
    const archetypeBoost = primSim * 0.14;

    let dominantBoost = 0;
    dominantTraits.forEach(d => {
      if ((rec.vector[d] || 0) >= 0.75) dominantBoost += 0.04;
    });

    let rejectedPenalty = 0;
    rejectedTraits.forEach(d => {
      if ((rec.vector[d] || 0) >= 0.7) rejectedPenalty += 0.05;
    });

    // Key decision alignment: how strongly rec reinforces the user's top lens directions
    let keyDecisionAlign = 0;
    topLenseDims.forEach(dim => {
      const userVal = userDnaDec[dim] || 0;
      const recVal = rec.vector[dim] || 0;
      if (Math.abs(userVal - recVal) < 0.2) keyDecisionAlign += 0.015;
    });

    const finalScore = baseSimilarity + archetypeBoost + dominantBoost + keyDecisionAlign - rejectedPenalty;

    // Calculate Top 2 Trait Synergies
    const synergies = dimensions
      .map(d => ({
        dim: d,
        label: TRAIT_LABELS[d] || d,
        score: Math.round(Math.min(userDnaDec[d] || 0, rec.vector[d] || 0) * 100),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    const matchPct = Math.min(99, Math.max(74, Math.round(baseSimilarity * 100)));
    const whyMatches = `Reflects your strong affinity for ${synergies[0]?.label.toLowerCase()} and ${synergies[1]?.label.toLowerCase()} with high narrative craft.`;

    return {
      ...rec,
      similarity: baseSimilarity,
      combinedScore: finalScore,
      matchPct,
      primSim,
      archetypeBoost,
      dominantBoost,
      keyDecisionAlign,
      synergies,
      whyMatches,
      curationLens: rec.category || 'core',
    };
  });

  fullyScored.sort((a, b) => b.combinedScore - a.combinedScore);

  // THE SOULMATE: #1 ranked film
  const soulmate = fullyScored[0];

  // Alignment strength label & dynamic reasoning for Soulmate
  const soulmateStrengthLabel = (() => {
    if (!soulmate) return 'Cinematic Match';
    const pct = soulmate.matchPct || 92;
    if (pct >= 95) return `${pct}% · Pure Resonance`;
    if (pct >= 88) return `${pct}% · Harmonic Match`;
    if (pct >= 80) return `${pct}% · Strong Affinity`;
    return `${pct}% · Cinematic Resonance`;
  })();

  const soulmateReasons = (() => {
    if (!soulmate) return [];
    const reasons = [];

    if (soulmate.whyMatches) {
      reasons.push(soulmate.whyMatches);
    } else if (soulmate.synergies && soulmate.synergies.length >= 2) {
      reasons.push(`Reflects your strong affinity for ${soulmate.synergies[0].label.toLowerCase()} and ${soulmate.synergies[1].label.toLowerCase()} with exquisite narrative craft.`);
    }

    if (primaryArchetype?.name) {
      reasons.push(`Exemplifies the foundational narrative qualities of your ${primaryArchetype.name} cinematic archetype.`);
    }

    if (soulmate.director) {
      reasons.push(`Directed by ${soulmate.director}, whose visual storytelling closely matches your instinctive preference balance.`);
    } else if (soulmate.tagline) {
      reasons.push(`Theme: "${soulmate.tagline}"`);
    }

    return reasons.slice(0, 3);
  })();

  // Candidates excluding soulmate
  const remainingRecs = fullyScored.filter(rec => rec.id !== soulmate?.id);

  // 3-Film Viewing Itinerary (Step 1: Resonance, Step 2: Immersion, Step 3: Revelation)
  const step1 = remainingRecs.find(r => (r.vector.humanism || 0) >= 0.7 || (r.vector.optimism || 0) >= 0.5) || remainingRecs[0];
  const step2 = remainingRecs.find(r => r.id !== step1?.id) || remainingRecs[1];
  const step3 = remainingRecs.find(r => r.id !== step1?.id && r.id !== step2?.id && (r.curationLens === 'horizon' || (r.vector.ambiguity || 0) >= 0.8 || (r.vector.narrativeExperimentation || 0) >= 0.8))
    || remainingRecs.find(r => r.id !== step1?.id && r.id !== step2?.id);

  const viewingItinerary = [
    {
      step: 1,
      role: 'The Resonance',
      sub: 'Comfort & Direct Confirmation',
      description: 'The gentlest on-ramp into your cinematic spectrum — immediate aesthetic validation.',
      movie: step1
    },
    {
      step: 2,
      role: 'The Deep Immersion',
      sub: 'Pure Archetype Concentration',
      description: 'An uncompromising deep dive into the core emotional truth of your profile.',
      movie: step2
    },
    {
      step: 3,
      role: 'The Revelation',
      sub: 'Horizon Boundary Stretch',
      description: 'Expands your taste boundary by taking your core instincts into bolder, uncharted territory.',
      movie: step3
    }
  ].filter(s => s.movie);

  // Your Next Watches: Top 24 recommendations for multi-lens exploration
  const yourNextWatches = remainingRecs.slice(0, 24);



  // ── CINEMATIC FORENSICS ────────────────────────────────────────────────────

  // FORENSICS 1: Alternate Timeline
  // For each of the 20 battles, flip the winner, recalculate archetype, measure impact.
  const alternateTimeline = (() => {
    const impacts = winners.map((w, idx) => {
      const battle = DNA_BATTLES[w.battleIndex];
      if (!battle) return null;

      // Build hypothetical winner list with this battle flipped
      const flippedWinners = winners.map((fw, fi) => {
        if (fi !== idx) return fw;
        const altMovie = fw.side === 'a' ? battle.b : battle.a;
        return { ...fw, movie: altMovie, side: fw.side === 'a' ? 'b' : 'a' };
      });

      // Compute alt DNA vector
      const altSums = {};
      dimensions.forEach(d => { altSums[d] = 0; });
      flippedWinners.forEach(fw => {
        const vec = fw.movie.vector;
        if (vec) dimensions.forEach(d => { altSums[d] += vec[d] || 0; });
      });
      const altDnaDec = {};
      dimensions.forEach(d => { altDnaDec[d] = altSums[d] / flippedWinners.length; });

      // Score archetypes against alt DNA
      const altScored = DNA_ARCHETYPES.map(arch => ({
        ...arch,
        similarity: cosineSimilarity(altDnaDec, arch.vector)
      })).sort((a, b) => b.similarity - a.similarity);
      const altPrimary = altScored[0];

      const identityChanged = altPrimary.name !== primaryArchetype.name;
      const profileShift = dimensions.reduce((sum, d) => {
        return sum + Math.abs((altDnaDec[d] || 0) - (userDnaDec[d] || 0));
      }, 0) / dimensions.length;
      const impactScore = profileShift * 100 + (identityChanged ? 20 : 0)
        + Math.abs(primaryArchetype.similarity - altPrimary.similarity) * 30;

      const altMovie = w.side === 'a' ? battle.b : battle.a;

      // Top 2 dimensions that shift most
      const topShiftedDims = dimensions
        .map(d => ({ dim: d, delta: Math.abs((altDnaDec[d] || 0) - (userDnaDec[d] || 0)) }))
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 2)
        .map(x => TRAIT_LABELS[x.dim]);

      return {
        battleIndex: w.battleIndex,
        chosenTitle: w.movie.title,
        altTitle: altMovie.title,
        altArchetype: altPrimary,
        identityChanged,
        impactScore,
        origArchetypeName: primaryArchetype.name,
        topShiftedDims
      };
    }).filter(Boolean);

    impacts.sort((a, b) => b.impactScore - a.impactScore);
    return impacts.slice(0, 3);
  })();

  // FORENSICS 2: Taste Outlier
  // The selected movie with the lowest cosine similarity to the user's DNA vector.
  const tasteOutlier = (() => {
    const scored = winners.map(w => ({
      movie: w.movie,
      similarity: cosineSimilarity(userDnaDec, w.movie.vector || {})
    }));
    scored.sort((a, b) => a.similarity - b.similarity);
    const outlier = scored[0];
    if (!outlier) return null;

    const vec = outlier.movie.vector || {};
    const divergentDims = dimensions
      .map(d => ({ dim: d, delta: Math.abs((vec[d] || 0) - (userDnaDec[d] || 0)) }))
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 2);

    const explanationParts = divergentDims.map(({ dim }) => {
      const movieVal = vec[dim] || 0;
      const userVal = userDnaDec[dim] || 0;
      const label = TRAIT_LABELS[dim];
      return movieVal > userVal
        ? `elevated ${label.toLowerCase()}`
        : `suppressed ${label.toLowerCase()}`;
    });

    const explanation = `Despite sitting furthest from your dominant taste pattern, ${outlier.movie.title} found a place in your selections. Its ${explanationParts.join(' and ')} diverges most from your established cinematic vector — suggesting a deliberate pull toward contrast rather than reinforcement.`;

    return { movie: outlier.movie, similarity: outlier.similarity, explanation };
  })();

  // FORENSICS 3: Director Affinity
  // Score all directors in the battle database against the user's DNA vector.
  const directorAffinity = (() => {
    // Build director → avg vector from all movies appearing in DNA_BATTLES
    const directorVectors = {};
    DNA_BATTLES.forEach(battle => {
      [battle.a, battle.b].forEach(movie => {
        if (!movie.vector) return;
        const dir = movie.director;
        if (!directorVectors[dir]) directorVectors[dir] = { sums: {}, count: 0 };
        dimensions.forEach(d => {
          directorVectors[dir].sums[d] = (directorVectors[dir].sums[d] || 0) + (movie.vector[d] || 0);
        });
        directorVectors[dir].count += 1;
      });
    });

    const scored = Object.keys(directorVectors).map(dir => {
      const { sums, count } = directorVectors[dir];
      const avgVec = {};
      dimensions.forEach(d => { avgVec[d] = sums[d] / count; });
      return { director: dir, similarity: cosineSimilarity(userDnaDec, avgVec), avgVec };
    });
    scored.sort((a, b) => b.similarity - a.similarity);

    // Top 5: directors whose film vectors are closest to user DNA
    const topDirectors = scored.slice(0, 5).map(d => {
      const topDim = dimensions
        .filter(dim => (d.avgVec[dim] || 0) > 0.6 && (userDnaDec[dim] || 0) > 0.55)
        .sort((dimA, dimB) => {
          const simA = 1 - Math.abs((d.avgVec[dimA] || 0) - (userDnaDec[dimA] || 0));
          const simB = 1 - Math.abs((d.avgVec[dimB] || 0) - (userDnaDec[dimB] || 0));
          return simB - simA;
        })[0];
      const label = topDim ? TRAIT_LABELS[topDim] : null;
      const resonanceNote = label
        ? `Their work aligns closely with your affinity for ${label.toLowerCase()}.`
        : `Their cinematic language resonates consistently with your established taste profile.`;
      return { director: d.director, resonanceNote };
    });

    // Bottom 5: directors furthest from user DNA
    const divergentDirectors = scored.slice(-5).reverse().map(d => {
      const topDivDim = dimensions
        .map(dim => ({ dim, delta: Math.abs((d.avgVec[dim] || 0) - (userDnaDec[dim] || 0)) }))
        .sort((a, b) => b.delta - a.delta)[0];
      const label = topDivDim ? TRAIT_LABELS[topDivDim.dim] : null;
      const divergenceNote = label
        ? `Their dominant creative tendencies, particularly around ${label.toLowerCase()}, sit furthest from your established cinematic preferences.`
        : `Their dominant creative tendencies sit furthest from your established cinematic preferences.`;
      return { director: d.director, divergenceNote };
    });

    return { topDirectors, divergentDirectors };
  })();



  // ── CINEMATIC TWIN ────────────────────────────────────────────────────────
  // Score every twin against the user's DNA vector, then apply validation weights.
  const cinematicTwin = (() => {
    const scored = CINEMATIC_TWINS.map(twin => {
      const baseSim = cosineSimilarity(userDnaDec, twin.vector);

      // Validation boost 1: archetype-to-twin alignment
      const archetypeAlign = cosineSimilarity(primaryArchetype.vector, twin.vector);
      const archetypeBoost = archetypeAlign * 0.08;

      // Validation boost 2: dominant trait overlap
      let dominantOverlap = 0;
      dominantTraits.forEach(d => {
        if ((twin.vector[d] || 0) >= 0.72) dominantOverlap += 0.015;
      });

      // Validation guard 3: tonal darkness axis
      const darknessGap = Math.abs((userDnaDec.darkness || 0) - (twin.vector.darkness || 0));
      const tonalPenalty = darknessGap > 0.4 ? -(darknessGap - 0.4) * 0.25 : 0;

      // Validation guard 4: imagination/realism axis
      const imaginationGap = Math.abs((userDnaDec.imagination || 0) - (twin.vector.imagination || 0));
      const imaginationPenalty = imaginationGap > 0.45 ? -(imaginationGap - 0.45) * 0.18 : 0;

      const finalScore = baseSim + archetypeBoost + dominantOverlap + tonalPenalty + imaginationPenalty;
      return { ...twin, baseSim, finalScore };
    });

    scored.sort((a, b) => b.finalScore - a.finalScore);
    const top = scored[0];
    if (!top) return null;

    const tv = top.vector;

    // ── Alignment strength label ────────────────────────────────────────────
    const rawAlignPct = Math.min(100, Math.max(0, Math.round((top.finalScore - 0.72) / 0.48 * 100)));
    const alignmentStrengthLabel = (() => {
      if (rawAlignPct >= 88) return 'Near-Perfect Match';
      if (rawAlignPct >= 72) return 'Rare Match';
      if (rawAlignPct >= 52) return 'Exceptional Match';
      if (rawAlignPct >= 30) return 'Strong Match';
      return 'Good Match';
    })();
    const alignmentScore = rawAlignPct;

    // ── Why You Align (3 dynamic reasons) ──────────────────────────────────
    const twinReasons = (() => {
      const reasons = [];

      // Reason 1: top 2 jointly shared high-score dimensions
      const jointDims = dimensions
        .map(d => ({ dim: d, joint: Math.min(tv[d] || 0, userDnaDec[d] || 0) }))
        .sort((a, b) => b.joint - a.joint)
        .slice(0, 2);
      if (jointDims.length > 0) {
        const labels = jointDims.map(x => TRAIT_LABELS[x.dim].toLowerCase());
        reasons.push(`Both gravitate toward ${labels.join(' and ')} as primary cinematic values`);
      }

      // Reason 2: shared low-score dimension (what you both avoid)
      const sharedLow = dimensions
        .filter(d => (tv[d] || 0) <= 0.42 && (userDnaDec[d] || 0) <= 0.42)
        .map(d => ({ dim: d, joint: Math.max(tv[d] || 0, userDnaDec[d] || 0) }))
        .sort((a, b) => a.joint - b.joint)
        .slice(0, 1);
      if (sharedLow.length > 0) {
        reasons.push(`Both consistently deprioritise ${TRAIT_LABELS[sharedLow[0].dim].toLowerCase()} in favour of more demanding cinematic registers`);
      } else {
        // fallback: biggest gap avoided by both
        const topSingle = dimensions
          .map(d => ({ dim: d, joint: Math.min(tv[d] || 0, userDnaDec[d] || 0) }))
          .sort((a, b) => b.joint - a.joint)[2];
        if (topSingle) reasons.push(`A deep mutual investment in ${TRAIT_LABELS[topSingle.dim].toLowerCase()} runs through both sensibilities`);
      }

      // Reason 3: dominant trait alignment
      const matchedDominant = dominantTraits.filter(d => (tv[d] || 0) >= 0.7);
      if (matchedDominant.length >= 2) {
        const labels = matchedDominant.slice(0, 2).map(d => TRAIT_LABELS[d].toLowerCase());
        reasons.push(`Both favour ${labels.join(' and ')} over conventional narrative comfort`);
      } else if (matchedDominant.length === 1) {
        reasons.push(`A shared emphasis on ${TRAIT_LABELS[matchedDominant[0]].toLowerCase()} is a defining characteristic of this alignment`);
      } else {
        const topSingle = dimensions
          .map(d => ({ dim: d, joint: Math.min(tv[d] || 0, userDnaDec[d] || 0) }))
          .sort((a, b) => b.joint - a.joint)[0];
        if (topSingle) {
          reasons.push(`A deeply shared commitment to ${TRAIT_LABELS[topSingle.dim].toLowerCase()} defines the core of this alignment`);
        }
      }

      return reasons.slice(0, 3);
    })();

    // ── Shared trait bars: top 5 joint-highest dimensions ──────────────────
    const sharedTraitBars = dimensions
      .map(d => ({
        dim: d,
        label: TRAIT_LABELS[d],
        userVal: Math.round((userDnaDec[d] || 0) * 100),
        twinVal: Math.round((tv[d] || 0) * 100),
        joint: Math.min(userDnaDec[d] || 0, tv[d] || 0)
      }))
      .sort((a, b) => b.joint - a.joint)
      .slice(0, 5);

    // ── Defining Themes (3 thematic pillars from vector clusters) ──────────
    const definingThemes = (() => {
      const themeGroups = [
        {
          title: 'Human Darkness',
          dims: ['darkness', 'psychologicalIntensity', 'moralComplexity'],
          explanation: 'A shared pull toward the psychological shadow — stories where obsession, frailty, and moral compromise are treated with unflinching honesty.'
        },
        {
          title: 'Emotional Depth',
          dims: ['emotionality', 'humanism', 'intimacy'],
          explanation: 'Cinema as an empathetic act — films that get close to characters and trust vulnerability as a form of cinematic strength.'
        },
        {
          title: 'Narrative Ambiguity',
          dims: ['ambiguity', 'complexity', 'narrativeExperimentation'],
          explanation: 'A preference for stories that resist resolution — where meaning accrues slowly, and the audience is trusted to carry the weight.'
        },
        {
          title: 'Atmospheric World',
          dims: ['atmosphere', 'worldbuilding', 'imagination'],
          explanation: 'An investment in the texture of cinema — where environment, light, and sound carry as much meaning as plot or dialogue.'
        },
        {
          title: 'Mythic Grandeur',
          dims: ['mythicScale', 'spectacle', 'wonder'],
          explanation: 'Cinema experienced at scale — films that invoke archetypal resonance and the full spatial power of the frame.'
        },
        {
          title: 'Character Portraiture',
          dims: ['characterFocus', 'density', 'philosophical'],
          explanation: 'A lean toward the interior life — films built around the slow accumulation of human detail rather than external event.'
        },
        {
          title: 'Realist Anchor',
          dims: ['realism', 'humanism', 'intimacy'],
          explanation: 'A grounding in the textures of lived reality — cinema that finds power in the ordinary and refuses easy spectacle.'
        }
      ];
      const scoredThemes = themeGroups.map(group => {
        const jointScore = group.dims.reduce((sum, d) => sum + Math.min(tv[d] || 0, userDnaDec[d] || 0), 0) / group.dims.length;
        return { ...group, jointScore };
      });
      scoredThemes.sort((a, b) => b.jointScore - a.jointScore);
      return scoredThemes.slice(0, 3);
    })();

    return { ...top, twinReasons, sharedTraitBars, alignmentStrengthLabel, alignmentScore, definingThemes };
  })();

  // ── ANTI-MOVIE ─────────────────────────────────────────────────────────────
  // The film whose vector is most distant (lowest cosine similarity) from the
  // user's DNA, drawn from the full DNA_MOVIES pool excluding their 20 selections.
  const antiMovie = (() => {
    const winnerIds = new Set(winners.map(w => w.movie?.id).filter(Boolean));
    const allMovies = Object.values(DNA_MOVIES);

    const scored = allMovies
      .filter(m => !winnerIds.has(m.id) && m.vector)
      .map(m => ({ movie: m, sim: cosineSimilarity(userDnaDec, m.vector) }));

    scored.sort((a, b) => a.sim - b.sim);
    const pick = scored[0];
    if (!pick) return null;

    const { movie, sim } = pick;
    const vec = movie.vector;

    // Tension label from distance
    const tensionLabel = (() => {
      if (sim < 0.45) return 'Extreme Clash';
      if (sim < 0.58) return 'Strong Clash';
      if (sim < 0.70) return 'Noticeable Clash';
      return 'Mild Clash';
    })();

    // 3 dynamic clash reasons from biggest dimensional gaps
    const clashDims = dimensions
      .map(d => ({
        dim: d,
        label: TRAIT_LABELS[d],
        userVal: userDnaDec[d] || 0,
        movieVal: vec[d] || 0,
        diff: Math.abs((userDnaDec[d] || 0) - (vec[d] || 0)),
      }))
      .sort((a, b) => b.diff - a.diff)
      .slice(0, 3);

    const clashReasons = clashDims.map(({ label, userVal, movieVal }) => {
      if (userVal > movieVal) {
        return `Strong preference for ${label.toLowerCase()} in your profile clashes with this film's restrained approach`;
      }
      return `Prioritises ${label.toLowerCase()} at levels your profile consistently avoids`;
    });

    // Appreciation check — dynamically derived from anti-movie's top traits
    const antiTopDims = dimensions
      .filter(d => (vec[d] || 0) >= 0.72)
      .sort((a, b) => (vec[b] || 0) - (vec[a] || 0))
      .slice(0, 2)
      .map(d => TRAIT_LABELS[d].toLowerCase());

    const appreciationCheck = antiTopDims.length >= 2
      ? `Despite sitting at the far edge of your taste profile, its commitment to ${antiTopDims[0]} and ${antiTopDims[1]} may still find resonance with dimensions of your cinematic instinct this analysis doesn't fully surface.`
      : antiTopDims.length === 1
      ? `Despite sitting at the far edge of your taste profile, its emphasis on ${antiTopDims[0]} may still offer an experience worth exploring on its own terms.`
      : `Despite the profile distance, its execution and craft may still offer an experience worth exploring for any discerning viewer.`;

    return { movie, sim, tensionLabel, clashReasons, appreciationCheck };
  })();

  // ── TASTE HEATMAP ───────────────────────────────────────────────────────────
  // Rank all 20 DNA dimensions by user's averaged score.
  // Top 5 = Dominant Forces, Bottom 5 = Underused Territories.
  const tasteHeatmap = (() => {
    const sorted = dimensions
      .map(d => ({ dim: d, label: TRAIT_LABELS[d], score: userDnaDec[d] || 0 }))
      .sort((a, b) => b.score - a.score);

    const dominantForces = sorted.slice(0, 5).map((entry, i) => ({
      ...entry,
      rank: i + 1,
      pct: Math.round(entry.score * 100),
    }));

    const underusedTerritories = sorted.slice(-5).reverse().map((entry, i) => ({
      ...entry,
      rank: i + 1,
      pct: Math.round(entry.score * 100),
    }));

    return { dominantForces, underusedTerritories };
  })();

  // ── CINEMATIC BLIND SPOTS ─────────────────────────────────────────────
  // Score each blind spot: average of (1 - userScore) for its dominant dims.
  // Higher score = larger gap = stronger blind spot.
  const cinematicBlindSpots = (() => {
    const scored = BLIND_SPOTS.map(bs => {
      const gapScore = bs.dominantDimensions.reduce((sum, dim) => {
        return sum + (1 - (userDnaDec[dim] || 0));
      }, 0) / bs.dominantDimensions.length;
      return { ...bs, gapScore };
    });

    scored.sort((a, b) => b.gapScore - a.gapScore);

    const primary = scored[0];
    const secondary = scored.slice(1, 3);

    if (!primary) return null;

    // Generate "why it's missing" bullets from actual whyMissingDims
    const whyMissing = (primary.whyMissingDims || primary.dominantDimensions.slice(0, 3))
      .map(dim => {
        const userVal = userDnaDec[dim] || 0;
        const label = TRAIT_LABELS[dim] || dim;
        if (userVal < 0.35) {
          return `${label} registers as one of the least represented dimensions across your selections`;
        } else if (userVal < 0.5) {
          return `Lower emphasis on ${label.toLowerCase()} relative to your stronger cinematic preferences`;
        } else {
          return `Your stronger attraction toward other qualities leaves ${label.toLowerCase()} underrepresented`;
        }
      })
      .slice(0, 3);

    return { blindSpots: scored, primaryBlindSpot: { ...primary, whyMissing }, secondaryBlindSpots: secondary };
  })();

  return {
    dna: userDna,
    userVector: userDnaDec,
    primaryArchetype,
    stabilityScore,
    complexityLabel,
    complexityScore,
    keyDecisions,
    yourNextWatches,
    viewingItinerary: viewingItinerary || [],
    soulmate,
    soulmateReasons,
    soulmateStrengthLabel,
    cinematicTwin,
    antiMovie,
    tasteHeatmap,
    blindSpots: cinematicBlindSpots?.blindSpots || [],
    primaryBlindSpot: cinematicBlindSpots?.primaryBlindSpot || null,
    secondaryBlindSpots: cinematicBlindSpots?.secondaryBlindSpots || [],
    cinematicForensics: {
      alternateTimeline,
      tasteOutlier,
      directorAffinity
    }
  };
};

const CinematicBlindSpotsSection = ({ primaryBlindSpot, secondaryBlindSpots }) => {
  const navigate = useNavigate();

  // FALLBACK PROTECTION
  if (!primaryBlindSpot) {
    return (
      <motion.div
        className="dna-section dna-blind-spots-section"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: EASE_PREMIUM }}
      >
        <span className="dna-section-eyebrow">Cinematic Blind Spots</span>
        <p className="dna-section-desc">No dominant blind spots detected. Your profile is unusually balanced across cinematic dimensions.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="dna-section dna-blind-spots-section"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease: EASE_PREMIUM }}
    >
      <span className="dna-section-eyebrow">Cinematic Blind Spots</span>
      <p className="dna-section-desc">Major cinematic territories that remain largely unexplored within your profile.</p>

      {/* PRIMARY BLIND SPOT HERO CARD */}
      <div
        className="dna-bs-primary-card"
        style={{
          '--bs-primary': primaryBlindSpot.colorTheme.primary,
          '--bs-accent': primaryBlindSpot.colorTheme.accent,
          '--bs-border': primaryBlindSpot.colorTheme.border,
        }}
      >
        <div className="dna-bs-primary-header">
          <span className="dna-bs-primary-eyebrow">Primary Blind Spot</span>
          <h3 className="dna-bs-primary-name">{primaryBlindSpot.name}</h3>
          <p className="dna-bs-primary-desc">{primaryBlindSpot.description}</p>
        </div>

        <div className="dna-bs-primary-body">
          {/* Why It's Missing */}
          <div className="dna-bs-why-block">
            <span className="dna-bs-sub-label">Why It's Missing</span>
            <ul className="dna-bs-why-list">
              {primaryBlindSpot.whyMissing.map((reason, i) => (
                <li key={i} className="dna-bs-why-item">
                  <span className="dna-bs-why-bullet">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Entry Point Films */}
          <div className="dna-bs-entry-block">
            <span className="dna-bs-sub-label">Entry Point Films</span>
            <div className="dna-bs-entry-grid">
              {primaryBlindSpot.entryFilms.map((film, i) => (
                <motion.button
                  key={i}
                  className="dna-bs-entry-card"
                  onClick={() => navigate(`/movie/${film.id}`)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + 0.07 * i, ease: EASE_PREMIUM }}
                  aria-label={`View ${film.title}`}
                >
                  <span className="dna-bs-entry-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="dna-bs-entry-info">
                    <span className="dna-bs-entry-title">{film.title}</span>
                    <span className="dna-bs-entry-meta">{film.year} · {film.director}</span>
                  </div>
                  <span className="dna-bs-entry-arrow">→</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY BLIND SPOTS */}
      {secondaryBlindSpots && secondaryBlindSpots.length > 0 && (
        <div className="dna-bs-secondary-wrap">
          <span className="dna-bs-secondary-label">Secondary Blind Spots</span>
          <div className="dna-bs-secondary-grid">
            {secondaryBlindSpots.map((bs, i) => (
              <motion.div
                key={bs.id}
                className="dna-bs-secondary-card"
                style={{
                  '--bs-primary': bs.colorTheme.primary,
                  '--bs-accent': bs.colorTheme.accent,
                  '--bs-border': bs.colorTheme.border,
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + 0.08 * i, ease: EASE_PREMIUM }}
              >
                <span className="dna-bs-secondary-name">{bs.name}</span>
                <p className="dna-bs-secondary-desc">
                  {bs.description.split('.')[0] + '.'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};



const ResultsScreen = ({ winners, onRestart, cachedAnalysis, onCacheAnalysis }) => {

  const navigate = useNavigate();
  
  // Reusable graceful image fallback (never defaults to Inception or another movie)
  const handleImageFallback = useCallback((e) => {
    const currentSrc = e.target.src || '';
    if (currentSrc.includes('/w780/')) {
      e.target.src = currentSrc.replace('/w780/', '/w500/');
    } else if (!e.target.dataset.fallback) {
      e.target.dataset.fallback = 'true';
      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780&auto=format&fit=crop&q=80';
    }
  }, []);

  // ── Result Recalculation Cache ──────────────────────────────
  // Force-refresh if cached analysis is missing sections or from an older version
  const shouldRefreshAnalysis = !cachedAnalysis?.yourNextWatches
    || !cachedAnalysis?.cinematicForensics
    || !cachedAnalysis?.soulmate
    || !cachedAnalysis?.soulmateReasons
    || !cachedAnalysis?.cinematicTwin
    || !cachedAnalysis?.antiMovie
    || !cachedAnalysis?.tasteHeatmap
    || !cachedAnalysis?.primaryBlindSpot
    || cachedAnalysis?._version !== 4;

  const analysis = useMemo(() => {
    if (!shouldRefreshAnalysis && cachedAnalysis?.primaryArchetype) {
      return cachedAnalysis;
    }
    try {
      return analyzeDna(winners);
    } catch (err) {
      console.error('[MovieDNA] Failed to compute DNA analysis:', err);
      return null;
    }
  }, [shouldRefreshAnalysis, cachedAnalysis, winners]);

  useEffect(() => {
    if (shouldRefreshAnalysis && analysis) {
      onCacheAnalysis({ ...analysis, _version: 4 });
    }
  }, [shouldRefreshAnalysis, analysis, onCacheAnalysis]);

  const [activeRecFilter, setActiveRecFilter] = useState('all');
  const [previewTrailerKey, setPreviewTrailerKey] = useState(null);
  const [watchlistedIds, setWatchlistedIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cinematix_watchlist') || '[]');
      return saved.map(m => m.id);
    } catch {
      return [];
    }
  });
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const toggleWatchlist = useCallback((movie, e) => {
    if (e) e.stopPropagation();
    try {
      let saved = JSON.parse(localStorage.getItem('cinematix_watchlist') || '[]');
      const exists = saved.some(m => m.id === movie.id);
      if (exists) {
        saved = saved.filter(m => m.id !== movie.id);
        setWatchlistedIds(prev => prev.filter(id => id !== movie.id));
        showToast(`Removed "${movie.title}" from Watchlist`);
      } else {
        saved.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.posterLarge ? movie.posterLarge.replace('https://image.tmdb.org/t/p/w780', '') : '',
          vote_average: Math.round((movie.similarity || 0.8) * 10),
          release_date: `${movie.year}-01-01`,
          overview: movie.tagline || movie.pitch || '',
        });
        setWatchlistedIds(prev => [...prev, movie.id]);
        showToast(`Saved "${movie.title}" to Watchlist`);
      }
      localStorage.setItem('cinematix_watchlist', JSON.stringify(saved));
    } catch (err) {
      console.error(err);
    }
  }, [showToast]);

  const filteredRecs = useMemo(() => {
    const nextWatches = analysis?.yourNextWatches;
    if (!nextWatches) return [];
    if (activeRecFilter === 'all') return nextWatches;
    if (activeRecFilter === 'core') return nextWatches.filter(r => r.curationLens === 'core');
    if (activeRecFilter === 'horizon') return nextWatches.filter(r => r.curationLens === 'horizon');
    if (activeRecFilter === 'deep_cut') return nextWatches.filter(r => r.curationLens === 'deep_cut');
    if (activeRecFilter === 'atmosphere') return nextWatches.filter(r => (r.vector?.atmosphere || 0) >= 0.8);
    if (activeRecFilter === 'complexity') return nextWatches.filter(r => (r.vector?.complexity || 0) >= 0.75 || (r.vector?.imagination || 0) >= 0.8);
    if (activeRecFilter === 'emotionality') return nextWatches.filter(r => (r.vector?.emotionality || 0) >= 0.75 || (r.vector?.humanism || 0) >= 0.85);
    if (activeRecFilter === 'darkness') return nextWatches.filter(r => (r.vector?.darkness || 0) >= 0.7 || (r.vector?.psychologicalIntensity || 0) >= 0.8);
    return nextWatches;
  }, [analysis?.yourNextWatches, activeRecFilter]);

  if (!analysis || !analysis.primaryArchetype) {
    return (
      <div className="dna-error-recovery" style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        color: '#fff'
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', fontWeight: 700 }}>
          Movie DNA Profile
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '440px', marginBottom: '1.75rem', lineHeight: '1.6' }}>
          Your previous analysis session is ready to be refreshed. Start fresh to map your cinematic taste across 10 epic battles!
        </p>
        <button
          className="dna-begin-btn"
          onClick={onRestart}
          style={{ padding: '0.85rem 2rem', cursor: 'pointer' }}
        >
          Begin Movie DNA
        </button>
      </div>
    );
  }

  const {
    primaryArchetype,
    stabilityScore,
    complexityLabel,
    complexityScore,
    keyDecisions,
    soulmate,
    soulmateReasons,
    soulmateStrengthLabel,
    antiMovie,
    tasteHeatmap,
    primaryBlindSpot,
    secondaryBlindSpots,
  } = analysis;



  // Top 5 Dominant Forces (What You Gravitate Towards)
  const topLikes = tasteHeatmap?.dominantForces || [];
  // Top 5 Underused / Aversions (What You Actively Resist / Dislike)
  const topDislikes = tasteHeatmap?.underusedTerritories || [];

  return (
    <div className="dna-results-screen">
      {/* Soft Aurora backdrop */}
      <div className="dna-results-bg">
        <SoftAurora
          speed={0.25}
          scale={1.3}
          brightness={0.7}
          color1="#0c0c14"
          color2={primaryArchetype.color}
          noiseFrequency={2.0}
          noiseAmplitude={0.75}
          bandHeight={0.4}
          bandSpread={0.8}
          octaveDecay={0.2}
          enableMouseInteraction={false}
        />
      </div>
      <div className="dna-results-overlay" />

      <motion.div
        className="dna-results-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_PREMIUM }}
      >

        {/* ══ 1. IDENTITY HERO & GAUGES ═══════════════════════════ */}
        <div className="dna-identity-hero-section">
          <span className="dna-results-title-badge">Your Cinematic DNA Dossier</span>
          <div className="dna-identity-hero-grid">
            {/* Primary archetype card */}
            <div className="dna-identity-primary-card" style={{ '--card-color': primaryArchetype.color }}>
              <span className="dna-identity-eyebrow">Primary Cinematic Archetype</span>
              <h1 className="dna-identity-primary-name">{primaryArchetype.name}</h1>
              <p className="dna-identity-primary-sub">{primaryArchetype.subtitle}</p>
              <p className="dna-identity-primary-desc">{primaryArchetype.description}</p>
            </div>

            {/* Stats column */}
            <div className="dna-identity-stats-col">
              {/* Stability gauge */}
              <div className="dna-stat-gauge-card">
                <div className="dna-stat-gauge-visual">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" stroke="rgba(255,255,255,0.07)" strokeWidth="4" fill="none" />
                    <motion.circle
                      cx="36" cy="36" r="30"
                      stroke={primaryArchetype.color}
                      strokeWidth="4" fill="none"
                      strokeDasharray="188.5"
                      initial={{ strokeDashoffset: 188.5 }}
                      animate={{ strokeDashoffset: 188.5 - (188.5 * stabilityScore) / 100 }}
                      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                      strokeLinecap="round"
                      transform="rotate(-90 36 36)"
                    />
                  </svg>
                  <span className="dna-stat-gauge-num">{stabilityScore}%</span>
                </div>
                <div className="dna-stat-gauge-info">
                  <span className="dna-stat-gauge-label">Taste Stability</span>
                  <p className="dna-stat-gauge-desc">How clearly concentrated your aesthetic priorities are across choices.</p>
                </div>
              </div>

              {/* Complexity gauge */}
              <div className="dna-stat-gauge-card">
                <div className="dna-stat-gauge-visual">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" stroke="rgba(255,255,255,0.07)" strokeWidth="4" fill="none" />
                    <motion.circle
                      cx="36" cy="36" r="30"
                      stroke="rgba(164,143,255,0.9)"
                      strokeWidth="4" fill="none"
                      strokeDasharray="188.5"
                      initial={{ strokeDashoffset: 188.5 }}
                      animate={{ strokeDashoffset: 188.5 - (188.5 * complexityScore) / 100 }}
                      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.35 }}
                      strokeLinecap="round"
                      transform="rotate(-90 36 36)"
                    />
                  </svg>
                  <span className="dna-stat-gauge-num">{complexityScore}%</span>
                </div>
                <div className="dna-stat-gauge-info">
                  <span className="dna-stat-gauge-label">Profile Complexity</span>
                  <span className="dna-complexity-badge">{complexityLabel}</span>
                  <p className="dna-stat-gauge-desc">Range of contrasting genres and tones your profile integrates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ 2. TASTE ANALYSIS: WHAT YOU LOVE VS. WHAT YOU DISLIKE ══ */}
        <div className="dna-taste-breakdown-section">
          <div className="dna-section-header">
            <span className="dna-section-eyebrow">Psychological Taste Analysis</span>
            <h2 className="dna-section-title">What You Gravitate Towards vs. What You Resist</h2>
            <p className="dna-section-desc">
              Your 10 matchup decisions established definitive aesthetic boundaries. Here is exactly what you love in cinema — and what you consistently reject.
            </p>
          </div>

          <div className="dna-taste-columns-grid">
            {/* LIKES COLUMN: What You Gravitate Towards */}
            <div className="dna-taste-column likes-column">
              <div className="dna-taste-col-header">
                <div className="dna-taste-col-icon likes">✦</div>
                <div>
                  <h3 className="dna-taste-col-title">What You Gravitate Towards</h3>
                  <span className="dna-taste-col-sub">Your core aesthetic pillars</span>
                </div>
              </div>

              <div className="dna-taste-items-list">
                {topLikes.map((item, idx) => {
                  const traitInfo = TRAIT_ANALYSIS[item.dim]?.like || "A prominent driving force in your cinematic preferences.";
                  return (
                    <motion.div
                      key={`like-${item.dim}`}
                      className="dna-taste-card like-card"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.08 * idx, ease: EASE_PREMIUM }}
                    >
                      <div className="dna-taste-card-top">
                        <div className="dna-taste-card-left">
                          <span className="dna-taste-rank">#{item.rank}</span>
                          <span className="dna-taste-label">{item.label}</span>
                        </div>
                        <span className="dna-taste-pct high">{item.pct}%</span>
                      </div>
                      
                      <div className="dna-taste-bar-track">
                        <motion.div
                          className="dna-taste-bar-fill high"
                          style={{ '--fill-color': primaryArchetype.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.9, delay: 0.1 * idx }}
                        />
                      </div>

                      <p className="dna-taste-explanation">{traitInfo}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* DISLIKES COLUMN: What You Actively Resist */}
            <div className="dna-taste-column dislikes-column">
              <div className="dna-taste-col-header">
                <div className="dna-taste-col-icon dislikes">✕</div>
                <div>
                  <h3 className="dna-taste-col-title">What You Actively Resist</h3>
                  <span className="dna-taste-col-sub">Cinematic tropes your choices rejected</span>
                </div>
              </div>

              <div className="dna-taste-items-list">
                {topDislikes.map((item, idx) => {
                  const traitInfo = TRAIT_ANALYSIS[item.dim]?.dislike || "A dimension your choices consistently deprioritized.";
                  const resistanceLevel = 100 - item.pct;
                  return (
                    <motion.div
                      key={`dislike-${item.dim}`}
                      className="dna-taste-card dislike-card"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.08 * idx, ease: EASE_PREMIUM }}
                    >
                      <div className="dna-taste-card-top">
                        <div className="dna-taste-card-left">
                          <span className="dna-taste-rank aversion">✕</span>
                          <span className="dna-taste-label">{item.label}</span>
                        </div>
                        <span className="dna-taste-pct low">{resistanceLevel}% Resistance</span>
                      </div>
                      
                      <div className="dna-taste-bar-track aversion">
                        <motion.div
                          className="dna-taste-bar-fill aversion"
                          initial={{ width: 0 }}
                          animate={{ width: `${resistanceLevel}%` }}
                          transition={{ duration: 0.9, delay: 0.1 * idx }}
                        />
                      </div>

                      <p className="dna-taste-explanation aversion">{traitInfo}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ══ 3. CINEMATIC ANTI-MOVIE (THE POLAR OPPOSITE) ═══════ */}
        {antiMovie && (
          <motion.div
            className="dna-anti-movie-section"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          >
            <div className="dna-section-header">
              <span className="dna-section-eyebrow">The Polar Opposite</span>
              <h2 className="dna-section-title">Your Cinematic Anti-Movie</h2>
              <p className="dna-section-desc">The film in world cinema that sits furthest from your aesthetic worldview.</p>
            </div>

            <div className="dna-anti-movie-card">
              <div className="dna-anti-poster-col">
                <div className="dna-anti-poster-wrap">
                  <img
                    className="dna-anti-poster"
                    src={antiMovie.movie.posterLarge || antiMovie.movie.poster}
                    alt={antiMovie.movie.title}
                    draggable="false"
                    loading="lazy"
                    onError={handleImageFallback}
                    style={{ objectPosition: antiMovie.movie.posterPosition || 'center center' }}
                  />
                  <div className="dna-anti-tension-badge">{antiMovie.tensionLabel || "Polar Mismatch"}</div>
                </div>
              </div>

              <div className="dna-anti-content-col">
                <div className="dna-anti-header-block">
                  <span className="dna-anti-eyebrow-tag">Opposing Spectrum</span>
                  <h3 className="dna-anti-title">{antiMovie.movie.title}</h3>
                  <span className="dna-anti-meta">{antiMovie.movie.year} · Directed by {antiMovie.movie.director}</span>
                </div>

                <div className="dna-anti-clash-box">
                  <h4 className="dna-anti-clash-title">Why It Clashes With Your Instincts</h4>
                  <ul className="dna-anti-clash-list">
                    {antiMovie.clashReasons && antiMovie.clashReasons.map((reason, i) => (
                      <li key={i} className="dna-anti-clash-item">
                        <span className="dna-anti-bullet">✕</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {antiMovie.appreciationCheck && (
                  <div className="dna-anti-appreciation-box">
                    <span className="dna-anti-apprec-label">Cinephile Perspective:</span>
                    <p className="dna-anti-apprec-text">{antiMovie.appreciationCheck}</p>
                  </div>
                )}

                <div className="dna-anti-actions">
                  <button
                    className="dna-anti-view-btn"
                    onClick={() => navigate(`/movie/${antiMovie.movie.id}`)}
                  >
                    Inspect Film Details →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ 4. KEY DECISIONS ANALYSIS ══════════════════════════ */}
        {keyDecisions && keyDecisions.length > 0 && (
          <div className="dna-decisions-section">
            <div className="dna-section-header">
              <span className="dna-section-eyebrow">Pivotal Decisions</span>
              <h2 className="dna-section-title">The Battles That Defined You</h2>
              <p className="dna-section-desc">How your specific choices shaped your artistic hierarchy.</p>
            </div>
            <div className="dna-decisions-list">
              {keyDecisions.slice(0, 4).map((dec, idx) => (
                <motion.div
                  key={`kd-${idx}`}
                  className="dna-decision-row"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.06 * idx, ease: EASE_PREMIUM }}
                >
                  <div className="dna-decision-num" style={{ color: primaryArchetype.color }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="dna-decision-body">
                    <h4 className="dna-decision-heading">{dec.title}</h4>
                    <p className="dna-decision-text">{dec.prose}</p>
                    <div className="dna-decision-films">
                      {dec.evidence && dec.evidence.slice(0, 2).map((ev, ei) => (
                        <span key={ei} className="dna-decision-chip">
                          <span className="dna-chip-winner">✓ {ev.winner}</span>
                          <span className="dna-chip-sep">preferred over</span>
                          <span className="dna-chip-loser">{ev.loser}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 5. CINEMATIC SOULMATE ══════════════════════════════ */}
        {soulmate && (
          <motion.div
            className="dna-soulmate-section"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_PREMIUM }}
          >
            <div className="dna-section-header">
              <span className="dna-section-eyebrow">Purest Aesthetic Resonance</span>
              <h2 className="dna-section-title">Your Cinematic Soulmate</h2>
              <p className="dna-section-desc">The single film in cinema that most completely captures your artistic frequency.</p>
            </div>

            <div
              className="dna-soulmate-hero"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/movie/${soulmate.id}`)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/movie/${soulmate.id}`); }}
              aria-label={`View details for ${soulmate.title}`}
              style={{ '--soulmate-color': primaryArchetype.color }}
            >
              <div className="dna-soulmate-poster-col">
                <div className="dna-soulmate-poster-wrap">
                  <img
                    className="dna-soulmate-poster"
                    src={soulmate.posterLarge}
                    alt={soulmate.title}
                    draggable="false"
                    onError={handleImageFallback}
                    style={{ objectPosition: soulmate.posterPosition || 'center center' }}
                  />
                  <div className="dna-soulmate-poster-glow" />
                  <div className="dna-soulmate-poster-overlay" />
                </div>
              </div>

              <div className="dna-soulmate-content-col">
                <div className="dna-soulmate-strength-row">
                  <span className="dna-soulmate-strength-badge">
                    <span className="dna-soulmate-strength-dot" />
                    {soulmateStrengthLabel}
                  </span>
                </div>
                <div className="dna-soulmate-title-block">
                  <h2 className="dna-soulmate-title">{soulmate.title}</h2>
                  <span className="dna-soulmate-meta">{soulmate.year} · Directed by {soulmate.director}</span>
                </div>
                <div className="dna-soulmate-divider" />
                <div className="dna-soulmate-reasons">
                  <span className="dna-soulmate-reasons-label">Why this film?</span>
                  <ul className="dna-soulmate-reasons-list">
                    {soulmateReasons.map((reason, i) => (
                      <li key={i} className="dna-soulmate-reason-item">
                        <span className="dna-soulmate-reason-bullet">◆</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dna-soulmate-actions-row">
                  {soulmate.trailerKey && (
                    <button
                      className="dna-soulmate-trailer-btn"
                      onClick={(e) => { e.stopPropagation(); setPreviewTrailerKey(soulmate.trailerKey); }}
                      aria-label="Watch Clip"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>Watch Clip</span>
                    </button>
                  )}
                  <button
                    className={`dna-soulmate-watchlist-btn ${watchlistedIds.includes(soulmate.id) ? 'active' : ''}`}
                    onClick={(e) => toggleWatchlist(soulmate, e)}
                    aria-label="Add to Watchlist"
                  >
                    {watchlistedIds.includes(soulmate.id)
                      ? <><BookmarkCheck size={16} fill="currentColor" /><span>Watchlisted</span></>
                      : <><BookmarkPlus size={16} /><span>Watchlist</span></>
                    }
                  </button>
                  <div className="dna-soulmate-cta">
                    <span className="dna-soulmate-cta-text">View Film Details</span>
                    <span className="dna-soulmate-cta-arrow">→</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ 6. CINEMATIC BLIND SPOTS ══════════════════════════ */}
        <CinematicBlindSpotsSection
          primaryBlindSpot={primaryBlindSpot}
          secondaryBlindSpots={secondaryBlindSpots}
        />

        {/* ══ 7. CINEMATIC BLUEPRINT (YOUR 10 SELECTIONS) ═══════ */}
        <div className="dna-blueprint-section">
          <div className="dna-section-header">
            <span className="dna-section-eyebrow">Your 10 Selections</span>
            <h2 className="dna-section-title">Cinematic Blueprint</h2>
            <p className="dna-section-desc">The 10 films you chose — the foundational anchors of your profile.</p>
          </div>
          <div className="dna-blueprint-grid">
            {winners.map((winner, idx) => (
              <motion.div
                key={`winner-${idx}`}
                className="dna-blueprint-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * idx, ease: EASE_PREMIUM }}
                onClick={() => navigate(`/movie/${winner.movie.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/movie/${winner.movie.id}`); }}
                aria-label={`View ${winner.movie.title}`}
              >
                <div className="dna-blueprint-poster-wrap">
                  <img
                    className="dna-blueprint-poster"
                    src={winner.movie.posterLarge || winner.movie.poster}
                    alt={winner.movie.title}
                    draggable="false"
                    loading="lazy"
                    onError={handleImageFallback}
                    style={{ objectPosition: winner.movie.posterPosition || 'center center' }}
                  />
                  <span className="dna-blueprint-num">#{idx + 1}</span>
                  <div className="dna-blueprint-hover">
                    <span>View Details</span>
                  </div>
                </div>
                <div className="dna-blueprint-body">
                  <div className="dna-blueprint-title">{winner.movie.title}</div>
                  <div className="dna-blueprint-meta">{winner.movie.year} · {winner.movie.director}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══ 7. RECOMMENDED FILMS (NEXT WATCHES) ════════════════ */}
        <div className="dna-recs-section">
          <div className="dna-section-header">
            <span className="dna-section-eyebrow">Matched To Your Vector</span>
            <h2 className="dna-section-title">Personalized Film Catalog</h2>
            <p className="dna-section-desc">Carefully calibrated against your unique taste vector with verified official artwork.</p>
          </div>

          <div className="dna-recs-filter-row">
            {[
              { id: 'all', label: 'All Recommendations' },
              { id: 'core', label: '🎯 Core Canon' },
              { id: 'horizon', label: '⚡ Horizon Stretch' },
              { id: 'deep_cut', label: '💎 Deep Cuts' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`dna-recs-filter-pill ${activeRecFilter === tab.id ? 'active' : ''}`}
                onClick={() => setActiveRecFilter(tab.id)}
                style={activeRecFilter === tab.id ? { borderColor: primaryArchetype.color, background: `${primaryArchetype.color}20`, color: '#fff' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="dna-recs-grid">
            {filteredRecs.map((rec, idx) => {
              const isSaved = watchlistedIds.includes(rec.id);
              return (
                <motion.div
                  key={`rec-${rec.id || idx}`}
                  className="dna-rec-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(0.04 * idx, 0.35), ease: EASE_PREMIUM }}
                  onClick={() => navigate(`/movie/${rec.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/movie/${rec.id}`); }}
                  aria-label={`View ${rec.title}`}
                >
                  <div className="dna-rec-card-poster-wrap">
                    <img
                      className="dna-rec-card-poster"
                      src={rec.posterLarge || rec.poster}
                      alt={rec.title}
                      draggable="false"
                      loading="lazy"
                      onError={handleImageFallback}
                      style={{ objectPosition: rec.posterPosition || 'center center' }}
                    />
                    <span className="dna-rec-card-match">{rec.matchPct || Math.round((rec.similarity || 0.8) * 100)}% Match</span>
                    <div className="dna-rec-card-overlay">
                      <div className="dna-rec-card-overlay-actions">
                        {rec.trailerKey && (
                          <button
                            className="dna-rec-ov-btn"
                            onClick={(e) => { e.stopPropagation(); setPreviewTrailerKey(rec.trailerKey); }}
                          >
                            <Play size={13} fill="currentColor" /> Clip
                          </button>
                        )}
                        <button
                          className={`dna-rec-ov-btn watchlist ${isSaved ? 'active' : ''}`}
                          onClick={(e) => toggleWatchlist(rec, e)}
                        >
                          {isSaved ? <BookmarkCheck size={13} fill="currentColor" /> : <BookmarkPlus size={13} />}
                          {isSaved ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="dna-rec-card-body">
                    <div className="dna-rec-card-title">{rec.title}</div>
                    <div className="dna-rec-card-meta">{rec.year} · {rec.director}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ══ 8. RESTART CTA ═════════════════════════════════════ */}
        <div className="dna-results-actions">
          <motion.button
            className="dna-begin-btn dna-results-btn"
            onClick={onRestart}
            whileTap={{ scale: 0.97 }}
            aria-label="Restart Movie DNA Analysis"
          >
            Restart Analysis
            <svg className="dna-begin-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>

        {/* Trailer Modal */}
        {previewTrailerKey && (
          <DnaTrailerModal videoKey={previewTrailerKey} onClose={() => setPreviewTrailerKey(null)} />
        )}

        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              className="dna-toast-alert"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Check size={16} />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};



// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Session Persistence â€” localStorage helpers
// Key: 'cinematix_dna_session'
// Only a COMPLETED session (phase==='results') is persisted.
// The only way to clear it is an explicit Restart.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DNA_SESSION_KEY = 'cinematix_dna_session';

const loadDnaSession = () => {
  try {
    const raw = localStorage.getItem(DNA_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || typeof session !== 'object') return null;
    // Complete session sanity check — must have completed all battles with valid movie data
    if (!Array.isArray(session.winners) || session.winners.length < TOTAL_BATTLES) return null;
    if (!session.winners.every(w => w?.movie?.title)) return null;
    return session;
  } catch {
    return null;
  }
};

const saveDnaSession = (winners, analysis = null) => {
  try {
    localStorage.setItem(
      DNA_SESSION_KEY,
      JSON.stringify({ winners, analysis, savedAt: Date.now() })
    );
  } catch {
    // Ignore quota / private browsing errors
  }
};

const clearDnaSession = () => {
  try {
    localStorage.removeItem(DNA_SESSION_KEY);
  } catch {
    // Ignore storage errors.
  }
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Root: MovieDNA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MovieDNA = () => {
  // â”€â”€ Restore from localStorage if a completed session exists â”€â”€
  // useState lazy initializer runs only once â€” safe for session restoration.
  const [phase, setPhase] = useState(() => {
    const session = loadDnaSession();
    return session ? 'results' : 'intro';
  });
  const [battleIndex, setBattleIndex] = useState(0);
  const [cardStates, setCardStates]   = useState({ a: 'idle', b: 'idle' });
  const [showTransitionBlur, setShowTransitionBlur] = useState(false);
  const [winners, setWinners] = useState(() => {
    const session = loadDnaSession();
    return session ? session.winners : [];
  });
  const [cachedAnalysis, setCachedAnalysis] = useState(() => {
    const session = loadDnaSession();
    return session ? session.analysis : null;
  });
  // Timeline state
  const [timelinePendingIdx, setTimelinePendingIdx] = useState(null); // dot clicked, waiting for confirm
  const [isAnimating, setIsAnimating] = useState(false);              // true during winner reveal + advance
  const advanceTimer = useRef(null);

  // â”€â”€ Auto-save completed session to localStorage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (phase === 'results' && winners.length > 0) {
      saveDnaSession(winners, cachedAnalysis);
    }
  }, [phase, winners, cachedAnalysis]);

  // Preload all posters and backdrops to prevent flicker
  useEffect(() => {
    DNA_BATTLES.forEach(battle => {
      [battle.a, battle.b].forEach(movie => {
        const imgPoster = new Image();
        imgPoster.src = movie.posterLarge;
        const imgBackdrop = new Image();
        imgBackdrop.src = movie.backdrop;
      });
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const handleBegin = useCallback(() => {
    setPhase('battle');
  }, []);

  const handleRestart = useCallback(() => {
    clearDnaSession();            // â† only place that wipes the saved session
    setWinners([]);
    setCachedAnalysis(null);
    setBattleIndex(0);
    setCardStates({ a: 'idle', b: 'idle' });
    setPhase('intro');
  }, []);


  // Timeline dot clicked â€” show modal if it would erase choices
  const handleTimelineDotClick = useCallback((idx) => {
    if (isAnimating) return;
    if (idx >= battleIndex) return;
    setTimelinePendingIdx(idx);
  }, [isAnimating, battleIndex]);

  // Modal: user confirmed revisit
  const handleTimelineConfirm = useCallback(() => {
    const idx = timelinePendingIdx;
    setTimelinePendingIdx(null);
    if (idx === null) return;
    // Truncate winners to the target battle index and restore state
    setWinners(prev => prev.slice(0, idx));
    setBattleIndex(idx);
    setCardStates({ a: 'idle', b: 'idle' });
  }, [timelinePendingIdx]);

  // Modal: user cancelled
  const handleTimelineCancel = useCallback(() => {
    setTimelinePendingIdx(null);
  }, []);

  const handleSelect = useCallback((side) => {
    if (cardStates.a !== 'idle' || cardStates.b !== 'idle') return;

    const battle      = DNA_BATTLES[battleIndex];
    const loserSide   = side === 'a' ? 'b' : 'a';
    const winnerMovie = side === 'a' ? battle.a : battle.b;

    // Lock timeline for the duration of the reveal + advance
    setIsAnimating(true);

    // Record winner for the montage sequence with side and battleIndex
    setWinners(prev => [...prev, { movie: winnerMovie, color: battle.color, side, battleIndex }]);

    // Phase 1 (0ms): Trigger winner/loser card states
    setCardStates({ [side]: 'winner', [loserSide]: 'loser' });

    // Phase 2 (1050ms): Advance to next battle or complete
    advanceTimer.current = setTimeout(() => {
      const nextIndex = battleIndex + 1;

      if (nextIndex >= TOTAL_BATTLES) {
        // All battles done â€” cinematic blur transition
        setShowTransitionBlur(true);
        setTimeout(() => {
          setPhase('complete');
          setShowTransitionBlur(false);
          setIsAnimating(false);
        }, 900);
      } else {
        setBattleIndex(nextIndex);
        setCardStates({ a: 'idle', b: 'idle' });
        setIsAnimating(false);
      }
    }, 1050);
  }, [battleIndex, cardStates]);


  const currentBattle = DNA_BATTLES[battleIndex];
  const isSelecting = cardStates.a !== 'idle' || cardStates.b !== 'idle';
  const selectedMovie = cardStates.a === 'winner' ? currentBattle.a : cardStates.b === 'winner' ? currentBattle.b : null;

  return (
    <div className="dna-page">
      {/* Cinematic transition blur overlay */}
      <div className={`dna-transition-blur${showTransitionBlur ? ' active' : ''}`} />

      {/* Shared Stable Background Layers (Only mounted during battle phase) */}
      {phase === 'battle' && (
        <div className="dna-battle-bg-root">
          <div className="dna-battle-backdrop-container">
            <AnimatePresence>
              {isSelecting && selectedMovie && (
                <motion.div
                  className="dna-battle-backdrop-img"
                  key={`backdrop-${battleIndex}-${selectedMovie.id}`}
                  style={{
                    backgroundImage: `url(${selectedMovie.backdrop})`,
                    backgroundPosition: selectedMovie.posterPosition || 'center center'
                  }}
                  initial={{ opacity: 0, scale: 1.08, filter: 'blur(16px)' }}
                  animate={{ opacity: 1, scale: 1.02, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{
                    delay: 0.4, // Reveal AFTER winner is centered (400ms)
                    opacity: { duration: 0.6 },
                    scale: { duration: 0.8, ease: 'easeOut' },
                    filter: { duration: 0.6 }
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="dna-battle-snow-container"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isSelecting ? 0 : 1
            }}
            transition={
              isSelecting
                ? { duration: 0.35, ease: 'easeOut' }
                : { duration: 0.4, delay: 0.5 }
            }
          >
            <PixelSnow 
              color="#ffffff"
              flakeSize={0.015}
              minFlakeSize={1.25}
              pixelResolution={1200}
              speed={0.9}
              density={0.65}
              direction={150}
              brightness={2.2}
              depthFade={8.5}
              farPlane={27}
              gamma={0.4545}
              variant="round"
            />
          </motion.div>

          <div className="dna-battle-overlay" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" style={{ width: '100%' }}>
            <IntroScreen onBegin={handleBegin} />
          </motion.div>
        )}

        {phase === 'battle' && (
          <motion.div
            key={`battle-${battleIndex}`}
            style={{ width: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <BattleScreen
              battle={currentBattle}
              battleIndex={battleIndex}
              onSelect={handleSelect}
              cardStates={cardStates}
              winners={winners}
              timelineLocked={isAnimating || cardStates.a !== 'idle' || cardStates.b !== 'idle'}
              onTimelineDotClick={handleTimelineDotClick}
            />
          </motion.div>
        )}

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {timelinePendingIdx !== null && (
            <ResetConfirmationModal
              targetIndex={timelinePendingIdx}
              currentIndex={battleIndex}
              onConfirm={handleTimelineConfirm}
              onCancel={handleTimelineCancel}
            />
          )}
        </AnimatePresence>

        {phase === 'complete' && (
          <motion.div
            key="complete"
            style={{ width: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CompleteScreen winners={winners} onComplete={() => setPhase('results')} />
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div
            key="results"
            style={{ width: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ResultsScreen
              winners={winners}
              onRestart={handleRestart}
              cachedAnalysis={cachedAnalysis}
              onCacheAnalysis={setCachedAnalysis}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieDNA;
