import { z } from "zod";

export const eventIncidentSchema = z.object({
  guardName: z.string().min(1, "Guard name is required"),
  shift: z.string().min(1, "Shift is required"),
  location: z.string().min(1, "Location is required"),
  incidentDate: z.date(),
  description: z.string().min(1, "Description is required"),
  reportingTime: z.date(),
  actionTaken: z.string().min(1, "Action taken is required"),
  reportingPerson: z.string().min(1, "Reporting person is required"),
  photoUrl: z.string().optional(),
});

export type EventIncidentFormValues = z.infer<typeof eventIncidentSchema>;