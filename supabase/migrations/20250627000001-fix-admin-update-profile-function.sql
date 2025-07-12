-- Fix the admin_update_user_profile function
-- This migration recreates the function with better error handling

-- Drop existing function to avoid conflicts
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text, text);

-- Create improved function to update user profile
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  target_user_id uuid,
  new_first_name text DEFAULT NULL,
  new_last_name text DEFAULT NULL,
  new_business_name text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can update user profiles';
  END IF;

  -- Validate target_user_id exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Target user does not exist';
  END IF;

  -- Update the profile using upsert
  INSERT INTO public.profiles (id, email, first_name, last_name, business_name)
  VALUES (
    target_user_id, 
    (SELECT email FROM auth.users WHERE id = target_user_id), 
    new_first_name, 
    new_last_name, 
    new_business_name
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    business_name = COALESCE(EXCLUDED.business_name, profiles.business_name);

  -- Return success response
  result := json_build_object(
    'success', true,
    'message', 'Profile updated successfully',
    'user_id', target_user_id
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- Return error response
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'user_id', target_user_id
    );
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_update_user_profile(uuid, text, text, text) TO authenticated;

-- Test the function (optional - remove after testing)
-- SELECT public.admin_update_user_profile('your-user-id-here', 'John', 'Doe', 'Test Business'); 