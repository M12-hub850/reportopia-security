
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket: string;
  required?: boolean;
}

export function ImageUpload({ value, onChange, bucket, required = true }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log("Starting upload process:", { bucket, fileType: file.type, fileSize: file.size });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error('Authentication error. Please try signing in again.');
      }
      if (!session) {
        throw new Error('You must be logged in to upload files');
      }
      console.log("User authenticated successfully");

      const fileExt = file.name.split(".").pop()?.toLowerCase() || 'png';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      console.log("Preparing to upload file:", { fileName, bucket, fileExt });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("File uploaded successfully:", uploadData);

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error getting public URL:", urlError);
        throw new Error('Failed to get public URL for uploaded file');
      }

      console.log("Generated public URL:", publicUrl);

      onChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Reset the input
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error: any) {
      console.error("Error uploading image:", {
        error,
        message: error.message,
        stack: error.stack,
        bucket,
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="image-upload"
        required={required && !value}
      />
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant={value ? "outline" : "default"}
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={isUploading}
          className={`${!value && required ? "border-red-500" : ""} min-w-[120px]`}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : value ? (
            "Change Image"
          ) : (
            "Upload Image"
          )}
          {required && !value && " (Required)"}
        </Button>
        {value && (
          <img
            src={value}
            alt="Uploaded"
            className="w-20 h-20 object-cover rounded"
          />
        )}
      </div>
    </div>
  );
}
