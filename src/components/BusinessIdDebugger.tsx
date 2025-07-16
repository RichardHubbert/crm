import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { testBusinessIdPassthrough } from '@/services/businessIdDebug';

export const BusinessIdDebugger: React.FC = () => {
  const [businessId, setBusinessId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleTest = async () => {
    if (!businessId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a business ID to test",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);

      const testResult = await testBusinessIdPassthrough(businessId);
      setResult(testResult);
      
      if (testResult.success && testResult.match) {
        toast({
          title: "Test Successful",
          description: "Business ID was correctly passed through!",
        });
      } else {
        toast({
          title: "Test Failed",
          description: testResult.message || "Business ID was not correctly passed through",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : 'An error occurred during testing',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business ID Debugger</CardTitle>
          <CardDescription>
            Test if business_id is being correctly passed to Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessId">Business ID to Test</Label>
            <Input
              id="businessId"
              placeholder="Enter a business ID"
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleTest} 
            disabled={isLoading || !businessId.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Business ID Passthrough'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
            
            {result.success && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Expected Business ID:</span> {result.expected}
                </div>
                <div>
                  <span className="font-semibold">Actual Business ID:</span> {result.actual}
                </div>
                <div>
                  <span className="font-semibold">Match:</span> {result.match ? 'Yes ✓' : 'No ✗'}
                </div>
              </div>
            )}
            
            {result.customer && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Created Customer:</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(result.customer, null, 2)}
                </pre>
              </div>
            )}
            
            {result.originalResponse && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Edge Function Response:</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(result.originalResponse, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
