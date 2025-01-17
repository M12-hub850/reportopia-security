import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";
import { ImageUpload } from "@/components/ImageUpload";

interface HandoverDetailsProps {
  form: UseFormReturn<FormSchema>;
}

export function HandoverDetails({ form }: HandoverDetailsProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Handover Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="receiverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter receiver's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter receiver's phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter receiver's ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverIdImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver ID Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  bucket="vehicle_images"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="drivingLicenseImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driving License Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  bucket="vehicle_images"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supervisorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisor Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter supervisor's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}