
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Building2 } from "lucide-react";

const mockCustomers = [
  {
    id: 1,
    name: "Acme Corporation",
    industry: "Technology",
    status: "Active",
    revenue: "$125,000",
    contacts: 5,
    deals: 3,
  },
  {
    id: 2,
    name: "Global Solutions Inc",
    industry: "Consulting",
    status: "Active",
    revenue: "$85,000",
    contacts: 3,
    deals: 2,
  },
  {
    id: 3,
    name: "TechStart Ltd",
    industry: "Software",
    status: "Prospect",
    revenue: "$0",
    contacts: 2,
    deals: 1,
  },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
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
              <CardDescription>{customer.industry}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue:</span>
                  <span className="text-sm font-medium">{customer.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Contacts:</span>
                  <span className="text-sm font-medium">{customer.contacts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Deals:</span>
                  <span className="text-sm font-medium">{customer.deals}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Customers;
