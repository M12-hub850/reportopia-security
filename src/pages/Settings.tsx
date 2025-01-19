import { MainNav } from "@/components/MainNav";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Bell, HelpCircle, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLanguageChange = async (lang: "en" | "ar") => {
    try {
      await setLanguage(lang);
      toast({
        title: "Language Updated",
        description: `The application language has been changed to ${
          lang === "en" ? "English" : "Arabic"
        }`,
      });
    } catch (error) {
      console.error("Error changing language:", error);
      toast({
        title: "Error",
        description: "Failed to update language preference",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />
      <div className="flex items-center p-6">
        <BackButton />
        <div className="flex-1 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Settings</h1>
          <p className="text-muted-foreground mb-8">
            Manage your account preferences and application settings.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language
                </CardTitle>
                <CardDescription>
                  Choose your preferred language for the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {language === "en" ? "English" : "العربية"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
                      العربية
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
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
              <CardContent>
                <Button variant="outline" className="w-full">
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help & Support
                </CardTitle>
                <CardDescription>
                  Get help with using the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  View Documentation
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}