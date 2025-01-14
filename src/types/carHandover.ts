import * as z from "zod";

export const formSchema = z.object({
  carModel: z.string().min(2, "Car model is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
  mileage: z.string().min(1, "Current mileage is required"),
  project: z.string().min(1, "Project location is required"),
  condition: z.string().min(10, "Please provide detailed condition notes"),
  carImages: z.array(z.string()).min(1, "At least one car condition image is required"),
  mileageImage: z.string().min(1, "Mileage meter image is required"),
});

export type FormSchema = z.infer<typeof formSchema>;