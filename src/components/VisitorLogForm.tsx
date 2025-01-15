import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VisitorLogForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
  const [visitorName, setVisitorName] = useState("");
  const [visitPurpose, setVisitPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitorName.trim() || !visitPurpose.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both visitor name and purpose of visit.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reports')
        .insert({
          type: 'visitor_log',
          description,
          photo_url: '', // Required field but not used for visitor logs
          user_id: user.user.id,
          visitor_name: visitorName,
          visit_purpose: visitPurpose,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Visitor log submitted successfully.",
      });

      // Reset form
      setVisitorName("");
      setVisitPurpose("");
      setDescription("");
      onSubmitSuccess();

    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Visitor Log</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitorName">Visitor Name</Label>
            <Input
              id="visitorName"
              placeholder="Enter visitor's name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visitPurpose">Purpose of Visit</Label>
            <Input
              id="visitPurpose"
              placeholder="Enter purpose of visit"
              value={visitPurpose}
              onChange={(e) => setVisitPurpose(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              placeholder="Enter any additional details about the visit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}