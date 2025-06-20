
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, User, Loader2, Upload } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import CSVImport from "@/components/CSVImport";
import AddContactDialog from "@/components/AddContactDialog";
import ViewToggle from "@/components/ViewToggle";
import ContactsList from "@/components/ContactsList";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { contacts, loading, error, refetch } = useContacts();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.customer?.name && contact.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.title && contact.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImportComplete = () => {
    setShowImportDialog(false);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Import Contact Data</DialogTitle>
              </DialogHeader>
              <CSVImport onImportComplete={handleImportComplete} />
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {filteredContacts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No contacts found. Add your first contact to get started!</p>
          </div>
        </div>
      ) : (
        <ContactsList contacts={filteredContacts} view={view} />
      )}

      <AddContactDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};

export default Contacts;
