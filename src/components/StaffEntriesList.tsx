
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StaffEntry } from "./staff/StaffEntry";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface StaffEntriesListProps {
  form: UseFormReturn<any>;
  maxEntries?: number;
  viewMode?: boolean;
  entries?: any[];
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

export function StaffEntriesList({ form, maxEntries = 8, viewMode = false, entries }: StaffEntriesListProps) {
  const staffEntries = viewMode ? entries : (form.watch("staffEntries") || []);

  const addStaffEntry = () => {
    if (!viewMode && staffEntries.length < maxEntries) {
      const newEntry = {
        staffName: "",
        shift: "",
        attendanceRating: "",
        dutiesRating: "",
        uniformRating: "",
        presenceRating: "",
      };
      form.setValue("staffEntries", [...staffEntries, newEntry]);
    }
  };

  const removeStaffEntry = (index: number) => {
    if (!viewMode) {
      const updatedEntries = staffEntries.filter((_: any, i: number) => i !== index);
      form.setValue("staffEntries", updatedEntries);
    }
  };

  if (viewMode) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Staff Entries</h3>
        {staffEntries.map((entry: any, index: number) => (
          <Card key={index} className="p-4">
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
        {staffEntries.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No staff entries found.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Staff Entries</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addStaffEntry}
          disabled={staffEntries.length >= maxEntries}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Entry
        </Button>
      </div>

      {staffEntries.map((_: any, index: number) => (
        <StaffEntry
          key={index}
          form={form}
          index={index}
          onRemove={() => removeStaffEntry(index)}
        />
      ))}

      {staffEntries.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No staff entries yet. Click "Add Staff Entry" to begin.
        </p>
      )}
    </div>
  );
}
