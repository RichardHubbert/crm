import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, Settings, Save } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { BusinessMembershipManager } from "@/components/BusinessMembershipManager";
import { UserInfo } from "@/components/UserInfo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Business = () => {
  const [userBusiness, setUserBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');
  const [saving, setSaving] = useState(false);
  const { getUserBusiness } = useCustomers();

  useEffect(() => {
    const loadUserBusiness = async () => {
      try {
        setLoading(true);
        const business = await getUserBusiness();
        setUserBusiness(business);
        if (business?.businesses) {
          const businessData = business.businesses as any;
          setBusinessName(businessData.name || '');
          setBusinessIndustry(businessData.industry || '');
        }
      } catch (error) {
        console.error('Error loading user business:', error);
        toast.error('Failed to load business information');
      } finally {
        setLoading(false);
      }
    };

    loadUserBusiness();
  }, [getUserBusiness]);

  const handleSaveBusiness = async () => {
    if (!userBusiness?.business_id) {
      toast.error('No business found');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: businessName.trim(),
          industry: businessIndustry.trim() || null
        })
        .eq('id', userBusiness.business_id);

      if (error) {
        throw error;
      }

      toast.success('Business updated successfully');
      setEditingBusiness(false);
      
      // Reload business data
      const business = await getUserBusiness();
      setUserBusiness(business);
    } catch (error) {
      console.error('Error updating business:', error);
      toast.error('Failed to update business');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Business</h2>
          </div>
          <UserInfo />
        </div>
        <div className="text-center py-8">Loading business information...</div>
      </div>
    );
  }

  if (!userBusiness) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Business</h2>
          </div>
          <UserInfo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              No Business Found
            </CardTitle>
            <CardDescription>
              You are not associated with any business. Please contact your administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Business</h2>
        </div>
        <UserInfo />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Manage your business details and settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingBusiness ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-industry">Industry</Label>
                  <Input
                    id="business-industry"
                    value={businessIndustry}
                    onChange={(e) => setBusinessIndustry(e.target.value)}
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveBusiness}
                    disabled={saving || !businessName.trim()}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingBusiness(false);
                      setBusinessName(userBusiness.businesses.name || '');
                      setBusinessIndustry(userBusiness.businesses.industry || '');
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <p className="text-sm font-medium">{userBusiness.businesses.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <p className="text-sm text-muted-foreground">
                    {userBusiness.businesses.industry || 'Not specified'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <p className="text-sm font-medium capitalize">{userBusiness.role}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditingBusiness(true)}
                  className="w-full"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Business
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>
              Overview of your business activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">-</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">-</div>
                <div className="text-sm text-muted-foreground">Customers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <BusinessMembershipManager
        businessId={userBusiness.business_id}
        businessName={userBusiness.businesses.name}
        userRole={userBusiness.role}
      />
    </div>
  );
};

export default Business; 