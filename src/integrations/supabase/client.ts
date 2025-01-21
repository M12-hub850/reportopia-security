import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jiqbosndzhevajffcinr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWJvc25kemhldmFqZmZjaW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDU3NDIsImV4cCI6MjA1MjQyMTc0Mn0.7UqdihjgJC5bYykHtJlIwibltIgyZF_d9RkwCEW2Tgk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'Content-Type': 'application/json',
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add error handling for fetch operations
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});