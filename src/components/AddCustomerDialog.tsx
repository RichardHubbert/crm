import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCustomers } from '@/hooks/useCustomers';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface AddCustomerDialogProps {
  onCustomerAdded?: () => void;
}

const AddCustomerDialog = ({ onCustomerAdded }: AddCustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    status: 'Active',
    revenue: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addCustomer } = useCustomers();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addCustomer({
        name: formData.name,
        industry: formData.industry || null,
        status: formData.status,
        revenue: parseFloat(formData.revenue) || 0,
      });

      toast({
        title: "Success",
        description: "Customer created successfully",
      });

      setFormData({
        name: '',
        industry: '',
        status: 'Active',
        revenue: '',
      });
      setOpen(false);
      onCustomerAdded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Customer Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="Enter industry"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="revenue">Revenue (GBP)</Label>
            <Input
              id="revenue"
              type="number"
              value={formData.revenue}
              onChange={(e) => handleInputChange('revenue', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
