import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { VisitorLogForm } from "@/components/VisitorLogForm";

export default function VisitorLogs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports, refetch } = useQuery({
    queryKey: ['visitor-logs'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('type', 'visitor_log')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports',
          filter: 'type=eq.visitor_log'
        },
        () => {
          console.log('New visitor log received');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Visitor Logs</h1>
      
      {reports && (
        <div className="text-lg mb-6">
          Total Visitor Logs: <span className="font-semibold">{reports.length}</span>
        </div>
      )}

      <VisitorLogForm onSubmitSuccess={refetch} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports?.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{report.visitor_name}</h3>
              <p className="text-sm text-gray-600 mt-1">{report.visit_purpose}</p>
              {report.description && (
                <p className="mt-2 text-sm">{report.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}