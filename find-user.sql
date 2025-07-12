-- Find information about user ID: 24e2799f-60d5-4e3b-bb30-b8049c9ae56d
-- Run this in your Supabase SQL Editor

-- 1. Check if user exists in auth.users table
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users 
WHERE id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- 2. Check profiles table
SELECT 
  id,
  email,
  first_name,
  last_name,
  business_name,
  created_at,
  updated_at
FROM public.profiles 
WHERE id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- 3. Check user_roles table
SELECT 
  user_id,
  role,
  created_at
FROM public.user_roles 
WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- 4. Check customers table (temporarily disable RLS for this query)
-- First, let's see if there are any customers at all
SELECT COUNT(*) as total_customers FROM public.customers;

-- Then check for this specific user's customers
SELECT 
  id,
  name,
  industry,
  status,
  revenue,
  user_id,
  created_at,
  source_database_id,
  source_customer_id,
  notes
FROM public.customers 
WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
ORDER BY created_at DESC;

-- 5. Check deals table
SELECT 
  id,
  title,
  customer_id,
  value,
  stage,
  probability,
  close_date,
  deal_type,
  user_id,
  created_at
FROM public.deals 
WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
ORDER BY created_at DESC;

-- 6. Check contacts table
SELECT 
  id,
  name,
  title,
  customer_id,
  email,
  phone,
  status,
  user_id,
  created_at
FROM public.contacts 
WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
ORDER BY created_at DESC;

-- 7. Check onboarding_data table
SELECT 
  id,
  user_id,
  purpose,
  role,
  team_size,
  company_size,
  industry,
  referral_sources,
  created_at
FROM public.onboarding_data 
WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- 8. Check business_users table
SELECT 
  bu.id,
  bu.business_id,
  bu.user_id,
  bu.role,
  bu.created_at,
  b.name as business_name,
  b.industry as business_industry
FROM public.business_users bu
LEFT JOIN public.businesses b ON bu.business_id = b.id
WHERE bu.user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- 9. Check if this user is an admin
SELECT public.is_admin('24e2799f-60d5-4e3b-bb30-b8049c9ae56d') as is_admin;

-- 10. Summary query - get all data in one place
WITH user_summary AS (
  SELECT 
    'auth.users' as table_name,
    id,
    email,
    created_at,
    NULL as additional_info
  FROM auth.users 
  WHERE id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
  
  UNION ALL
  
  SELECT 
    'profiles' as table_name,
    id,
    email,
    created_at,
    CONCAT(first_name, ' ', last_name, ' - ', business_name) as additional_info
  FROM public.profiles 
  WHERE id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
  
  UNION ALL
  
  SELECT 
    'user_roles' as table_name,
    user_id as id,
    role as email,
    created_at,
    NULL as additional_info
  FROM public.user_roles 
  WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
)
SELECT * FROM user_summary ORDER BY table_name; 