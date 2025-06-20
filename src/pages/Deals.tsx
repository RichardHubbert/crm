
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, DollarSign } from "lucide-react";

const mockDeals = [
  {
    id: 1,
    title: "Enterprise Software License",
    customer: "Acme Corporation",
    value: "$50,000",
    stage: "Negotiation",
    probability: 80,
    closeDate: "2024-02-15",
  },
  {
    id: 2,
    title: "Consulting Services Contract",
    customer: "Global Solutions Inc",
    value: "$35,000",
    stage: "Proposal",
    probability: 60,
    closeDate: "2024-02-28",
  },
  {
    id: 3,
    title: "Annual Support Package",
    customer: "TechStart Ltd",
    value: "$15,000",
    stage: "Qualification",
    probability: 40,
    closeDate: "2024-03-15",
  },
];

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === "all" || deal.stage.toLowerCase() === stageFilter;
    return matchesSearch && matchesStage;
  });

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDeals.map((deal) => (
          <Card key={deal.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
              <CardDescription>{deal.customer}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Value:</span>
                  <span className="text-sm font-medium">{deal.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Probability:</span>
                  <span className="text-sm font-medium">{deal.probability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Close Date:</span>
                  <span className="text-sm font-medium">{deal.closeDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Deals;
