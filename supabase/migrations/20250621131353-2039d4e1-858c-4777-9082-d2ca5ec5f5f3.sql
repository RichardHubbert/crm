
-- Ensure RLS policies exist for admin access to all tables
-- First, let's make sure profiles table has admin access policy
DO $$
BEGIN
    -- Create RLS policy for profiles table if it doesn't exist
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

    -- Ensure user_roles has admin access policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' 
        AND policyname = 'Admins can view all user roles'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all user roles" 
                 ON public.user_roles 
                 FOR SELECT 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;

    -- Ensure onboarding_data has admin access policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'onboarding_data' 
        AND policyname = 'Admins can view all onboarding data'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all onboarding data" 
                 ON public.onboarding_data 
                 FOR SELECT 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;
END $$;

-- Enable RLS on all these tables if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
