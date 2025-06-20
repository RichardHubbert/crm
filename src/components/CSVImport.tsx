
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";
import { useToast } from "@/hooks/use-toast";

type ImportType = "customers" | "deals" | "contacts";

interface CSVRow {
  [key: string]: string;
}

const CSVImport = () => {
  const [importType, setImportType] = useState<ImportType | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  
  const { addCustomer } = useCustomers();
  const { addDeal } = useDeals();
  const { addContact } = useContacts();
  const { toast } = useToast();

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    
    return rows;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Preview the first few rows
    const text = await selectedFile.text();
    const rows = parseCSV(text);
    setPreview(rows.slice(0, 3)); // Show first 3 rows as preview
  };

  const processCustomers = async (rows: CSVRow[]) => {
    for (const row of rows) {
      try {
        await addCustomer({
          name: row.name || row.Name || '',
          industry: row.industry || row.Industry || null,
          status: row.status || row.Status || 'Active',
          revenue: parseFloat(row.revenue || row.Revenue || '0') || 0,
        });
      } catch (error) {
        console.error('Error adding customer:', error);
      }
    }
  };

  const processDeals = async (rows: CSVRow[]) => {
    for (const row of rows) {
      try {
        await addDeal({
          title: row.title || row.Title || '',
          customer_id: null, // Would need customer mapping logic
          value: parseFloat(row.value || row.Value || '0') || 0,
          stage: row.stage || row.Stage || 'Prospecting',
          probability: parseInt(row.probability || row.Probability || '0') || 0,
          close_date: row.close_date || row['Close Date'] || null,
        });
      } catch (error) {
        console.error('Error adding deal:', error);
      }
    }
  };

  const processContacts = async (rows: CSVRow[]) => {
    for (const row of rows) {
      try {
        await addContact({
          name: row.name || row.Name || '',
          title: row.title || row.Title || null,
          customer_id: null, // Would need customer mapping logic
          email: row.email || row.Email || null,
          phone: row.phone || row.Phone || null,
          status: row.status || row.Status || 'Active',
        });
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    }
  };

  const handleImport = async () => {
    if (!file || !importType) return;
    
    setImporting(true);
    
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length === 0) {
        toast({
          title: "No data found",
          description: "The CSV file appears to be empty or invalid",
          variant: "destructive",
        });
        return;
      }
      
      switch (importType) {
        case "customers":
          await processCustomers(rows);
          break;
        case "deals":
          await processDeals(rows);
          break;
        case "contacts":
          await processContacts(rows);
          break;
      }
      
      toast({
        title: "Import successful",
        description: `Successfully imported ${rows.length} ${importType}`,
      });
      
      // Reset form
      setFile(null);
      setImportType("");
      setPreview([]);
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "There was an error importing your data",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const getExpectedFields = (type: ImportType) => {
    switch (type) {
      case "customers":
        return ["name", "industry", "status", "revenue"];
      case "deals":
        return ["title", "value", "stage", "probability", "close_date"];
      case "contacts":
        return ["name", "title", "email", "phone", "status"];
      default:
        return [];
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Import CSV Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select import type</label>
          <Select value={importType} onValueChange={(value: ImportType) => setImportType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose what to import" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="deals">Deals</SelectItem>
              <SelectItem value="contacts">Contacts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {importType && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Expected CSV columns for {importType}:</p>
                <p className="text-sm text-blue-700 mt-1">
                  {getExpectedFields(importType).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Choose CSV file</label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={!importType}
          />
        </div>

        {preview.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview (first 3 rows)</label>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-2 border-b">
                <FileText className="h-4 w-4 inline mr-2" />
                <span className="text-sm font-medium">{file?.name}</span>
              </div>
              <div className="p-2 max-h-32 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(preview, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleImport}
          disabled={!file || !importType || importing}
          className="w-full"
        >
          {importing ? "Importing..." : "Import Data"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVImport;
