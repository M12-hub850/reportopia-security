import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ratingOptions = ["Excellent", "Good", "Fair", "Poor"];

interface StaffEntryRatingsProps {
  form: UseFormReturn<any>;
  index: number;
}

export function StaffEntryRatings({ form, index }: StaffEntryRatingsProps) {
  return (
    <>
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
    </>
  );
}