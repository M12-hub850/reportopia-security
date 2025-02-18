
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Settings, FileText, Clipboard, AlertTriangle, Car } from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MainNav() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].common;
  const [isAdmin] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      console.log("MainNav: Signing out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });

      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("MainNav: Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigationItems = [
    { label: t.managerReports, icon: FileText, path: "/manager-reports" },
    { label: t.supervisorReports, icon: Clipboard, path: "/supervisor-reports" },
    { label: t.eventIncidents, icon: AlertTriangle, path: "/event-incidents" },
    { label: t.carHandovers, icon: Car, path: "/car-handovers/new" },
    { label: t.settings, icon: Settings, path: "/settings" },
  ];

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>{t.menu}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex items-center gap-4">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <NotificationsDropdown />
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800 transition-all duration-300"
        >
          {isLoading ? "Signing out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
