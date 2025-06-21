
-- Update the admin delete function to accept both target_user_id and admin_user_id parameters
CREATE OR REPLACE FUNCTION public.admin_delete_user_complete(
  target_user_id uuid,
  admin_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the admin_user_id is actually an admin
  IF NOT public.is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  -- Check if trying to delete own account
  IF target_user_id = admin_user_id THEN
    RAISE EXCEPTION 'Cannot delete your own admin account';
  END IF;

  -- Delete from public schema tables first (due to foreign key constraints)
  DELETE FROM public.onboarding_data WHERE user_id = target_user_id;
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  DELETE FROM public.user_product_assignments WHERE user_id = target_user_id;
  DELETE FROM public.user_subscriptions WHERE user_id = target_user_id;
  DELETE FROM public.contacts WHERE user_id = target_user_id;
  DELETE FROM public.customers WHERE user_id = target_user_id;
  DELETE FROM public.deals WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- Note: We cannot delete from auth.users directly in a SQL function
  -- This will need to be handled by an Edge Function with admin privileges
  
  RETURN true;
END;
$$;
