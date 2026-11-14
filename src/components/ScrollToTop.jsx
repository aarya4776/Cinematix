import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // If returning to /discover with a saved scroll position, let Discover handle scroll restoration
    if (pathname === '/discover' && sessionStorage.getItem('cinematix_discover_scroll')) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
