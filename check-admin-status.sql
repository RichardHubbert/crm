-- Check admin status and policies
-- Replace '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' with your actual user ID

-- Check if you're an admin
SELECT 
    '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' as user_id,
    is_admin('24e2799f-60d5-4e3b-bb30-b8049c9ae56d') as is_admin_result;

-- Check your user_roles
SELECT 
    user_id,
    role,
    created_at
FROM user_roles 
WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- Check all customers (should work for admin)
SELECT 
    id,
    name,
    email,
    business_id,
    created_at
FROM customers 
ORDER BY created_at DESC 
LIMIT 10;

-- Check all businesses (should work for admin)
SELECT 
    id,
    name,
    created_at
FROM businesses 
ORDER BY created_at DESC 
LIMIT 10;

-- Check current policies on customers table
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'customers'
ORDER BY policyname;

-- Check if RLS is enabled on customers table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'customers'; 