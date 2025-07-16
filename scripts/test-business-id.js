#!/usr/bin/env node

/**
 * Test script to verify business_id passthrough to Supabase
 * 
 * Usage: 
 *   node test-business-id.js <business_id>
 * 
 * Example:
 *   node test-business-id.js 123e4567-e89b-12d3-a456-426614174000
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get business_id from command line args
const businessId = process.argv[2];

if (!businessId) {
  console.error('Error: Please provide a business_id as a command line argument');
  console.log('Usage: node test-business-id.js <business_id>');
  process.exit(1);
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nnxdtpnrwgcknhpyhowr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBusinessIdPassthrough() {
  try {
    console.log('Starting business_id passthrough test...');
    console.log(`Testing with business_id: ${businessId}`);
    
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
      throw new Error('No authentication token available - please login first');
    }
    
    // Call the Edge Function directly with our test customer
    console.log('Calling edge function...');
    const response = await fetch(`${supabaseUrl}/functions/v1/receive-customer-data`, {
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
    console.log('Edge function response:', JSON.stringify(result, null, 2));
    
    // Check if the customer was created with the correct business_id
    if (result.success && result.results && result.results[0]?.customer_id) {
      const { data: createdCustomer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', result.results[0].customer_id)
        .single();
      
      if (error) {
        console.error('Error fetching created customer:', error);
        return;
      }
      
      console.log('Created customer:', createdCustomer);
      console.log('\n--- BUSINESS ID TEST RESULTS ---');
      console.log(`Expected business_id: ${businessId}`);
      console.log(`Actual business_id:   ${createdCustomer.business_id}`);
      console.log(`Match:                ${createdCustomer.business_id === businessId ? 'YES ✓' : 'NO ✗'}`);
      
      if (createdCustomer.business_id !== businessId) {
        console.log('\n⚠️ BUSINESS ID MISMATCH DETECTED ⚠️');
        console.log('The business_id in the database does not match the one provided in the test.');
      } else {
        console.log('\n✅ BUSINESS ID TEST PASSED ✅');
        console.log('The business_id was correctly passed through to Supabase.');
      }
    } else {
      console.error('Failed to create test customer:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error in test script:', error);
  }
}

testBusinessIdPassthrough();
