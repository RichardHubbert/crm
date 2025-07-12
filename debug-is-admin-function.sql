-- Debug the is_admin function
-- Replace '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' with your actual user ID

-- Check the is_admin function definition
SELECT 
    proname,
    prosrc
FROM pg_proc 
WHERE proname = 'is_admin';

-- Test the function step by step
SELECT 
    '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' as user_id,
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' 
        AND role = 'admin'
    ) as has_admin_role,
    is_admin('24e2799f-60d5-4e3b-bb30-b8049c9ae56d') as function_result;

-- Check all user_roles for this user
SELECT 
    user_id,
    role,
    created_at
FROM user_roles 
WHERE user_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- Check if there are any user_roles at all
SELECT 
    COUNT(*) as total_user_roles,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users
FROM user_roles;

-- Show all admin users
SELECT 
    user_id,
    role,
    created_at
FROM user_roles 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Test direct query without RLS (as superuser)
-- This should show all customers if you're truly an admin
SELECT 
    COUNT(*) as total_customers
FROM customers;

-- Check if there are any customers at all
SELECT 
    COUNT(*) as customer_count
FROM customers; 