import { useEffect } from 'react';
import { initAnalytics } from '../utils/analytics';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Component that initializes analytics tracking when the app loads
 * This is a hidden component that should be included once in your app
 */

// Helper function to get or create a session ID
const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('analytics_session', sessionId);
  }
  return sessionId;
};

export function AnalyticsInit() {
  const location = useLocation();

  // Track page view on route change
  useEffect(() => {
    const trackPage = async () => {
      try {
        // Try to initialize analytics with RPC functions
        initAnalytics();
      } catch (error) {
        console.error('Error initializing analytics:', error);
        
        // Fallback: Try to directly insert into page_views table
        try {
          await supabase.from('page_views').insert({
            page_path: location.pathname,
            user_agent: navigator.userAgent,
            referrer: document.referrer,
            session_id: getOrCreateSessionId(),
            device_type: /mobile|android|iphone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
          });
        } catch (insertError) {
          console.error('Fallback analytics tracking failed:', insertError);
        }
      }
    };

    trackPage();
  }, [location.pathname]);

  // This component doesn't render anything visible
  return null;
} 