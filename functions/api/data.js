import { createClient } from '@supabase/supabase-js';

// Create Supabase client using environment variables (server-side only)
const getSupabaseClient = (env) => {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false, // Server-side usage
    },
    global: {
      headers: {
        'x-application-name': 'portfolio-api',
      },
    },
  });
};

// Helper to detect device type from user agent
const detectDeviceType = (userAgent) => {
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'Mobile';
  } else if (/ipad|tablet/i.test(userAgent)) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
};

// Helper to detect browser from user agent
const detectBrowser = (userAgent) => {
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
};

// Helper to detect OS from user agent
const detectOS = (userAgent) => {
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
};

// Helper to categorize traffic sources
const categorizeSources = (referrer) => {
  if (!referrer) {
    return 'Direct';
  } else if (/google|bing|yahoo|duckduckgo/i.test(referrer)) {
    return 'Search';
  } else if (/facebook|twitter|instagram|linkedin|pinterest|reddit/i.test(referrer)) {
    return 'Social';
  } else {
    return 'Referral';
  }
};

// Generate session ID from request headers for consistency
const generateSessionId = (request) => {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || '';
  return btoa(ip + userAgent).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table');
    const id = url.searchParams.get('id');
    
    // Validate table parameter (whitelist allowed tables)
    const allowedTables = ['projects', 'experiences', 'about'];
    if (!table || !allowedTables.includes(table)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid or missing table parameter',
        allowedTables 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = getSupabaseClient(env);
    
    let query = supabase.from(table).select('*');
    
    // Add specific filters based on table
    switch (table) {
      case 'projects':
        query = query.order('year', { ascending: false });
        if (id) query = query.eq('id', id);
        break;
      case 'experiences':
        query = query.order('period', { ascending: false });
        if (id) query = query.eq('id', id);
        break;
      case 'about':
        query = query.order('id', { ascending: true });
        if (id) query = query.eq('id', id);
        break;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      return new Response(JSON.stringify({ 
        error: 'Database query failed',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If requesting single item by ID, return single object
    if (id && data && data.length > 0) {
      return new Response(JSON.stringify(data[0]), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300' // 5 minutes cache
        }
      });
    }

    // Return array of results
    return new Response(JSON.stringify(data || []), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
      }
    });

  } catch (error) {
    console.error('Data API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle analytics operations
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { action, ...params } = data;
    
    const supabase = getSupabaseClient(env);
    
    switch (action) {
      case 'track_page_view':
        return await handlePageView(request, env, supabase, params);
      case 'track_interaction':
        return await handleInteraction(request, env, supabase, params);
      default:
        return new Response(JSON.stringify({ 
          error: 'Invalid action',
          allowedActions: ['track_page_view', 'track_interaction']
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process analytics request',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle page view tracking
async function handlePageView(request, env, supabase, params) {
  try {
    const { page_path, referrer, screen_size } = params;
    
    // Extract secure server-side info
    const userAgent = request.headers.get('User-Agent') || '';
    const ip = request.headers.get('CF-Connecting-IP') || 
               request.headers.get('X-Forwarded-For') || 
               'anonymous';
    const sessionId = generateSessionId(request);
    
    try {
      // Try RPC function first
      const { data, error } = await supabase.rpc('record_page_view', {
        page_path,
        user_agent: userAgent,
        ip_address: ip,
        referrer: referrer || '',
        screen_size: screen_size || ''
      });
      
      if (error) throw error;
      
      return new Response(JSON.stringify({ 
        success: true, 
        id: data 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (rpcError) {
      console.warn('RPC failed, using direct insert:', rpcError);
      
      // Fallback to direct insert
      const { data: insertData, error: insertError } = await supabase.from('page_views').insert({
        page_path,
        user_agent: userAgent,
        ip_address: ip,
        referrer: referrer || '',
        screen_size: screen_size || '',
        session_id: sessionId,
        device_type: detectDeviceType(userAgent),
        browser: detectBrowser(userAgent),
        operating_system: detectOS(userAgent),
        referrer_source: categorizeSources(referrer)
      }).select('id').single();
      
      if (insertError) throw insertError;
      
      return new Response(JSON.stringify({ 
        success: true, 
        id: insertData?.id 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Page view tracking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to track page view',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle interaction tracking
async function handleInteraction(request, env, supabase, params) {
  try {
    const { 
      action_type, 
      page_path, 
      element_id, 
      element_class, 
      element_type, 
      value, 
      x_position, 
      y_position 
    } = params;
    
    // Extract secure server-side info
    const userAgent = request.headers.get('User-Agent') || '';
    const ip = request.headers.get('CF-Connecting-IP') || 
               request.headers.get('X-Forwarded-For') || 
               'anonymous';
    
    const { data, error } = await supabase.rpc('record_user_interaction', {
      action_type,
      page_path,
      ip_address: ip,
      user_agent: userAgent,
      element_id: element_id || null,
      element_class: element_class || null,
      element_type: element_type || null,
      x_position: x_position || null,
      y_position: y_position || null,
      value: value || null
    });
    
    if (error) throw error;
    
    return new Response(JSON.stringify({ 
      success: true, 
      id: data 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Interaction tracking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to track interaction',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}