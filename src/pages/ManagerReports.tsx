
import { useState, useEffect } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const staffEntrySchema = z.object({
  staffName: z.string().min(1, "Staff name is required"),
  shift: z.string().min(1, "Shift information is required"),
  attendanceRating: z.string().min(1, "Attendance rating is required"),
  dutiesRating: z.string().min(1, "Duties rating is required"),
  uniformRating: z.string().min(1, "Uniform rating is required"),
  presenceRating: z.string().min(1, "Presence rating is required"),
});

const formSchema = z.object({
  staffEntries: z.array(staffEntrySchema).min(1, "At least one staff entry is required"),
  description: z.string().min(1, "Description is required"),
  photoUrl: z.string().min(1, "Photo is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ManagerReports() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].reports.manager;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffEntries: [],
      description: "",
      photoUrl: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log("No valid session found:", error);
        navigate("/sign-in");
        return;
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        navigate("/sign-in");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Starting manager report submission:", data);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Auth error:", userError);
        if (userError.message.includes("invalid JWT")) {
          navigate("/sign-in");
          return;
        }
        throw userError;
      }

      if (!user) {
        throw new Error("Authentication required");
      }

      console.log("Creating report with user:", user.id);

      // First create the report
      const { data: reportData, error: reportError } = await supabase
        .from("reports")
        .insert({
          type: "manager_monthly",
          description: data.description,
          photo_url: data.photoUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (reportError) {
        console.error("Error creating report:", reportError);
        throw new Error(reportError.message);
      }

      if (!reportData) {
        throw new Error("Failed to create report - no data returned");
      }

      console.log("Report created successfully:", reportData.id);

      // Then create the staff entries
      const staffEntriesData = data.staffEntries.map(entry => ({
        report_id: reportData.id,
        staff_name: entry.staffName,
        shift: entry.shift,
        attendance_rating: entry.attendanceRating,
        duties_rating: entry.dutiesRating,
        uniform_rating: entry.uniformRating,
        presence_rating: entry.presenceRating,
      }));

      console.log("Creating staff entries:", staffEntriesData);

      const { error: staffEntriesError } = await supabase
        .from("staff_entries")
        .insert(staffEntriesData);

      if (staffEntriesError) {
        console.error("Error creating staff entries:", staffEntriesError);
        throw new Error(staffEntriesError.message);
      }

      console.log("Staff entries created successfully");

      // Generate PDF
      try {
        console.log("Generating PDF for report:", reportData.id);
        const pdfUrl = await generateReportPDF(
          { ...data, id: reportData.id },
          "manager_monthly",
          reportData.id,
          user.id
        );

        if (pdfUrl) {
          // Create report file entry
          const { error: fileError } = await supabase
            .from("report_files")
            .insert({
              user_id: user.id,
              report_id: reportData.id,
              report_type: "manager_monthly",
              file_name: `manager_monthly_${reportData.id}.pdf`,
              file_path: pdfUrl,
            });

          if (fileError) {
            console.error("Error creating report file entry:", fileError);
          }
        } else {
          console.warn("PDF generation failed but continuing with submission");
        }
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        // Continue with the process
      }

      // Create visit record
      console.log("Creating visit record");
      const { error: visitError } = await supabase
        .from("visits")
        .insert({
          user_id: user.id,
          status: 'completed',
          type: 'manager_monthly',
          visit_date: new Date().toISOString(),
        });

      if (visitError) {
        console.error("Error creating visit record:", visitError);
        // Continue with the process
      }

      // Create notification
      console.log("Creating notification");
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type: "report_submitted",
          title: t.notificationTitle,
          message: t.notificationMessage.replace('{count}', data.staffEntries.length.toString()),
          report_id: reportData.id
        });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
        // Continue with the process
      }

      toast({
        title: translations[language].common.success,
        description: t.successMessage,
      });

      navigate("/reports");
    } catch (error) {
      console.error("Error in report submission:", error);
      toast({
        variant: "destructive",
        title: translations[language].common.error,
        description: error instanceof Error ? error.message : t.errorMessage,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ManagerReportForm form={form} />
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/reports")}
              disabled={isSubmitting}
            >
              {translations[language].common.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.formState.isValid}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations[language].common.loading}
                </>
              ) : (
                translations[language].common.submit
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
