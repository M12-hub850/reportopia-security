
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserList } from "./UserList";
import { CreateUserDialog } from "./CreateUserDialog";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  email: string;
  created_at: string;
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, created_at');

      if (profilesError) throw profilesError;

      console.log("Users fetched:", profiles);
      setUsers(profiles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email: string) => {
    try {
      console.log("Creating new user...");
      const { data: { user }, error: createError } = await supabase.auth.signUp({
        email,
        password: "tempPassword123!", // Temporary password
      });

      if (createError) throw createError;

      console.log("User created successfully");
      toast({
        title: "Success",
        description: "User created successfully.",
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user.",
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateUserDialog onCreateUser={createUser} />
      </div>
      <UserList users={users} />
    </div>
  );
}
