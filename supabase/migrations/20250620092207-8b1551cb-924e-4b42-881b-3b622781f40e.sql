
-- Create onboarding_data table to store user onboarding responses
CREATE TABLE public.onboarding_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  purpose text NOT NULL, -- 'work', 'personal', 'school', 'nonprofits'
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for onboarding_data
CREATE POLICY "Users can view their own onboarding data" 
  ON public.onboarding_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding data" 
  ON public.onboarding_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" 
  ON public.onboarding_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at timestamp on onboarding_data
CREATE TRIGGER update_onboarding_data_updated_at 
  BEFORE UPDATE ON public.onboarding_data 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_onboarding_data_user_id ON public.onboarding_data(user_id);
