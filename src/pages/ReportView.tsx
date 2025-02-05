import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, startOfDay, endOfDay, format } from 'date-fns';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupervisorReportDisplay } from '@/components/reports/SupervisorReportDisplay';
import { IncidentReportDisplay } from '@/components/reports/IncidentReportDisplay';
import { VehicleReportDisplay } from '@/components/reports/VehicleReportDisplay';
import { useQuery } from '@tanstack/react-query';

interface ReportDetails {
  description: string;
  photo_url: string;
  staff_name?: string | null;
  shift?: string | null;
  attendance_rating?: string | null;
  duties_rating?: string | null;
  uniform_rating?: string | null;
  presence_rating?: string | null;
  location?: string | null;
  incident_date?: string | null;
  reporting_time?: string | null;
  action_taken?: string | null;
  reporting_person?: string | null;
  staff_entries?: any[];
  car_model?: string;
  plate_number?: string;
  mileage?: number;
  project?: string;
  condition?: string;
  car_images?: string[];
  mileage_image?: string;
  receiver_id_image?: string;
  driving_license_image?: string;
}

interface ReportFile {
  id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
  report: ReportDetails;
}

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

        console.log('Fetched reports:', data);

        return data.map(item => ({
          ...item,
          report: {
            ...item.report,
            ...(item.vehicle_report || {}),
            staff_entries: item.report?.staff_entries || []
          }
        })) as ReportFile[];
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

  const renderReportContent = (report: ReportFile) => {
    switch (report.report_type) {
      case 'supervisor_weekly':
        return (
          <SupervisorReportDisplay
            staffEntries={report.report.staff_entries || []}
            description={report.report.description}
            photoUrl={report.report.photo_url}
          />
        );
      case 'event_incident':
        return (
          <IncidentReportDisplay
            staffName={report.report.staff_name}
            shift={report.report.shift}
            location={report.report.location}
            incidentDate={report.report.incident_date}
            actionTaken={report.report.action_taken}
            reportingPerson={report.report.reporting_person}
            description={report.report.description}
            photoUrl={report.report.photo_url}
          />
        );
      case 'vehicle_handover':
        return (
          <VehicleReportDisplay
            carModel={report.report.car_model || ''}
            plateNumber={report.report.plate_number || ''}
            mileage={report.report.mileage || 0}
            project={report.report.project || ''}
            condition={report.report.condition || ''}
            carImages={report.report.car_images}
            mileageImage={report.report.mileage_image}
            receiverIdImage={report.report.receiver_id_image}
            drivingLicenseImage={report.report.driving_license_image}
            description={report.report.description}
          />
        );
      default:
        return null;
    }
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
        <div className="space-y-4">
          {reports.map((report) => (
            <Card 
              key={report.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">
                      {report.report_type.replace(/_/g, ' ').toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(report.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedReport?.report_type.replace(/_/g, ' ').toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {selectedReport && renderReportContent(selectedReport)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
