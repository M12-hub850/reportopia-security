import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export function DashboardStats() {
  const { language } = useLanguage();
  const userId = supabase.auth.getUser().then(response => response.data.user?.id);

  // Use a single query for user ID to avoid multiple fetches
  const { data: currentUserId } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id;
    },
  });

  const { data: weeklyVisits, isLoading: weeklyLoading } = useQuery({
    queryKey: ['weekly-visits', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return 0;
      const { data, error } = await supabase.rpc('get_weekly_visits', { 
        user_id: currentUserId 
      });
      if (error) throw error;
      return data.reduce((acc: number, curr: any) => acc + Number(curr.count), 0);
    },
    enabled: !!currentUserId,
  });

  const { data: monthlyVisits, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthly-visits', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return 0;
      const { data, error } = await supabase.rpc('get_monthly_visits', { 
        user_id: currentUserId 
      });
      if (error) throw error;
      return data.reduce((acc: number, curr: any) => acc + Number(curr.count), 0);
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
        .eq('type', 'event_incident')
        .eq('user_id', currentUserId);
      if (error) throw error;
      return count;
    },
    enabled: !!currentUserId,
  });

  const t = translations[language].dashboard.stats;

  const stats = [
    {
      title: t.weeklyVisits.title,
      value: weeklyLoading ? "..." : weeklyVisits?.toString() || "0",
      icon: ClipboardList,
      description: t.weeklyVisits.description
    },
    {
      title: t.monthlyVisits.title,
      value: monthlyLoading ? "..." : monthlyVisits?.toString() || "0",
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
    </div>
  );
}