import { supabase } from "@/integrations/supabase/client";

/**
 * Debug utility to check if business_id is being properly passed and processed
 * @param businessId The business ID to test
 */
export const testBusinessIdPassthrough = async (businessId: string) => {
  try {
    console.log('Testing business_id passthrough with:', businessId);
    
    // Create a test customer with explicit business_id
    const testCustomer = {
      name: `Test Customer ${new Date().toISOString()}`,
      business_id: businessId,
      status: 'Test',
      notes: 'Created by business_id debug utility'
    };
    
    console.log('Test customer payload:', testCustomer);
    
    // Get the current session token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error('Failed to get authentication session');
    }
    
    if (!session?.access_token) {
      console.error('No access token available');
      throw new Error('No authentication token available');
    }
    
    // Call the Edge Function directly with our test customer
    const response = await fetch(`https://nnxdtpnrwgcknhpyhowr.supabase.co/functions/v1/receive-customer-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_data: [testCustomer]
      }),
    });
    
    console.log('Edge function response status:', response.status);
    const result = await response.json();
    console.log('Edge function response:', result);
    
    // Check if the customer was created with the correct business_id
    if (result.success && result.results && result.results[0]?.customer_id) {
      const { data: createdCustomer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', result.results[0].customer_id)
        .single();
      
      if (error) {
        console.error('Error fetching created customer:', error);
        return {
          success: false,
          message: 'Failed to verify created customer',
          error: error.message,
          originalResponse: result
        };
      }
      
      console.log('Created customer:', createdCustomer);
      
      return {
        success: true,
        message: `Customer created with business_id: ${createdCustomer.business_id}`,
        expected: businessId,
        actual: createdCustomer.business_id,
        match: createdCustomer.business_id === businessId,
        customer: createdCustomer,
        originalResponse: result
      };
    }
    
    return {
      success: false,
      message: 'Failed to create test customer',
      error: result.error || 'Unknown error',
      originalResponse: result
    };
  } catch (error) {
    console.error('Error in testBusinessIdPassthrough:', error);
    return {
      success: false,
      message: 'Exception in business ID test',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
