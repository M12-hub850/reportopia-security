import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

export default function VisitorLogs() {
  const [visitorName, setVisitorName] = useState("");
  const [visitPurpose, setVisitPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: reports, refetch } = useQuery({
    queryKey: ['visitor-logs'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('type', 'visitor_log')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure camera permissions are granted.",
        variant: "destructive",
      });
    }
  };

  const captureAndSubmit = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!visitorName.trim() || !visitPurpose.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both visitor name and purpose of visit.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8)
      );

      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCapturing(false);

      const fileName = `${crypto.randomUUID()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('report_photos')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('report_photos')
        .getPublicUrl(fileName);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error: reportError } = await supabase
        .from('reports')
        .insert({
          type: 'visitor_log',
          description,
          photo_url: publicUrl,
          user_id: user.user.id,
          visitor_name: visitorName,
          visit_purpose: visitPurpose,
        });

      if (reportError) throw reportError;

      setVisitorName("");
      setVisitPurpose("");
      setDescription("");
      refetch();
      toast({
        title: "Success",
        description: "Visitor log submitted successfully.",
      });
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Visitor Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Submit New Visitor Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitorName">Visitor Name</Label>
            <Input
              id="visitorName"
              placeholder="Enter visitor's name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visitPurpose">Purpose of Visit</Label>
            <Input
              id="visitPurpose"
              placeholder="Enter purpose of visit"
              value={visitPurpose}
              onChange={(e) => setVisitPurpose(e.target.value)}
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
          
          {isCapturing ? (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              <Button 
                onClick={captureAndSubmit} 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Capture Photo & Submit"}
              </Button>
            </div>
          ) : (
            <Button onClick={startCamera} className="w-full">
              Take Photo
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports?.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <img
              src={report.photo_url}
              alt="Report photo"
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{report.visitor_name}</h3>
              <p className="text-sm text-gray-600 mt-1">{report.visit_purpose}</p>
              <p className="mt-2 text-sm">{report.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}