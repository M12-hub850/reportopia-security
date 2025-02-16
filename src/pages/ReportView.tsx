import { useState } from 'react';
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

interface StaffEntry {
  staff_name: string;
  shift: string;
  attendance_rating: string | null;
  duties_rating: string | null;
  uniform_rating: string | null;
  presence_rating: string | null;
}

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
  staff_entries?: StaffEntry[];
}

interface VehicleReportDetails {
  car_model: string;
  plate_number: string;
  mileage: number;
  Location: string;
  condition: string;
  car_images: string[];
  mileage_image: string;
  receiver_id_image: string | null;
  driving_license_image: string | null;
}

interface DatabaseReportFile {
  id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
  report_id: string;
  vehicle_report_id: string;
  user_id: string;
  report: (ReportDetails & { staff_entries: any }) | null;
  vehicle_report: VehicleReportDetails | null;
}

interface ReportFile {
  id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
  report: ReportDetails & Partial<VehicleReportDetails>;
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
              Location,
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

  const renderReportContent = (report: ReportFile) => {
    switch (report.report_type) {
      case 'supervisor_weekly':
      case 'manager_monthly':
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
            Location={report.report.Location || ''}
            condition={report.report.condition || ''}
            carImages={report.report.car_images || []}
            mileageImage={report.report.mileage_image || ''}
            receiverIdImage={report.report.receiver_id_image || null}
            drivingLicenseImage={report.report.driving_license_image || null}
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
                      {getReportTitle(report.report_type)}
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
              {selectedReport && getReportTitle(selectedReport.report_type)}
            </DialogTitle>
          </DialogHeader>
          {selectedReport && renderReportContent(selectedReport)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
