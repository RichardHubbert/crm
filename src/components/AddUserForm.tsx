
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserFormData } from "@/types/userForm";
import { Shield, User, Building, Check, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AddUserFormProps {
  form: UseFormReturn<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading: boolean;
  children: React.ReactNode;
}

type UserRole = "admin" | "business" | "user";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "user",
    label: "Standard User",
    description: "Basic access to view and interact with assigned deals",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    value: "business",
    label: "Business User",
    description: "Access to business features, analytics, and team management",
    icon: Building,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Full access to all features, settings, and user management",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

const AddUserForm = ({ form, onSubmit, isLoading, children }: AddUserFormProps) => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password)) strength += 25; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special characters
    
    setPasswordStrength(strength);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter email address" 
                  {...field} 
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temporary Password *</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter temporary password" 
                  {...field}
                  required 
                  onChange={(e) => {
                    field.onChange(e);
                    checkPasswordStrength(e.target.value);
                  }}
                />
              </FormControl>
              
              {field.value && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      Password strength: 
                      {passwordStrength < 50 ? (
                        <span className="text-red-500 ml-1">Weak</span>
                      ) : passwordStrength < 75 ? (
                        <span className="text-amber-500 ml-1">Moderate</span>
                      ) : (
                        <span className="text-green-500 ml-1">Strong</span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {passwordStrength}%
                    </span>
                  </div>
                  
                  <div className="relative w-full">
                    <div className={cn(
                      "h-1 w-full rounded-full overflow-hidden",
                      passwordStrength < 50 ? "bg-red-100" : 
                      passwordStrength < 75 ? "bg-amber-100" : "bg-green-100"
                    )}>
                      <div 
                        className={cn(
                          "h-full transition-all",
                          passwordStrength < 50 ? "bg-red-500" : 
                          passwordStrength < 75 ? "bg-amber-500" : "bg-green-500"
                        )}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {/[A-Z]/.test(field.value) ? 
                        <Check className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[0-9]/.test(field.value) ? 
                        <Check className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      <span>Number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[^A-Za-z0-9]/.test(field.value) ? 
                        <Check className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      <span>Special character</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {field.value.length >= 8 ? 
                        <Check className="h-3 w-3 text-green-500" /> : 
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                      <span>At least 8 characters</span>
                    </div>
                  </div>
                </div>
              )}
              
              <FormDescription className="flex items-start gap-2 mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <span className="text-xs text-blue-700">
                  Users will be prompted to change this temporary password on first login
                </span>
              </FormDescription>
              
              <FormMessage />
            </FormItem>
          )}
        />

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
            <FormItem className="space-y-3">
              <FormLabel>User Role *</FormLabel>
              <FormDescription>
                Select the appropriate role for this user to control their access level
              </FormDescription>
              
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  {roleOptions.map((role) => (
                    <div key={role.value}>
                      <label
                        htmlFor={`role-${role.value}`}
                        className={cn(
                          "flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer",
                          "hover:border-primary",
                          field.value === role.value ? role.borderColor : "border-muted",
                          field.value === role.value ? role.bgColor : "bg-popover"
                        )}
                      >
                        <RadioGroupItem
                          value={role.value}
                          id={`role-${role.value}`}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <role.icon className={cn("mr-2 h-5 w-5", role.color)} />
                            <span className="font-medium">{role.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
};

export default AddUserForm;
