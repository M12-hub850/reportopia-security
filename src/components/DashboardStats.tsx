import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, AlertTriangle } from "lucide-react";

const stats = [
  {
    title: "Weekly Visits",
    value: "24",
    icon: ClipboardList,
    description: "Supervisor site visits this week",
  },
  {
    title: "Monthly Visits",
    value: "86",
    icon: Users,
    description: "Manager project visits this month",
  },
  {
    title: "Events & Incidents",
    value: "12",
    icon: AlertTriangle,
    description: "Total events and incidents reported",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="animate-fadeIn backdrop-blur-sm bg-white/50 border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}