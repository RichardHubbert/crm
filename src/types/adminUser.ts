
export interface AdminUser {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  business_name?: string | null;
  created_at: string;
  primary_role?: string | null;
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
