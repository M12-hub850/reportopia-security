import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/ReportCard";
import { VehicleDetailsForm } from "@/components/VehicleDetailsForm";
import { VehicleImageCapture } from "@/components/VehicleImageCapture";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormSchema } from "@/types/carHandover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { createCompositeImage } from "@/utils/imageComposite";

interface VehicleHandoverSectionProps {
  onClose: () => void;
}

export function VehicleHandoverSection({ onClose }: VehicleHandoverSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: "",
      model: "",
      type: "",
      brand: "",
      mileage: "",
      location: "",
      contents: {
        spareTire: false,
        jackHandle: false,
        safetyKit: false,
        fireExtinguisher: false,
        dashCam: false,
        other: false,
        otherSpecification: "",
      },
      observations: [],
      receiverName: "",
      receiverPhone: "",
      receiverId: "",
      receiverIdImage: "",
      drivingLicenseImage: "",
      supervisorName: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
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
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('vehicle_images')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('vehicle_images')
          .getPublicUrl(fileName);

        if (fieldName === "carImages") {
          const currentImages = form.getValues("carImages");
          form.setValue("carImages", [...currentImages, publicUrl]);
        } else {
          form.setValue(fieldName, publicUrl);
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Create composite image
      const compositeImageDataUrl = await createCompositeImage(data.carImages, data.mileageImage);

      // Convert data URL to blob
      const response = await fetch(compositeImageDataUrl);
      const blob = await response.blob();

      // Upload composite image
      const fileName = `composite_${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle_images')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle_images')
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from('vehicle_reports')
        .insert({
          user_id: user.id,
          car_model: data.model,
          plate_number: data.plateNumber,
          mileage: parseInt(data.mileage),
          project: data.location,
          condition: JSON.stringify({
            contents: data.contents,
            observations: data.observations,
          }),
          car_images: [publicUrl], // Store the composite image URL
          mileage_image: data.mileageImage,
          receiver_id_image: data.receiverIdImage,
          driving_license_image: data.drivingLicenseImage,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Vehicle handover report has been submitted successfully.",
        variant: "default",
      });

      form.reset();
      onClose();

      await queryClient.invalidateQueries({ queryKey: ['vehicleReports'] });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReportCard
      title="New Vehicle Handover"
      subtitle="Document vehicle transfer and conditions"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <VehicleDetailsForm form={form} />
          <VehicleImageCapture form={form} onCaptureImage={captureImage} />
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
    </ReportCard>
  );
}