import { UseFormReturn } from "react-hook-form";
import { SupervisorReportFormValues } from "@/types/supervisorReport";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ManagerReportForm } from "@/components/ManagerReportForm";

interface SupervisorReportFormProps {
  form: UseFormReturn<SupervisorReportFormValues>;
  onSubmit: (data: SupervisorReportFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function SupervisorReportForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  onCancel 
}: SupervisorReportFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ManagerReportForm form={form} />
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </Form>
  );
}