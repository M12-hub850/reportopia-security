
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
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Starting upload to bucket:', bucket);

      // First, check if bucket exists
      const { data: bucketExists, error: bucketError } = await supabase.storage
        .getBucket(bucket);

      if (bucketError) {
        console.error("Bucket error:", bucketError);
        throw new Error(`Bucket ${bucket} not found or inaccessible`);
      }

      // Attempt upload
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

      // Get public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (urlError) {
        console.error("URL error:", urlError);
        throw new Error("Failed to get public URL");
      }

      console.log('Upload successful, public URL:', publicUrl);
      onChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
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
          className={!value && required ? "border-red-500" : ""}
        >
          {isUploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
          {required && !value && " (Required)"}
        </Button>
        {value && (
          <img
            src={value}
            alt="Uploaded"
            className="w-20 h-20 object-cover rounded"
            onError={(e) => {
              console.error("Image load error:", e);
              const img = e.target as HTMLImageElement;
              img.src = 'https://via.placeholder.com/80?text=Error';
            }}
          />
        )}
      </div>
    </div>
  );
}
