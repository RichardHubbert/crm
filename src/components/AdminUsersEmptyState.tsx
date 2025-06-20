
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, User } from "lucide-react";

interface AdminUsersEmptyStateProps {
  onAddUser: () => void;
}

export const AdminUsersEmptyState = ({ onAddUser }: AdminUsersEmptyStateProps) => {
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
          <Button onClick={onAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
