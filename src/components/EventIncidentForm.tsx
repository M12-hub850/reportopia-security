import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { GuardInfoSection } from "./event-incident/GuardInfoSection";
import { IncidentDetailsSection } from "./event-incident/IncidentDetailsSection";
import { IncidentDescriptionSection } from "./event-incident/IncidentDescriptionSection";

interface EventIncidentFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function EventIncidentForm({ form, onSubmit, isSubmitting, onCancel }: EventIncidentFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <GuardInfoSection form={form} />
      <IncidentDetailsSection form={form} />
      <IncidentDescriptionSection form={form} />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}