import { supabase } from "@/integrations/supabase/client";

export interface ImportCustomerData {
  id?: string
  name: string
  industry?: string
  status?: string
  revenue?: number
  email?: string
  phone?: string
  address?: string
  website?: string
  notes?: string
  source_database_id?: string
  source_customer_id?: string
  created_at?: string
  updated_at?: string
}

export interface ImportResponse {
  success: boolean
  customer_id?: string
  message: string
  error?: string
}

export interface ImportSummary {
  total: number
  successful: number
  failed: number
}

export interface ImportResult {
  success: boolean
  message: string
  results: ImportResponse[]
  summary: ImportSummary
}

export const importCustomersFromDatabase = async (
  customerData: ImportCustomerData[],
  sourceDatabaseId?: string
): Promise<ImportResult> => {
  try {
    console.log('Starting customer import process...', {
      customerCount: customerData.length,
      sourceDatabaseId
    });

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

    // Prepare the data with source database ID if provided
    const preparedData = customerData.map(customer => ({
      ...customer,
      source_database_id: sourceDatabaseId || customer.source_database_id
    }));

    console.log('Calling receive-customer-data edge function...');
    
    // Call the Edge Function to import customers
    const response = await fetch(`https://nnxdtpnrwgcknhpyhowr.supabase.co/functions/v1/receive-customer-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_data: preparedData
      }),
    });

    console.log('Edge function response status:', response.status);

    const result = await response.json();

    if (!response.ok) {
      console.error('Edge function error:', result);
      throw new Error(result.error || 'Failed to import customers');
    }

    console.log('Import result:', result);
    return result;
  } catch (error) {
    console.error('Error in importCustomersFromDatabase:', error);
    throw error;
  }
};

// Helper function to fetch customers from another Supabase database
export const fetchCustomersFromDatabase = async (
  sourceSupabaseUrl: string,
  sourceApiKey: string,
  sourceDatabaseId: string
): Promise<ImportCustomerData[]> => {
  try {
    console.log('Fetching customers from source database...', {
      sourceUrl: sourceSupabaseUrl,
      sourceDatabaseId
    });

    // Create a temporary Supabase client for the source database
    const { createClient } = await import('@supabase/supabase-js');
    const sourceClient = createClient(sourceSupabaseUrl, sourceApiKey);

    // Fetch customers from the source database
    const { data, error } = await sourceClient
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching from source database:', error);
      throw new Error(`Failed to fetch customers from source database: ${error.message}`);
    }

    // Transform the data to match our import format
    const transformedData: ImportCustomerData[] = (data || []).map(customer => ({
      name: customer.name,
      industry: customer.industry,
      status: customer.status,
      revenue: customer.revenue,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      website: customer.website,
      notes: customer.notes,
      source_database_id: sourceDatabaseId,
      source_customer_id: customer.id, // Use the original ID as source_customer_id
      created_at: customer.created_at,
      updated_at: customer.updated_at
    }));

    console.log(`Fetched ${transformedData.length} customers from source database`);
    return transformedData;
  } catch (error) {
    console.error('Error in fetchCustomersFromDatabase:', error);
    throw error;
  }
};

// Complete workflow function to fetch and import customers
export const importCustomersFromSourceDatabase = async (
  sourceSupabaseUrl: string,
  sourceApiKey: string,
  sourceDatabaseId: string
): Promise<ImportResult> => {
  try {
    console.log('Starting complete import workflow...');
    
    // Step 1: Fetch customers from source database
    const sourceCustomers = await fetchCustomersFromDatabase(
      sourceSupabaseUrl,
      sourceApiKey,
      sourceDatabaseId
    );

    if (sourceCustomers.length === 0) {
      return {
        success: true,
        message: 'No customers found in source database',
        results: [],
        summary: { total: 0, successful: 0, failed: 0 }
      };
    }

    // Step 2: Import customers to current database
    const importResult = await importCustomersFromDatabase(
      sourceCustomers,
      sourceDatabaseId
    );

    return importResult;
  } catch (error) {
    console.error('Error in importCustomersFromSourceDatabase:', error);
    throw error;
  }
}; 