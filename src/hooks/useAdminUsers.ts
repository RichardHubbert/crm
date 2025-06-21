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

        // Get the current session token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get authentication session');
          return;
        }

        if (!session?.access_token) {
          console.error('No access token available');
          setError('No authentication token available');
          return;
        }

        // Use the new edge function instead of the problematic database function
        const response = await fetch(`https://nxiejogrelqxxkyhcwgi.supabase.co/functions/v1/admin-get-users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response from edge function:', response.status, errorText);
          setError(`Failed to fetch users: ${response.status} ${errorText}`);
          return;
        }

        const result = await response.json();

        if (!result.success) {
          console.error('Edge function returned error:', result.error);
          setError(result.error || 'Failed to fetch users');
          return;
        }

        console.log('Fetched users from edge function:', result.users?.length);
        console.log('Users data:', result.users);
        
        setUsers(result.users || []);
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
