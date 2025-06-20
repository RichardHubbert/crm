
export interface AdminUser {
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
