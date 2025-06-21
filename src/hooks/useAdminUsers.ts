
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

        // Use the new admin function to get all users from auth.users
        const { data: authUsers, error: authUsersError } = await supabase
          .rpc('admin_get_all_users');

        if (authUsersError) {
          console.error('Error fetching auth users:', authUsersError);
          setError('Failed to fetch users from auth system');
          return;
        }

        console.log('Fetched auth users:', authUsers?.length);
        console.log('Auth users details:', authUsers);

        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Don't fail completely, profiles might be optional for some users
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

        // Combine all data - start with auth users as the source of truth
        const combinedUsers: AdminUser[] = authUsers?.map(authUser => {
          // Find matching profile
          const profile = profiles?.find(p => p.id === authUser.id);
          
          // Find user roles
          const roles = userRoles?.filter(ur => ur.user_id === authUser.id).map(ur => ur.role) || [];
          
          // Find onboarding data
          const onboarding = onboardingData?.find(od => od.user_id === authUser.id);

          return {
            id: authUser.id,
            email: authUser.email,
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            business_name: profile?.business_name || null,
            created_at: authUser.created_at,
            primary_role: profile?.primary_role || null,
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
