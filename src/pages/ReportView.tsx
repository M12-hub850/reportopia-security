
import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { ReportDialog } from '@/components/reports/ReportDialog';
import { ReportContent } from '@/components/reports/ReportContent';
import { ReportFile } from '@/types/reports';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useReports } from '@/hooks/use-reports';
import { getReportTitle } from '@/utils/report-utils';

export default function ReportView() {
  const [selectedReport, setSelectedReport] = useState<ReportFile | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(addDays(new Date(), -30)),
    to: endOfDay(new Date())
  });

  const userId = useAuthCheck();
  const { data: reports = [], isLoading, error } = useReports(userId, dateRange);

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

      <ReportContent
        isLoading={isLoading}
        reports={reports}
        onSelectReport={setSelectedReport}
        getReportTitle={getReportTitle}
      />

      <ReportDialog
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        getReportTitle={getReportTitle}
      />
    </div>
  );
}
