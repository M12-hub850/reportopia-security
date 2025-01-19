import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Settings, User } from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainNav() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    console.log("MainNav: Initializing component");
    fetchProfile();
  }, []);

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
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/settings")}>
          <Settings className="h-4 w-4" />
        </Button>
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
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}