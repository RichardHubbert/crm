import { AdminUsersTable } from "@/components/AdminUsersTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuthContext } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Loader2, User, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddUserDialog from "@/components/AddUserDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AdminUsers = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { users, loading: usersLoading, error } = useAdminUsers();
  const { user } = useAuthContext();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking permissions...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Alert className="max-w-md mx-auto border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Access denied. You need administrator privileges to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleUsersChange = () => {
    // Force refresh by reloading the page - simple solution
    window.location.reload();
  };

  const initials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : "AD";

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Admin Header Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                  Manage and view all users in the system
                </p>
              </div>
            </div>
            
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-purple-300">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-purple-200 text-purple-600 text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xs text-purple-600 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {usersLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Loading Users...</CardTitle>
            <CardDescription>
              Fetching user data from the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading users...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AdminUsersTable users={users} onUsersChange={handleUsersChange} currentUser={user} />
      )}

      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onUserAdded={handleUsersChange}
      />
    </div>
  );
};

export default AdminUsers;
