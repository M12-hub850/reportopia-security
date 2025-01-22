import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, startOfDay, endOfDay, format } from 'date-fns';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportFile | null>(null);
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(addDays(new Date(), -30)),
    to: endOfDay(new Date())
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      if (!dateRange?.from || !dateRange?.to) return;

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
            car_images
          )
        `)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReports = data.map(item => ({
        ...item,
        report: {
          ...item.report,
          ...(item.vehicle_report || {}),
          staff_entries: item.report?.staff_entries || []
        }
      })) as ReportFile[];

      setReports(formattedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingColor = (rating: string | null) => {
    if (!rating) return 'bg-gray-100 text-gray-800';
    
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSupervisorReport = (report: ReportDetails) => {
    if (!report.staff_entries?.length) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <h4 className="font-medium">Staff Evaluations</h4>
        <div className="space-y-3">
          {report.staff_entries.map((entry, index) => (
            <Card key={index} className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium">Staff Name</p>
                  <p className="text-sm text-muted-foreground">{entry.staff_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Shift</p>
                  <p className="text-sm text-muted-foreground">{entry.shift}</p>
                </div>
                <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <p className="text-sm font-medium">Attendance</p>
                    <Badge variant="secondary" className={getRatingColor(entry.attendance_rating)}>
                      {entry.attendance_rating || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duties</p>
                    <Badge variant="secondary" className={getRatingColor(entry.duties_rating)}>
                      {entry.duties_rating || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Uniform</p>
                    <Badge variant="secondary" className={getRatingColor(entry.uniform_rating)}>
                      {entry.uniform_rating || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Presence</p>
                    <Badge variant="secondary" className={getRatingColor(entry.presence_rating)}>
                      {entry.presence_rating || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderIncidentReport = (report: ReportDetails) => {
    if (!report.staff_name) return null;

    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Guard Name</p>
            <p className="text-sm text-muted-foreground">{report.staff_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Shift</p>
            <p className="text-sm text-muted-foreground">{report.shift}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">{report.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Incident Date</p>
            <p className="text-sm text-muted-foreground">
              {report.incident_date ? format(new Date(report.incident_date), 'PPP') : 'N/A'}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium">Action Taken</p>
          <p className="text-sm text-muted-foreground">{report.action_taken}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Reporting Person</p>
          <p className="text-sm text-muted-foreground">{report.reporting_person}</p>
        </div>
      </div>
    );
  };

  const renderVehicleReport = (report: ReportDetails) => {
    if (!report.car_model) return null;

    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Car Model</p>
            <p className="text-sm text-muted-foreground">{report.car_model}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Plate Number</p>
            <p className="text-sm text-muted-foreground">{report.plate_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Mileage</p>
            <p className="text-sm text-muted-foreground">{report.mileage}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Project</p>
            <p className="text-sm text-muted-foreground">{report.project}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Condition</p>
          <p className="text-sm text-muted-foreground">{report.condition}</p>
        </div>
        {report.car_images && report.car_images.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Car Images</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {report.car_images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Car image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
        {report.mileage_image && (
          <div>
            <p className="text-sm font-medium mb-2">Mileage Image</p>
            <img
              src={report.mileage_image}
              alt="Mileage"
              className="w-full max-w-md h-48 object-cover rounded-lg"
            />
          </div>
        )}
        {report.receiver_id_image && (
          <div>
            <p className="text-sm font-medium mb-2">Receiver ID</p>
            <img
              src={report.receiver_id_image}
              alt="Receiver ID"
              className="w-full max-w-md h-48 object-cover rounded-lg"
            />
          </div>
        )}
        {report.driving_license_image && (
          <div>
            <p className="text-sm font-medium mb-2">Driving License</p>
            <img
              src={report.driving_license_image}
              alt="Driving License"
              className="w-full max-w-md h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    );
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

      {loading ? (
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
          {selectedReport && (
            <div className="space-y-6">
              {selectedReport.report_type === 'supervisor_weekly' && renderSupervisorReport(selectedReport.report)}
              {selectedReport.report_type === 'event_incident' && renderIncidentReport(selectedReport.report)}
              {selectedReport.report_type === 'vehicle_handover' && renderVehicleReport(selectedReport.report)}
              
              {selectedReport.report.description && (
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.report.description}</p>
                </div>
              )}
              
              {selectedReport.report.photo_url && (
                <div>
                  <p className="text-sm font-medium mb-2">Photo Evidence</p>
                  <img
                    src={selectedReport.report.photo_url}
                    alt="Report photo"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
