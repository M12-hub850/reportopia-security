
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BackButton } from "@/components/BackButton";
import { EventIncidentForm } from "@/components/EventIncidentForm";
import { eventIncidentSchema, type EventIncidentFormValues } from "@/types/eventIncident";
import { Form } from "@/components/ui/form";
import { generateReportPDF } from "@/utils/pdfGenerator";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export default function EventIncidents() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].reports.incidents;

  const form = useForm<EventIncidentFormValues>({
    resolver: zodResolver(eventIncidentSchema),
    defaultValues: {
      guardName: "",
      shift: "",
      location: "",
      incidentDate: new Date(),
      description: "",
      reportingTime: new Date(),
      actionTaken: "",
      reportingPerson: "",
      photoUrl: "",
    },
  });

  const handleSubmit = async (data: EventIncidentFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting event/incident report:", data);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Insert the report data
      const { data: reportData, error } = await supabase
        .from("reports")
        .insert({
          type: "event_incident",
          staff_name: data.guardName,
          shift: data.shift,
          location: data.location,
          incident_date: data.incidentDate.toISOString(),
          description: data.description,
          reporting_time: data.reportingTime.toISOString(),
          action_taken: data.actionTaken,
          reporting_person: data.reportingPerson,
          photo_url: data.photoUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting report:", error);
        throw error;
      }

      // Generate PDF for the report
      const pdfUrl = await generateReportPDF(
        data,
        "event_incident",
        reportData.id,
        user.id
      );

      if (!pdfUrl) {
        console.error("Failed to generate PDF");
      }

      // Create a notification
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type: "report_submitted",
          title: "Incident Report Submitted",
          message: `An incident report has been submitted by ${data.guardName}`,
          report_id: reportData.id
        });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
      }

      toast({
        title: translations[language].common.success,
        description: t.successMessage,
      });

      // Navigate to reports page after successful submission
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

      <Form {...form}>
        <EventIncidentForm
          form={form}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/")}
        />
      </Form>
    </div>
  );
}
