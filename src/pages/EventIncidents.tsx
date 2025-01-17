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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const { data: reports, isLoading } = useQuery({
    queryKey: ['event-incidents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('type', 'event_incident')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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

      const { data: reportData, error } = await supabase.from("reports").insert({
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
      }).select().single();

      if (error) throw error;

      const pdfUrl = await generateReportPDF(
        data,
        "event_incident",
        reportData.id,
        user.id
      );

      if (!pdfUrl) {
        console.error("Failed to generate PDF");
      }

      toast({
        title: "Success!",
        description: "Event/Incident report has been submitted successfully.",
        variant: "default",
      });

      form.reset();
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
        <h1 className="text-3xl font-bold mt-4">Events and Incidents</h1>
        <p className="text-muted-foreground">
          Record and view events and incidents
        </p>
      </div>

      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Report</TabsTrigger>
          <TabsTrigger value="view">View Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Form {...form}>
            <EventIncidentForm
              form={form}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => navigate("/")}
            />
          </Form>
        </TabsContent>

        <TabsContent value="view">
          {isLoading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : !reports?.length ? (
            <Card className="p-8 text-center text-muted-foreground">
              No reports found
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Incident at {report.location}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(report.incident_date), 'PPP')} at{' '}
                      {format(new Date(report.reporting_time), 'p')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <div className="font-semibold">Guard on Duty</div>
                        <div>{report.staff_name}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Description</div>
                        <div>{report.description}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Action Taken</div>
                        <div>{report.action_taken}</div>
                      </div>
                      {report.photo_url && (
                        <div>
                          <div className="font-semibold">Photo Evidence</div>
                          <img 
                            src={report.photo_url} 
                            alt="Incident evidence" 
                            className="mt-2 rounded-md max-w-sm"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}