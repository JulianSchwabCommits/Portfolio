import { supabase } from './supabase';

export const trackPageView = async (path: string) => {
  try {
    await supabase.from('page_views').insert({
      page_path: path,
      visitor_ip: await getVisitorIP(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackInteraction = async (
  type: string,
  elementId: string,
  pagePath: string
) => {
  try {
    await supabase.from('user_interactions').insert({
      interaction_type: type,
      element_id: elementId,
      page_path: pagePath,
      visitor_ip: await getVisitorIP(),
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Error tracking interaction:', error);
  }
};

const getVisitorIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
}; 