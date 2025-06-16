import { createClient } from '@supabase/supabase-js';

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const supabase_anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabase_url || !supabase_anon_key) {
  console.error('Missing Supabase environment variables in utils/supabase.ts');
  console.error('VITE_SUPABASE_URL:', supabase_url);
  console.error('VITE_SUPABASE_ANON_KEY:', supabase_anon_key ? 'Present' : 'Missing');
}

export const supabase = createClient(
  supabase_url || '', 
  supabase_anon_key || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);