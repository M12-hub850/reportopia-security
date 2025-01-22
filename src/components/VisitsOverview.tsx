import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function VisitsOverview() {
  const { data: monthlyData } = useQuery({
    queryKey: ['monthlyVisits'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .rpc('get_pending_monthly_visits', { user_id: user.user.id });
      
      if (error) throw error;
      
      return data?.[0]?.count || 0;
    },
  });

  return (
    <div className="grid gap-4">
      <Card className="backdrop-blur-sm bg-white/50 border-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Pending Visits Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{monthlyData || 0}</div>
          <p className="text-sm text-muted-foreground mt-2">Total pending visits this month</p>
        </CardContent>
      </Card>
    </div>
  );
}