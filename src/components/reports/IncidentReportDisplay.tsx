import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { ReportImage } from "@/components/ui/report-image";

interface IncidentReportProps {
  staffName: string | null;
  shift: string | null;
  location: string | null;
  incidentDate: string | null;
  actionTaken: string | null;
  reportingPerson: string | null;
  description: string;
  photoUrl?: string;
}

export function IncidentReportDisplay({
  staffName,
  shift,
  location,
  incidentDate,
  actionTaken,
  reportingPerson,
  description,
  photoUrl
}: IncidentReportProps) {
  if (!staffName) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Guard Name</p>
          <p className="text-sm text-muted-foreground">{staffName}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Shift</p>
          <p className="text-sm text-muted-foreground">{shift}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Location</p>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Incident Date</p>
          <p className="text-sm text-muted-foreground">
            {incidentDate ? format(new Date(incidentDate), 'PPP') : 'N/A'}
          </p>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <p className="text-sm font-medium">Action Taken</p>
        <p className="text-sm text-muted-foreground">{actionTaken}</p>
      </div>
      
      <div>
        <p className="text-sm font-medium">Reporting Person</p>
        <p className="text-sm text-muted-foreground">{reportingPerson}</p>
      </div>

      {description && (
        <div>
          <p className="text-sm font-medium">Description</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      
      {photoUrl && (
        <div>
          <p className="text-sm font-medium mb-2">Photo Evidence</p>
          <ReportImage
            src={photoUrl}
            alt="Report photo"
            className="w-full max-w-2xl h-64 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}