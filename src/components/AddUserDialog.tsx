
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AddUserForm from "./AddUserForm";
import { createUser } from "@/services/userService";
import { UserFormData } from "@/types/userForm";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const AddUserDialog = ({ open, onOpenChange, onUserAdded }: AddUserDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormData>({
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      business_name: "",
      role: "user",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await createUser(data);
      
      toast.success("User created successfully!");
      onUserAdded();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with the specified role and information.
          </DialogDescription>
        </DialogHeader>

        <AddUserForm form={form} onSubmit={onSubmit} isLoading={isLoading}>
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
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </AddUserForm>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
