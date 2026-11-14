import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div className="fade-page" key={location.pathname}>
      {children}
    </div>
  );
};

export default PageTransition;
