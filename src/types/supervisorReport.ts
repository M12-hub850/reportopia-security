import * as z from "zod";

export const supervisorReportSchema = z.object({
  staffName: z.string().min(1, "Staff name is required"),
  shift: z.string().min(1, "Shift information is required"),
  attendanceRating: z.string().min(1, "Attendance rating is required"),
  dutiesRating: z.string().min(1, "Duties rating is required"),
  uniformRating: z.string().min(1, "Uniform rating is required"),
  presenceRating: z.string().min(1, "Presence rating is required"),
  description: z.string().min(1, "Description is required"),
  photoUrl: z.string().min(1, "Photo evidence is required"),
});

export type SupervisorReportFormValues = z.infer<typeof supervisorReportSchema>;