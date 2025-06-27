import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminUser } from "@/types/adminUser";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import UserPermissionsForm from "./UserPermissionsForm";

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
  onPermissionsUpdated: () => void;
}

export const UserPermissionsDialog = ({
  open,
  onOpenChange,
  user,
  onPermissionsUpdated,
}: UserPermissionsDialogProps) => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user permissions when dialog opens
  useEffect(() => {
    if (open && user) {
      fetchUserPermissions();
    }
  }, [open, user]);

  const fetchUserPermissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call Supabase function to get user permissions
      const { data, error } = await supabase.rpc('get_user_permissions', {
        target_user_id: user.id
      });

      if (error) {
        throw error;
      }

      // Set permissions (if no permissions are found, use empty array)
      setUserPermissions(data || []);
    } catch (err) {
      console.error("Error fetching user permissions:", err);
      setError("Failed to load user permissions. Please try again.");
      setUserPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionsUpdated = () => {
    // Call the parent callback to refresh user data
    onPermissionsUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Manage Permissions: {user.email}
          </DialogTitle>
          <DialogDescription>
            Configure specific permissions for this user. Changes will take effect immediately.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading permissions...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            {error}
          </div>
        ) : (
          <UserPermissionsForm
            userId={user.id}
            userRole={user.primary_role || "user"}
            initialPermissions={userPermissions}
            onPermissionsUpdated={handlePermissionsUpdated}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
