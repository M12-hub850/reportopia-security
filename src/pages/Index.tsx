
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
import { Loader2, BarChart2 } from "lucide-react";

export default function Index() {
  const { language } = useLanguage();
  const t = translations[language].dashboard;

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {t.welcome}
          </h1>
          
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
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportCounts}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                        <XAxis 
                          dataKey="report_type" 
                          tick={{ fill: '#6B46C1' }}
                          axisLine={{ stroke: '#6B46C1' }}
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
