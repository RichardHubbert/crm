-- Fix RLS policies including admin access
-- Run this in your Supabase SQL Editor

-- Drop ALL existing policies on these tables
DROP POLICY IF EXISTS "Users can view customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can create customers for their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can create their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can manage all customers" ON public.customers;

DROP POLICY IF EXISTS "Users can view contacts from their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can create contacts for their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can update contacts from their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete contacts from their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can view their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can create their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can manage all contacts" ON public.contacts;

DROP POLICY IF EXISTS "Users can view deals from their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can create deals for their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals from their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can delete deals from their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can view their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can create their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can update their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can delete their own deals" ON public.deals;
DROP POLICY IF EXISTS "Admins can view all deals" ON public.deals;
DROP POLICY IF EXISTS "Admins can manage all deals" ON public.deals;

-- Create user-based policies for customers
CREATE POLICY "Users can view their own customers" 
  ON public.customers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" 
  ON public.customers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" 
  ON public.customers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create admin policies for customers
CREATE POLICY "Admins can view all customers" 
  ON public.customers 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all customers" 
  ON public.customers 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

-- Create user-based policies for contacts
CREATE POLICY "Users can view their own contacts" 
  ON public.contacts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" 
  ON public.contacts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" 
  ON public.contacts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create admin policies for contacts
CREATE POLICY "Admins can view all contacts" 
  ON public.contacts 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all contacts" 
  ON public.contacts 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

-- Create user-based policies for deals
CREATE POLICY "Users can view their own deals" 
  ON public.deals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deals" 
  ON public.deals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals" 
  ON public.deals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals" 
  ON public.deals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create admin policies for deals
CREATE POLICY "Admins can view all deals" 
  ON public.deals 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all deals" 
  ON public.deals 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

-- Test the is_admin function for your user
SELECT public.is_admin('cc15dc34-b530-46ce-9073-25590494faaa') as is_admin_for_your_user;

-- Show the final configuration
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('customers', 'contacts', 'deals')
ORDER BY tablename, policyname; 