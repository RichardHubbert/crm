-- Ensure the admin-create-user function creates profile records
-- This migration adds explicit profile creation to the edge function

-- The edge function has been updated to explicitly create profile records
-- This migration ensures the database is ready for this change

-- Make sure the profiles table has the correct structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS business_name text;

-- Ensure RLS policies allow the service role to insert profiles
-- This is needed for the edge function to create profiles
CREATE POLICY IF NOT EXISTS "Service role can insert profiles" 
  ON public.profiles 
  FOR INSERT 
  TO service_role 
  WITH CHECK (true);

-- Ensure RLS policies allow the service role to update profiles
CREATE POLICY IF NOT EXISTS "Service role can update profiles" 
  ON public.profiles 
  FOR UPDATE 
  TO service_role 
  USING (true);

-- Grant necessary permissions to the service role
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.user_roles TO service_role; 