import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Handshake, MoreHorizontal, Edit, Trash2, User, Repeat, Zap } from "lucide-react";
import EditDealDialog from "./EditDealDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Deal } from "@/hooks/useDeals";
import { formatGBP } from "@/lib/utils";

interface DealsListProps {
  deals: Deal[];
  view: "grid" | "list";
  onDealUpdated: (id: string, data: any) => Promise<void>;
  onDealDeleted: (id: string) => Promise<void>;
}

const DealsList = ({ deals, view, onDealUpdated, onDealDeleted }: DealsListProps) => {
  const navigate = useNavigate();
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospecting": return "bg-gray-100 text-gray-800";
      case "Qualification": return "bg-blue-100 text-blue-800";
      case "Proposal": return "bg-yellow-100 text-yellow-800";
      case "Negotiation": return "bg-orange-100 text-orange-800";
      case "Closed Won": return "bg-green-100 text-green-800";
      case "Closed Lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDealTypeDisplay = (dealType: string) => {
    switch (dealType) {
      case "recurring":
        return { label: "Recurring", icon: Repeat, color: "text-blue-600" };
      case "one_off":
      default:
        return { label: "One-off", icon: Zap, color: "text-orange-600" };
    }
  };

  const getAnnualValue = (value: number, dealType: string) => {
    return dealType === 'recurring' ? value * 12 : value;
  };

  const handleDelete = async () => {
    if (!deletingDeal) return;
    
    setIsDeleting(true);
    try {
      await onDealDeleted(deletingDeal.id);
      setDeletingDeal(null);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const ActionsMenu = ({ deal }: { deal: Deal }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setEditingDeal(deal)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setDeletingDeal(deal)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (view === "grid") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <Card key={deal.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/deals/${deal.id}`)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Link to={`/deals/${deal.id}`} className="flex items-center flex-1">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center cursor-pointer hover:underline">
                        <Handshake className="mr-2 h-5 w-5" />
                        {deal.title}
                      </CardTitle>
                      {deal.notes && (
                        <CardDescription className="mt-2 line-clamp-2">
                          {deal.notes}
                        </CardDescription>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStageColor(deal.stage)}>
                      {deal.stage}
                    </Badge>
                    <ActionsMenu deal={deal} />
                  </div>
                </div>
                <CardDescription>{deal.customer?.name || "No customer assigned"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Value:</span>
                    <span className="text-sm font-medium">{formatGBP(deal.value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual Value:</span>
                    <span className="text-sm font-medium">{formatGBP(getAnnualValue(deal.value, deal.deal_type))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm font-medium flex items-center">
                      {(() => {
                        const { label, icon: Icon, color } = getDealTypeDisplay(deal.deal_type);
                        return (
                          <>
                            <Icon className={`mr-1 h-3 w-3 ${color}`} />
                            {label}
                          </>
                        );
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Probability:</span>
                    <span className="text-sm font-medium">{deal.probability}%</span>
                  </div>
                  {deal.close_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Close Date:</span>
                      <span className="text-sm font-medium">{new Date(deal.close_date).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                  {deal.user_id && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created by:</span>
                      <span className="text-sm font-medium flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {deal.user_id.substring(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingDeal && (
          <EditDealDialog
            deal={editingDeal}
            open={!!editingDeal}
            onOpenChange={(open) => !open && setEditingDeal(null)}
            onDealUpdated={onDealUpdated}
          />
        )}

        {deletingDeal && (
          <DeleteConfirmationDialog
            open={!!deletingDeal}
            onOpenChange={(open) => !open && setDeletingDeal(null)}
            onConfirm={handleDelete}
            title="Delete Deal"
            description={`Are you sure you want to delete "${deletingDeal.title}"? This action cannot be undone.`}
            isLoading={isDeleting}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Annual Value</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Close Date</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link to={`/deals/${deal.id}`} className="flex items-center hover:underline">
                    <Handshake className="mr-2 h-4 w-4" />
                    {deal.title}
                  </Link>
                </TableCell>
                <TableCell>{deal.customer?.name || "-"}</TableCell>
                <TableCell>{formatGBP(deal.value)}</TableCell>
                <TableCell>{formatGBP(getAnnualValue(deal.value, deal.deal_type))}</TableCell>
                <TableCell>
                  <span className="text-sm font-medium flex items-center">
                    {(() => {
                      const { label, icon: Icon, color } = getDealTypeDisplay(deal.deal_type);
                      return (
                        <>
                          <Icon className={`mr-1 h-3 w-3 ${color}`} />
                          {label}
                        </>
                      );
                    })()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStageColor(deal.stage)}>
                    {deal.stage}
                  </Badge>
                </TableCell>
                <TableCell>{deal.probability}%</TableCell>
                <TableCell>
                  {deal.close_date ? new Date(deal.close_date).toLocaleDateString('en-GB') : "-"}
                </TableCell>
                <TableCell>
                  {deal.user_id && (
                    <span className="text-sm font-medium flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {deal.user_id.substring(0, 8)}...
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <ActionsMenu deal={deal} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingDeal && (
        <EditDealDialog
          deal={editingDeal}
          open={!!editingDeal}
          onOpenChange={(open) => !open && setEditingDeal(null)}
          onDealUpdated={onDealUpdated}
        />
      )}

      {deletingDeal && (
        <DeleteConfirmationDialog
          open={!!deletingDeal}
          onOpenChange={(open) => !open && setDeletingDeal(null)}
          onConfirm={handleDelete}
          title="Delete Deal"
          description={`Are you sure you want to delete "${deletingDeal.title}"? This action cannot be undone.`}
          isLoading={isDeleting}
        />
      )}
    </>
  );
};

export default DealsList;
