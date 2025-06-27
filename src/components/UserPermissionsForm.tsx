import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShieldCheck, 
  Users, 
  Building, 
  Settings, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Handshake,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "deals" | "users" | "analytics" | "settings" | "communications";
  icon: React.ElementType;
}

interface UserPermissionsFormProps {
  userId: string;
  userRole: string;
  initialPermissions: string[];
  onPermissionsUpdated: () => void;
}

const permissions: Permission[] = [
  // Deals permissions
  {
    id: "deals.view",
    name: "View Deals",
    description: "Can view deal information",
    category: "deals",
    icon: Handshake
  },
  {
    id: "deals.create",
    name: "Create Deals",
    description: "Can create new deals",
    category: "deals",
    icon: Handshake
  },
  {
    id: "deals.edit",
    name: "Edit Deals",
    description: "Can modify existing deals",
    category: "deals",
    icon: Handshake
  },
  {
    id: "deals.delete",
    name: "Delete Deals",
    description: "Can remove deals from the system",
    category: "deals",
    icon: Handshake
  },
  
  // User management permissions
  {
    id: "users.view",
    name: "View Users",
    description: "Can view user information",
    category: "users",
    icon: Users
  },
  {
    id: "users.create",
    name: "Create Users",
    description: "Can add new users to the system",
    category: "users",
    icon: Users
  },
  {
    id: "users.edit",
    name: "Edit Users",
    description: "Can modify user information",
    category: "users",
    icon: Users
  },
  {
    id: "users.delete",
    name: "Delete Users",
    description: "Can remove users from the system",
    category: "users",
    icon: Users
  },
  
  // Analytics permissions
  {
    id: "analytics.view",
    name: "View Analytics",
    description: "Can access analytics dashboards",
    category: "analytics",
    icon: BarChart3
  },
  {
    id: "analytics.export",
    name: "Export Analytics",
    description: "Can export analytics data",
    category: "analytics",
    icon: BarChart3
  },
  
  // Settings permissions
  {
    id: "settings.view",
    name: "View Settings",
    description: "Can view system settings",
    category: "settings",
    icon: Settings
  },
  {
    id: "settings.edit",
    name: "Edit Settings",
    description: "Can modify system settings",
    category: "settings",
    icon: Settings
  },
  
  // Communications permissions
  {
    id: "communications.view",
    name: "View Communications",
    description: "Can view messages and notifications",
    category: "communications",
    icon: MessageSquare
  },
  {
    id: "communications.send",
    name: "Send Communications",
    description: "Can send messages and notifications",
    category: "communications",
    icon: MessageSquare
  }
];

// Group permissions by category
const permissionsByCategory = permissions.reduce((acc, permission) => {
  if (!acc[permission.category]) {
    acc[permission.category] = [];
  }
  acc[permission.category].push(permission);
  return acc;
}, {} as Record<string, Permission[]>);

// Category metadata
const categories = {
  deals: {
    name: "Deal Management",
    icon: Handshake,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  users: {
    name: "User Management",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  analytics: {
    name: "Analytics & Reporting",
    icon: BarChart3,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  settings: {
    name: "System Settings",
    icon: Settings,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200"
  },
  communications: {
    name: "Communications",
    icon: MessageSquare,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  }
};

export const UserPermissionsForm = ({ 
  userId, 
  userRole, 
  initialPermissions = [],
  onPermissionsUpdated 
}: UserPermissionsFormProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle permission toggle
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(current => {
      if (current.includes(permissionId)) {
        return current.filter(id => id !== permissionId);
      } else {
        return [...current, permissionId];
      }
    });
  };
  
  // Handle category toggle (select/deselect all permissions in a category)
  const toggleCategory = (category: string) => {
    const categoryPermissionIds = permissionsByCategory[category].map(p => p.id);
    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Remove all permissions in this category
      setSelectedPermissions(current => 
        current.filter(id => !categoryPermissionIds.includes(id))
      );
    } else {
      // Add all permissions in this category
      const newPermissions = [...selectedPermissions];
      categoryPermissionIds.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      setSelectedPermissions(newPermissions);
    }
  };
  
  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (category: string) => {
    return permissionsByCategory[category].every(
      permission => selectedPermissions.includes(permission.id)
    );
  };
  
  // Check if some (but not all) permissions in a category are selected
  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions = permissionsByCategory[category];
    const selectedCount = categoryPermissions.filter(
      permission => selectedPermissions.includes(permission.id)
    ).length;
    
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };
  
  // Apply role template
  const applyRoleTemplate = (role: string) => {
    let templatePermissions: string[] = [];
    
    switch (role) {
      case "admin":
        // Admins get all permissions
        templatePermissions = permissions.map(p => p.id);
        break;
        
      case "business":
        // Business users get deal management, analytics, and limited user management
        templatePermissions = [
          "deals.view", "deals.create", "deals.edit", "deals.delete",
          "users.view",
          "analytics.view", "analytics.export",
          "communications.view", "communications.send"
        ];
        break;
        
      case "user":
        // Standard users get basic permissions
        templatePermissions = [
          "deals.view", "deals.create", "deals.edit",
          "analytics.view",
          "communications.view", "communications.send"
        ];
        break;
        
      default:
        // Fallback to minimal permissions
        templatePermissions = ["deals.view", "communications.view"];
    }
    
    setSelectedPermissions(templatePermissions);
  };
  
  // Save permissions to the database
  const savePermissions = async () => {
    setIsUpdating(true);
    
    try {
      // Get the current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Failed to get authentication session');
      }

      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }
      
      // Call the RPC function to update user permissions
      const { data, error } = await supabase.rpc('admin_update_user_permissions', {
        target_user_id: userId,
        permissions: selectedPermissions
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("User permissions updated successfully");
      onPermissionsUpdated();
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Fine-tune user access by selecting specific permissions. Role-based templates are available as starting points.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => applyRoleTemplate("admin")}
          className={cn(
            "border-purple-200",
            userRole === "admin" && "bg-purple-50"
          )}
        >
          <ShieldCheck className="mr-1 h-4 w-4 text-purple-600" />
          Admin Template
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => applyRoleTemplate("business")}
          className={cn(
            "border-green-200",
            userRole === "business" && "bg-green-50"
          )}
        >
          <Building className="mr-1 h-4 w-4 text-green-600" />
          Business Template
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => applyRoleTemplate("user")}
          className={cn(
            "border-blue-200",
            userRole === "user" && "bg-blue-50"
          )}
        >
          <Users className="mr-1 h-4 w-4 text-blue-600" />
          User Template
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => {
          const categoryInfo = categories[category as keyof typeof categories];
          const CategoryIcon = categoryInfo.icon;
          
          return (
            <Card 
              key={category}
              className={cn(
                "border",
                categoryInfo.borderColor,
                isCategoryFullySelected(category) && categoryInfo.bgColor
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className={cn("h-5 w-5", categoryInfo.color)} />
                    <CardTitle className="text-lg">{categoryInfo.name}</CardTitle>
                  </div>
                  
                  <Checkbox 
                    id={`category-${category}`}
                    checked={isCategoryFullySelected(category)}
                    indeterminate={isCategoryPartiallySelected(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="h-5 w-5"
                  />
                </div>
                <CardDescription>
                  Manage {categoryInfo.name.toLowerCase()} permissions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-0">
                {categoryPermissions.map(permission => (
                  <div 
                    key={permission.id}
                    className="flex items-center justify-between space-x-2 rounded-md border p-3 hover:bg-muted/50"
                  >
                    <div className="space-y-0.5">
                      <Label 
                        htmlFor={permission.id}
                        className="font-medium cursor-pointer"
                      >
                        {permission.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                    <Checkbox 
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={savePermissions} 
          disabled={isUpdating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isUpdating ? "Saving..." : "Save Permissions"}
        </Button>
      </div>
    </div>
  );
};

export default UserPermissionsForm;
