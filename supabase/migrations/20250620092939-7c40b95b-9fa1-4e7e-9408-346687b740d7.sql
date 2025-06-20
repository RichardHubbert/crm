
-- Add team_size and company_size columns to the onboarding_data table
ALTER TABLE public.onboarding_data 
ADD COLUMN team_size TEXT,
ADD COLUMN company_size TEXT;
