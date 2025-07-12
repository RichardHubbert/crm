-- Add fields to customers table for tracking imported data
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS source_database_id text,
ADD COLUMN IF NOT EXISTS source_customer_id text,
ADD COLUMN IF NOT EXISTS notes text;

-- Create index for efficient lookups by source customer ID
CREATE INDEX IF NOT EXISTS idx_customers_source_customer_id ON public.customers(source_customer_id);

-- Create index for efficient lookups by source database ID
CREATE INDEX IF NOT EXISTS idx_customers_source_database_id ON public.customers(source_database_id);

-- Add a unique constraint to prevent duplicate imports from the same source
-- (optional - uncomment if you want to prevent duplicates)
-- ALTER TABLE public.customers 
-- ADD CONSTRAINT unique_source_customer 
-- UNIQUE (source_database_id, source_customer_id) 
-- WHERE source_database_id IS NOT NULL AND source_customer_id IS NOT NULL;

-- Add RLS policy for data importers (if you have a data_importer role)
-- This allows users with data_importer role to view all customers for import purposes
CREATE POLICY IF NOT EXISTS "Data importers can view all customers" 
  ON public.customers 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'data_importer')
    )
  );

-- Add RLS policy for data importers to create customers
CREATE POLICY IF NOT EXISTS "Data importers can create customers" 
  ON public.customers 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'data_importer')
    )
  );

-- Add RLS policy for data importers to update customers
CREATE POLICY IF NOT EXISTS "Data importers can update customers" 
  ON public.customers 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'data_importer')
    )
  ); 