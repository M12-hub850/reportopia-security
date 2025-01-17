import * as z from "zod";

export const formSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  brand: z.string().min(1, "Brand is required"),
  mileage: z.string().min(1, "Current mileage is required"),
  location: z.string().min(1, "Location is required"),
  contents: z.object({
    spareTire: z.boolean().default(false),
    jackHandle: z.boolean().default(false),
    safetyKit: z.boolean().default(false),
    fireExtinguisher: z.boolean().default(false),
    dashCam: z.boolean().default(false),
  }),
  observations: z.array(z.string()).default([]),
  receiverName: z.string().min(1, "Receiver name is required"),
  receiverPhone: z.string().min(1, "Receiver phone is required"),
  receiverId: z.string().min(1, "Receiver ID is required"),
  supervisorName: z.string().min(1, "Supervisor name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  carImages: z.array(z.string()).min(1, "At least one car condition image is required"),
  mileageImage: z.string().min(1, "Mileage meter image is required"),
});

export type FormSchema = z.infer<typeof formSchema>;