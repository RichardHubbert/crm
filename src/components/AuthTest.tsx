import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export const AuthTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAuthTest = async () => {
    setIsLoading(true);
    try {
      const results: any = {};

      // Test 1: Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      results.auth = {
        user: user ? { id: user.id, email: user.email } : null,
        error: authError?.message
      };

      // Test 2: Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      results.session = {
        hasSession: !!session,
        error: sessionError?.message
      };

      // Test 3: Test database connection with simple query
      const { data: testData, error: testError } = await supabase
        .from('customers')
        .select('count')
        .limit(1);

      results.database = {
        connection: testError ? 'Failed' : 'Success',
        error: testError?.message,
        testData
      };

      // Test 4: Try to get actual customer count
      const { count, error: countError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      results.customerCount = {
        count: count || 0,
        error: countError?.message
      };

      // Test 5: Check if we can see any customers at all
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, name')
        .limit(5);

      results.customers = {
        found: customers?.length || 0,
        sample: customers?.slice(0, 3).map(c => c.name),
        error: customersError?.message
      };

      setTestResults(results);
    } catch (error) {
      console.error('Auth test error:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication & Database Test</CardTitle>
        <CardDescription>
          Test authentication and database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runAuthTest} disabled={isLoading}>
          {isLoading ? 'Running Tests...' : 'Run Auth Test'}
        </Button>

        {testResults && (
          <div className="space-y-4">
            {/* Authentication */}
            <div>
              <h4 className="font-semibold mb-2">Authentication</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div><strong>User:</strong> {testResults.auth?.user ? `${testResults.auth.user.email} (${testResults.auth.user.id.slice(0, 8)}...)` : 'Not authenticated'}</div>
                {testResults.auth?.error && (
                  <div className="text-red-600"><strong>Error:</strong> {testResults.auth.error}</div>
                )}
              </div>
            </div>

            {/* Session */}
            <div>
              <h4 className="font-semibold mb-2">Session</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div><strong>Has Session:</strong> {testResults.session?.hasSession ? 'Yes' : 'No'}</div>
                {testResults.session?.error && (
                  <div className="text-red-600"><strong>Error:</strong> {testResults.session.error}</div>
                )}
              </div>
            </div>

            {/* Database Connection */}
            <div>
              <h4 className="font-semibold mb-2">Database Connection</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div><strong>Status:</strong> {testResults.database?.connection}</div>
                {testResults.database?.error && (
                  <div className="text-red-600"><strong>Error:</strong> {testResults.database.error}</div>
                )}
              </div>
            </div>

            {/* Customer Count */}
            <div>
              <h4 className="font-semibold mb-2">Customer Count</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div><strong>Total Customers:</strong> {testResults.customerCount?.count}</div>
                {testResults.customerCount?.error && (
                  <div className="text-red-600"><strong>Error:</strong> {testResults.customerCount.error}</div>
                )}
              </div>
            </div>

            {/* Sample Customers */}
            <div>
              <h4 className="font-semibold mb-2">Sample Customers</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div><strong>Found:</strong> {testResults.customers?.found} customers</div>
                {testResults.customers?.sample && testResults.customers.sample.length > 0 && (
                  <div><strong>Sample:</strong> {testResults.customers.sample.join(', ')}</div>
                )}
                {testResults.customers?.error && (
                  <div className="text-red-600"><strong>Error:</strong> {testResults.customers.error}</div>
                )}
              </div>
            </div>

            {/* Analysis */}
            <div>
              <h4 className="font-semibold mb-2">Analysis</h4>
              <div className="bg-blue-50 p-3 rounded text-sm">
                {!testResults.auth?.user ? (
                  <div className="text-red-600">❌ Not authenticated - you need to log in</div>
                ) : !testResults.session?.hasSession ? (
                  <div className="text-red-600">❌ No active session - try refreshing the page</div>
                ) : testResults.database?.connection === 'Failed' ? (
                  <div className="text-red-600">❌ Database connection failed</div>
                ) : testResults.customerCount?.count === 0 ? (
                  <div className="text-orange-600">⚠️ Database connected but no customers found</div>
                ) : (
                  <div className="text-green-600">✅ Everything looks good - {testResults.customerCount?.count} customers found</div>
                )}
              </div>
            </div>
          </div>
        )}

        {testResults?.error && (
          <div className="bg-red-50 p-3 rounded text-sm text-red-600">
            <strong>Test Error:</strong> {testResults.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 