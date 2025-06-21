
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EditUserDialog from "./EditUserDialog";
import AddUserDialog from "./AddUserDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { AdminUsersEmptyState } from "./AdminUsersEmptyState";
import { AdminUserTableHeader } from "./AdminUserTableHeader";
import { AdminUserTableRow } from "./AdminUserTableRow";
import { AdminUser } from "@/types/adminUser";

interface AdminUsersTableProps {
  users: AdminUser[];
  onUsersChange?: () => void;
}

export const AdminUsersTable = ({ users, onUsersChange }: AdminUsersTableProps) => {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    setIsDeleting(true);
    try {
      console.log('Starting complete user deletion for:', deletingUser.id);

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call the Edge Function for complete user deletion
      const { data, error } = await supabase.functions.invoke('admin-delete-user-complete', {
        body: { target_user_id: deletingUser.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to delete user');
      }

      if (data?.error) {
        console.error('Edge function returned error:', data.error);
        if (data.partial_success) {
          toast.warning(data.message);
          toast.info("User data deleted from application, but auth account may still exist");
        } else {
          throw new Error(data.error);
        }
      } else {
        console.log('User deletion successful:', data);
        toast.success("User completely deleted from both application and auth system");
      }

      onUsersChange?.();
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (users.length === 0) {
    return (
      <>
        <AdminUsersEmptyState onAddUser={() => setShowAddDialog(true)} />
        <AddUserDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onUserAdded={() => onUsersChange?.()}
        />
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage all users in the system ({users.length} total)
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <AdminUserTableHeader />
              <TableBody>
                {users.map((user) => (
                  <AdminUserTableRow
                    key={user.id}
                    user={user}
                    onEdit={setEditingUser}
                    onDelete={setDeletingUser}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <EditUserDialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
          onUserUpdated={() => onUsersChange?.()}
        />
      )}

      <AddUserDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onUserAdded={() => onUsersChange?.()}
      />

      <DeleteConfirmationDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Completely"
        description={`Are you sure you want to completely delete ${deletingUser?.email}? This will permanently remove all user data from both the application and the authentication system. This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};
