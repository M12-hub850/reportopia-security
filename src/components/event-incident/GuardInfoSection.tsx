import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface GuardInfoSectionProps {
  form: UseFormReturn<any>;
}

export function GuardInfoSection({ form }: GuardInfoSectionProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Guard Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="guardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of Guard on Duty</FormLabel>
              <FormControl>
                <Input placeholder="Enter guard name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift"
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
      </div>
    </Card>
  );
}