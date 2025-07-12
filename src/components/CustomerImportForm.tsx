import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  importCustomersFromDatabase, 
  importCustomersFromSourceDatabase,
  ImportCustomerData,
  ImportResult 
} from '@/services/customerImportService';

interface CustomerImportFormProps {
  onImportComplete?: (result: ImportResult) => void;
}

export const CustomerImportForm: React.FC<CustomerImportFormProps> = ({ 
  onImportComplete 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [importMode, setImportMode] = useState<'manual' | 'database'>('manual');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  
  // Manual import fields
  const [customerData, setCustomerData] = useState('');
  
  // Database import fields
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceApiKey, setSourceApiKey] = useState('');
  const [sourceDatabaseId, setSourceDatabaseId] = useState('');
  
  const { toast } = useToast();

  const handleManualImport = async () => {
    if (!customerData.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer data in JSON format",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setImportResult(null);

      // Parse the JSON data
      const parsedData: ImportCustomerData[] = JSON.parse(customerData);
      
      if (!Array.isArray(parsedData)) {
        throw new Error('Data must be an array of customer objects');
      }

      // Validate each customer has required fields
      for (const customer of parsedData) {
        if (!customer.name || customer.name.trim() === '') {
          throw new Error('Each customer must have a name');
        }
      }

      const result = await importCustomersFromDatabase(parsedData);
      setImportResult(result);
      
      toast({
        title: "Import Complete",
        description: result.message,
      });

      if (onImportComplete) {
        onImportComplete(result);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'An error occurred during import',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatabaseImport = async () => {
    if (!sourceUrl || !sourceApiKey || !sourceDatabaseId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setImportResult(null);

      const result = await importCustomersFromSourceDatabase(
        sourceUrl,
        sourceApiKey,
        sourceDatabaseId
      );
      
      setImportResult(result);
      
      toast({
        title: "Import Complete",
        description: result.message,
      });

      if (onImportComplete) {
        onImportComplete(result);
      }
    } catch (error) {
      console.error('Database import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'An error occurred during import',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerData('');
    setSourceUrl('');
    setSourceApiKey('');
    setSourceDatabaseId('');
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Customers</CardTitle>
          <CardDescription>
            Import customer data from another source or database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Import Mode Selection */}
          <div className="flex space-x-2">
            <Button
              variant={importMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setImportMode('manual')}
              disabled={isLoading}
            >
              Manual Import
            </Button>
            <Button
              variant={importMode === 'database' ? 'default' : 'outline'}
              onClick={() => setImportMode('database')}
              disabled={isLoading}
            >
              Database Import
            </Button>
          </div>

          {importMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerData">Customer Data (JSON)</Label>
                <Textarea
                  id="customerData"
                  placeholder={`[
  {
    "name": "Acme Corp",
    "industry": "Technology",
    "status": "Active",
    "revenue": 1000000,
    "email": "contact@acme.com",
    "phone": "+1-555-0123"
  }
]`}
                  value={customerData}
                  onChange={(e) => setCustomerData(e.target.value)}
                  rows={10}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                onClick={handleManualImport} 
                disabled={isLoading || !customerData.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Customers
                  </>
                )}
              </Button>
            </div>
          )}

          {importMode === 'database' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="sourceUrl">Source Database URL</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="sourceApiKey">Source API Key</Label>
                <Input
                  id="sourceApiKey"
                  type="password"
                  placeholder="Enter the anon/public API key"
                  value={sourceApiKey}
                  onChange={(e) => setSourceApiKey(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="sourceDatabaseId">Source Database ID</Label>
                <Input
                  id="sourceDatabaseId"
                  placeholder="Enter a unique identifier for this source"
                  value={sourceDatabaseId}
                  onChange={(e) => setSourceDatabaseId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                onClick={handleDatabaseImport} 
                disabled={isLoading || !sourceUrl || !sourceApiKey || !sourceDatabaseId}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import from Database
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {importResult.success ? (
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="mr-2 h-5 w-5 text-red-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>{importResult.message}</AlertDescription>
            </Alert>
            
            {importResult.summary && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{importResult.summary.total}</div>
                  <div className="text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{importResult.summary.successful}</div>
                  <div className="text-muted-foreground">Successful</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">{importResult.summary.failed}</div>
                  <div className="text-muted-foreground">Failed</div>
                </div>
              </div>
            )}
            
            {importResult.results && importResult.results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Detailed Results:</h4>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {importResult.results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`text-sm p-2 rounded ${
                        result.success 
                          ? 'bg-green-50 text-green-800' 
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {result.message}
                      {result.error && <div className="text-xs mt-1">{result.error}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button onClick={resetForm} variant="outline" className="w-full">
              Import More Customers
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 