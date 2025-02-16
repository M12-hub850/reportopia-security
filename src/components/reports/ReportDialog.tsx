
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportFile } from '@/types/reports';
import { SupervisorReportDisplay } from './SupervisorReportDisplay';
import { IncidentReportDisplay } from './IncidentReportDisplay';
import { VehicleReportDisplay } from './VehicleReportDisplay';

interface ReportDialogProps {
  report: ReportFile | null;
  onClose: () => void;
  getReportTitle: (type: string) => string;
}

export function ReportDialog({ report, onClose, getReportTitle }: ReportDialogProps) {
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
            project={report.report.project || ''}
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
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {report && getReportTitle(report.report_type)}
          </DialogTitle>
        </DialogHeader>
        {report && renderReportContent(report)}
      </DialogContent>
    </Dialog>
  );
}
