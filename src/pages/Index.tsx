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
import { Loader2, BarChart2, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { language } = useLanguage();
  const t = translations[language].dashboard;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking auth status:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in again",
        });
        navigate('/sign-in');
        return;
      }
      
      if (!session) {
        console.log('No active session found, redirecting to sign-in');
        navigate('/sign-in');
        return;
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/sign-in');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const { data: reportCounts, isLoading: isLoadingReports, refetch: refetchReports } = useQuery({
    queryKey: ['report-counts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      const { data, error } = await supabase.rpc('get_report_counts', {
        p_user_id: session.user.id,
        p_start_date: startDate.toISOString(),
        p_end_date: new Date().toISOString()
      });

      if (error) {
        console.error('Error fetching report counts:', error);
        throw error;
      }

      const transformedData = (data || []).map(item => ({
        report_type: item.report_type.replace(/_/g, ' ').toUpperCase(),
        count: Number(item.count) || 0
      }));

      console.log('Transformed report counts:', transformedData);
      return transformedData;
    },
    enabled: true,
    refetchInterval: 30000
  });

  const handleRefresh = async () => {
    await Promise.all([
      refetchReports()
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
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
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              {t.welcome}
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="hover:bg-purple-50"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-6">
            <DashboardStats />

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-blue-50 border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-6 w-6 text-purple-600" />
                    <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                      Visits Overview
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
                    <BarChart2 className="h-6 w-6 text-purple-600" />
                    <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                      Monthly Reports
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {isLoadingReports ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                  ) : reportCounts && reportCounts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportCounts}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                        <XAxis 
                          dataKey="report_type" 
                          tick={{ fill: '#6B46C1' }}
                          axisLine={{ stroke: '#6B46C1' }}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          tick={{ fill: '#6B46C1' }}
                          axisLine={{ stroke: '#6B46C1' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #6B46C1',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="url(#colorGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9F7AEA" />
                            <stop offset="100%" stopColor="#4299E1" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No reports data available
                    </div>
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
