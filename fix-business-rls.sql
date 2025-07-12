-- Fix infinite recursion in business_users RLS policies
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
WHERE tablename = 'business_users';

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view business memberships" ON public.business_users;
DROP POLICY IF EXISTS "Business owners and admins can manage members" ON public.business_users;

-- Create simpler, non-recursive policies
CREATE POLICY "Users can view their own business memberships" 
  ON public.business_users 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can view memberships for businesses they belong to" 
  ON public.business_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu2
      WHERE bu2.business_id = business_users.business_id 
      AND bu2.user_id = auth.uid()
      AND bu2.id != business_users.id  -- Avoid self-reference
    )
  );

CREATE POLICY "Users can create their own business memberships" 
  ON public.business_users 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Business owners and admins can manage members" 
  ON public.business_users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu2
      WHERE bu2.business_id = business_users.business_id 
      AND bu2.user_id = auth.uid()
      AND bu2.role IN ('owner', 'admin')
      AND bu2.id != business_users.id  -- Avoid self-reference
    )
  );

CREATE POLICY "Business owners and admins can delete members" 
  ON public.business_users 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu2
      WHERE bu2.business_id = business_users.business_id 
      AND bu2.user_id = auth.uid()
      AND bu2.role IN ('owner', 'admin')
      AND bu2.id != business_users.id  -- Avoid self-reference
    )
  );

-- Also fix the businesses table policies to avoid recursion
DROP POLICY IF EXISTS "Users can view businesses they belong to" ON public.businesses;

CREATE POLICY "Users can view businesses they belong to" 
  ON public.businesses 
  FOR SELECT 
  USING (
    id IN (
      SELECT business_id FROM public.business_users 
      WHERE user_id = auth.uid()
    )
  );

-- Add admin policies for business_users
CREATE POLICY "Admins can view all business memberships" 
  ON public.business_users 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all business memberships" 
  ON public.business_users 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

-- Add admin policies for businesses
CREATE POLICY "Admins can view all businesses" 
  ON public.businesses 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all businesses" 
  ON public.businesses 
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
WHERE tablename IN ('business_users', 'businesses')
ORDER BY tablename, policyname; 