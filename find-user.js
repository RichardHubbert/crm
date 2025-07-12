import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nnxdtpnrwgcknhpyhowr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueGR0cG5yd2dja25ocHlob3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxODU3NDYsImV4cCI6MjA1NDc2MTc0Nn0.vtNzW7hrDrgSaTHWg37nCOLPnFp_khWSOMp6GVQS1rY";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const userId = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

async function findUser() {
  console.log(`Searching for user ID: ${userId}`);
  console.log('=====================================');

  try {
    // 1. Check auth.users table
    console.log('\n1. Checking auth.users table...');
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError) {
      console.log('Auth user error:', authError.message);
    } else if (authUser) {
      console.log('Auth user found:');
      console.log('  Email:', authUser.user.email);
      console.log('  Created at:', authUser.user.created_at);
      console.log('  Last sign in:', authUser.user.last_sign_in_at);
      console.log('  Email confirmed:', authUser.user.email_confirmed_at ? 'Yes' : 'No');
    } else {
      console.log('No auth user found with this ID');
    }

    // 2. Check profiles table
    console.log('\n2. Checking profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.log('Profile error:', profileError.message);
    } else if (profile) {
      console.log('Profile found:');
      console.log('  First Name:', profile.first_name);
      console.log('  Last Name:', profile.last_name);
      console.log('  Business Name:', profile.business_name);
      console.log('  Email:', profile.email);
      console.log('  Created at:', profile.created_at);
    } else {
      console.log('No profile found with this ID');
    }

    // 3. Check user_roles table
    console.log('\n3. Checking user_roles table...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    if (rolesError) {
      console.log('Roles error:', rolesError.message);
    } else if (roles && roles.length > 0) {
      console.log('User roles found:');
      roles.forEach(role => {
        console.log('  Role:', role.role);
        console.log('  Created at:', role.created_at);
      });
    } else {
      console.log('No user roles found for this ID');
    }

    // 4. Check customers table
    console.log('\n4. Checking customers table...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId);

    if (customersError) {
      console.log('Customers error:', customersError.message);
    } else if (customers && customers.length > 0) {
      console.log(`Found ${customers.length} customers for this user:`);
      customers.forEach(customer => {
        console.log(`  - ${customer.name} (${customer.industry || 'No industry'}) - £${customer.revenue || 0}`);
      });
    } else {
      console.log('No customers found for this user');
    }

    // 5. Check deals table
    console.log('\n5. Checking deals table...');
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId);

    if (dealsError) {
      console.log('Deals error:', dealsError.message);
    } else if (deals && deals.length > 0) {
      console.log(`Found ${deals.length} deals for this user:`);
      deals.forEach(deal => {
        console.log(`  - ${deal.title} (${deal.stage}) - £${deal.value || 0}`);
      });
    } else {
      console.log('No deals found for this user');
    }

    // 6. Check contacts table
    console.log('\n6. Checking contacts table...');
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId);

    if (contactsError) {
      console.log('Contacts error:', contactsError.message);
    } else if (contacts && contacts.length > 0) {
      console.log(`Found ${contacts.length} contacts for this user:`);
      contacts.forEach(contact => {
        console.log(`  - ${contact.name} (${contact.title || 'No title'}) - ${contact.email || 'No email'}`);
      });
    } else {
      console.log('No contacts found for this user');
    }

    // 7. Check onboarding_data table
    console.log('\n7. Checking onboarding_data table...');
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', userId);

    if (onboardingError) {
      console.log('Onboarding error:', onboardingError.message);
    } else if (onboarding && onboarding.length > 0) {
      console.log('Onboarding data found:');
      onboarding.forEach(data => {
        console.log('  Purpose:', data.purpose);
        console.log('  Role:', data.role);
        console.log('  Industry:', data.industry);
        console.log('  Team Size:', data.team_size);
        console.log('  Company Size:', data.company_size);
        console.log('  Referral Sources:', data.referral_sources);
      });
    } else {
      console.log('No onboarding data found for this user');
    }

    // 8. Check business_users table
    console.log('\n8. Checking business_users table...');
    const { data: businessUsers, error: businessUsersError } = await supabase
      .from('business_users')
      .select(`
        *,
        business:businesses(name, industry)
      `)
      .eq('user_id', userId);

    if (businessUsersError) {
      console.log('Business users error:', businessUsersError.message);
    } else if (businessUsers && businessUsers.length > 0) {
      console.log('Business memberships found:');
      businessUsers.forEach(membership => {
        console.log(`  Business: ${membership.business?.name || 'Unknown'} (${membership.business?.industry || 'No industry'})`);
        console.log(`  Role: ${membership.role}`);
        console.log(`  Created at: ${membership.created_at}`);
      });
    } else {
      console.log('No business memberships found for this user');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

findUser(); 