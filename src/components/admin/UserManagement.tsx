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
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;

      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          return {
            id: user.id,
            email: user.email,
            role: roles?.role || "user",
            created_at: user.created_at,
          };
        })
      );

      console.log("Users fetched:", usersWithRoles);
      setUsers(usersWithRoles);
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
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: "tempPassword123!", // Temporary password
        email_confirm: true,
      });

      if (createError) throw createError;

      if (user) {
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