
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Settings, FileText, Clipboard, AlertTriangle, Car } from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
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

  const handleSignOut = async () => {
    try {
      console.log("MainNav: Signing out user");
      await supabase.auth.signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("MainNav: Error signing out:", error);
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
          className="text-red-600 hover:text-red-700"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
