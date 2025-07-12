-- Debug current RLS policies
-- Run this in your Supabase SQL Editor to see what's happening

-- Check current policies on all tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('customers', 'contacts', 'deals', 'business_users', 'businesses')
ORDER BY tablename, policyname;

-- Check if RLS is enabled on tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('customers', 'contacts', 'deals', 'business_users', 'businesses')
AND schemaname = 'public';

-- Test if we can query customers directly
SELECT COUNT(*) as total_customers FROM public.customers;

-- Check if there are any customers for the current user
SELECT COUNT(*) as user_customers 
FROM public.customers 
WHERE user_id = auth.uid();

-- Check if the is_admin function exists and works
SELECT public.is_admin(auth.uid()) as is_admin;

-- Check user roles
SELECT 
  user_id,
  role,
  created_at
FROM public.user_roles 
WHERE user_id = auth.uid(); 