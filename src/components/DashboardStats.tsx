import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./DateRangeFilter";

export function DashboardStats() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(addDays(new Date(), -7)), // Default to last 7 days
    to: endOfDay(new Date())
  });

  console.log("Date range:", dateRange);
  console.log("Fetching dashboard stats...");

  const { data: weeklyVisits, isLoading: weeklyLoading } = useQuery({
    queryKey: ['weekly-visits', dateRange],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) return 0;
      const { data, error } = await supabase.rpc('get_weekly_visits', { 
        user_id: (await supabase.auth.getUser()).data.user?.id,
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString()
      });
      if (error) throw error;
      console.log("Weekly visits data:", data);
      return data.reduce((acc: number, curr: any) => acc + Number(curr.count), 0);
    }
  });

  const { data: monthlyVisits, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthly-visits', dateRange],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) return 0;
      const { data, error } = await supabase.rpc('get_monthly_visits', { 
        user_id: (await supabase.auth.getUser()).data.user?.id,
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString()
      });
      if (error) throw error;
      console.log("Monthly visits data:", data);
      return data.reduce((acc: number, curr: any) => acc + Number(curr.count), 0);
    }
  });

  const { data: incidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents-count', dateRange],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) return 0;
      const { data: { user } } = await supabase.auth.getUser();
      const { count, error } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'event_incident')
        .eq('user_id', user?.id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());
      if (error) throw error;
      console.log("Incidents count:", count);
      return count;
    }
  });

  const stats = [
    {
      title: "Weekly Visits",
      value: weeklyLoading ? "..." : weeklyVisits?.toString() || "0",
      icon: ClipboardList,
      description: "Supervisor site visits in selected period",
      path: "/supervisor-reports"
    },
    {
      title: "Monthly Visits",
      value: monthlyLoading ? "..." : monthlyVisits?.toString() || "0",
      icon: Users,
      description: "Manager project visits in selected period",
      path: "/manager-reports"
    },
    {
      title: "Events & Incidents",
      value: incidentsLoading ? "..." : incidents?.toString() || "0",
      icon: AlertTriangle,
      description: "Events and incidents in selected period",
      path: "/event-incidents"
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeFilter date={dateRange} onDateChange={setDateRange} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="animate-fadeIn backdrop-blur-sm bg-white/50 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
            onClick={() => navigate(stat.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {weeklyLoading || monthlyLoading || incidentsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}