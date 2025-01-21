import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";
import { Form } from "@/components/ui/form";
import { VehicleDetailsForm } from "@/components/VehicleDetailsForm";
import { VehicleImageCapture } from "@/components/VehicleImageCapture";
import { Button } from "@/components/ui/button";

interface VehicleHandoverFormProps {
  form: UseFormReturn<FormSchema>;
  isSubmitting: boolean;
  onSubmit: (data: FormSchema) => Promise<void>;
  onClose: () => void;
  onCaptureImage: (fieldName: keyof Pick<FormSchema, 'carImages'>) => Promise<void>;
}

export function VehicleHandoverForm({ 
  form, 
  isSubmitting, 
  onSubmit, 
  onClose,
  onCaptureImage 
}: VehicleHandoverFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <VehicleDetailsForm form={form} />
        <VehicleImageCapture form={form} onCaptureImage={onCaptureImage} />
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </Form>
  );
}