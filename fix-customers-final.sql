-- Fix customers RLS policies - handles existing policies properly
-- Run this in your Supabase SQL Editor

-- First, let's see what policies currently exist
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

-- Drop all existing policies on customers table (using IF EXISTS to avoid errors)
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

-- Add admin policies (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'customers' 
        AND policyname = 'Admins can view all customers'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all customers" 
                 ON public.customers 
                 FOR SELECT 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'customers' 
        AND policyname = 'Admins can manage all customers'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can manage all customers" 
                 ON public.customers 
                 FOR ALL 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;
END $$;

-- Also fix contacts and deals tables
-- Contacts
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

-- Add admin policies for contacts (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Admins can view all contacts'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all contacts" 
                 ON public.contacts 
                 FOR SELECT 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Admins can manage all contacts'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can manage all contacts" 
                 ON public.contacts 
                 FOR ALL 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;
END $$;

-- Deals
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

-- Add admin policies for deals (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'deals' 
        AND policyname = 'Admins can view all deals'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all deals" 
                 ON public.deals 
                 FOR SELECT 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'deals' 
        AND policyname = 'Admins can manage all deals'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can manage all deals" 
                 ON public.deals 
                 FOR ALL 
                 TO authenticated 
                 USING (public.is_admin(auth.uid()))';
    END IF;
END $$;

-- Show the final policy configuration
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