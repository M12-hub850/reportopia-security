import { useState } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureProps {
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
}

export function ProfilePicture({ avatarUrl, onAvatarChange }: ProfilePictureProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarChange = async (url: string) => {
    try {
      setIsUploading(true);
      onAvatarChange(url);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile picture",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          <Camera className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <ImageUpload
        value={avatarUrl}
        onChange={handleAvatarChange}
        bucket="profile_pictures"
        required={false}
      />
    </div>
  );
}