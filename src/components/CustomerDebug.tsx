import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/AuthProvider';

export const CustomerDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const runDebug = async () => {
    setIsLoading(true);
    try {
      const debugData: any = {};

      // 1. Get current user info
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      debugData.currentUser = {
        id: currentUser?.id,
        email: currentUser?.email,
        error: userError?.message
      };

      // 2. Get all customers (without RLS to see what's actually in the database)
      const { data: allCustomers, error: allCustomersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      debugData.allCustomers = {
        count: allCustomers?.length || 0,
        customers: allCustomers?.slice(0, 5), // Show first 5
        error: allCustomersError?.message
      };

      // 3. Get customers for current user (with RLS)
      const { data: userCustomers, error: userCustomersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false });

      debugData.userCustomers = {
        count: userCustomers?.length || 0,
        customers: userCustomers?.slice(0, 5), // Show first 5
        error: userCustomersError?.message
      };

      // 4. Check user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', currentUser?.id);

      debugData.userRoles = {
        roles: userRoles || [],
        error: rolesError?.message
      };

      // 5. Check if user is admin
      try {
        const { data: isAdminResult, error: isAdminError } = await supabase
          .rpc('is_admin', { user_uuid: currentUser?.id });

        debugData.isAdmin = {
          result: isAdminResult,
          error: isAdminError?.message
        };
      } catch (error) {
        debugData.isAdmin = {
          result: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      setDebugInfo(debugData);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDebug();
    }
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Debug</CardTitle>
          <CardDescription>Not authenticated</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Customer Debug Information</CardTitle>
          <CardDescription>
            Debug information to help troubleshoot customer visibility issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runDebug} disabled={isLoading}>
            {isLoading ? 'Running Debug...' : 'Refresh Debug Info'}
          </Button>

          {debugInfo && (
            <div className="space-y-4">
              {/* Current User */}
              <div>
                <h4 className="font-semibold mb-2">Current User</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div><strong>ID:</strong> {debugInfo.currentUser?.id}</div>
                  <div><strong>Email:</strong> {debugInfo.currentUser?.email}</div>
                  {debugInfo.currentUser?.error && (
                    <div className="text-red-600"><strong>Error:</strong> {debugInfo.currentUser.error}</div>
                  )}
                </div>
              </div>

              {/* User Roles */}
              <div>
                <h4 className="font-semibold mb-2">User Roles</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {debugInfo.userRoles?.roles?.length > 0 ? (
                    <div className="flex gap-2">
                      {debugInfo.userRoles.roles.map((role: any, index: number) => (
                        <Badge key={index} variant="secondary">{role.role}</Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No roles assigned</div>
                  )}
                  {debugInfo.userRoles?.error && (
                    <div className="text-red-600 mt-2"><strong>Error:</strong> {debugInfo.userRoles.error}</div>
                  )}
                </div>
              </div>

              {/* Admin Status */}
              <div>
                <h4 className="font-semibold mb-2">Admin Status</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div><strong>Is Admin:</strong> {debugInfo.isAdmin?.result ? 'Yes' : 'No'}</div>
                  {debugInfo.isAdmin?.error && (
                    <div className="text-red-600"><strong>Error:</strong> {debugInfo.isAdmin.error}</div>
                  )}
                </div>
              </div>

              {/* All Customers (Database) */}
              <div>
                <h4 className="font-semibold mb-2">All Customers in Database</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div><strong>Total Count:</strong> {debugInfo.allCustomers?.count}</div>
                  {debugInfo.allCustomers?.customers?.length > 0 && (
                    <div className="mt-2">
                      <strong>Sample Customers:</strong>
                      <div className="mt-1 space-y-1">
                        {debugInfo.allCustomers.customers.map((customer: any, index: number) => (
                          <div key={index} className="text-xs">
                            • {customer.name} (User: {customer.user_id?.slice(0, 8)}...)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {debugInfo.allCustomers?.error && (
                    <div className="text-red-600 mt-2"><strong>Error:</strong> {debugInfo.allCustomers.error}</div>
                  )}
                </div>
              </div>

              {/* User's Customers (With RLS) */}
              <div>
                <h4 className="font-semibold mb-2">Your Customers (With RLS)</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div><strong>Visible Count:</strong> {debugInfo.userCustomers?.count}</div>
                  {debugInfo.userCustomers?.customers?.length > 0 && (
                    <div className="mt-2">
                      <strong>Your Customers:</strong>
                      <div className="mt-1 space-y-1">
                        {debugInfo.userCustomers.customers.map((customer: any, index: number) => (
                          <div key={index} className="text-xs">
                            • {customer.name} (Created: {new Date(customer.created_at).toLocaleDateString()})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {debugInfo.userCustomers?.error && (
                    <div className="text-red-600 mt-2"><strong>Error:</strong> {debugInfo.userCustomers.error}</div>
                  )}
                </div>
              </div>

              {/* Analysis */}
              <div>
                <h4 className="font-semibold mb-2">Analysis</h4>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  {debugInfo.allCustomers?.count > debugInfo.userCustomers?.count ? (
                    <div className="text-orange-600">
                      ⚠️ There are {debugInfo.allCustomers.count - debugInfo.userCustomers.count} customers in the database that you can't see.
                      This suggests an RLS policy issue or the customers were created by a different user.
                    </div>
                  ) : debugInfo.userCustomers?.count === 0 && debugInfo.allCustomers?.count > 0 ? (
                    <div className="text-red-600">
                      ❌ You can't see any customers even though there are {debugInfo.allCustomers.count} in the database.
                      This indicates an RLS policy issue.
                    </div>
                  ) : (
                    <div className="text-green-600">
                      ✅ Customer visibility appears to be working correctly.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {debugInfo?.error && (
            <div className="bg-red-50 p-3 rounded text-sm text-red-600">
              <strong>Debug Error:</strong> {debugInfo.error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 