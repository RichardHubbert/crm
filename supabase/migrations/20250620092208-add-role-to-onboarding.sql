
-- Add role column to onboarding_data table
ALTER TABLE public.onboarding_data 
ADD COLUMN role text;

-- Update the existing data to have a default role if needed
UPDATE public.onboarding_data 
SET role = 'team_member' 
WHERE role IS NULL;
