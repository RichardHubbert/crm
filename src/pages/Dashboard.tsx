
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, Handshake, DollarSign, Upload } from "lucide-react";
import CSVImport from "@/components/CSVImport";
import { UserInfo } from "@/components/UserInfo";
import { useCustomers } from "@/hooks/useCustomers";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";

const Dashboard = () => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { customers } = useCustomers();
  const { deals } = useDeals();
  const { contacts } = useContacts();

  console.log('Dashboard component rendering');

  const handleImportComplete = () => {
    setShowImportDialog(false);
    // Could add a refetch of dashboard data here if needed
  };

  // Calculate metrics from real data
  const totalCustomers = customers.length;
  const activeDeals = deals.filter(deal => 
    deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost'
  ).length;
  const totalContacts = contacts.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + (customer.revenue || 0), 0);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <UserInfo />
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
              </DialogHeader>
              <CSVImport onImportComplete={handleImportComplete} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active customers in your CRM
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Deals
            </CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">
              Deals in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              People in your network
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total customer revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest customer interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customers.length > 0 ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Customer added: {customers[0]?.name}</p>
                    <p className="text-xs text-muted-foreground">Recently</p>
                  </div>
                </div>
                {deals.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Deal created: {deals[0]?.title}</p>
                      <p className="text-xs text-muted-foreground">Recently</p>
                    </div>
                  </div>
                )}
                {contacts.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Contact added: {contacts[0]?.name}</p>
                      <p className="text-xs text-muted-foreground">Recently</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No recent activity. Start by adding customers, deals, or contacts!</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Deal Pipeline</CardTitle>
            <CardDescription>
              Current deal stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prospecting</span>
                    <span className="text-sm font-medium">
                      {deals.filter(d => d.stage === 'Prospecting').length} deals
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Qualification</span>
                    <span className="text-sm font-medium">
                      {deals.filter(d => d.stage === 'Qualification').length} deals
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Proposal</span>
                    <span className="text-sm font-medium">
                      {deals.filter(d => d.stage === 'Proposal').length} deals
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Negotiation</span>
                    <span className="text-sm font-medium">
                      {deals.filter(d => d.stage === 'Negotiation').length} deals
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No deals yet. Create your first deal to see the pipeline!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
