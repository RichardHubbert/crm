
-- Add missing columns to the onboarding_data table
ALTER TABLE public.onboarding_data 
ADD COLUMN IF NOT EXISTS role text,
ADD COLUMN IF NOT EXISTS referral_sources text[];

-- Update the updated_at column when the row is modified
CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_onboarding_updated_at_trigger ON public.onboarding_data;
CREATE TRIGGER update_onboarding_updated_at_trigger
    BEFORE UPDATE ON public.onboarding_data
    FOR EACH ROW
    EXECUTE FUNCTION update_onboarding_updated_at();
