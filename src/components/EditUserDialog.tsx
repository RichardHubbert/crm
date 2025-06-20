
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    business_name?: string;
    primary_role?: string;
    roles?: string[];
  };
  onUserUpdated: () => void;
}

type UserRole = "admin" | "business" | "user";

interface FormData {
  first_name: string;
  last_name: string;
  business_name: string;
  role: UserRole;
}

const EditUserDialog = ({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      business_name: user.business_name || "",
      role: (user.primary_role as UserRole) || "user",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Update profile information
      const { error: profileError } = await supabase.rpc('admin_update_user_profile', {
        target_user_id: user.id,
        new_first_name: data.first_name || null,
        new_last_name: data.last_name || null,
        new_business_name: data.business_name || null,
      });

      if (profileError) {
        throw profileError;
      }

      // Update user role if it changed
      if (data.role !== user.primary_role) {
        const { error: roleError } = await supabase.rpc('admin_update_user_role', {
          target_user_id: user.id,
          new_role: data.role,
        });

        if (roleError) {
          throw roleError;
        }
      }

      toast.success("User updated successfully");
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and role for {user.email}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
