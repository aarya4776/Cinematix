import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Discover, { clearDiscoverCache } from './pages/Discover';
import Watchlist from './pages/Watchlist';
import TonightsPick from './pages/TonightsPick';
import DirectorUniverse from './pages/DirectorUniverse';
import MovieDNA from './pages/MovieDNA';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';

function DiscoverCacheWatcher() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If the user navigates completely away from Discover and Movie Details,
    // clear the Discover cache so returning to Discover later starts fresh.
    if (pathname !== '/discover' && !pathname.startsWith('/movie/')) {
      clearDiscoverCache();
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <DiscoverCacheWatcher />
      <div className="app-container">
        <Navbar />
        <main style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/movie/:id" element={<PageTransition><MovieDetails /></PageTransition>} />
            <Route path="/director/:id" element={<PageTransition><DirectorUniverse /></PageTransition>} />
            <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
            <Route path="/watchlist" element={<PageTransition><Watchlist /></PageTransition>} />
            <Route path="/tonights-pick" element={<PageTransition><TonightsPick /></PageTransition>} />
            <Route path="/movie-dna" element={<PageTransition><MovieDNA /></PageTransition>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

