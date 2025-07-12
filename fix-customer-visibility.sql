-- Fix Customer Visibility Issues
-- Run this in your Supabase SQL Editor to diagnose and fix customer visibility problems

-- 1. First, let's see what customers exist and who owns them
SELECT 
  id,
  name,
  user_id,
  created_at,
  source_database_id,
  source_customer_id
FROM public.customers 
ORDER BY created_at DESC;

-- 2. Check if there are any customers without a user_id (shouldn't happen but let's verify)
SELECT COUNT(*) as customers_without_user_id
FROM public.customers 
WHERE user_id IS NULL;

-- 3. Check if there are customers owned by users that don't exist in auth.users
SELECT 
  c.id,
  c.name,
  c.user_id,
  c.created_at
FROM public.customers c
LEFT JOIN auth.users u ON c.user_id = u.id
WHERE u.id IS NULL;

-- 4. If you want to transfer ownership of all customers to a specific user (replace with your user ID)
-- WARNING: This will make all customers visible to the specified user
-- UPDATE public.customers 
-- SET user_id = 'your-user-id-here' 
-- WHERE user_id != 'your-user-id-here';

-- 5. Check RLS policies on the customers table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'customers';

-- 6. Check if the is_admin function exists and works
SELECT public.is_admin('your-user-id-here');

-- 7. Check your user roles
SELECT 
  user_id,
  role,
  created_at
FROM public.user_roles 
WHERE user_id = 'your-user-id-here';

-- 8. If you're an admin and want to see all customers regardless of ownership, 
-- you can temporarily disable RLS (NOT RECOMMENDED FOR PRODUCTION)
-- ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;

-- 9. To re-enable RLS after debugging
-- ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 10. Check if there are any customers created by the import function
SELECT 
  id,
  name,
  user_id,
  source_database_id,
  source_customer_id,
  created_at
FROM public.customers 
WHERE source_database_id IS NOT NULL 
   OR source_customer_id IS NOT NULL
ORDER BY created_at DESC; 