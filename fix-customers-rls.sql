-- Fix customers RLS policies to work with both user-based and business-based access
-- Run this in your Supabase SQL Editor

-- First, let's see what policies currently exist
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

-- Drop the problematic business-based policies
DROP POLICY IF EXISTS "Users can view customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can create customers for their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers from their businesses" ON public.customers;

-- Create hybrid policies that work with both user_id and business_id
CREATE POLICY "Users can view their own customers" 
  ON public.customers 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own customers" 
  ON public.customers 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own customers" 
  ON public.customers 
  FOR DELETE 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

-- Add admin policies for customers
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

-- Also fix the contacts and deals tables to use the same hybrid approach
-- Contacts table
DROP POLICY IF EXISTS "Users can view contacts from their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can create contacts for their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can update contacts from their businesses" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete contacts from their businesses" ON public.contacts;

CREATE POLICY "Users can view their own contacts" 
  ON public.contacts 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own contacts" 
  ON public.contacts 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own contacts" 
  ON public.contacts 
  FOR DELETE 
  USING (user_id = auth.uid());

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

-- Deals table
DROP POLICY IF EXISTS "Users can view deals from their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can create deals for their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals from their businesses" ON public.deals;
DROP POLICY IF EXISTS "Users can delete deals from their businesses" ON public.deals;

CREATE POLICY "Users can view their own deals" 
  ON public.deals 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create deals" 
  ON public.deals 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own deals" 
  ON public.deals 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own deals" 
  ON public.deals 
  FOR DELETE 
  USING (user_id = auth.uid());

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

-- Verify the policies are created correctly
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