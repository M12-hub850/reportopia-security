import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReportCard } from "@/components/ReportCard";
import { VehicleDetailsForm } from "@/components/VehicleDetailsForm";
import { VehicleImageCapture } from "@/components/VehicleImageCapture";
import { formSchema, FormSchema } from "@/types/carHandover";

const CarHandovers = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carModel: "",
      plateNumber: "",
      mileage: "",
      project: "",
      condition: "",
      carImages: [],
      mileageImage: "",
    },
  });

  const captureImage = async (
    fieldName: keyof Pick<FormSchema, 'carImages' | 'mileageImage'>
  ) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      const fileSelected = new Promise<File | null>((resolve) => {
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0] || null;
          resolve(file);
        };
      });

      input.click();

      const file = await fileSelected;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (fieldName === "carImages") {
            const currentImages = form.getValues("carImages");
            form.setValue("carImages", [...currentImages, reader.result as string]);
          } else {
            form.setValue(fieldName, reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const onSubmit = (data: FormSchema) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Car Handover Form</h1>
          <p className="text-muted-foreground">Document vehicle transfers and conditions</p>
        </div>

        <ReportCard title="Vehicle Details" subtitle="Enter car information and current status">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <VehicleDetailsForm form={form} />
              <VehicleImageCapture form={form} onCaptureImage={captureImage} />
              <Button type="submit" className="w-full">Submit Handover Form</Button>
            </form>
          </Form>
        </ReportCard>
      </div>
    </div>
  );
};

export default CarHandovers;