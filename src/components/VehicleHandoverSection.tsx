import { ReportCard } from "@/components/ReportCard";
import { VehicleHandoverForm } from "@/components/vehicle-form/VehicleHandoverForm";
import { useVehicleHandover } from "@/hooks/use-vehicle-handover";

interface VehicleHandoverSectionProps {
  onClose: () => void;
}

export function VehicleHandoverSection({ onClose }: VehicleHandoverSectionProps) {
  const { form, isSubmitting, captureImage, onSubmit } = useVehicleHandover(onClose);

  return (
    <ReportCard
      title="New Vehicle Handover"
      subtitle="Document vehicle transfer and conditions"
    >
      <VehicleHandoverForm 
        form={form}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onClose={onClose}
        onCaptureImage={captureImage}
      />
    </ReportCard>
  );
}