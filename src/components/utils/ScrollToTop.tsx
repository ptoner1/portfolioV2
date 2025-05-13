import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top when navigating to a new page,
 * but preserves scrolling functionality for in-page navigation.
 */
const ScrollToTop: React.FC = () => {
  const { pathname, state, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Only scroll to top when:
    // 1. The pathname has changed (we're navigating to a different page)
    // 2. We're not navigating to the home page with a scroll target in state
    // 3. We're not using a hash link for in-page navigation
    const isHomeWithScrollTarget = 
      (pathname === '/' || pathname === '/about') && 
      state && 
      (state as any).scrollTarget;
    
    const isHashLink = hash !== '';
    const isPathChanged = prevPathname.current !== pathname;
    
    // Update the previous pathname reference
    prevPathname.current = pathname;
    
    // Only scroll to top when navigating to a new page without hash or scroll target
    if (isPathChanged && !isHomeWithScrollTarget && !isHashLink) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state, hash]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
