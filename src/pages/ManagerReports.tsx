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

      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase.from("reports").insert({
        type: "manager_monthly",
        staff_name: data.staffName,
        shift: data.shift,
        attendance_rating: data.attendanceRating,
        duties_rating: data.dutiesRating,
        uniform_rating: data.uniformRating,
        presence_rating: data.presenceRating,
        description: data.description,
        photo_url: data.photoUrl,
        user_id: user.id, // Add the user_id field
      });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Manager monthly report has been saved successfully.",
      });

      navigate("/");
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