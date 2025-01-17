import * as z from "zod";

export const eventIncidentSchema = z.object({
  guardName: z.string().min(1, "Guard name is required"),
  shift: z.string().min(1, "Shift information is required"),
  location: z.string().min(1, "Location is required"),
  incidentDate: z.date(),
  reportingTime: z.date(),
  description: z.string().min(1, "Description is required"),
  actionTaken: z.string().min(1, "Action taken is required"),
  reportingPerson: z.string().min(1, "Reporting person is required"),
  photoUrl: z.string().min(1, "Photo evidence is required"),
});

export type EventIncidentFormValues = z.infer<typeof eventIncidentSchema>;