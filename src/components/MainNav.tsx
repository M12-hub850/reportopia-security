import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, 
  Settings, 
  User, 
  FileText, 
  Clipboard, 
  AlertTriangle,
  Car,
  Users
} from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MainNav() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].common;

  useEffect(() => {
    console.log("MainNav: Initializing component");
    fetchProfile();
    checkAdminRole();
  }, []);

  const checkAdminRole = async () => {
    try {
      console.log("Checking admin role...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (error) throw error;
      
      console.log("Is admin:", data);
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      console.log("MainNav: Fetching user profile");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("MainNav: Error fetching user:", userError);
        return;
      }

      if (!user) {
        console.log("MainNav: No authenticated user found");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("MainNav: Error fetching profile:", profileError);
        return;
      }

      if (profile?.avatar_url) {
        console.log("MainNav: Avatar URL found:", profile.avatar_url);
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      console.error("MainNav: Error in fetchProfile:", error);
    }
  };

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
    ...(isAdmin ? [{ label: "User Management", icon: Users, path: "/admin" }] : []),
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              {t.settings}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              {t.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
