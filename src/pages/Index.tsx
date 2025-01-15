import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ReportCard } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { useState } from "react";
import { VehicleHandoverSection } from "@/components/VehicleHandoverSection";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
      }
    };
    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/sign-in");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Security Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your security operations reports</p>
        </div>

        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ReportCard
            title="Supervisor Weekly Visits"
            subtitle="Track site inspections and observations"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create and manage weekly site visit reports from supervisors.
              </p>
              <Button asChild className="w-full">
                <Link to="/supervisor-reports">Add New Report</Link>
              </Button>
            </div>
          </ReportCard>

          <ReportCard
            title="Manager Monthly Visits"
            subtitle="Monitor project performance"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create and track monthly project visit reports and analytics.
              </p>
              <Button asChild className="w-full">
                <Link to="/manager-reports">Add New Report</Link>
              </Button>
            </div>
          </ReportCard>

          <ReportCard
            title="Vehicle Handovers"
            subtitle="Document vehicle transfers and conditions"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create and manage vehicle handover reports with photos and condition details.
              </p>
              <Button 
                className="w-full"
                onClick={() => setShowHandoverForm(true)}
              >
                Add New Report
              </Button>
            </div>
          </ReportCard>
        </div>

        {showHandoverForm && (
          <VehicleHandoverSection onClose={() => setShowHandoverForm(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;