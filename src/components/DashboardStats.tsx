
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export function DashboardStats() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = translations[language].dashboard;

  // Use React Query to fetch the current user
  const { data: userData } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const currentUserId = userData?.id;

  // Fetch pending monthly visits
  const { data: pendingMonthlyVisits, isLoading: monthlyLoading, refetch: refetchMonthlyVisits } = useQuery({
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

  // Fetch pending supervisor visits
  const { data: pendingSupervisorVisits, isLoading: supervisorLoading, refetch: refetchSupervisorVisits } = useQuery({
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

  const handleMonthlyVisitClick = () => {
    if (pendingMonthlyVisits && pendingMonthlyVisits > 0) {
      navigate('/manager-reports');
    }
  };

  const handleSupervisorVisitClick = () => {
    if (pendingSupervisorVisits && pendingSupervisorVisits > 0) {
      navigate('/supervisor-reports');
    }
  };

  const stats = [
    {
      title: t.stats.monthlyVisits.title,
      value: monthlyLoading ? "..." : pendingMonthlyVisits?.toString() || "0",
      icon: Users,
      description: t.stats.monthlyVisits.description,
      onClick: handleMonthlyVisitClick,
      isPending: pendingMonthlyVisits && pendingMonthlyVisits > 0
    },
    {
      title: t.stats.weeklyVisits.title,
      value: supervisorLoading ? "..." : pendingSupervisorVisits?.toString() || "0",
      icon: Clock,
      description: t.stats.weeklyVisits.description,
      onClick: handleSupervisorVisitClick,
      isPending: pendingSupervisorVisits && pendingSupervisorVisits > 0
    }
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
            {monthlyLoading || supervisorLoading ? (
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
                    Submit Report
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
