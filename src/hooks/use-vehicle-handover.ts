
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema } from "@/types/carHandover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { createCompositeImage } from "@/utils/imageComposite";

export function useVehicleHandover(onClose: () => void) {
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
      isDelegated: false,
      delegationNumber: "",
      nonDelegationReason: "",
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
      supervisorName: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      carImages: [],
    },
  });

  const captureImage = async (
    fieldName: keyof Pick<FormSchema, 'carImages' | 'receiverIdImage'>
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

      // Create a composite image for the mileage
      const mileageImage = data.carImages[0]; // Use the first car image as mileage image
      
      // Create the vehicle report
      const { data: vehicleReport, error: vehicleError } = await supabase
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
            isDelegated: data.isDelegated,
            delegationNumber: data.delegationNumber,
            nonDelegationReason: data.nonDelegationReason,
          }),
          car_images: data.carImages,
          receiver_id_image: data.receiverIdImage,
          mileage_image: mileageImage
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Create notification for the vehicle handover
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'report_submitted',
          title: 'Vehicle Handover Report Submitted',
          message: `Vehicle handover report for ${data.model} (${data.plateNumber}) has been submitted successfully.`,
          vehicle_report_id: vehicleReport.id
        });

      if (notificationError) throw notificationError;

      toast({
        title: "Success!",
        description: "Vehicle handover report has been submitted successfully.",
      });

      // Reset form and close modal
      form.reset();
      onClose();

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['vehicleReports'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
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

  return {
    form,
    isSubmitting,
    captureImage,
    onSubmit
  };
}
