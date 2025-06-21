
-- Create an admin function to fetch all users from auth.users
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can access all user data';
  END IF;

  -- Return all users from auth.users
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.email_confirmed_at,
    au.last_sign_in_at
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$;
