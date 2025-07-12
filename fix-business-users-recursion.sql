-- Fix infinite recursion in business_users table
-- Drop all existing policies first

-- Drop policies on business_users table
DROP POLICY IF EXISTS "Users can view their own business memberships" ON business_users;
DROP POLICY IF EXISTS "Admins can view all business memberships" ON business_users;
DROP POLICY IF EXISTS "Users can insert their own business memberships" ON business_users;
DROP POLICY IF EXISTS "Admins can insert business memberships" ON business_users;
DROP POLICY IF EXISTS "Users can update their own business memberships" ON business_users;
DROP POLICY IF EXISTS "Admins can update business memberships" ON business_users;
DROP POLICY IF EXISTS "Users can delete their own business memberships" ON business_users;
DROP POLICY IF EXISTS "Admins can delete business memberships" ON business_users;

-- Drop policies on businesses table
DROP POLICY IF EXISTS "Users can view businesses they belong to" ON businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON businesses;
DROP POLICY IF EXISTS "Users can insert businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can insert businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update businesses they belong to" ON businesses;
DROP POLICY IF EXISTS "Admins can update businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete businesses they belong to" ON businesses;
DROP POLICY IF EXISTS "Admins can delete businesses" ON businesses;

-- Drop policies on customers table
DROP POLICY IF EXISTS "Users can view customers from their businesses" ON customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON customers;
DROP POLICY IF EXISTS "Users can insert customers for their businesses" ON customers;
DROP POLICY IF EXISTS "Admins can insert customers" ON customers;
DROP POLICY IF EXISTS "Users can update customers from their businesses" ON customers;
DROP POLICY IF EXISTS "Admins can update customers" ON customers;
DROP POLICY IF EXISTS "Users can delete customers from their businesses" ON customers;
DROP POLICY IF EXISTS "Admins can delete customers" ON customers;

-- Drop policies on contacts table
DROP POLICY IF EXISTS "Users can view contacts from their businesses" ON contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Users can insert contacts for their businesses" ON contacts;
DROP POLICY IF EXISTS "Admins can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update contacts from their businesses" ON contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete contacts from their businesses" ON contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON contacts;

-- Drop policies on deals table
DROP POLICY IF EXISTS "Users can view deals from their businesses" ON deals;
DROP POLICY IF EXISTS "Admins can view all deals" ON deals;
DROP POLICY IF EXISTS "Users can insert deals for their businesses" ON deals;
DROP POLICY IF EXISTS "Admins can insert deals" ON deals;
DROP POLICY IF EXISTS "Users can update deals from their businesses" ON deals;
DROP POLICY IF EXISTS "Admins can update deals" ON deals;
DROP POLICY IF EXISTS "Users can delete deals from their businesses" ON deals;
DROP POLICY IF EXISTS "Admins can delete deals" ON deals;

-- Now create simple, non-recursive policies

-- Business Users table - simple policies
CREATE POLICY "Users can view their own business memberships" ON business_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all business memberships" ON business_users
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert their own business memberships" ON business_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can insert business memberships" ON business_users
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Users can update their own business memberships" ON business_users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update business memberships" ON business_users
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Users can delete their own business memberships" ON business_users
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete business memberships" ON business_users
    FOR DELETE USING (is_admin(auth.uid()));

-- Businesses table - simple policies
CREATE POLICY "Users can view businesses they belong to" ON businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = businesses.id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all businesses" ON businesses
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert businesses" ON businesses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can insert businesses" ON businesses
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Users can update businesses they belong to" ON businesses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = businesses.id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update businesses" ON businesses
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Users can delete businesses they belong to" ON businesses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = businesses.id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete businesses" ON businesses
    FOR DELETE USING (is_admin(auth.uid()));

-- Customers table - simple policies
CREATE POLICY "Users can view customers from their businesses" ON customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = customers.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all customers" ON customers
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert customers for their businesses" ON customers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = customers.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can insert customers" ON customers
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Users can update customers from their businesses" ON customers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = customers.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update customers" ON customers
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Users can delete customers from their businesses" ON customers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = customers.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete customers" ON customers
    FOR DELETE USING (is_admin(auth.uid()));

-- Contacts table - simple policies
CREATE POLICY "Users can view contacts from their businesses" ON contacts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = contacts.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all contacts" ON contacts
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert contacts for their businesses" ON contacts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = contacts.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can insert contacts" ON contacts
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Users can update contacts from their businesses" ON contacts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = contacts.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update contacts" ON contacts
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Users can delete contacts from their businesses" ON contacts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = contacts.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete contacts" ON contacts
    FOR DELETE USING (is_admin(auth.uid()));

-- Deals table - simple policies
CREATE POLICY "Users can view deals from their businesses" ON deals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = deals.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all deals" ON deals
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert deals for their businesses" ON deals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = deals.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can insert deals" ON deals
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Users can update deals from their businesses" ON deals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = deals.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update deals" ON deals
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Users can delete deals from their businesses" ON deals
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM business_users 
            WHERE business_users.business_id = deals.business_id 
            AND business_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete deals" ON deals
    FOR DELETE USING (is_admin(auth.uid()));

-- Test the is_admin function for your user
SELECT 
    auth.uid() as current_user_id,
    is_admin(auth.uid()) as is_admin_result;

-- Show current policies
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
WHERE tablename IN ('business_users', 'businesses', 'customers', 'contacts', 'deals')
ORDER BY tablename, policyname; 