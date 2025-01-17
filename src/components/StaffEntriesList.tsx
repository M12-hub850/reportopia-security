import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StaffEntry } from "./staff/StaffEntry";

interface StaffEntriesListProps {
  form: UseFormReturn<any>;
  maxEntries?: number;
}

export function StaffEntriesList({ form, maxEntries = 8 }: StaffEntriesListProps) {
  const staffEntries = form.watch("staffEntries") || [];

  const addStaffEntry = () => {
    if (staffEntries.length < maxEntries) {
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
    const updatedEntries = staffEntries.filter((_: any, i: number) => i !== index);
    form.setValue("staffEntries", updatedEntries);
  };

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