-- Minimal fix: Only fix the core user-based policies
-- Run this in your Supabase SQL Editor

-- Drop only the problematic business-based policies
DROP POLICY IF EXISTS "Users can view customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can create customers for their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers from their businesses" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers from their businesses" ON public.customers;

-- Create only the basic user-based policies (don't touch admin policies)
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

-- Also fix contacts table
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

-- Also fix deals table
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