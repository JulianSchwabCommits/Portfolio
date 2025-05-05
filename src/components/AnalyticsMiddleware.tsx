import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackInteraction } from '../lib/analytics';

export default function AnalyticsMiddleware() {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    trackPageView(location.pathname);

    // Track clicks on interactive elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementId = target.id || target.getAttribute('data-analytics-id');
      
      if (elementId) {
        trackInteraction('click', elementId, location.pathname);
      }
    };

    // Track form submissions
    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      const formId = form.id || form.getAttribute('data-analytics-id');
      
      if (formId) {
        trackInteraction('form_submit', formId, location.pathname);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [location]);

  return null;
} 