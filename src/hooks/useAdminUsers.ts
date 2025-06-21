
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/AuthProvider';
import { AdminUser } from '@/types/adminUser';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching all users for admin...');

        // First, fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setError('Failed to fetch user profiles');
          return;
        }

        console.log('Fetched profiles:', profiles?.length);
        console.log('Profile details:', profiles);

        // Fetch user roles for all users
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          // Don't set error here, roles might be optional
        }

        console.log('Fetched user roles:', userRoles?.length);
        console.log('User roles details:', userRoles);

        // Fetch onboarding data for all users - using a more robust approach
        let onboardingData: any[] = [];
        try {
          const { data, error: onboardingError } = await supabase
            .from('onboarding_data')
            .select('user_id, purpose, role, team_size, company_size, industry, completed_at');

          if (onboardingError) {
            console.error('Error fetching onboarding data:', onboardingError);
            // Don't fail completely, just log the error
          } else {
            onboardingData = data || [];
          }
        } catch (error) {
          console.error('Unexpected error fetching onboarding data:', error);
          // Continue without onboarding data
        }

        console.log('Fetched onboarding data:', onboardingData.length);
        console.log('Onboarding data details:', onboardingData);

        // Combine all data
        const combinedUsers: AdminUser[] = profiles?.map(profile => {
          const roles = userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || [];
          const onboarding = onboardingData?.find(od => od.user_id === profile.id);

          return {
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            business_name: profile.business_name,
            created_at: profile.created_at,
            primary_role: profile.primary_role,
            roles,
            onboarding_data: onboarding ? {
              purpose: onboarding.purpose,
              role: onboarding.role,
              team_size: onboarding.team_size,
              company_size: onboarding.company_size,
              industry: onboarding.industry,
              completed_at: onboarding.completed_at,
            } : undefined,
          };
        }) || [];

        console.log('Combined users data:', combinedUsers.length);
        console.log('Final user data:', combinedUsers);
        setUsers(combinedUsers);
      } catch (error) {
        console.error('Unexpected error fetching users:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  return { users, loading, error };
};
