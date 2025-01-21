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
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export default function SupervisorReports() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].reports.supervisor;

  const form = useForm<SupervisorReportFormValues>({
    resolver: zodResolver(supervisorReportSchema),
    defaultValues: {
      staffEntries: [],
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

      console.log("Authenticated user:", user.id);

      // Insert the main report
      const { data: reportData, error: insertError } = await supabase
        .from("reports")
        .insert({
          type: "supervisor_weekly",
          description: data.description,
          photo_url: data.photoUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting report:", insertError);
        throw insertError;
      }

      console.log("Report inserted successfully:", reportData);

      // Insert staff entries
      if (data.staffEntries && data.staffEntries.length > 0) {
        const staffEntriesData = data.staffEntries.map(entry => ({
          report_id: reportData.id,
          staff_name: entry.staffName,
          shift: entry.shift,
          attendance_rating: entry.attendanceRating,
          duties_rating: entry.dutiesRating,
          uniform_rating: entry.uniformRating,
          presence_rating: entry.presenceRating,
        }));

        const { error: staffError } = await supabase
          .from("staff_entries")
          .insert(staffEntriesData);

        if (staffError) {
          console.error("Error inserting staff entries:", staffError);
          throw staffError;
        }
      }

      // Generate and store PDF
      const pdfUrl = await generateReportPDF(
        {
          ...data,
          reportId: reportData.id,
          reportType: "supervisor_weekly",
          timestamp: new Date().toISOString(),
        },
        "supervisor_weekly",
        reportData.id,
        user.id
      );

      if (!pdfUrl) {
        console.error("Failed to generate PDF");
        throw new Error("Failed to generate PDF");
      }

      console.log("PDF generated successfully:", pdfUrl);

      // Create notification
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type: "report_submitted",
          title: t.notificationTitle,
          message: t.notificationMessage,
          report_id: reportData.id,
        });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
      }

      toast({
        title: translations[language].common.success,
        description: t.successMessage,
      });

      navigate("/reports");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        variant: "destructive",
        title: translations[language].common.error,
        description: t.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold mt-4">{t.title}</h1>
        <p className="text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      <SupervisorReportForm
        form={form}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/reports")}
      />
    </div>
  );
}