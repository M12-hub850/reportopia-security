
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/DashboardStats";
import { VisitsOverview } from "@/components/VisitsOverview";
import { Eye } from "lucide-react";

export function DashboardContent() {
  return (
    <div className="grid gap-6">
      <DashboardStats />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-blue-50 border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                Overview
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VisitsOverview />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-blue-50 border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Welcome!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your dashboard overview. You can view your visits and manage your tasks from here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
