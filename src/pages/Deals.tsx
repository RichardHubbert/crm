
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, DollarSign, Loader2, Upload } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import CSVImport from "@/components/CSVImport";
import ViewToggle from "@/components/ViewToggle";
import DealsList from "@/components/DealsList";

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { deals, loading, error } = useDeals();

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (deal.customer?.name && deal.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStage = stageFilter === "all" || deal.stage.toLowerCase() === stageFilter;
    return matchesSearch && matchesStage;
  });

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
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
            <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
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
          <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
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
                <DialogTitle>Import Deal Data</DialogTitle>
              </DialogHeader>
              <CSVImport />
            </DialogContent>
          </Dialog>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
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
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="prospecting">Prospecting</SelectItem>
              <SelectItem value="qualification">Qualification</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {filteredDeals.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
