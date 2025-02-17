
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ManagerReports from "./pages/ManagerReports";
import SupervisorReports from "./pages/SupervisorReports";
import EventIncidents from "./pages/EventIncidents";
import NewVehicleHandover from "./pages/NewVehicleHandover";
import ReportView from "./pages/ReportView";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configure the query client with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      retry: 1, // Only retry failed requests once
      refetchOnWindowFocus: false, // Disable automatic refetching when window gains focus
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setIsAuthenticated(!!session);
          console.log("Initial auth state:", !!session);
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (!mounted) return;
          
          console.log("Auth state changed:", event, !!session);
          if (event === 'SIGNED_IN') {
            setIsAuthenticated(true);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            // Clear any cached data on sign out
            queryClient.clear();
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error in auth check:", error);
        if (mounted) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/sign-in" />} 
            />
            <Route 
              path="/sign-in" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />} 
            />
            <Route 
              path="/sign-up" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />} 
            />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Index /> : <Navigate to="/sign-in" />} 
            />
            <Route 
              path="/admin" 
              element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/sign-in" />} 
            />
            <Route 
              path="/manager-reports" 
              element={isAuthenticated ? <ManagerReports /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/supervisor-reports" 
              element={isAuthenticated ? <SupervisorReports /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/event-incidents" 
              element={isAuthenticated ? <EventIncidents /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/car-handovers/new" 
              element={isAuthenticated ? <NewVehicleHandover /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/reports" 
              element={isAuthenticated ? <ReportView /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/settings" 
              element={isAuthenticated ? <Settings /> : <Navigate to="/dashboard" />} 
            />

            {/* Catch all route */}
            <Route 
              path="*" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/sign-in" />} 
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
