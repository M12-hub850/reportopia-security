
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jiqbosndzhevajffcinr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWJvc25kemhldmFqZmZjaW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDU3NDIsImV4cCI6MjA1MjQyMTc0Mn0.7UqdihjgJC5bYykHtJlIwibltIgyZF_d9RkwCEW2Tgk";

// Get the current origin
const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

console.log('Initializing Supabase client with:', {
  url: SUPABASE_URL,
  hasKey: !!SUPABASE_PUBLISHABLE_KEY,
  origin,
  timestamp: new Date().toISOString()
});

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    },
    fetch: async (url, options: RequestInit = {}) => {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Add authorization header if we have a token
      const headers = new Headers(options.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Make the request
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Supabase request failed:', {
          url,
          status: response.status,
          error,
          timestamp: new Date().toISOString()
        });
        throw new Error(error.message || 'An error occurred with the request');
      }

      return response;
    }
  }
});

// Clear any existing sessions on client initialization
if (typeof window !== 'undefined') {
  window.localStorage?.removeItem('supabase.auth.token');
}

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
    window.localStorage?.removeItem('supabase.auth.token');
  }
});

// Enhanced error event listener
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Failed to fetch')) {
      console.error('Supabase API connection error:', {
        error: event.reason,
        domain: window.location.origin,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    }
  });
}
