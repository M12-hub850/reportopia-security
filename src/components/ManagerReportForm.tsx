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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";

interface ManagerReportFormProps {
  form: UseFormReturn<any>;
}

const ratingOptions = ["Excellent", "Good", "Fair", "Poor"];

export function ManagerReportForm({ form }: ManagerReportFormProps) {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Staff Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="staffName"
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

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Performance Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="attendanceRating"
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
            name="dutiesRating"
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
            name="uniformRating"
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
            name="presenceRating"
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

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Additional Information</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter detailed observations and comments"
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
            name="photoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo Evidence</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    bucket="report_photos"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  );
}