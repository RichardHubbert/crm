
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/AuthProvider';

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const completeOnboarding = async (
    purpose: string, 
    role: string, 
    teamSize?: string, 
    companySize?: string, 
    industry?: string, 
    referralSources?: string[]
  ) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to complete onboarding",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      console.log('Saving onboarding data for user:', user.id, 'with data:', {
        purpose,
        role,
        teamSize,
        companySize,
        industry,
        referralSources
      });
      
      const { error } = await supabase
        .from('onboarding_data')
        .insert({
          user_id: user.id,
          purpose: purpose,
          role: role,
          team_size: teamSize,
          company_size: companySize,
          industry: industry,
          referral_sources: referralSources,
        });

      if (error) {
        console.error('Error saving onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to save onboarding data. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Onboarding data saved successfully');
      
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      
      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected error during onboarding:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getOnboardingData = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching onboarding data:', error);
      return null;
    }
  };

  return {
    completeOnboarding,
    getOnboardingData,
    isLoading,
  };
};
