
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  revenue: number;
}

interface CustomersListProps {
  customers: Customer[];
  view: "grid" | "list";
}

const CustomersList = ({ customers, view }: CustomersListProps) => {
  if (view === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  {customer.name}
                </CardTitle>
                <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                  {customer.status}
                </Badge>
              </div>
              <CardDescription>{customer.industry || "No industry specified"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue:</span>
                  <span className="text-sm font-medium">${customer.revenue.toLocaleString()}</span>
                </div>
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
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  {customer.name}
                </div>
              </TableCell>
              <TableCell>{customer.industry || "-"}</TableCell>
              <TableCell>${customer.revenue.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                  {customer.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersList;
