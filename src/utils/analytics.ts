import { supabase } from '../lib/supabase';

/**
 * Tracks a page view in the database
 */
export async function track_page_view(path: string): Promise<string | null> {
  try {
    // Get user agent and referrer from browser
    const user_agent = navigator.userAgent;
    const referrer = document.referrer;
    const screen_size = `${window.innerWidth}x${window.innerHeight}`;
    
    try {
      // First attempt: Try to use the record_page_view RPC function
      const { data, error } = await supabase.rpc('record_page_view', {
        page_path: path,
        user_agent,
        ip_address: 'anonymous', // For privacy reasons, we're using 'anonymous' instead of actual IP
        referrer,
        screen_size
      });
      
      if (error) throw error;
      return data as string;
    } catch (rpcError) {
      console.warn('RPC record_page_view failed, falling back to direct insert:', rpcError);
      
      // Fallback: Direct insert to page_views table
      const sessionId = getSessionId();
      const { data: insertData, error: insertError } = await supabase.from('page_views').insert({
        page_path: path,
        user_agent,
        ip_address: 'anonymous',
        referrer,
        screen_size,
        session_id: sessionId,
        device_type: detectDeviceType(user_agent),
        browser: detectBrowser(user_agent),
        operating_system: detectOS(user_agent),
        referrer_source: categorizeSources(referrer)
      }).select('id').single();
      
      if (insertError) throw insertError;
      return insertData?.id as string;
    }
  } catch (err) {
    console.error('Failed to track page view:', err);
    return null;
  }
}

// Helper to generate a consistent session ID
function getSessionId(): string {
  const storageKey = 'analytics_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

// Helper to detect device type from user agent
function detectDeviceType(userAgent: string): string {
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'Mobile';
  } else if (/ipad|tablet/i.test(userAgent)) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}

// Helper to detect browser from user agent
function detectBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) {
    return 'Chrome';
  } else if (/firefox/i.test(userAgent)) {
    return 'Firefox';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    return 'Safari';
  } else if (/edge|edg/i.test(userAgent)) {
    return 'Edge';
  } else if (/opera|opr/i.test(userAgent)) {
    return 'Opera';
  } else if (/msie|trident/i.test(userAgent)) {
    return 'Internet Explorer';
  } else {
    return 'Other';
  }
}

// Helper to detect OS from user agent
function detectOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) {
    return 'Windows';
  } else if (/macintosh|mac os/i.test(userAgent)) {
    return 'MacOS';
  } else if (/linux/i.test(userAgent) && !/android/i.test(userAgent)) {
    return 'Linux';
  } else if (/android/i.test(userAgent)) {
    return 'Android';
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'iOS';
  } else {
    return 'Other';
  }
}

// Helper to categorize traffic sources
function categorizeSources(referrer: string): string {
  if (!referrer) {
    return 'Direct';
  } else if (/google|bing|yahoo|duckduckgo/i.test(referrer)) {
    return 'Search';
  } else if (/facebook|twitter|instagram|linkedin|pinterest|reddit/i.test(referrer)) {
    return 'Social';
  } else {
    return 'Referral';
  }
}

/**
 * Interaction types for tracking user actions
 */
export type InteractionType = 
  | 'click' 
  | 'scroll' 
  | 'hover' 
  | 'form_submit' 
  | 'button_click' 
  | 'link_click' 
  | 'download' 
  | 'video_play' 
  | 'video_pause' 
  | 'input_change' 
  | 'copy' 
  | 'custom';

/**
 * Tracks a user interaction in the database
 */
export async function track_interaction(
  action_type: InteractionType,
  element_id?: string,
  element_class?: string,
  element_type?: string,
  value?: string,
  x_position?: number,
  y_position?: number
): Promise<string | null> {
  try {
    // Get current path and user agent
    const page_path = window.location.pathname;
    const user_agent = navigator.userAgent;
    
    // Call the record_user_interaction function in Supabase
    const { data, error } = await supabase.rpc('record_user_interaction', {
      action_type,
      page_path,
      ip_address: 'anonymous', // For privacy reasons
      user_agent,
      element_id: element_id || null,
      element_class: element_class || null,
      element_type: element_type || null,
      x_position: x_position || null,
      y_position: y_position || null,
      value: value || null
    });
    
    if (error) {
      console.error('Error tracking interaction:', error);
      return null;
    }
    
    return data as string;
  } catch (err) {
    console.error('Failed to track interaction:', err);
    return null;
  }
}

/**
 * Helper function to track clicks on elements
 */
export function trackClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  
  if (!target) return;
  
  // Get element details
  const element_id = target.id || '';
  const element_class = Array.from(target.classList).join(' ') || '';
  const element_type = target.tagName.toLowerCase();
  const value = (target as any).value || '';
  
  // Track the interaction
  track_interaction(
    target.tagName === 'A' ? 'link_click' : 
    target.tagName === 'BUTTON' ? 'button_click' : 'click',
    element_id,
    element_class,
    element_type,
    value,
    event.clientX,
    event.clientY
  );
}

/**
 * Helper function to setup analytics tracking on a page
 */
export function setupAnalytics(): void {
  // Track initial page view
  track_page_view(window.location.pathname);
  
  // Add listeners for navigation events (useful for SPA)
  window.addEventListener('popstate', () => {
    track_page_view(window.location.pathname);
  });
  
  // Track clicks on the document
  document.addEventListener('click', trackClick);
  
  // Track form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    track_interaction(
      'form_submit',
      form.id,
      Array.from(form.classList).join(' '),
      'form',
      form.action
    );
  });
}

/**
 * Initialize analytics tracking
 * Call this function once when the app loads
 */
export function initAnalytics(): void {
  if (typeof window !== 'undefined') {
    setupAnalytics();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      document.removeEventListener('click', trackClick);
    });
    
    console.log('Analytics tracking initialized');
  }
} 