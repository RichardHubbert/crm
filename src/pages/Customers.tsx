
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Building2, Loader2, Upload, Trash2 } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import CSVImport from "@/components/CSVImport";
import ViewToggle from "@/components/ViewToggle";
import CustomersList from "@/components/CustomersList";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { toast } from "sonner";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { customers, loading, error, refetch, deleteCustomers } = useCustomers();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportComplete = () => {
    setShowImportDialog(false);
    refetch();
  };

  const handleSelectionChange = (customerId: string, selected: boolean) => {
    setSelectedCustomers(prev => 
      selected 
        ? [...prev, customerId]
        : prev.filter(id => id !== customerId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedCustomers(selected ? filteredCustomers.map(c => c.id) : []);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteCustomers(selectedCustomers);
      toast.success(`Successfully deleted ${selectedCustomers.length} customer(s)`);
      setSelectedCustomers([]);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete customers');
      console.error('Delete error:', error);
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
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
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
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
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
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        </div>
        <div className="flex space-x-2">
          {selectedCustomers.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedCustomers.length})
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
                <DialogTitle>Import Customer Data</DialogTitle>
              </DialogHeader>
              <CSVImport onImportComplete={handleImportComplete} />
            </DialogContent>
          </Dialog>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No customers found. Add your first customer to get started!</p>
          </div>
        </div>
      ) : (
        <CustomersList 
          customers={filteredCustomers} 
          view={view} 
          selectedCustomers={selectedCustomers}
          onSelectionChange={handleSelectionChange}
          onSelectAll={handleSelectAll}
        />
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Customers"
        description={`Are you sure you want to delete ${selectedCustomers.length} customer(s)? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Customers;
