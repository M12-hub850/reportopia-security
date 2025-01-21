import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jiqbosndzhevajffcinr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWJvc25kemhldmFqZmZjaW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDU3NDIsImV4cCI6MjA1MjQyMTc0Mn0.7UqdihjgJC5bYykHtJlIwibltIgyZF_d9RkwCEW2Tgk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Add detailed error logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
  
  if (event === 'SIGNED_OUT') {
    console.log('User signed out, clearing local storage');
    localStorage.removeItem('supabase.auth.token');
  }
  if (event === 'SIGNED_IN') {
    console.log('User signed in, session exists:', !!session);
  }
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed, session exists:', !!session);
  }
  if (event === 'USER_UPDATED') {
    console.log('User updated, session exists:', !!session);
  }
  if (event === 'INITIAL_SESSION') {
    console.log('Initial session loaded, session exists:', !!session);
  }
});

// Add error handling for fetch operations
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && !session) {
    console.error('Auth state inconsistency: SIGNED_IN event but no session');
  }
});