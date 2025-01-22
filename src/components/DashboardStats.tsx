import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, AlertTriangle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { WeeklyVisitsReturn, MonthlyVisitsReturn, ReportType } from "@/types/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function DashboardStats() {
  const { language } = useLanguage();
  const t = translations[language].dashboard.stats;
  const navigate = useNavigate();

  const { data: currentUserId } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id;
    },
  });

  const { data: weeklyVisits, isLoading: weeklyLoading } = useQuery<WeeklyVisitsReturn>({
    queryKey: ['weekly-visits', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await supabase.rpc('get_weekly_visits', { 
        user_id: currentUserId 
      });
      if (error) throw error;
      return data as WeeklyVisitsReturn;
    },
    enabled: !!currentUserId,
  });

  const { data: monthlyVisits, isLoading: monthlyLoading } = useQuery<MonthlyVisitsReturn>({
    queryKey: ['monthly-visits', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await supabase.rpc('get_monthly_visits', { 
        user_id: currentUserId 
      });
      if (error) throw error;
      return data as MonthlyVisitsReturn;
    },
    enabled: !!currentUserId,
  });

  const { data: incidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents-count', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return 0;
      const { count, error } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'event_incident' as ReportType)
        .eq('user_id', currentUserId);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!currentUserId,
  });

  const { data: pendingVisits, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-supervisor-visits', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return 0;
      const { data, error } = await supabase.rpc('get_pending_supervisor_visits', {
        user_id: currentUserId
      });
      if (error) throw error;
      return data?.[0]?.count || 0;
    },
    enabled: !!currentUserId,
  });

  const handlePendingClick = () => {
    navigate('/supervisor-reports');
  };

  const stats = [
    {
      title: t.weeklyVisits.title,
      value: weeklyLoading ? "..." : (weeklyVisits?.reduce((acc, curr) => acc + Number(curr.count), 0) || "0").toString(),
      icon: ClipboardList,
      description: t.weeklyVisits.description
    },
    {
      title: t.monthlyVisits.title,
      value: monthlyLoading ? "..." : (monthlyVisits?.reduce((acc, curr) => acc + Number(curr.count), 0) || "0").toString(),
      icon: Users,
      description: t.monthlyVisits.description
    },
    {
      title: t.incidents.title,
      value: incidentsLoading ? "..." : incidents?.toString() || "0",
      icon: AlertTriangle,
      description: t.incidents.description
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="animate-fadeIn backdrop-blur-sm bg-white/50 border-2"
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

      {/* Pending Supervisor Visits Card */}
      <Card 
        className="animate-fadeIn backdrop-blur-sm bg-white/50 border-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handlePendingClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Supervisor Visits</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{pendingVisits}</div>
              <p className="text-xs text-muted-foreground">Click to add pending reports</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={handlePendingClick}
              >
                View Pending Reports
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}