import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";

interface VehicleContentsProps {
  form: UseFormReturn<FormSchema>;
}

export function VehicleContents({ form }: VehicleContentsProps) {
  const showOtherSpecification = form.watch("contents.other");

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Vehicle Contents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contents.spareTire"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Spare Tire</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.jackHandle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Jack Handle</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.safetyKit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Safety Kit</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.fireExtinguisher"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Fire Extinguisher</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.dashCam"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Dash Camera</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents.other"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Other</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {showOtherSpecification && (
        <div className="mt-4">
          <FormField
            control={form.control}
            name="contents.otherSpecification"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Please specify other contents..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </Card>
  );
}