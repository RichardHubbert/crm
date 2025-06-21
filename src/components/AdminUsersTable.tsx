
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit, User, Building, Calendar, Shield } from "lucide-react";
import { AdminUser } from "@/types/adminUser";
import { formatUKDate } from "@/lib/utils";
import EditUserDialog from "./EditUserDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminUsersTableProps {
  users: AdminUser[];
  onUsersChange: () => void;
}

export const AdminUsersTable = ({ users, onUsersChange }: AdminUsersTableProps) => {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditUser = useCallback((user: AdminUser) => {
    console.log('Opening edit dialog for user:', user.id);
    setEditingUser(user);
    setShowEditDialog(true);
  }, []);

  const handleDeleteUser = useCallback((user: AdminUser) => {
    console.log('Opening delete dialog for user:', user.id);
    setUserToDelete(user);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!userToDelete) {
      console.error('No user selected for deletion');
      return;
    }

    console.log('Starting delete process for user:', userToDelete.id);
    setIsDeleting(true);

    try {
      // Get the current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get authentication session');
      }

      if (!session?.access_token) {
        console.error('No access token available');
        throw new Error('No authentication token available');
      }

      console.log('Making request to delete user via edge function...');
      
      // Call the Edge Function to delete the user with more robust error handling
      const response = await fetch(`https://nnxdtpnrwgcknhpyhowr.supabase.co/functions/v1/admin-delete-user-complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_user_id: userToDelete.id,
        }),
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', Object.fromEntries(response.headers.entries()));

      // Handle response more carefully
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('Delete response JSON:', result);
      } else {
        const textResult = await response.text();
        console.log('Delete response text:', textResult);
        result = { error: `Unexpected response format: ${textResult}` };
      }

      if (!response.ok) {
        console.error('Delete request failed:', {
          status: response.status,
          statusText: response.statusText,
          result
        });
        
        if (response.status === 500) {
          throw new Error(`Server error (500): ${result?.error || result?.message || 'Internal server error occurred during user deletion'}`);
        } else if (response.status === 403) {
          throw new Error('Access denied: You do not have permission to delete users');
        } else if (response.status === 401) {
          throw new Error('Authentication failed: Please sign in again');
        } else {
          throw new Error(result?.error || result?.message || `Delete request failed with status ${response.status}`);
        }
      }

      if (!result?.success) {
        console.error('Delete operation unsuccessful:', result);
        throw new Error(result?.error || result?.message || 'User deletion was not successful');
      }

      console.log('User deleted successfully:', result);
      toast.success(`User ${userToDelete.email} has been deleted successfully`);
      
      // Close dialog and refresh users list
      setShowDeleteDialog(false);
      setUserToDelete(null);
      onUsersChange();

    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          toast.error(`Server Error: ${error.message}. Please try again or contact support if the issue persists.`);
        } else if (error.message.includes('fetch')) {
          toast.error('Network error: Unable to connect to the server. Please check your connection and try again.');
        } else {
          toast.error(`Delete failed: ${error.message}`);
        }
      } else {
        toast.error('An unexpected error occurred while deleting the user');
      }
    } finally {
      setIsDeleting(false);
    }
  }, [userToDelete, onUsersChange]);

  const handleUserUpdated = useCallback(() => {
    console.log('User updated, refreshing list...');
    setShowEditDialog(false);
    setEditingUser(null);
    onUsersChange();
  }, [onUsersChange]);

  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Users Found</CardTitle>
          <CardDescription>
            There are currently no users in the system.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{user.email}</h3>
                      {user.primary_role === 'admin' && (
                        <Shield className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    
                    {(user.first_name || user.last_name) && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="text-sm">
                          {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                        </span>
                      </div>
                    )}
                    
                    {user.business_name && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Building className="h-3 w-3" />
                        <span className="text-sm">{user.business_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">
                        Joined {formatUKDate(user.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={user.primary_role === 'admin' ? 'default' : 'secondary'}
                    className={user.primary_role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                  >
                    {user.primary_role || 'user'}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {user.onboarding_data && (
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {user.onboarding_data.purpose && (
                    <div>
                      <span className="font-medium text-muted-foreground">Purpose:</span>
                      <p className="mt-1">{user.onboarding_data.purpose}</p>
                    </div>
                  )}
                  
                  {user.onboarding_data.role && (
                    <div>
                      <span className="font-medium text-muted-foreground">Role:</span>
                      <p className="mt-1">{user.onboarding_data.role}</p>
                    </div>
                  )}
                  
                  {user.onboarding_data.company_size && (
                    <div>
                      <span className="font-medium text-muted-foreground">Company Size:</span>
                      <p className="mt-1">{user.onboarding_data.company_size}</p>
                    </div>
                  )}
                  
                  {user.onboarding_data.industry && (
                    <div>
                      <span className="font-medium text-muted-foreground">Industry:</span>
                      <p className="mt-1">{user.onboarding_data.industry}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {editingUser && (
        <EditUserDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          user={editingUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete User Account"
        description={`Are you sure you want to permanently delete ${userToDelete?.email}? This will remove all their data and cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};
