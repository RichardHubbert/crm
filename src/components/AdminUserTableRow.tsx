
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building, Calendar, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { AdminUser } from "@/types/adminUser";
import { formatDate, getRoleBadgeColor } from "@/utils/adminUsersUtils";

interface AdminUserTableRowProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export const AdminUserTableRow = ({ user, onEdit, onDelete }: AdminUserTableRowProps) => {
  return (
    <TableRow>
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
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(user)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
