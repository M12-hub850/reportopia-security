
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      console.log("Starting file upload to bucket:", bucket);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate a unique filename to avoid conflicts
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split(".").pop()?.toLowerCase() || 'png';
      const filePath = `${timestamp}_${random}.${fileExt}`;

      console.log("Uploading file:", { filePath, fileType: file.type, bucket });

      // First, check if we can access the bucket
      const { data: bucketExists, error: bucketError } = await supabase.storage
        .from(bucket)
        .list();

      if (bucketError) {
        console.error("Bucket access error:", bucketError);
        throw new Error(`Cannot access bucket ${bucket}. Please check permissions.`);
      }

      // Attempt the upload
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      console.log("File uploaded successfully, getting public URL");

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log("Got public URL:", publicUrl);

      onChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Reset the input to allow uploading the same file again
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error: any) {
      console.error("Error uploading image:", error);
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
          {isUploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
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
