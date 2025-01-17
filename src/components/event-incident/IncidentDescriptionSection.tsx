import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";

interface IncidentDescriptionSectionProps {
  form: UseFormReturn<any>;
}

export function IncidentDescriptionSection({ form }: IncidentDescriptionSectionProps) {
  return (
    <div className="mt-4 space-y-4">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description of the Incident or Event</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter detailed description"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="actionTaken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Action Taken</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe actions taken"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="reportingPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name of the Reporting Person</FormLabel>
            <FormControl>
              <Input placeholder="Enter name of reporting person" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="photoUrl"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                bucket="report_photos"
                required={true}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}