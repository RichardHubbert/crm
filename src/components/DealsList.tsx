
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  close_date: string | null;
  customer?: {
    name: string;
  };
}

interface DealsListProps {
  deals: Deal[];
  view: "grid" | "list";
}

const DealsList = ({ deals, view }: DealsListProps) => {
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

  if (view === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <Link key={deal.id} to={`/deals/${deal.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    {deal.title}
                  </CardTitle>
                  <Badge className={getStageColor(deal.stage)}>
                    {deal.stage}
                  </Badge>
                </div>
                <CardDescription>{deal.customer?.name || "No customer assigned"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Value:</span>
                    <span className="text-sm font-medium">${deal.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Probability:</span>
                    <span className="text-sm font-medium">{deal.probability}%</span>
                  </div>
                  {deal.close_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Close Date:</span>
                      <span className="text-sm font-medium">{new Date(deal.close_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Probability</TableHead>
            <TableHead>Close Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">
                <Link to={`/deals/${deal.id}`} className="flex items-center hover:underline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {deal.title}
                </Link>
              </TableCell>
              <TableCell>{deal.customer?.name || "-"}</TableCell>
              <TableCell>${deal.value.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStageColor(deal.stage)}>
                  {deal.stage}
                </Badge>
              </TableCell>
              <TableCell>{deal.probability}%</TableCell>
              <TableCell>
                {deal.close_date ? new Date(deal.close_date).toLocaleDateString() : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DealsList;
