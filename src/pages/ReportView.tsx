
import { useState } from 'react';
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

export default function ReportView() {
  const [selectedReport, setSelectedReport] = useState<ReportFile | null>(null);
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(addDays(new Date(), -30)),
    to: endOfDay(new Date())
  });

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports', dateRange?.from, dateRange?.to],
    queryFn: async () => {
      try {
        if (!dateRange?.from || !dateRange?.to) return [];

        console.log('Fetching reports with date range:', { from: dateRange.from, to: dateRange.to });

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
          .order('created_at', { ascending: false });

        if (error) throw error;

        return (data as unknown as DatabaseReportFile[]).map(item => ({
          id: item.id,
          report_type: item.report_type,
          file_name: item.file_name,
          file_path: item.file_path,
          created_at: item.created_at,
          report: {
            ...(item.report || { description: '', photo_url: '' }),
            ...(item.vehicle_report || {}),
            staff_entries: Array.isArray(item.report?.staff_entries) 
              ? item.report.staff_entries 
              : []
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
        <div className="text-center py-8">Loading reports...</div>
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
