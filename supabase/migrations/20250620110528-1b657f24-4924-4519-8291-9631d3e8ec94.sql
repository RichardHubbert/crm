
-- Check if the user_roles table has RLS policies for admins
DO $$
BEGIN
    -- Create RLS policy for user_roles table if it doesn't exist
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

    -- Create RLS policy for onboarding_data table if it doesn't exist
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

-- Enable RLS on user_roles and onboarding_data tables if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
