
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Phone } from "lucide-react";
import { Contact } from "@/hooks/useContacts";

interface ContactsListProps {
  contacts: Contact[];
  view: "grid" | "list";
  selectedContacts: string[];
  onSelectionChange: (contactId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

const ContactsList = ({ 
  contacts, 
  view, 
  selectedContacts, 
  onSelectionChange, 
  onSelectAll 
}: ContactsListProps) => {
  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length;
  const someSelected = selectedContacts.length > 0;

  if (view === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={(checked) => onSelectionChange(contact.id, !!checked)}
                  />
                  <CardTitle className="text-lg flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    {contact.name}
                  </CardTitle>
                </div>
                <Badge variant={contact.status === "Active" ? "default" : "secondary"}>
                  {contact.status}
                </Badge>
              </div>
              <CardDescription>
                {contact.title ? `${contact.title}` : "No title"} 
                {contact.customer?.name ? ` at ${contact.customer.name}` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contact.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contact.phone}</span>
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
            <TableHead>Title</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={(checked) => onSelectionChange(contact.id, !!checked)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {contact.name}
                </div>
              </TableCell>
              <TableCell>{contact.title || "-"}</TableCell>
              <TableCell>{contact.customer?.name || "-"}</TableCell>
              <TableCell>
                {contact.email ? (
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {contact.email}
                  </div>
                ) : "-"}
              </TableCell>
              <TableCell>
                {contact.phone ? (
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {contact.phone}
                  </div>
                ) : "-"}
              </TableCell>
              <TableCell>
                <Badge variant={contact.status === "Active" ? "default" : "secondary"}>
                  {contact.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactsList;
