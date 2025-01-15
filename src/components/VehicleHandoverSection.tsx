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

interface VehicleHandoverSectionProps {
  onClose: () => void;
}

export function VehicleHandoverSection({ onClose }: VehicleHandoverSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        // Upload to Supabase Storage
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
      const { error } = await supabase
        .from('vehicle_reports')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          car_model: data.carModel,
          plate_number: data.plateNumber,
          mileage: parseInt(data.mileage),
          project: data.project,
          condition: data.condition,
          car_images: data.carImages,
          mileage_image: data.mileageImage,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle handover report submitted successfully",
      });

      // Reset form and close
      form.reset();
      onClose();

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['vehicleReports'] });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
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
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full">Submit Report</Button>
          </div>
        </form>
      </Form>
    </ReportCard>
  );
}