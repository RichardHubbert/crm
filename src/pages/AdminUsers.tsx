
import { AdminUsersTable } from "@/components/AdminUsersTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";

const AdminUsers = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { users, loading: usersLoading, error } = useAdminUsers();

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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage and view all users in the system
          </p>
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
        <AdminUsersTable users={users} />
      )}
    </div>
  );
};

export default AdminUsers;
