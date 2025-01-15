import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function VisitorLogs() {
  const [description, setDescription] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
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

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => 
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8)
    );

    // Stop camera stream
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    setIsCapturing(false);

    // Upload photo to Supabase Storage
    const fileName = `${crypto.randomUUID()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('report_photos')
      .upload(fileName, blob);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      toast({
        title: "Upload Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Get public URL for the uploaded photo
    const { data: { publicUrl } } = supabase.storage
      .from('report_photos')
      .getPublicUrl(fileName);

    // Create report entry
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { error: reportError } = await supabase
      .from('reports')
      .insert({
        type: 'visitor_log',
        description,
        photo_url: publicUrl,
        user_id: user.user.id,
      });

    if (reportError) {
      console.error('Error creating report:', reportError);
      toast({
        title: "Submission Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Reset form and show success message
    setDescription("");
    refetch();
    toast({
      title: "Success",
      description: "Visitor log submitted successfully.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Visitor Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Submit New Visitor Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter visitor log details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
          
          {isCapturing ? (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              <Button onClick={capturePhoto} className="w-full">
                Capture Photo
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
              <p className="text-sm text-gray-600">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
              <p className="mt-2">{report.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
