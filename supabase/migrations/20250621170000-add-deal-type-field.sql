-- Add deal_type field to deals table
-- This will track whether a deal is recurring (monthly) or one-off

-- Add the deal_type column
ALTER TABLE public.deals 
ADD COLUMN deal_type text DEFAULT 'one_off' CHECK (deal_type IN ('one_off', 'recurring'));

-- Add a comment to explain the field
COMMENT ON COLUMN public.deals.deal_type IS 'Type of deal: one_off for single payment, recurring for monthly/annual payments';

-- Create an index for better performance when filtering by deal type
CREATE INDEX idx_deals_deal_type ON public.deals(deal_type);

-- Update existing deals to have a default value (optional)
-- UPDATE public.deals SET deal_type = 'one_off' WHERE deal_type IS NULL; 