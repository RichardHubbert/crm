-- Create businesses table and modify customers to associate with businesses
-- This allows multiple users from the same business to share customers

-- Create businesses table
CREATE TABLE public.businesses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  industry text,
  status text NOT NULL DEFAULT 'Active',
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create business_users table to associate users with businesses
CREATE TABLE public.business_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- Add business_id column to customers table
ALTER TABLE public.customers 
ADD COLUMN business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_businesses_created_by ON public.businesses(created_by);
CREATE INDEX idx_business_users_business_id ON public.business_users(business_id);
CREATE INDEX idx_business_users_user_id ON public.business_users(user_id);
CREATE INDEX idx_customers_business_id ON public.customers(business_id);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for businesses
CREATE POLICY "Users can view businesses they belong to" 
  ON public.businesses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = businesses.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create businesses" 
  ON public.businesses 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Business owners and admins can update businesses" 
  ON public.businesses 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = businesses.id 
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Business owners can delete businesses" 
  ON public.businesses 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = businesses.id 
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Create RLS policies for business_users
CREATE POLICY "Users can view business memberships" 
  ON public.business_users 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.business_users bu2
      WHERE bu2.business_id = business_users.business_id 
      AND bu2.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners and admins can manage members" 
  ON public.business_users 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu2
      WHERE bu2.business_id = business_users.business_id 
      AND bu2.user_id = auth.uid()
      AND bu2.role IN ('owner', 'admin')
    )
  );

-- Update customers RLS policies to work with businesses
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can create their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;

CREATE POLICY "Users can view customers from their businesses" 
  ON public.customers 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create customers for their businesses" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update customers from their businesses" 
  ON public.customers 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete customers from their businesses" 
  ON public.customers 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users 
      WHERE business_id = customers.business_id 
      AND user_id = auth.uid()
    )
  );

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_users_updated_at BEFORE UPDATE ON public.business_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create business when user signs up
CREATE OR REPLACE FUNCTION public.create_business_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a business for the new user if they have a business_name
  IF NEW.business_name IS NOT NULL AND NEW.business_name != '' THEN
    -- Check if business already exists
    INSERT INTO public.businesses (name, created_by)
    VALUES (NEW.business_name, NEW.id)
    ON CONFLICT DO NOTHING;
    
    -- Get the business ID and create the business_user relationship
    INSERT INTO public.business_users (business_id, user_id, role)
    SELECT id, NEW.id, 'owner'
    FROM public.businesses 
    WHERE name = NEW.business_name 
    AND created_by = NEW.id
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create business when profile is created/updated
DROP TRIGGER IF EXISTS create_business_trigger ON public.profiles;
CREATE TRIGGER create_business_trigger
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_business_for_user();

-- Create function to migrate existing customers to businesses
CREATE OR REPLACE FUNCTION public.migrate_customers_to_businesses()
RETURNS void AS $$
DECLARE
  customer_record RECORD;
  business_record RECORD;
BEGIN
  -- For each customer, find or create a business based on the user's business_name
  FOR customer_record IN 
    SELECT c.*, p.business_name 
    FROM public.customers c
    JOIN public.profiles p ON c.user_id = p.id
    WHERE c.business_id IS NULL
  LOOP
    -- Find existing business or create new one
    SELECT * INTO business_record 
    FROM public.businesses 
    WHERE name = customer_record.business_name 
    AND created_by = customer_record.user_id
    LIMIT 1;
    
    IF business_record IS NULL AND customer_record.business_name IS NOT NULL THEN
      -- Create new business
      INSERT INTO public.businesses (name, created_by)
      VALUES (customer_record.business_name, customer_record.user_id)
      RETURNING * INTO business_record;
      
      -- Create business_user relationship
      INSERT INTO public.business_users (business_id, user_id, role)
      VALUES (business_record.id, customer_record.user_id, 'owner');
    END IF;
    
    -- Update customer with business_id
    IF business_record IS NOT NULL THEN
      UPDATE public.customers 
      SET business_id = business_record.id
      WHERE id = customer_record.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT ALL ON public.businesses TO authenticated;
GRANT ALL ON public.business_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_business_for_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.migrate_customers_to_businesses() TO authenticated; 