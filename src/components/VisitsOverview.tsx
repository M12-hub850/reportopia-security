
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Calendar } from "lucide-react";

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
      <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-blue-50 border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
            Monthly Pending Visits Overview
          </CardTitle>
          <Eye className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {monthlyData || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Total pending visits this month</p>
              </div>
            </div>
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">{monthlyData || 0}</span>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${Math.min((monthlyData || 0) * 10, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
