import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ManagerReportForm } from "@/components/ManagerReportForm";
import { BackButton } from "@/components/BackButton";
import { generateReportPDF } from "@/utils/pdfGenerator";

const formSchema = z.object({
  staffName: z.string().min(1, "Staff name is required"),
  shift: z.string().min(1, "Shift information is required"),
  attendanceRating: z.string().min(1, "Attendance rating is required"),
  dutiesRating: z.string().min(1, "Duties rating is required"),
  uniformRating: z.string().min(1, "Uniform rating is required"),
  presenceRating: z.string().min(1, "Presence rating is required"),
  description: z.string().min(1, "Description is required"),
  photoUrl: z.string().min(1, "Photo is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ManagerReports() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffName: "",
      shift: "",
      attendanceRating: "",
      dutiesRating: "",
      uniformRating: "",
      presenceRating: "",
      description: "",
      photoUrl: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting manager report:", data);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Create the report
      const { data: reportData, error: reportError } = await supabase.from("reports").insert({
        type: "manager_monthly",
        staff_name: data.staffName,
        shift: data.shift,
        attendance_rating: data.attendanceRating,
        duties_rating: data.dutiesRating,
        uniform_rating: data.uniformRating,
        presence_rating: data.presenceRating,
        description: data.description,
        photo_url: data.photoUrl,
        user_id: user.id,
      }).select().single();

      if (reportError) {
        console.error("Error creating report:", reportError);
        throw reportError;
      }

      console.log("Report created successfully:", reportData);

      // Generate PDF after successful report submission
      const pdfUrl = await generateReportPDF(
        data,
        "manager_monthly",
        reportData.id,
        user.id
      );

      if (!pdfUrl) {
        console.error("Failed to generate PDF");
        throw new Error("Failed to generate PDF");
      }

      console.log("PDF generated successfully:", pdfUrl);

      // Create a corresponding visit record for monthly visit
      const { error: visitError } = await supabase.from("visits").insert({
        user_id: user.id,
        status: 'completed',
        visit_date: new Date().toISOString(),
        type: 'manager_monthly' // Add this to differentiate between visit types
      });

      if (visitError) {
        console.error("Error creating visit record:", visitError);
        throw visitError;
      }

      console.log("Visit record created successfully");

      // Store report file metadata
      const { error: fileError } = await supabase.from("report_files").insert({
        user_id: user.id,
        report_type: "manager_monthly",
        file_name: `manager_monthly_${reportData.id}.pdf`,
        file_path: `${reportData.id}.pdf`,
        report_id: reportData.id
      });

      if (fileError) {
        console.error("Error storing file metadata:", fileError);
        throw fileError;
      }

      console.log("File metadata stored successfully");

      // Create notification for the new report
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: user.id,
        type: "report_submitted",
        title: "Monthly Report Submitted",
        message: `Monthly report for ${data.staffName} has been submitted successfully.`,
        report_id: reportData.id
      });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
      }

      toast({
        title: "Success!",
        description: "Manager monthly report has been submitted successfully.",
        variant: "default",
      });

      navigate("/reports");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold mt-4">Manager Monthly Report</h1>
        <p className="text-muted-foreground">
          Complete the monthly assessment for security staff performance
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ManagerReportForm form={form} />
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}