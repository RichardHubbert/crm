
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Building2, Edit, Briefcase } from "lucide-react";
import { formatGBP } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  revenue: number;
  business_id: string | null;
  business?: {
    name: string;
  };
}

interface CustomersListProps {
  customers: Customer[];
  view: "grid" | "list";
  selectedCustomers: string[];
  onSelectionChange: (customerId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditCustomer: (customer: Customer) => void;
}

const CustomersList = ({ 
  customers, 
  view, 
  selectedCustomers, 
  onSelectionChange, 
  onSelectAll,
  onEditCustomer
}: CustomersListProps) => {
  const allSelected = customers.length > 0 && selectedCustomers.length === customers.length;
  const someSelected = selectedCustomers.length > 0;

  // Safe revenue formatting function
  const formatRevenue = (revenue: number | null | undefined): string => {
    try {
      const numericValue = Number(revenue) || 0;
      return formatGBP(numericValue);
    } catch (error) {
      console.error('Error formatting revenue:', error, revenue);
      return '£0';
    }
  };

  if (view === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={(checked) => onSelectionChange(customer.id, !!checked)}
                  />
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    {customer.name}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditCustomer(customer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                    {customer.status}
                  </Badge>
                </div>
              </div>
              <CardDescription>{customer.industry || "No industry specified"}</CardDescription>
              {customer.business && customer.business.name && (
                <div className="text-sm text-muted-foreground mt-1">
                  <strong>Business:</strong> {customer.business.name}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue:</span>
                  <span className="text-sm font-medium">{formatRevenue(customer.revenue)}</span>
                </div>
                {customer.business && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Business:</span>
                    <span className="text-sm font-medium flex items-center">
                      <Briefcase className="mr-1 h-3 w-3" />
                      {customer.business.name}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={(checked) => onSelectionChange(customer.id, !!checked)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  {customer.name}
                </div>
              </TableCell>
              <TableCell>{customer.industry || "-"}</TableCell>
              <TableCell>
                {customer.business ? (
                  <div className="flex items-center">
                    <Briefcase className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{customer.business.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>{formatRevenue(customer.revenue)}</TableCell>
              <TableCell>
                <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCustomer(customer)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersList;
