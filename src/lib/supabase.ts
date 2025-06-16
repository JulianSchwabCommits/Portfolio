import { createClient } from '@supabase/supabase-js';

// Environment variables required
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values if environment variables are missing
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-key';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl);
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing');
  console.warn('Using fallback values - Supabase features will not work properly');
}

// Create a single supabase client for the entire app using singleton pattern
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  // Check if there's already an instance in global scope to avoid duplicates
  if (globalThis.__SUPABASE_SINGLETON_INSTANCE) {
    supabaseInstance = globalThis.__SUPABASE_SINGLETON_INSTANCE;
    return supabaseInstance;
  }
    supabaseInstance = createClient(
    supabaseUrl || FALLBACK_URL,
    supabaseKey || FALLBACK_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'x-application-name': 'portfolio',
        },
      },
    }
  );
  
  // Store the instance globally to ensure true singleton pattern
  globalThis.__SUPABASE_SINGLETON_INSTANCE = supabaseInstance;
  
  return supabaseInstance;
};

// For backward compatibility - directly export the instance
export const supabase = getSupabase();

// Error handler for better debugging
export const handleSupabaseError = (error: any, operation: string = 'operation') => {
  console.error(`Supabase ${operation} error:`, error);
  return { error: true, message: error.message || 'An unexpected error occurred' };
};

// Add type declaration for global scope
declare global {
  var __SUPABASE_SINGLETON_INSTANCE: ReturnType<typeof createClient> | undefined;
} 