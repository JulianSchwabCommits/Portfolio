import { createClient } from '@supabase/supabase-js';

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const supabase_anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values if environment variables are missing
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-key';

if (!supabase_url || !supabase_anon_key) {
  console.warn('Missing Supabase environment variables in utils/supabase.ts');
  console.warn('VITE_SUPABASE_URL:', supabase_url);
  console.warn('VITE_SUPABASE_ANON_KEY:', supabase_anon_key ? 'Present' : 'Missing');
  console.warn('All env vars:', Object.keys(import.meta.env));
  console.warn('Using fallback values - Supabase features will not work properly');
}

export const supabase = createClient(
  supabase_url || FALLBACK_URL, 
  supabase_anon_key || FALLBACK_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);