
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Building, Calendar } from "lucide-react";
import { format } from "date-fns";

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
}

export const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
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

  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            No Users Found
          </CardTitle>
          <CardDescription>
            No users are currently registered in the system.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          View and manage all users in the system ({users.length} total)
        </CardDescription>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
