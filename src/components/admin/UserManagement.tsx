import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserList } from "./UserList";
import { CreateUserDialog } from "./CreateUserDialog";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
type User = {
  id: string;
  email: string;
  role?: AppRole;
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
        .select(`
          id,
          email,
          created_at,
          user_roles (
            role
          )
        `);

      if (profilesError) throw profilesError;

      const formattedUsers = profiles.map(profile => ({
        id: profile.id,
        email: profile.email,
        role: profile.user_roles?.[0]?.role || 'user',
        created_at: profile.created_at
      }));

      console.log("Users fetched:", formattedUsers);
      setUsers(formattedUsers);
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

  const createUser = async (email: string, role: AppRole) => {
    try {
      console.log("Creating new user...");
      const { data: { user }, error: createError } = await supabase.auth.signUp({
        email,
        password: "tempPassword123!", // Temporary password
      });

      if (createError) throw createError;

      if (user) {
        // Insert into user_roles
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role });

        if (roleError) throw roleError;
      }

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

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    try {
      console.log("Updating user role...", { userId, newRole });
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: newRole });

      if (error) throw error;

      console.log("Role updated successfully");
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role.",
      });
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
      <UserList users={users} onUpdateRole={updateUserRole} />
    </div>
  );
}