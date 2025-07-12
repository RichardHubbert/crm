-- Simple fix: Revert to original user-based RLS policies
-- Run this in your Supabase SQL Editor

-- Drop all existing policies on customers table
DROP POLICY IF EXISTS "Users can view customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can create customers for their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can create their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;

-- Create simple user-based policies (original working version)
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

-- Add admin policies
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

-- Also fix contacts and deals tables
-- Contacts
DROP POLICY IF EXISTS "Users can view contacts from their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can create contacts for their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can update contacts from their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete contacts from their businesses" ON public.contacts;

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

-- Add admin policies for contacts
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

-- Deals
DROP POLICY IF EXISTS "Users can view deals from their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can create deals for their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals from their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can delete deals from their businesses" ON public.deals;

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

-- Add admin policies for deals
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

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('customers', 'contacts', 'deals')
ORDER BY tablename, policyname; 