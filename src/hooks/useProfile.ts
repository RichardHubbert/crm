import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/AuthProvider';

interface ProfileData {
  purpose: string;
  role: string;
  team_size?: string;
  company_size?: string;
  industry?: string;
  referral_sources?: string[];
}

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile data:', error);
          return;
        }

        if (data) {
          setProfileData({
            purpose: data.purpose,
            role: data.role,
            team_size: data.team_size,
            company_size: data.company_size,
            industry: data.industry,
            referral_sources: data.referral_sources,
          });
        }
      } catch (error) {
        console.error('Unexpected error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  return { profileData, loading };
};
