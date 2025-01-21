import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jiqbosndzhevajffcinr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWJvc25kemhldmFqZmZjaW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDU3NDIsImV4cCI6MjA1MjQyMTc0Mn0.7UqdihjgJC5bYykHtJlIwibltIgyZF_d9RkwCEW2Tgk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Add detailed error logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, !!session);
  if (event === 'SIGNED_IN') {
    console.log('User signed in, session exists:', !!session);
    console.log('Session details:', session);
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out, clearing local storage');
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem('supabase.auth.token');
    }
  }
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed, session exists:', !!session);
  }
  if (event === 'USER_UPDATED') {
    console.log('User updated:', session?.user);
  }
});

// Add error handling for network issues
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Network connection restored');
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Refreshing session after network restore');
        supabase.auth.refreshSession();
      }
    });
  });
}