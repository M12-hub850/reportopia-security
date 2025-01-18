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
import Help from "./pages/Help";
import About from "./pages/About";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      console.log("Auth state changed:", event, !!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
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
            path="/manager-reports" 
            element={isAuthenticated ? <ManagerReports /> : <Navigate to="/sign-in" />} 
          />
          <Route 
            path="/supervisor-reports" 
            element={isAuthenticated ? <SupervisorReports /> : <Navigate to="/sign-in" />} 
          />
          <Route 
            path="/event-incidents" 
            element={isAuthenticated ? <EventIncidents /> : <Navigate to="/sign-in" />} 
          />
          <Route 
            path="/car-handovers/new" 
            element={isAuthenticated ? <NewVehicleHandover /> : <Navigate to="/sign-in" />} 
          />
          <Route 
            path="/reports" 
            element={isAuthenticated ? <ReportView /> : <Navigate to="/sign-in" />} 
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <Settings /> : <Navigate to="/sign-in" />} 
          />
          <Route 
            path="/help" 
            element={isAuthenticated ? <Help /> : <Navigate to="/sign-in" />} 
          />
          <Route 
            path="/about" 
            element={isAuthenticated ? <About /> : <Navigate to="/sign-in" />} 
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;