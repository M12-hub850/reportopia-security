
import { Card } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ReportFile } from '@/types/reports';

interface ReportListProps {
  reports: ReportFile[];
  onSelectReport: (report: ReportFile) => void;
  getReportTitle: (type: string) => string;
}

export function ReportList({ reports, onSelectReport, getReportTitle }: ReportListProps) {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card 
          key={report.id} 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectReport(report)}
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
  );
}
