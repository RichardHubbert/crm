
-- Create function to update user roles
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id uuid, 
  new_role app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can update user roles';
  END IF;

  -- Check if trying to remove own admin role
  IF target_user_id = auth.uid() AND new_role != 'admin' THEN
    RAISE EXCEPTION 'Cannot remove your own admin privileges';
  END IF;

  -- Remove existing roles for this user
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  
  -- Add new role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role);

  RETURN true;
END;
$$;

-- Create function to add a new user role
CREATE OR REPLACE FUNCTION public.admin_add_user_role(
  target_user_id uuid, 
  new_role app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can add user roles';
  END IF;

  -- Add new role (will be ignored if already exists due to unique constraint)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

-- Create function to remove a user role
CREATE OR REPLACE FUNCTION public.admin_remove_user_role(
  target_user_id uuid, 
  role_to_remove app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can remove user roles';
  END IF;

  -- Check if trying to remove own admin role
  IF target_user_id = auth.uid() AND role_to_remove = 'admin' THEN
    RAISE EXCEPTION 'Cannot remove your own admin privileges';
  END IF;

  -- Remove the specific role
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id AND role = role_to_remove;

  RETURN FOUND;
END;
$$;
