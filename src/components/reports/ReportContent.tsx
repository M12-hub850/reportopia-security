
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ReportFile } from '@/types/reports';
import { ReportList } from './ReportList';

interface ReportContentProps {
  isLoading: boolean;
  reports: ReportFile[];
  onSelectReport: (report: ReportFile) => void;
  getReportTitle: (type: string) => string;
}

export function ReportContent({ isLoading, reports, onSelectReport, getReportTitle }: ReportContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No reports found in the selected date range
      </Card>
    );
  }

  return (
    <ReportList
      reports={reports}
      onSelectReport={onSelectReport}
      getReportTitle={getReportTitle}
    />
  );
}
