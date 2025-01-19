import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfilePicture } from "./ProfilePicture";
import { PersonalInfo } from "./PersonalInfo";
import { PasswordManagement } from "./PasswordManagement";

export function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    console.log("Initializing AccountSettings component");
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("Fetching user profile...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching user:", userError);
        throw userError;
      }

      if (!user) {
        console.log("No authenticated user found");
        return;
      }

      console.log("User found, fetching profile data...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.log("No profile found for user");
        // Initialize with default values
        setFormData(prev => ({
          ...prev,
          email: user.email || "",
        }));
        return;
      }

      console.log("Profile data retrieved successfully:", profile);
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || "",
        email: user.email || "",
        phone: profile.phone || "",
      }));
      setAvatarUrl(profile.avatar_url || "");
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile. Please try again.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    try {
      console.log("Updating profile...");
      setIsLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
      }

      if (!user) {
        console.log("No authenticated user found");
        throw new Error("No user found");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          avatar_url: avatarUrl,
        });

      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }

      console.log("Profile updated successfully");
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error in updateProfile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match",
      });
      return;
    }

    try {
      console.log("Updating password...");
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      console.log("Password updated successfully");
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setShowPasswordDialog(false);
      setFormData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account
        </CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfilePicture 
          avatarUrl={avatarUrl} 
          onAvatarChange={setAvatarUrl} 
        />
        <PersonalInfo 
          formData={formData} 
          onChange={handleInputChange} 
        />
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={updateProfile}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
          <PasswordManagement
            showDialog={showPasswordDialog}
            onOpenChange={setShowPasswordDialog}
            formData={formData}
            onChange={handleInputChange}
            onUpdatePassword={updatePassword}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}