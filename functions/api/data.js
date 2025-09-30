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
        // No additional filtering needed for about
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

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}