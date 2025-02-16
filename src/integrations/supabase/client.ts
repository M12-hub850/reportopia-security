
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jiqbosndzhevajffcinr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWJvc25kemhldmFqZmZjaW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDU3NDIsImV4cCI6MjA1MjQyMTc0Mn0.7UqdihjgJC5bYykHtJlIwibltIgyZF_d9RkwCEW2Tgk";

console.log('Initializing Supabase client with:', {
  url: SUPABASE_URL,
  hasKey: !!SUPABASE_PUBLISHABLE_KEY,
});

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: true,
    // Add CORS headers for auth requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enhanced error logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { 
    event, 
    sessionExists: !!session,
    domain: window.location.origin,
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
  
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully:', {
      userId: session?.user?.id,
      timestamp: new Date().toISOString()
    });
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out, clearing local storage');
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem('supabase.auth.token');
    }
  }
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully:', {
      timestamp: new Date().toISOString()
    });
  }
  if (event === 'USER_UPDATED') {
    console.log('User data updated:', {
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced network error handling
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Network connection restored:', {
      timestamp: new Date().toISOString()
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Refreshing session after network restore');
        supabase.auth.refreshSession();
      }
    }).catch(error => {
      console.error('Error refreshing session:', {
        error,
        timestamp: new Date().toISOString()
      });
    });
  });

  window.addEventListener('offline', () => {
    console.log('Network connection lost:', {
      timestamp: new Date().toISOString()
    });
  });
}

// Enhanced error event listener
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Failed to fetch')) {
      console.error('Supabase API connection error:', {
        error: event.reason,
        domain: window.location.origin,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        stack: event.reason?.stack
      });
    }
  });
}
