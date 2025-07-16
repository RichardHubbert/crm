-- Debug script to check customer creation and visibility
-- Run this in Supabase SQL Editor

-- 1. Check all customers in the database
SELECT 
  id, 
  name, 
  business_id, 
  user_id, 
  created_at,
  status
FROM customers 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Check all businesses
SELECT 
  id, 
  name, 
  created_by,
  created_at
FROM businesses 
ORDER BY created_at DESC;

-- 3. Check business_user associations
SELECT 
  bu.user_id,
  bu.business_id,
  bu.role,
  b.name as business_name,
  p.email as user_email
FROM business_users bu
JOIN businesses b ON bu.business_id = b.id
LEFT JOIN auth.users p ON bu.user_id = p.id
ORDER BY bu.created_at DESC;

-- 4. Check RLS policies on customers table
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

-- 5. Test customer visibility for current user (replace with your user ID)
-- Replace 'your-user-id-here' with your actual user ID
SELECT 
  c.id,
  c.name,
  c.business_id,
  c.user_id,
  b.name as business_name
FROM customers c
LEFT JOIN businesses b ON c.business_id = b.id
WHERE c.user_id = 'your-user-id-here'  -- Replace with your user ID
   OR c.business_id IN (
     SELECT business_id 
     FROM business_users 
     WHERE user_id = 'your-user-id-here'  -- Replace with your user ID
   )
ORDER BY c.created_at DESC; 