
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Admin create user function called with method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Creating Supabase admin client...')
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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    console.log('Verifying admin user...')
    // Verify the user making the request is an admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Invalid authentication:', userError)
      throw new Error('Invalid authentication')
    }

    console.log('Checking admin status for user:', user.id)
    // Check if user is admin by looking directly at user_roles table
    const { data: userRoles, error: adminError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')

    if (adminError) {
      console.error('Error checking admin status:', adminError)
      throw new Error('Failed to verify admin status')
    }

    if (!userRoles || userRoles.length === 0) {
      console.error('User is not an admin:', user.id)
      throw new Error('Only admins can create users')
    }

    console.log('Parsing request body...')
    const requestBody = await req.json()
    console.log('Request body parsed successfully')
    
    const { email, password, first_name, last_name, business_name, role } = requestBody

    if (!email || !password) {
      console.error('Missing required fields: email or password')
      throw new Error('Email and password are required')
    }

    console.log('Creating user with email:', email)
    // Create the user in Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: first_name || null,
        last_name: last_name || null,
        business_name: business_name || null,
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }

    if (!newUser.user) {
      console.error('User creation failed - no user returned')
      throw new Error('Failed to create user')
    }

    console.log('User created successfully:', newUser.user.id)

    // Add user role
    console.log('Adding user role:', role || 'user')
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: role || 'user'
      })

    if (roleError) {
      console.error('Role assignment error:', roleError)
      // Don't throw here as user is already created
    } else {
      console.log('Role assigned successfully')
    }

    const successResponse = {
      success: true,
      message: 'User created successfully',
      user_id: newUser.user.id
    }

    console.log('Returning success response:', successResponse)

    return new Response(
      JSON.stringify(successResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Caught error in admin-create-user:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    const errorResponse = {
      success: false,
      error: error.message || 'Unknown error occurred'
    }

    console.log('Returning error response:', errorResponse)

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
