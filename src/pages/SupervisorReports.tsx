import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BackButton } from "@/components/BackButton";
import { SupervisorReportForm } from "@/components/SupervisorReportForm";
import { supervisorReportSchema, type SupervisorReportFormValues } from "@/types/supervisorReport";
import { generateReportPDF } from "@/utils/pdfGenerator";

export default function SupervisorReports() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SupervisorReportFormValues>({
    resolver: zodResolver(supervisorReportSchema),
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

  const handleSubmit = async (data: SupervisorReportFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting supervisor report:", data);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data: reportData, error } = await supabase.from("reports").insert({
        type: "supervisor_weekly",
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

      if (error) throw error;

      // Generate PDF after successful report submission
      const pdfUrl = await generateReportPDF(
        data,
        "supervisor_weekly",
        reportData.id,
        user.id
      );

      if (!pdfUrl) {
        console.error("Failed to generate PDF");
      }

      toast({
        title: "Report Submitted",
        description: "Supervisor weekly report has been saved successfully.",
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
        <h1 className="text-3xl font-bold mt-4">Supervisor Weekly Report</h1>
        <p className="text-muted-foreground">
          Complete the weekly assessment for security staff performance
        </p>
      </div>

      <SupervisorReportForm
        form={form}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}