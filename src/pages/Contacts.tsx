
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, User, Loader2, Upload, Trash2 } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import CSVImport from "@/components/CSVImport";
import AddContactDialog from "@/components/AddContactDialog";
import ViewToggle from "@/components/ViewToggle";
import ContactsList from "@/components/ContactsList";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { toast } from "sonner";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { contacts, loading, error, refetch, deleteContacts } = useContacts();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.customer?.name && contact.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.title && contact.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImportComplete = () => {
    setShowImportDialog(false);
    refetch();
  };

  const handleSelectionChange = (contactId: string, selected: boolean) => {
    setSelectedContacts(prev => 
      selected 
        ? [...prev, contactId]
        : prev.filter(id => id !== contactId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedContacts(selected ? filteredContacts.map(c => c.id) : []);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteContacts(selectedContacts);
      toast.success(`Successfully deleted ${selectedContacts.length} contact(s)`);
      setSelectedContacts([]);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete contacts');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllConfirm = async () => {
    try {
      setIsDeleting(true);
      const allContactIds = filteredContacts.map(c => c.id);
      await deleteContacts(allContactIds);
      toast.success(`Successfully deleted all ${allContactIds.length} contact(s)`);
      setSelectedContacts([]);
      setShowDeleteAllDialog(false);
    } catch (error) {
      toast.error('Failed to delete all contacts');
      console.error('Delete all error:', error);
    } finally {
      setIsDeleting(false);
    }
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
          {filteredContacts.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAllDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All ({filteredContacts.length})
            </Button>
          )}
          {selectedContacts.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedContacts.length})
            </Button>
          )}
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
        <ContactsList 
          contacts={filteredContacts} 
          view={view} 
          selectedContacts={selectedContacts}
          onSelectionChange={handleSelectionChange}
          onSelectAll={handleSelectAll}
        />
      )}

      <AddContactDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Contacts"
        description={`Are you sure you want to delete ${selectedContacts.length} contact(s)? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
        onConfirm={handleDeleteAllConfirm}
        title="Delete All Contacts"
        description={`Are you sure you want to delete ALL ${filteredContacts.length} contact(s)? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Contacts;
