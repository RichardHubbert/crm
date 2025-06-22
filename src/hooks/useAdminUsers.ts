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

        // Temporarily skip edge function attempt due to CORS issues
        // TODO: Re-enable when edge function is deployed
        console.log('Using database approach...');

        // Check if the is_admin function exists by trying to call it
        try {
          const { data: authUsers, error: authUsersError } = await supabase
            .rpc('admin_get_all_users');

          if (authUsersError) {
            console.error('Error fetching auth users:', authUsersError);
            // If the function doesn't exist, we'll handle it gracefully
            if (authUsersError.message.includes('function') || authUsersError.message.includes('does not exist')) {
              throw new Error('Admin function not available - please run the SQL fix in Supabase dashboard');
            }
            setError('Failed to fetch users from auth system');
            return;
          }

          console.log('Fetched auth users:', authUsers?.length);

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

          // Fetch user roles for all users
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('user_id, role');

          if (rolesError) {
            console.error('Error fetching user roles:', rolesError);
            // Don't set error here, roles might be optional
          }

          console.log('Fetched user roles:', userRoles?.length);

          // Fetch onboarding data for all users
          let onboardingData: any[] = [];
          try {
            const { data, error: onboardingError } = await supabase
              .from('onboarding_data')
              .select('user_id, purpose, role, team_size, company_size, industry, completed_at');

            if (onboardingError) {
              console.error('Error fetching onboarding data:', onboardingError);
            } else {
              onboardingData = data || [];
            }
          } catch (error) {
            console.error('Unexpected error fetching onboarding data:', error);
          }

          console.log('Fetched onboarding data:', onboardingData.length);

          // Combine all data
          const combinedUsers: AdminUser[] = authUsers?.map(authUser => {
            // Find matching profile
            const profile = profiles?.find(p => p.id === authUser.id);
            
            // Find user roles
            const roles = userRoles?.filter(ur => ur.user_id === authUser.id).map(ur => ur.role) || [];
            
            // Find onboarding data
            const onboarding = onboardingData?.find(od => od.user_id === authUser.id);

            return {
              id: authUser.id,
              email: authUser.email || '',
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
          setUsers(combinedUsers);

        } catch (databaseError) {
          console.error('Database approach failed:', databaseError);
          setError(databaseError.message || 'Failed to fetch users from database');
        }

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
