import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";
import { VehicleInformation } from "./vehicle-form/VehicleInformation";
import { VehicleContents } from "./vehicle-form/VehicleContents";
import { HandoverDetails } from "./vehicle-form/HandoverDetails";

interface VehicleDetailsFormProps {
  form: UseFormReturn<FormSchema>;
}

export function VehicleDetailsForm({ form }: VehicleDetailsFormProps) {
  return (
    <div className="space-y-6">
      <VehicleInformation form={form} />
      <VehicleContents form={form} />
      <HandoverDetails form={form} />
    </div>
  );
}