import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReportImage } from "@/components/ui/report-image";

interface StaffEntry {
  staff_name: string;
  shift: string;
  attendance_rating: string | null;
  duties_rating: string | null;
  uniform_rating: string | null;
  presence_rating: string | null;
}

interface SupervisorReportProps {
  staffEntries: StaffEntry[];
  description: string;
  photoUrl?: string;
}

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

export function SupervisorReportDisplay({ staffEntries, description, photoUrl }: SupervisorReportProps) {
  if (!staffEntries?.length) return null;
  
  return (
    <div className="space-y-6">
      <div className="mt-4 space-y-4">
        <h4 className="font-medium">Staff Evaluations</h4>
        <div className="space-y-3">
          {staffEntries.map((entry, index) => (
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