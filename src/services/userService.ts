
import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "@/types/userForm";

export const createUser = async (data: UserFormData) => {
  // Get the current session token
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token available');
  }

  // Call the Edge Function to create the user using the new project URL
  const response = await fetch(`https://nxiejogrelqxxkyhcwgi.supabase.co/functions/v1/admin-create-user`, {
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

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to create user');
  }

  console.log('User creation result:', result);
  return result;
};
