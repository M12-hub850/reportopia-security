import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { ReportType } from "@/types/supabase";
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

  const { data: pendingMonthlyVisits, isLoading: monthlyLoading } = useQuery({
    queryKey: ['pending-monthly-visits', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return 0;
      const { data, error } = await supabase.rpc('get_pending_monthly_visits', { 
        user_id: currentUserId 
      });
      if (error) throw error;
      return data?.[0]?.count || 0;
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

  const handleMonthlyVisitClick = () => {
    if (pendingMonthlyVisits && pendingMonthlyVisits > 0) {
      navigate('/manager-reports');
    }
  };

  const stats = [
    {
      title: t.monthlyVisits.title,
      value: monthlyLoading ? "..." : pendingMonthlyVisits?.toString() || "0",
      icon: Users,
      description: t.monthlyVisits.description,
      onClick: handleMonthlyVisitClick,
      isPending: pendingMonthlyVisits && pendingMonthlyVisits > 0
    },
    {
      title: t.incidents.title,
      value: incidentsLoading ? "..." : incidents?.toString() || "0",
      icon: AlertTriangle,
      description: t.incidents.description
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className={`animate-fadeIn backdrop-blur-sm bg-white/50 border-2 ${
            stat.isPending ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
          }`}
          onClick={stat.onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
              {stat.isPending && (
                <span className="ml-2 text-xs text-red-500">(Pending)</span>
              )}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${
              stat.isPending ? 'text-red-500' : 'text-muted-foreground'
            }`} />
          </CardHeader>
          <CardContent>
            {monthlyLoading || incidentsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.isPending && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={stat.onClick}
                  >
                    Submit Monthly Report
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}