
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

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("Uploading file:", { fileName, fileExt, bucket });

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
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
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
      // Reset the input value so the same file can be uploaded again if needed
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) input.value = '';
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
