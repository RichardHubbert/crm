-- Migration script to associate existing customers with businesses
-- Run this in your Supabase SQL Editor after applying the migration

-- First, let's see what we're working with
SELECT 
  'Current state' as info,
  COUNT(*) as total_customers,
  COUNT(CASE WHEN business_id IS NOT NULL THEN 1 END) as customers_with_business,
  COUNT(CASE WHEN business_id IS NULL THEN 1 END) as customers_without_business
FROM public.customers;

-- Check existing businesses
SELECT 
  'Businesses' as info,
  COUNT(*) as total_businesses
FROM public.businesses;

-- Check business_users relationships
SELECT 
  'Business Users' as info,
  COUNT(*) as total_relationships
FROM public.business_users;

-- Run the migration function
SELECT public.migrate_customers_to_businesses();

-- Check the results after migration
SELECT 
  'After migration' as info,
  COUNT(*) as total_customers,
  COUNT(CASE WHEN business_id IS NOT NULL THEN 1 END) as customers_with_business,
  COUNT(CASE WHEN business_id IS NULL THEN 1 END) as customers_without_business
FROM public.customers;

-- Show some example migrated customers
SELECT 
  c.id,
  c.name as customer_name,
  c.business_id,
  b.name as business_name,
  p.business_name as user_business_name
FROM public.customers c
LEFT JOIN public.businesses b ON c.business_id = b.id
LEFT JOIN public.profiles p ON c.user_id = p.id
ORDER BY c.created_at DESC
LIMIT 10;

-- Check if any customers still don't have a business (should be 0)
SELECT 
  c.id,
  c.name,
  c.user_id,
  p.business_name,
  c.created_at
FROM public.customers c
LEFT JOIN public.profiles p ON c.user_id = p.id
WHERE c.business_id IS NULL; 