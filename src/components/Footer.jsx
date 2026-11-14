import { Clapperboard } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <Clapperboard className="logo-icon" />
            <span>Cinematix</span>
          </div>
          <p className="footer-desc">
            Your premium cinematic movie discovery platform. Explore trending movies, top ratings, and build your perfect watchlist.
          </p>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} Cinematix. All rights reserved.</p>
        <p className="tmdb-attribution">Data provided by TMDB.</p>
      </div>
    </footer>
  );
};

export default Footer;
