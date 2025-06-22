
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
    
    // Call the Edge Function to create the user
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

    // Check if response is ok
    if (!response.ok) {
      console.error('Edge function returned non-OK status:', response.status, response.statusText);
      
      // Try to get error details from response
      let errorDetails;
      try {
        const responseText = await response.text();
        console.log('Error response body:', responseText);
        
        // Try to parse as JSON
        try {
          errorDetails = JSON.parse(responseText);
        } catch {
          errorDetails = { error: responseText || `HTTP ${response.status}: ${response.statusText}` };
        }
      } catch (textError) {
        console.error('Failed to read error response:', textError);
        errorDetails = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      throw new Error(errorDetails.error || `Request failed with status ${response.status}`);
    }

    // Parse the response
    let result;
    try {
      const responseText = await response.text();
      console.log('Success response body:', responseText);
      
      if (!responseText) {
        throw new Error('Empty response from server');
      }
      
      result = JSON.parse(responseText);
      console.log('Parsed result:', result);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      throw new Error('Invalid response format from server');
    }

    // Validate the result
    if (!result || typeof result !== 'object') {
      console.error('Invalid result object:', result);
      throw new Error('Invalid response from server');
    }

    if (!result.success) {
      console.error('Edge function reported failure:', result);
      throw new Error(result.error || 'User creation failed');
    }

    console.log('User creation successful:', result);
    return result;

  } catch (error) {
    console.error('Error in createUser:', error);
    
    // Re-throw with more context if it's a generic error
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
    }
    
    // Re-throw the original error
    throw error;
  }
};
