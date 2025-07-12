-- Quick check of customer records and ownership
-- Run this in your Supabase SQL Editor

-- 1. Count total customers
SELECT COUNT(*) as total_customers FROM public.customers;

-- 2. Show all customers with their owners (first 10)
SELECT 
  id,
  name,
  user_id,
  created_at,
  source_database_id,
  source_customer_id
FROM public.customers 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Count customers by user_id
SELECT 
  user_id,
  COUNT(*) as customer_count
FROM public.customers 
GROUP BY user_id 
ORDER BY customer_count DESC;

-- 4. Check if there are any customers without user_id
SELECT COUNT(*) as customers_without_user_id
FROM public.customers 
WHERE user_id IS NULL;

-- 5. Check if there are imported customers
SELECT 
  COUNT(*) as imported_customers,
  COUNT(CASE WHEN source_database_id IS NOT NULL THEN 1 END) as with_source_db,
  COUNT(CASE WHEN source_customer_id IS NOT NULL THEN 1 END) as with_source_id
FROM public.customers;

-- 6. Show your current user ID (replace 'your-email@example.com' with your actual email)
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 7. Check if you have any customers
-- Replace 'your-user-id' with your actual user ID from step 6
-- SELECT COUNT(*) as your_customers FROM public.customers WHERE user_id = 'your-user-id'; 