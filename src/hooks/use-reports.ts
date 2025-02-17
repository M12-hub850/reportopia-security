
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseReportFile, ReportFile } from '@/types/reports';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

export function useReports(userId: string | null, dateRange: DateRange | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['reports', dateRange?.from, dateRange?.to, userId],
    queryFn: async () => {
      try {
        if (!dateRange?.from || !dateRange?.to || !userId) {
          console.log('Missing required parameters:', { userId, dateRange });
          return [];
        }

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

        if (!data) {
          console.log('No data returned from query');
          return [];
        }

        console.log('Received raw reports data:', data);

        const transformedData = (data as unknown as DatabaseReportFile[]).map(item => ({
          id: item.id,
          report_type: item.report_type,
          file_name: item.file_name,
          file_path: item.file_path,
          created_at: item.created_at,
          report: {
            description: item.report?.description || '',
            photo_url: item.report?.photo_url || '',
            staff_name: item.report?.staff_name || null,
            shift: item.report?.shift || null,
            attendance_rating: item.report?.attendance_rating || null,
            duties_rating: item.report?.duties_rating || null,
            uniform_rating: item.report?.uniform_rating || null,
            presence_rating: item.report?.presence_rating || null,
            location: item.report?.location || null,
            incident_date: item.report?.incident_date || null,
            reporting_time: item.report?.reporting_time || null,
            action_taken: item.report?.action_taken || null,
            reporting_person: item.report?.reporting_person || null,
            staff_entries: item.report?.staff_entries || [],
            ...(item.vehicle_report || {})
          }
        }));

        console.log('Transformed reports data:', transformedData);
        return transformedData;

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
}
