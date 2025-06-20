
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Mail, Phone } from "lucide-react";
import { Contact } from "@/hooks/useContacts";

interface ContactsListProps {
  contacts: Contact[];
  view: "grid" | "list";
}

const ContactsList = ({ contacts, view }: ContactsListProps) => {
  if (view === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
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
            <TableRow key={contact.id} className="cursor-pointer hover:bg-muted/50">
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
