
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Handshake, Loader2, Upload } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import CSVImport from "@/components/CSVImport";
import ViewToggle from "@/components/ViewToggle";
import DealsList from "@/components/DealsList";
import AddDealDialog from "@/components/AddDealDialog";
import { UserInfo } from "@/components/UserInfo";

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { deals, loading, error, refetch } = useDeals();

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (deal.customer?.name && deal.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleImportComplete = () => {
    refetch();
  };

  const handleDealAdded = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
          </div>
          <UserInfo />
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
            <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
          </div>
          <UserInfo />
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
          <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
        </div>
        <div className="flex items-center space-x-4">
          <UserInfo />
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
                  <DialogTitle>Import Deal Data</DialogTitle>
                </DialogHeader>
                <CSVImport onImportComplete={handleImportComplete} />
              </DialogContent>
            </Dialog>
            <AddDealDialog onDealAdded={handleDealAdded} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {filteredDeals.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No deals found. Add your first deal to get started!</p>
          </div>
        </div>
      ) : (
        <DealsList deals={filteredDeals} view={view} />
      )}
    </div>
  );
};

export default Deals;
