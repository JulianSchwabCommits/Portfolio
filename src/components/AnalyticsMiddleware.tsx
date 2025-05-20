import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track_page_view, track_interaction, initAnalytics, trackClick } from '../utils/analytics';

export default function AnalyticsMiddleware() {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics tracking when the app loads
    initAnalytics();
    
    // Track page view on route changes
    const handleRouteChange = () => {
      track_page_view(location.pathname);
    };
    
    // Track initial page view
    handleRouteChange();
    
    // Listen for route changes (React Router doesn't trigger page reloads)
    return () => {
      // Clean up event listeners if needed
    };
  }, [location.pathname]);

  return null;
} 