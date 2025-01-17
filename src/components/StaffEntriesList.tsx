import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const ratingOptions = ["Excellent", "Good", "Fair", "Poor"];

interface StaffEntry {
  staffName: string;
  shift: string;
  attendanceRating: string;
  dutiesRating: string;
  uniformRating: string;
  presenceRating: string;
}

interface StaffEntriesListProps {
  form: UseFormReturn<any>;
  maxEntries?: number;
}

export function StaffEntriesList({ form, maxEntries = 8 }: StaffEntriesListProps) {
  const staffEntries = form.watch("staffEntries") || [];

  const addStaffEntry = () => {
    if (staffEntries.length < maxEntries) {
      const newEntry: StaffEntry = {
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

      {staffEntries.map((_, index: number) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium">Staff Entry #{index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeStaffEntry(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`staffEntries.${index}.staffName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter staff name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`staffEntries.${index}.shift`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shift details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`staffEntries.${index}.attendanceRating`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance Rating</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`staffEntries.${index}.dutiesRating`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duties Performance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`staffEntries.${index}.uniformRating`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uniform Compliance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`staffEntries.${index}.presenceRating`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Hours Presence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      ))}

      {staffEntries.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No staff entries yet. Click "Add Staff Entry" to begin.
        </p>
      )}
    </div>
  );
}