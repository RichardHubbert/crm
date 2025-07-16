-- Fix customer business association
-- Run this in the target database (nnxdtpnrwgcknhpyhowr)

-- 1. First, let's see what customers exist without business_id
SELECT 
  id, 
  name, 
  business_id, 
  user_id, 
  created_at,
  source_customer_id,
  source_database_id
FROM customers 
WHERE business_id IS NULL
ORDER BY created_at DESC;

-- 2. Get your user's business association
-- Replace 'YOUR_USER_ID' with your actual user ID
SELECT 
  bu.user_id,
  bu.business_id,
  bu.role,
  b.name as business_name
FROM business_users bu
JOIN businesses b ON bu.business_id = b.id
WHERE bu.user_id = 'YOUR_USER_ID'; -- Replace with your user ID

-- 3. Update the customer to associate it with your business
-- Replace 'YOUR_USER_ID' and 'YOUR_BUSINESS_ID' with actual values
UPDATE customers 
SET business_id = 'YOUR_BUSINESS_ID' -- Replace with your business ID
WHERE user_id = 'YOUR_USER_ID' -- Replace with your user ID
  AND business_id IS NULL;

-- 4. Verify the fix
SELECT 
  id, 
  name, 
  business_id, 
  user_id, 
  created_at
FROM customers 
WHERE user_id = 'YOUR_USER_ID' -- Replace with your user ID
ORDER BY created_at DESC; 