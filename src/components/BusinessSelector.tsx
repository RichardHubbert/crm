import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Check } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { toast } from 'sonner';

interface BusinessSelectorProps {
  onBusinessSelected: (businessId: string) => void;
  selectedBusinessId?: string | null;
}

export const BusinessSelector: React.FC<BusinessSelectorProps> = ({
  onBusinessSelected,
  selectedBusinessId
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessIndustry, setNewBusinessIndustry] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { businesses, getUserBusiness, createBusiness } = useCustomers();
  const [userBusiness, setUserBusiness] = useState<any>(null);

  useEffect(() => {
    const loadUserBusiness = async () => {
      const business = await getUserBusiness();
      setUserBusiness(business);
    };
    loadUserBusiness();
  }, [getUserBusiness]);

  const handleCreateBusiness = async () => {
    if (!newBusinessName.trim()) {
      toast.error('Business name is required');
      return;
    }

    setIsCreating(true);
    try {
      const business = await createBusiness({
        name: newBusinessName.trim(),
        industry: newBusinessIndustry.trim() || undefined
      });

      toast.success('Business created successfully');
      setShowCreateForm(false);
      setNewBusinessName('');
      setNewBusinessIndustry('');
      onBusinessSelected(business.id);
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create business');
    } finally {
      setIsCreating(false);
    }
  };

  const handleBusinessSelect = (businessId: string) => {
    onBusinessSelected(businessId);
  };

  if (showCreateForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Business
          </CardTitle>
          <CardDescription>
            Create a new business to associate with your customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name *</Label>
            <Input
              id="business-name"
              value={newBusinessName}
              onChange={(e) => setNewBusinessName(e.target.value)}
              placeholder="Enter business name"
              disabled={isCreating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-industry">Industry (Optional)</Label>
            <Input
              id="business-industry"
              value={newBusinessIndustry}
              onChange={(e) => setNewBusinessIndustry(e.target.value)}
              placeholder="e.g., Technology, Healthcare, Finance"
              disabled={isCreating}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleCreateBusiness} 
              disabled={isCreating || !newBusinessName.trim()}
              className="flex-1"
            >
              {isCreating ? 'Creating...' : 'Create Business'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Select Business
        </CardTitle>
        <CardDescription>
          Choose which business to associate with your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userBusiness && (
          <div className="space-y-2">
            <Label>Your Business</Label>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{userBusiness.businesses.name}</span>
                <span className="text-sm text-muted-foreground">({userBusiness.role})</span>
              </div>
              {selectedBusinessId === userBusiness.business_id && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Button
              variant={selectedBusinessId === userBusiness.business_id ? "default" : "outline"}
              onClick={() => handleBusinessSelect(userBusiness.business_id)}
              className="w-full"
            >
              {selectedBusinessId === userBusiness.business_id ? 'Selected' : 'Select This Business'}
            </Button>
          </div>
        )}

        {businesses.length > 1 && (
          <div className="space-y-2">
            <Label>Other Businesses</Label>
            <Select 
              value={selectedBusinessId || ''} 
              onValueChange={handleBusinessSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                {businesses
                  .filter(business => !userBusiness || business.id !== userBusiness.business_id)
                  .map(business => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Business
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 