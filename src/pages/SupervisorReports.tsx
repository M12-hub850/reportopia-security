import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SupervisorReportForm } from "@/components/SupervisorReportForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/types/supabase";
import { BackButton } from "@/components/BackButton";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

type ReportType = Database['public']['Enums']['report_type'];
type VisitStatus = Database['public']['Enums']['visit_status'];

export default function SupervisorReports() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm();
  const queryClient = useQueryClient();

  const handleSubmit = async (formData: any) => {
    try {
      console.log('Starting report submission:', formData);
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Not authenticated');
      }

      // Ensure photo_url is present
      if (!formData.photoUrl) {
        throw new Error('Photo evidence is required');
      }

      // Create the report
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          type: 'supervisor_weekly' as ReportType,
          description: formData.description,
          photo_url: formData.photoUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (reportError) {
        console.error('Error creating report:', reportError);
        throw reportError;
      }

      console.log('Report created successfully:', report);

      // Create staff entries
      if (formData.staffEntries && formData.staffEntries.length > 0) {
        const staffEntriesData = formData.staffEntries.map((entry: any) => ({
          report_id: report.id,
          staff_name: entry.staffName,
          shift: entry.shift,
          attendance_rating: entry.attendanceRating,
          duties_rating: entry.dutiesRating,
          uniform_rating: entry.uniformRating,
          presence_rating: entry.presenceRating,
        }));

        const { error: staffError } = await supabase
          .from('staff_entries')
          .insert(staffEntriesData);

        if (staffError) {
          console.error('Error creating staff entries:', staffError);
          throw staffError;
        }

        console.log('Staff entries created successfully');
      }

      // Create a visit record with completed status
      const { error: visitError } = await supabase
        .from('visits')
        .insert({
          user_id: user.id,
          status: 'completed' as VisitStatus,
          type: 'supervisor_weekly',
          visit_date: new Date().toISOString(),
        });

      if (visitError) {
        console.error('Error creating visit record:', visitError);
        throw visitError;
      }

      console.log('Visit record created successfully');

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'report_submitted',
          title: 'Supervisor Weekly Report Submitted',
          message: 'Your supervisor weekly report has been submitted successfully',
          report_id: report.id,
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
        throw notificationError;
      }

      console.log('Notification created successfully');

      // Invalidate relevant queries to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['weekly-visits'] });
      await queryClient.invalidateQueries({ queryKey: ['reports'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Show success toast with icon
      toast.success('Report Submitted Successfully', {
        description: 'Your supervisor weekly report has been submitted and saved. You can view it in the reports archive.',
        duration: 5000,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });

      // Navigate after showing the toast
      setTimeout(() => {
        navigate('/reports');
      }, 1000);

    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error('Failed to Submit Report', {
        description: error.message || 'Please try again or contact support if the problem persists.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/reports');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold">Supervisor Weekly Report</h1>
      </div>
      <SupervisorReportForm 
        form={form}
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
      />
    </div>
  );
}