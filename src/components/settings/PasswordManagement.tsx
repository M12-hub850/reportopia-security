import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PasswordManagementProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    newPassword: string;
    confirmPassword: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdatePassword: () => void;
  isLoading: boolean;
}

export function PasswordManagement({
  showDialog,
  onOpenChange,
  formData,
  onChange,
  onUpdatePassword,
  isLoading,
}: PasswordManagementProps) {
  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Lock className="mr-2 h-4 w-4" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Enter your new password below</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={onChange}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onChange}
            />
          </div>
          <Button className="w-full" onClick={onUpdatePassword} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}