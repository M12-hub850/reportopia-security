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

export default function EventIncidents() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

      const { error } = await supabase.from("reports").insert({
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
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event/Incident report has been submitted successfully.",
        variant: "default",
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
    <Form {...form}>
      <div className="container max-w-4xl py-6">
        <div className="mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold mt-4">Record of Events and Incidents</h1>
          <p className="text-muted-foreground">
            Document events and incidents that occur during security operations
          </p>
        </div>

        <EventIncidentForm
          form={form}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/")}
        />
      </div>
    </Form>
  );
}