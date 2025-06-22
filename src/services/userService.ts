import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/userForm";

export const createUser = async (data: UserFormData) => {
  console.log('Starting user creation process with data:', { ...data, password: '[REDACTED]' });
  
  try {
    // Get the current session token
    console.log('Getting current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error('Failed to get authentication session');
    }
    
    if (!session?.access_token) {
      console.error('No access token available');
      throw new Error('No authentication token available');
    }

    console.log('Session obtained, calling edge function...');
    
    // Call the Edge Function to create the user using the working project URL
    const response = await fetch(`https://nnxdtpnrwgcknhpyhowr.supabase.co/functions/v1/admin-create-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        business_name: data.business_name || null,
        role: data.role,
      }),
    });

    console.log('Edge function response status:', response.status);
    console.log('Edge function response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('Edge function error:', result);
      throw new Error(result.error || 'Failed to create user');
    }

    console.log('User creation result:', result);
    return result;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};
