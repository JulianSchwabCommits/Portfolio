/**
 * Secure Analytics API - All database operations happen server-side
 * No direct database access from client-side code
 */

/**
 * Tracks a page view via secure API endpoint
 */
export async function track_page_view(path: string): Promise<string | null> {
  try {
    // Get client-side info that's safe to send
    const referrer = document.referrer;
    const screen_size = `${window.innerWidth}x${window.innerHeight}`;
    
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'track_page_view',
        page_path: path,
        referrer,
        screen_size
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.id || null;
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
 * Tracks a user interaction via secure API endpoint
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
    // Get current path
    const page_path = window.location.pathname;
    
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'track_interaction',
        action_type,
        page_path,
        element_id: element_id || null,
        element_class: element_class || null,
        element_type: element_type || null,
        x_position: x_position || null,
        y_position: y_position || null,
        value: value || null
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.id || null;
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