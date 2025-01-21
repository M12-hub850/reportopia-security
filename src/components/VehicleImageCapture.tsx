import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/types/carHandover";

interface VehicleImageCaptureProps {
  form: UseFormReturn<FormSchema>;
  onCaptureImage: (fieldName: keyof Pick<FormSchema, 'carImages'>) => Promise<void>;
}

export function VehicleImageCapture({ form, onCaptureImage }: VehicleImageCaptureProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Car Condition Images</Label>
        <Button
          type="button"
          variant="outline"
          className="w-full mt-1"
          onClick={() => onCaptureImage("carImages")}
        >
          Take Car Photo
        </Button>
        <div className="mt-2 flex gap-2 flex-wrap">
          {form.watch("carImages").map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Car condition ${index + 1}`}
              className="w-24 h-24 object-cover rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}