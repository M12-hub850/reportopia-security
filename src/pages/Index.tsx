import { MainNav } from "@/components/MainNav";
import { SparklesCore } from "@/components/ui/sparkles";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { DashboardStats } from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisitsOverview } from "@/components/VisitsOverview";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

export default function Index() {
  const { language } = useLanguage();
  const t = translations[language].dashboard;

  // Fetch report counts for the chart
  const { data: reportCounts, isLoading: isLoadingReports } = useQuery({
    queryKey: ['report-counts'],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('get_report_counts', {
        p_user_id: user.user.id,
        p_start_date: startDate.toISOString(),
        p_end_date: new Date().toISOString()
      });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Sparkles Background */}
      <div className="fixed inset-0 -z-10">
        <SparklesCore
          id="dashboard-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="hsl(var(--primary))"
          speed={0.5}
        />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            {t.welcome}
          </h1>
          
          <div className="grid gap-6">
            {/* Stats Section */}
            <DashboardStats />

            {/* Overview Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Visits Overview */}
              <Card className="backdrop-blur-sm bg-white/50 border-2">
                <CardHeader>
                  <CardTitle>Visits Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <VisitsOverview />
                </CardContent>
              </Card>

              {/* Reports Chart */}
              <Card className="backdrop-blur-sm bg-white/50 border-2">
                <CardHeader>
                  <CardTitle>Monthly Reports</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {isLoadingReports ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportCounts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="report_type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}