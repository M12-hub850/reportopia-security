
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
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          throw error;
        }

        console.log("Session status:", !!session);
        setIsAuthenticated(!!session);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event, !!session);
          setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error in auth check:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
