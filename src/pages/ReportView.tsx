import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileIcon, DownloadIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, startOfDay, endOfDay, format } from 'date-fns';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { Badge } from '@/components/ui/badge';

interface ReportFile {
  id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
  report: {
    description: string;
    photo_url: string;
    staff_entries: Array<{
      staff_name: string;
      shift: string;
      attendance_rating: string;
      duties_rating: string;
      uniform_rating: string;
      presence_rating: string;
    }>;
  };
}

export default function ReportView() {
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [loading, setLoading] = useState(true);
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
            staff_entries (
              staff_name,
              shift,
              attendance_rating,
              duties_rating,
              uniform_rating,
              presence_rating
            )
          )
        `)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched reports:', data);
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('report_pdfs')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'report.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: 'Error',
        description: 'Failed to download report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating?.toLowerCase()) {
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

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold mt-4">Report Archive</h1>
        <p className="text-muted-foreground">
          View and download your submitted reports
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
            <Card key={report.id} className="p-4">
              <div className="space-y-4">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(report.file_path)}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                {report.report?.staff_entries && report.report.staff_entries.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Staff Entries</h4>
                    <div className="space-y-3">
                      {report.report.staff_entries.map((entry, index) => (
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
                )}

                {report.report?.description && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{report.report.description}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}