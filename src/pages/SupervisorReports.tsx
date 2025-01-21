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

      console.log("Authenticated user:", user.id);

      const { data: reportData, error: insertError } = await supabase
        .from("reports")
        .insert({
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
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting report:", insertError);
        throw insertError;
      }

      console.log("Report inserted successfully:", reportData);

      const pdfUrl = await generateReportPDF(
        data,
        "supervisor_weekly",
        reportData.id,
        user.id
      );

      if (!pdfUrl) {
        console.error("Failed to generate PDF");
      } else {
        console.log("PDF generated successfully:", pdfUrl);
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