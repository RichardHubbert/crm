import React from 'react';
import { BusinessIdDebugger } from '@/components/BusinessIdDebugger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BusinessIdDebugPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Business ID Debugging Tool</CardTitle>
          <CardDescription>
            Use this tool to diagnose and fix issues with business_id not being passed to Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This tool helps diagnose issues with the business_id field not being properly passed to Supabase.
            It creates a test customer with the specified business_id and verifies if it was correctly stored.
          </p>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
            <h3 className="font-medium text-yellow-800 mb-2">How to use this tool:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Enter a valid business ID (UUID format)</li>
              <li>Click "Test Business ID Passthrough"</li>
              <li>Check if the business_id was correctly stored in Supabase</li>
              <li>Review the detailed logs in the browser console</li>
            </ol>
          </div>
        </CardContent>
      </Card>
      
      <BusinessIdDebugger />
      
      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Missing business_id in request payload</h3>
            <p className="text-sm text-gray-600">
              Ensure the business_id field is included in the data being sent from the source application.
              Check the console logs to verify the business_id is present in the request.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">2. Edge function not processing business_id</h3>
            <p className="text-sm text-gray-600">
              The edge function has been updated to explicitly handle and log business_id processing.
              Check the console logs to see if the business_id is being correctly processed.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">3. Database permissions or RLS issues</h3>
            <p className="text-sm text-gray-600">
              If the business_id is present in the request but not being stored, check for RLS policies
              that might be preventing the business_id from being saved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessIdDebugPage;
