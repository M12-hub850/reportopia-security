import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface StaffEntryBasicFieldsProps {
  form: UseFormReturn<any>;
  index: number;
}

export function StaffEntryBasicFields({ form, index }: StaffEntryBasicFieldsProps) {
  return (
    <>
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
    </>
  );
}