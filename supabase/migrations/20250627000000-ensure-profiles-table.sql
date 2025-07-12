-- Ensure profiles table exists with business_name column
-- This migration creates the profiles table if it doesn't exist and adds the business_name column

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  first_name text,
  last_name text,
  business_name text,
  primary_role text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add business_name column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name text;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles if they don't exist
DO $$
BEGIN
    -- Users can view their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view their own profile" 
                 ON public.profiles 
                 FOR SELECT 
                 USING (auth.uid() = id)';
    END IF;

    -- Users can update their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can update their own profile" 
                 ON public.profiles 
                 FOR UPDATE 
                 USING (auth.uid() = id)';
    END IF;

    -- Users can insert their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can insert their own profile" 
                 ON public.profiles 
                 FOR INSERT 
                 WITH CHECK (auth.uid() = id)';
    END IF;

    -- Admins can view all profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can view all profiles'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all profiles" 
                 ON public.profiles 
                 FOR SELECT 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;

    -- Admins can update all profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can update all profiles'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can update all profiles" 
                 ON public.profiles 
                 FOR UPDATE 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;
END $$;

-- Drop existing function if it exists to avoid parameter conflicts
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text, text);

-- Create function to update user profile
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  target_user_id uuid,
  new_first_name text,
  new_last_name text,
  new_business_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can update user profiles';
  END IF;

  -- Update the profile
  INSERT INTO public.profiles (id, email, first_name, last_name, business_name)
  VALUES (target_user_id, (SELECT email FROM auth.users WHERE id = target_user_id), new_first_name, new_last_name, new_business_name)
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    business_name = EXCLUDED.business_name,
    updated_at = now();

  RETURN true;
END;
$$;

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_profiles_updated_at_trigger ON public.profiles;
CREATE TRIGGER update_profiles_updated_at_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_business_name ON public.profiles(business_name); 