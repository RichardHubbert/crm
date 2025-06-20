
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Building, Calendar, Edit, Trash2, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EditUserDialog from "./EditUserDialog";
import AddUserDialog from "./AddUserDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  created_at: string;
  primary_role?: string;
  roles?: string[];
  onboarding_data?: {
    purpose: string;
    role?: string;
    team_size?: string;
    company_size?: string;
    industry?: string;
    completed_at: string;
  };
}

interface AdminUsersTableProps {
  users: AdminUser[];
  onUsersChange?: () => void;
}

export const AdminUsersTable = ({ users, onUsersChange }: AdminUsersTableProps) => {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'business':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('admin_delete_user_profile', {
        target_user_id: deletingUser.id,
      });

      if (error) {
        throw error;
      }

      toast.success("User deleted successfully");
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                No Users Found
              </CardTitle>
              <CardDescription>
                No users are currently registered in the system.
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <AddUserDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onUserAdded={() => onUsersChange?.()}
        />
      </Card>
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
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.first_name || user.last_name 
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                            : 'No name'
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {user.id.slice(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.primary_role && (
                          <Badge 
                            variant="outline" 
                            className={getRoleBadgeColor(user.primary_role)}
                          >
                            {user.primary_role}
                          </Badge>
                        )}
                        {user.roles && user.roles.length > 0 && user.roles.map((role, index) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            className="text-xs"
                          >
                            {role}
                          </Badge>
                        ))}
                        {(!user.roles || user.roles.length === 0) && !user.primary_role && (
                          <Badge variant="outline" className="text-xs">
                            No roles
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.business_name ? (
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{user.business_name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No business</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.onboarding_data ? (
                        <div className="text-sm space-y-1">
                          <div className="font-medium">{user.onboarding_data.purpose}</div>
                          {user.onboarding_data.role && (
                            <div className="text-muted-foreground">
                              Role: {user.onboarding_data.role}
                            </div>
                          )}
                          {user.onboarding_data.industry && (
                            <div className="text-muted-foreground">
                              Industry: {user.onboarding_data.industry}
                            </div>
                          )}
                          {user.onboarding_data.company_size && (
                            <div className="text-muted-foreground">
                              Company: {user.onboarding_data.company_size}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not completed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(user.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeletingUser(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
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
        title="Delete User"
        description={`Are you sure you want to delete ${deletingUser?.email}? This action cannot be undone and will remove all associated data.`}
        isLoading={isDeleting}
      />
    </>
  );
};
