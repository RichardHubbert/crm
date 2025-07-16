// Script to trigger customer import from source to target database
// Run this with: node trigger-customer-import.js

const { createClient } = require('@supabase/supabase-js');

// Source database (where the customer was created)
const SOURCE_URL = "https://mxrrvqnfxfigeofbhepv.supabase.co";
const SOURCE_API_KEY = "YOUR_SOURCE_API_KEY"; // Replace with your source database anon key

// Target database (where customers should be imported)
const TARGET_URL = "https://nnxdtpnrwgcknhpyhowr.supabase.co";
const TARGET_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueGR0cG5yd2dja25ocHlob3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxODU3NDYsImV4cCI6MjA1NDc2MTc0Nn0.vtNzW7hrDrgSaTHWg37nCOLPnFp_khWSOMp6GVQS1rY";

async function triggerImport() {
  try {
    console.log('Starting customer import process...');

    // 1. Create source client
    const sourceClient = createClient(SOURCE_URL, SOURCE_API_KEY);
    
    // 2. Fetch customers from source database
    console.log('Fetching customers from source database...');
    const { data: sourceCustomers, error: fetchError } = await sourceClient
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching from source:', fetchError);
      return;
    }

    console.log(`Found ${sourceCustomers?.length || 0} customers in source database`);

    if (!sourceCustomers || sourceCustomers.length === 0) {
      console.log('No customers found in source database');
      return;
    }

    // 3. Transform data for import
    const transformedCustomers = sourceCustomers.map(customer => ({
      name: customer.name,
      industry: customer.industry,
      status: customer.status || 'Active',
      revenue: customer.revenue || 0,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      website: customer.website,
      notes: customer.notes,
      restaurant_id: customer.restaurant_id, // Preserve restaurant_id
      source_database_id: 'mxrrvqnfxfigeofbhepv',
      source_customer_id: customer.id,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    }));

    // 4. Create target client
    const targetClient = createClient(TARGET_URL, TARGET_API_KEY);

    // 5. Get authentication token (you'll need to be logged in)
    const { data: { session }, error: sessionError } = await targetClient.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      console.error('Authentication required. Please log in to the target database first.');
      console.log('You can log in by visiting your application and signing in.');
      return;
    }

    // 6. Call the import edge function
    console.log('Calling import edge function...');
    const response = await fetch(`${TARGET_URL}/functions/v1/receive-customer-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_data: transformedCustomers
      }),
    });

    const result = await response.json();
    console.log('Import result:', result);

    if (response.ok) {
      console.log('✅ Import completed successfully!');
      console.log(`Processed ${result.summary?.total || 0} customers`);
      console.log(`Successful: ${result.summary?.successful || 0}`);
      console.log(`Failed: ${result.summary?.failed || 0}`);
    } else {
      console.error('❌ Import failed:', result);
    }

  } catch (error) {
    console.error('Error during import:', error);
  }
}

// Instructions for running this script
console.log('=== Customer Import Script ===');
console.log('');
console.log('To use this script:');
console.log('1. Replace YOUR_SOURCE_API_KEY with your source database anon key');
console.log('2. Make sure you are logged in to the target database');
console.log('3. Run: node trigger-customer-import.js');
console.log('');
console.log('Getting source API key:');
console.log('- Go to: https://supabase.com/dashboard/project/mxrrvqnfxfigeofbhepv');
console.log('- Go to Settings > API');
console.log('- Copy the "anon public" key');
console.log('');
console.log('Logging in to target database:');
console.log('- Visit your application and sign in');
console.log('- This will create a session token for the import');
console.log('');

// Uncomment the line below to run the import
// triggerImport(); 