import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
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
      throw new Error('Invalid authentication')
    }

    // Check if user is admin by looking directly at user_roles table
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')

    if (rolesError) {
      console.error('Error checking user roles:', rolesError)
      throw new Error('Failed to verify admin status')
    }

    if (!userRoles || userRoles.length === 0) {
      throw new Error('Only admins can access all user data')
    }

    // Get all users from auth.users
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers()

    if (authUsersError) {
      console.error('Error fetching auth users:', authUsersError)
      throw new Error('Failed to fetch users from auth system')
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      // Don't fail completely, profiles might be optional for some users
    }

    // Get user roles for all users
    const { data: allUserRoles, error: allRolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role')

    if (allRolesError) {
      console.error('Error fetching user roles:', allRolesError)
      // Don't fail completely, roles might be optional
    }

    // Get onboarding data for all users
    let onboardingData: any[] = []
    try {
      const { data, error: onboardingError } = await supabaseAdmin
        .from('onboarding_data')
        .select('user_id, purpose, role, team_size, company_size, industry, completed_at')

      if (onboardingError) {
        console.error('Error fetching onboarding data:', onboardingError)
      } else {
        onboardingData = data || []
      }
    } catch (error) {
      console.error('Unexpected error fetching onboarding data:', error)
    }

    // Combine all data
    const combinedUsers = authUsers.users.map(authUser => {
      // Find matching profile
      const profile = profiles?.find(p => p.id === authUser.id)
      
      // Find user roles
      const roles = allUserRoles?.filter(ur => ur.user_id === authUser.id).map(ur => ur.role) || []
      
      // Find onboarding data
      const onboarding = onboardingData?.find(od => od.user_id === authUser.id)

      return {
        id: authUser.id,
        email: authUser.email || '',
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        business_name: profile?.business_name || null,
        created_at: authUser.created_at,
        primary_role: profile?.primary_role || null,
        roles,
        onboarding_data: onboarding ? {
          purpose: onboarding.purpose,
          role: onboarding.role,
          team_size: onboarding.team_size,
          company_size: onboarding.company_size,
          industry: onboarding.industry,
          completed_at: onboarding.completed_at,
        } : undefined,
      }
    })

    return new Response(
      JSON.stringify({
        success: true,
        users: combinedUsers
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in admin-get-users:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 