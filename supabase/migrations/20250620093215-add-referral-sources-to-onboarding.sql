
-- Add referral_sources column to onboarding_data table
ALTER TABLE public.onboarding_data 
ADD COLUMN IF NOT EXISTS referral_sources TEXT[];
