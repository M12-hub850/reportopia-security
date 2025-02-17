
import { useEffect, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserManagement } from "@/components/admin/UserManagement";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log("Checking admin access...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found, redirecting to login");
        navigate("/sign-in");
        return;
      }

      // For now, we'll consider all authenticated users as having access
      // You can implement your own admin check logic here
      setIsAdmin(true);
    } catch (error) {
      console.error("Error in checkAdminAccess:", error);
      navigate("/dashboard");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <UserManagement />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
