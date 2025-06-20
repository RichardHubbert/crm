
export type UserRole = "admin" | "business" | "user";

export interface UserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  business_name: string;
  role: UserRole;
}
