
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/DashboardStats";
import { VisitsOverview } from "@/components/VisitsOverview";
import { Eye, LayoutDashboard, Activity, ChevronRight } from "lucide-react";

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
            <CardTitle className="flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                Quick Start
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-purple-500" />
                <p className="text-muted-foreground flex-1">
                  Track your daily activities and insights
                </p>
                <ChevronRight className="h-5 w-5 text-purple-400" />
              </div>
              <div className="h-px bg-gradient-to-r from-purple-100 to-blue-100" />
              <p className="text-sm text-muted-foreground italic">
                Your personalized dashboard experience awaits
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
