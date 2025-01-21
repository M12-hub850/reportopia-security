import * as z from "zod";

export const formSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  brand: z.string().min(1, "Brand is required"),
  mileage: z.string().min(1, "Mileage is required"),
  location: z.string().min(1, "Location is required"),
  contents: z.object({
    spareTire: z.boolean(),
    jackHandle: z.boolean(),
    safetyKit: z.boolean(),
    fireExtinguisher: z.boolean(),
    dashCam: z.boolean(),
    other: z.boolean(),
    otherSpecification: z.string().optional(),
  }),
  observations: z.array(z.string()),
  receiverName: z.string().min(1, "Receiver name is required"),
  receiverPhone: z.string().min(1, "Receiver phone is required"),
  receiverId: z.string().min(1, "Receiver ID is required"),
  receiverIdImage: z.string().min(1, "Receiver ID image is required"),
  drivingLicenseImage: z.string().min(1, "Driving license image is required"),
  supervisorName: z.string().min(1, "Supervisor name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  carImages: z.array(z.string()).min(1, "At least one car image is required"),
});

export type FormSchema = z.infer<typeof formSchema>;