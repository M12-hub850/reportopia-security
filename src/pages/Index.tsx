import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ReportCard } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";

const Index = () => {
  const navigate = useNavigate();
  const form = useForm();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/sign-in");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Form {...form}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight">Security Monitoring Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your security operations reports</p>
            </div>
            <NotificationsDropdown />
          </div>

          <DashboardStats />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              title="Events & Incidents"
              subtitle="Record security events and incidents"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Document and track security events and incidents with detailed information.
                </p>
                <Button asChild className="w-full">
                  <Link to="/event-incidents">Add New Report</Link>
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
                <Button asChild className="w-full">
                  <Link to="/car-handovers/new">Add New Report</Link>
                </Button>
              </div>
            </ReportCard>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default Index;