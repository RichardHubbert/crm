
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with the user's JWT token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get current user to verify admin status
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('User verification error:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Authenticated user:', user.id)

    // Check if current user is admin using the existing function
    const { data: isAdminData, error: adminError } = await supabase
      .rpc('is_admin', { user_uuid: user.id })

    if (adminError) {
      console.error('Admin check error:', adminError)
      return new Response(
        JSON.stringify({ error: 'Failed to verify admin status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isAdminData) {
      console.error('User is not admin:', user.id)
      return new Response(
        JSON.stringify({ error: 'Only admins can delete users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request body
    const { target_user_id } = await req.json()

    if (!target_user_id) {
      return new Response(
        JSON.stringify({ error: 'target_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prevent deleting own account
    if (target_user_id === user.id) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete your own admin account' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Admin ${user.id} attempting to delete user ${target_user_id}`)

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

    // Step 1: Delete from public schema tables using the database function
    console.log('Calling admin_delete_user_complete function...')
    const { data: deleteResult, error: deleteError } = await supabaseAdmin
      .rpc('admin_delete_user_complete', { 
        target_user_id: target_user_id,
        admin_user_id: user.id
      })

    if (deleteError) {
      console.error('Error calling admin_delete_user_complete:', deleteError)
      return new Response(
        JSON.stringify({ 
          error: `Failed to delete user data: ${deleteError.message}`,
          details: deleteError
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Database function result:', deleteResult)

    // Step 2: Delete from auth.users using admin client
    console.log('Deleting user from auth system...')
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(target_user_id)

    if (authDeleteError) {
      console.error('Error deleting from auth.users:', authDeleteError)
      return new Response(
        JSON.stringify({ 
          error: `Failed to delete user from auth system: ${authDeleteError.message}`,
          partial_success: true,
          message: 'User data was deleted from application tables but not from auth system'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Successfully deleted user from auth system')

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User completely deleted from both application and auth system'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in admin-delete-user-complete:', error)
    
    // More detailed error response
    const errorResponse = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    }

    return new Response(
      JSON.stringify(errorResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
