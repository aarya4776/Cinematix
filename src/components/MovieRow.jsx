import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MovieRow.css';

const MovieRow = ({ title, subtitle, movies }) => {
  const containerRef = useRef(null);
  const rowRef = useRef(null);
  const [showLeftOverlay, setShowLeftOverlay] = useState(false);
  const [showRightOverlay, setShowRightOverlay] = useState(true);
  const [hasRevealed, setHasRevealed] = useState(false);
  const movieCount = movies?.length || 0;

  const updateScrollState = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftOverlay(scrollLeft > 10);
      setShowRightOverlay(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const rowEl = rowRef.current;
    if (rowEl) {
      updateScrollState();
      rowEl.addEventListener('scroll', updateScrollState);
      
      const resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(rowEl);

      return () => {
        rowEl.removeEventListener('scroll', updateScrollState);
        resizeObserver.disconnect();
      };
    }
  }, [movies]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl || hasRevealed || movieCount === 0) return undefined;

    if (!('IntersectionObserver' in window)) {
      const frameId = requestAnimationFrame(() => {
        setHasRevealed(true);
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasRevealed(true);
        observer.unobserve(entry.target);
      }
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, [hasRevealed, movieCount]);

  if (!movies || movies.length === 0) return null;

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={`movie-row-container container row-reveal ${hasRevealed ? 'revealed' : ''}`}
      ref={containerRef}
    >
      <div className="movie-row-header">
        <h2 className="row-title">{title}</h2>
        {subtitle && <p className="row-subtitle">{subtitle}</p>}
      </div>

      <div className="movie-row-slider-wrapper">
        {/* Left Edge Fade & Chevron */}
        <div className={`row-fade-overlay left-fade ${showLeftOverlay ? 'active' : ''}`} />
        <button 
          className={`row-scroll-btn left-btn ${showLeftOverlay ? 'visible' : ''}`} 
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Edge Fade & Chevron */}
        <div className={`row-fade-overlay right-fade ${showRightOverlay ? 'active' : ''}`} />
        <button 
          className={`row-scroll-btn right-btn ${showRightOverlay ? 'visible' : ''}`} 
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        {/* Horizontal Scroll Shelf */}
        <div className="movie-row" ref={rowRef}>
          {movies.map((movie, index) => (
            <div key={movie.id} className="row-card-shell" style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
