import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ReportCard } from "@/components/ReportCard";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Security Operations Dashboard</h1>
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
                View and manage weekly site visit reports from supervisors.
              </p>
              <Button asChild className="w-full">
                <Link to="/supervisor-reports">View Reports</Link>
              </Button>
            </div>
          </ReportCard>

          <ReportCard
            title="Manager Monthly Visits"
            subtitle="Monitor project performance"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Access monthly project visit reports and analytics.
              </p>
              <Button asChild className="w-full">
                <Link to="/manager-reports">View Reports</Link>
              </Button>
            </div>
          </ReportCard>

          <ReportCard
            title="Visitors Log"
            subtitle="Track visitor activity"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review and analyze visitor records and patterns.
              </p>
              <Button asChild className="w-full">
                <Link to="/visitor-logs">View Logs</Link>
              </Button>
            </div>
          </ReportCard>

          <ReportCard
            title="Company Cars Handover"
            subtitle="Manage vehicle transfers"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Track and manage company vehicle handover documentation.
              </p>
              <Button asChild className="w-full">
                <Link to="/car-handovers">View Forms</Link>
              </Button>
            </div>
          </ReportCard>
        </div>
      </div>
    </div>
  );
};

export default Index;