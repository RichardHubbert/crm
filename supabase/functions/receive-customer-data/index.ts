import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface for incoming customer data
interface IncomingCustomerData {
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
  business_id?: string
  restaurant_id?: string // For backward compatibility with source database
  source_database_id?: string
  source_customer_id?: string
  created_at?: string
  updated_at?: string
}

// Interface for existing customer records
interface ExistingCustomer {
  id: string;
  business_id?: string;
}

// Interface for the response
interface CustomerResponse {
  success: boolean
  customer_id?: string
  message: string
  error?: string
  action?: 'inserted' | 'updated'
  business_id?: string
  customer_name?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Method not allowed. Use POST.' 
        } as CustomerResponse),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authorization header required' 
        } as CustomerResponse),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user making the request
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid authentication' 
        } as CustomerResponse),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user is admin or has permission to import data
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'data_importer'])

    if (rolesError) {
      console.error('Error checking user roles:', rolesError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to verify user permissions' 
        } as CustomerResponse),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!userRoles || userRoles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Insufficient permissions to import customer data' 
        } as CustomerResponse),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const body = await req.json()
    
    // Validate the incoming data
    if (!body.customer_data || !Array.isArray(body.customer_data)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid request body. Expected customer_data array.' 
        } as CustomerResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const customerDataArray: IncomingCustomerData[] = body.customer_data
    console.log('Received customer data array:', customerDataArray.map(c => ({ name: c.name, business_id: c.business_id })))
    const results: CustomerResponse[] = []

    // Process each customer
    for (const customerData of customerDataArray) {
      try {
        // Validate required fields
        if (!customerData.name || customerData.name.trim() === '') {
          results.push({
            success: false,
            message: 'Customer name is required',
            error: 'Missing required field: name'
          })
          continue
        }

        // Define customerPayload at the top level of the try block so it's available in the catch block
        let customerPayload: Record<string, any> = {};
        
        // Check if customer already exists (by source_customer_id if available)
        let existingCustomer: ExistingCustomer | null = null;
        if (customerData.source_customer_id) {
          const { data, error } = await supabaseAdmin
            .from('customers')
            .select('id, business_id')
            .eq('source_customer_id', customerData.source_customer_id)
            .eq('source_database_id', customerData.source_database_id)
            .maybeSingle()
          
          if (error) {
            console.error('Error checking for existing customer:', error)
          } else if (data) {
            console.log('Found existing customer:', data)
            existingCustomer = data;
          }
        }

        // Get the user's business association
        const { data: userBusiness, error: businessError } = await supabaseAdmin
          .from('business_users')
          .select('business_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (businessError) {
          console.error('Error fetching user business:', businessError)
          results.push({
            success: false,
            message: `Failed to get user business for customer: ${customerData.name}`,
            error: 'User not associated with any business'
          })
          continue
        }

        if (!userBusiness?.business_id) {
          results.push({
            success: false,
            message: `User not associated with any business for customer: ${customerData.name}`,
            error: 'User not associated with any business'
          })
          continue
        }

        // Validate business_id
        let finalBusinessId: string;
        
        if (customerData.business_id) {
          console.log('Using provided business_id from customer data:', customerData.business_id)
          finalBusinessId = customerData.business_id
        } else if (userBusiness?.business_id) {
          console.log('Using default business_id from user association:', userBusiness.business_id)
          finalBusinessId = userBusiness.business_id
        } else {
          console.error('No business_id available from customer data or user association!')
          throw new Error('No business_id available for customer')
        }

        // Prepare customer data for insertion/update
        customerPayload = {
          name: customerData.name.trim(),
          industry: customerData.industry || null,
          status: customerData.status || 'Active',
          revenue: customerData.revenue || 0,
          user_id: user.id,
          business_id: finalBusinessId, // Use the validated business_id
          source_database_id: customerData.source_database_id || null,
          source_customer_id: customerData.source_customer_id || null,
          notes: customerData.notes || null,
          updated_at: new Date().toISOString()
        }
        console.log('Final customer payload with business_id:', customerPayload.business_id)
        console.log('Prepared customerPayload for insert:', customerPayload)

        let result: CustomerResponse

        if (existingCustomer) {
          // Update existing customer
          console.log('Updating existing customer with ID:', existingCustomer.id)
          console.log('Update payload business_id:', customerPayload.business_id)
          
          const { data, error } = await supabaseAdmin
            .from('customers')
            .update(customerPayload)
            .eq('id', existingCustomer.id)
            .select()
            .single()
          
          if (error) {
            console.error('Error updating customer:', error)
            throw error
          }
          
          console.log('Updated customer result:', data)
          console.log('Updated customer business_id:', data.business_id)
          result = { 
            success: true, 
            customer_id: data.id, 
            action: 'updated', 
            business_id: data.business_id,
            message: `Customer updated successfully: ${customerData.name}`
          }
        } else {
          // Insert new customer
          console.log('Inserting new customer')
          console.log('Insert payload business_id:', customerPayload.business_id)
          
          const { data, error } = await supabaseAdmin
            .from('customers')
            .insert([customerPayload])
            .select()
            .single()
          
          if (error) {
            console.error('Error inserting customer:', error)
            throw error
          }
          
          console.log('Inserted customer result:', data)
          console.log('Inserted customer business_id:', data.business_id)
          result = { 
            success: true, 
            customer_id: data.id, 
            action: 'inserted', 
            business_id: data.business_id,
            message: `Customer created successfully: ${customerData.name}`
          }
        }

        results.push(result)

      } catch (error) {
        console.error('Error processing customer:', error)
        try {
          // Log the payload that failed, if it exists
          console.error('Customer payload that failed:', customerPayload)
        } catch (logError) {
          console.error('Could not log customer payload, variable may be out of scope')
        }
        
        const errorResult: CustomerResponse = { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          customer_name: customerData.name,
          message: `Error processing customer: ${customerData.name || 'Unknown'}`
        };
        results.push(errorResult)
      }
    }

    // Calculate summary
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${customerDataArray.length} customers. ${successful} successful, ${failed} failed.`,
        results: results,
        summary: {
          total: customerDataArray.length,
          successful: successful,
          failed: failed
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      } as CustomerResponse),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 