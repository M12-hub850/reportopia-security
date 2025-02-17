
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { ReportList } from '@/components/reports/ReportList';
import { ReportDialog } from '@/components/reports/ReportDialog';
import { useQuery } from '@tanstack/react-query';
import { ReportFile, DatabaseReportFile } from '@/types/reports';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ReportView() {
  const [selectedReport, setSelectedReport] = useState<ReportFile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(addDays(new Date(), -30)),
    to: endOfDay(new Date())
  });

  // Check authentication and get userId
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.error('Auth error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in again",
        });
        navigate('/sign-in');
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/sign-in');
      } else {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports', dateRange?.from, dateRange?.to, userId],
    queryFn: async () => {
      try {
        if (!dateRange?.from || !dateRange?.to || !userId) return [];

        console.log('Fetching reports with params:', {
          userId,
          dateRange: { from: dateRange.from, to: dateRange.to }
        });

        const { data, error } = await supabase
          .from('report_files')
          .select(`
            *,
            report:report_id (
              description,
              photo_url,
              staff_name,
              shift,
              attendance_rating,
              duties_rating,
              uniform_rating,
              presence_rating,
              location,
              incident_date,
              reporting_time,
              action_taken,
              reporting_person,
              staff_entries (
                staff_name,
                shift,
                attendance_rating,
                duties_rating,
                uniform_rating,
                presence_rating
              )
            ),
            vehicle_report:vehicle_report_id (
              car_model,
              plate_number,
              mileage,
              project,
              condition,
              car_images,
              mileage_image,
              receiver_id_image,
              driving_license_image
            )
          `)
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString())
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Received reports data:', data);

        return (data as unknown as DatabaseReportFile[]).map(item => ({
          id: item.id,
          report_type: item.report_type,
          file_name: item.file_name,
          file_path: item.file_path,
          created_at: item.created_at,
          report: {
            ...(item.report || {}),
            ...(item.vehicle_report || {}),
            staff_entries: item.report?.staff_entries || []
          }
        }));
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reports. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: !!userId && !!dateRange?.from && !!dateRange?.to
  });

  const getReportTitle = (type: string) => {
    const titles: Record<string, string> = {
      'supervisor_weekly': 'SUPERVISOR WEEKLY REPORT',
      'manager_monthly': 'MANAGER MONTHLY REPORT',
      'event_incident': 'INCIDENT REPORT',
      'vehicle_handover': 'VEHICLE HANDOVER REPORT'
    };
    return titles[type] || type.toUpperCase().replace(/_/g, ' ');
  };

  if (error) {
    return (
      <div className="container max-w-4xl py-6">
        <BackButton />
        <Card className="mt-6 p-6 text-center text-red-600">
          Error loading reports. Please try refreshing the page.
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold mt-4">Report Archive</h1>
        <p className="text-muted-foreground">
          View your submitted reports
        </p>
      </div>

      <div className="mb-6">
        <DateRangeFilter date={dateRange} onDateChange={setDateRange} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No reports found in the selected date range
        </Card>
      ) : (
        <ReportList
          reports={reports}
          onSelectReport={setSelectedReport}
          getReportTitle={getReportTitle}
        />
      )}

      <ReportDialog
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        getReportTitle={getReportTitle}
      />
    </div>
  );
}
