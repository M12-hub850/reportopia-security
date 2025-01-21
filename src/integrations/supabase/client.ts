import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jiqbosndzhevajffcinr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWJvc25kemhldmFqZmZjaW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDU3NDIsImV4cCI6MjA1MjQyMTc0Mn0.7UqdihjgJC5bYykHtJlIwibltIgyZF_d9RkwCEW2Tgk";

// Log the current domain
console.log('Current domain:', window.location.origin);
console.log('Current hostname:', window.location.hostname);
console.log('Current URL:', window.location.href);

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: true // Enable debug mode to see detailed auth logs
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'X-Supabase-Auth': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add detailed error logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { 
    event, 
    sessionExists: !!session,
    domain: window.location.origin,
    url: window.location.href
  });
  
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully:', session?.user?.id);
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out, clearing local storage');
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem('supabase.auth.token');
    }
  }
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  if (event === 'USER_UPDATED') {
    console.log('User data updated');
  }
});

// Add network error handling
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

  window.addEventListener('offline', () => {
    console.log('Network connection lost');
  });
}

// Add error event listener
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Failed to fetch')) {
      console.error('Supabase API connection error:', {
        error: event.reason,
        domain: window.location.origin,
        url: window.location.href
      });
    }
  });
}