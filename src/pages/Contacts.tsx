
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, User, Mail, Phone } from "lucide-react";

const mockContacts = [
  {
    id: 1,
    name: "John Smith",
    title: "CEO",
    customer: "Acme Corporation",
    email: "john.smith@acme.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "CTO",
    customer: "Acme Corporation",
    email: "sarah.johnson@acme.com",
    phone: "+1 (555) 123-4568",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Wilson",
    title: "VP Sales",
    customer: "Global Solutions Inc",
    email: "mike.wilson@globalsolutions.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
  },
  {
    id: 4,
    name: "Lisa Chen",
    title: "Product Manager",
    customer: "TechStart Ltd",
    email: "lisa.chen@techstart.com",
    phone: "+1 (555) 456-7890",
    status: "Prospect",
  },
];

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  {contact.name}
                </CardTitle>
                <Badge variant={contact.status === "Active" ? "default" : "secondary"}>
                  {contact.status}
                </Badge>
              </div>
              <CardDescription>{contact.title} at {contact.customer}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
