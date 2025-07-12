
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
    console.log('Form submitted with data:', { ...data, password: '[REDACTED]' });
    setIsLoading(true);
    
    try {
      console.log('Calling createUser service...');
      const result = await createUser(data);
      console.log('CreateUser service returned:', result);
      
      toast.success("User created successfully!");
      onUserAdded();
      onOpenChange(false);
      form.reset();
      
    } catch (error) {
      console.error('Error in form submission:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while creating the user";
      
      console.error('Showing error toast:', errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with the specified role and information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <AddUserForm form={form} onSubmit={onSubmit} isLoading={isLoading}>
            <div className="h-4"></div> {/* Spacer */}
          </AddUserForm>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
