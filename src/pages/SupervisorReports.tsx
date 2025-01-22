import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SupervisorReportForm } from "@/components/SupervisorReportForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/types/supabase";

type ReportType = Database['public']['Enums']['report_type'];
type VisitStatus = Database['public']['Enums']['visit_status'];

export default function SupervisorReports() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create the report
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          type: 'supervisor_weekly' as ReportType,
          description: formData.description,
          photo_url: formData.photo_url,
          user_id: user.id,
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Create staff entries
      if (formData.staffEntries && formData.staffEntries.length > 0) {
        const staffEntriesData = formData.staffEntries.map((entry: any) => ({
          report_id: report.id,
          staff_name: entry.staff_name,
          shift: entry.shift,
          attendance_rating: entry.attendance_rating,
          duties_rating: entry.duties_rating,
          uniform_rating: entry.uniform_rating,
          presence_rating: entry.presence_rating,
        }));

        const { error: staffError } = await supabase
          .from('staff_entries')
          .insert(staffEntriesData);

        if (staffError) throw staffError;
      }

      // Create a visit record
      const { error: visitError } = await supabase
        .from('visits')
        .insert({
          user_id: user.id,
          status: 'completed' as VisitStatus,
          type: 'supervisor_weekly',
          visit_date: new Date().toISOString(),
        });

      if (visitError) throw visitError;

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

      if (notificationError) throw notificationError;

      toast.success('Report submitted successfully');
      navigate('/reports');
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supervisor Weekly Report</h1>
      </div>
      <SupervisorReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}