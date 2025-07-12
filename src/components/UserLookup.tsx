import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const UserLookup: React.FC = () => {
  const [userId, setUserId] = useState('24e2799f-60d5-4e3b-bb30-b8049c9ae56d');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const lookupUser = async () => {
    setIsLoading(true);
    setUserInfo(null);

    try {
      const results: any = {};

      // Check profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      results.profile = profile || null;
      results.profileError = profileError?.message;

      // Check user_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      results.roles = roles || [];
      results.rolesError = rolesError?.message;

      // Check customers table
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId);

      results.customers = customers || [];
      results.customersError = customersError?.message;

      // Check deals table
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', userId);

      results.deals = deals || [];
      results.dealsError = dealsError?.message;

      // Check contacts table
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId);

      results.contacts = contacts || [];
      results.contactsError = contactsError?.message;

      // Check onboarding_data table
      const { data: onboarding, error: onboardingError } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', userId);

      results.onboarding = onboarding || [];
      results.onboardingError = onboardingError?.message;

      // Check business_users table
      const { data: businessUsers, error: businessUsersError } = await supabase
        .from('business_users')
        .select(`
          *,
          business:businesses(name, industry)
        `)
        .eq('user_id', userId);

      results.businessUsers = businessUsers || [];
      results.businessUsersError = businessUsersError?.message;

      setUserInfo(results);

      if (!profile && !roles.length && !customers.length && !deals.length && !contacts.length && !onboarding.length && !businessUsers.length) {
        toast({
          title: "User Not Found",
          description: "No data found for this user ID in any table",
          variant: "destructive",
        });
      } else {
        toast({
          title: "User Found",
          description: "User data retrieved successfully",
        });
      }

    } catch (error) {
      console.error('Error looking up user:', error);
      toast({
        title: "Error",
        description: "Failed to look up user information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>User Lookup Tool</CardTitle>
        <CardDescription>
          Look up information about a specific user by their ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            className="flex-1"
          />
          <Button onClick={lookupUser} disabled={isLoading}>
            {isLoading ? 'Looking up...' : 'Lookup User'}
          </Button>
        </div>

        {userInfo && (
          <div className="space-y-6">
            {/* Profile Information */}
            {userInfo.profile && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> {userInfo.profile.email}</p>
                  <p><strong>Name:</strong> {userInfo.profile.first_name} {userInfo.profile.last_name}</p>
                  <p><strong>Business:</strong> {userInfo.profile.business_name}</p>
                  <p><strong>Created:</strong> {new Date(userInfo.profile.created_at).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* User Roles */}
            {userInfo.roles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">User Roles</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {userInfo.roles.map((role: any, index: number) => (
                    <p key={index}><strong>Role:</strong> {role.role} (Created: {new Date(role.created_at).toLocaleString()})</p>
                  ))}
                </div>
              </div>
            )}

            {/* Customers */}
            {userInfo.customers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Customers ({userInfo.customers.length})</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {userInfo.customers.map((customer: any) => (
                    <div key={customer.id} className="border-b pb-2">
                      <p><strong>{customer.name}</strong></p>
                      <p className="text-sm text-gray-600">
                        Industry: {customer.industry || 'N/A'} | 
                        Revenue: £{customer.revenue || 0} | 
                        Created: {new Date(customer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deals */}
            {userInfo.deals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Deals ({userInfo.deals.length})</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {userInfo.deals.map((deal: any) => (
                    <div key={deal.id} className="border-b pb-2">
                      <p><strong>{deal.title}</strong></p>
                      <p className="text-sm text-gray-600">
                        Stage: {deal.stage} | 
                        Value: £{deal.value || 0} | 
                        Type: {deal.deal_type} | 
                        Created: {new Date(deal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts */}
            {userInfo.contacts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Contacts ({userInfo.contacts.length})</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {userInfo.contacts.map((contact: any) => (
                    <div key={contact.id} className="border-b pb-2">
                      <p><strong>{contact.name}</strong> - {contact.title || 'No title'}</p>
                      <p className="text-sm text-gray-600">
                        Email: {contact.email || 'N/A'} | 
                        Phone: {contact.phone || 'N/A'} | 
                        Created: {new Date(contact.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onboarding Data */}
            {userInfo.onboarding.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Onboarding Data</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {userInfo.onboarding.map((data: any, index: number) => (
                    <div key={index}>
                      <p><strong>Purpose:</strong> {data.purpose}</p>
                      <p><strong>Role:</strong> {data.role}</p>
                      <p><strong>Industry:</strong> {data.industry || 'N/A'}</p>
                      <p><strong>Team Size:</strong> {data.team_size || 'N/A'}</p>
                      <p><strong>Company Size:</strong> {data.company_size || 'N/A'}</p>
                      <p><strong>Referral Sources:</strong> {data.referral_sources?.join(', ') || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Memberships */}
            {userInfo.businessUsers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Business Memberships</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {userInfo.businessUsers.map((membership: any) => (
                    <div key={membership.id} className="border-b pb-2">
                      <p><strong>Business:</strong> {membership.business?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">
                        Industry: {membership.business?.industry || 'N/A'} | 
                        Role: {membership.role} | 
                        Joined: {new Date(membership.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {Object.entries(userInfo).filter(([key, value]) => key.endsWith('Error') && value).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-600">Errors</h3>
                <div className="bg-red-50 p-4 rounded-lg space-y-2">
                  {Object.entries(userInfo).map(([key, value]) => {
                    if (key.endsWith('Error') && value) {
                      return (
                        <p key={key} className="text-red-600">
                          <strong>{key}:</strong> {String(value)}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 