
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeals } from '@/hooks/useDeals';
import { useCustomers } from '@/hooks/useCustomers';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface AddDealDialogProps {
  onDealAdded?: () => void;
}

const AddDealDialog = ({ onDealAdded }: AddDealDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    customer_id: '',
    value: '',
    stage: 'Prospecting',
    probability: '',
    close_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addDeal } = useDeals();
  const { customers } = useCustomers();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDeal({
        title: formData.title,
        customer_id: formData.customer_id || null,
        value: parseFloat(formData.value) || 0,
        stage: formData.stage,
        probability: parseInt(formData.probability) || 0,
        close_date: formData.close_date || null,
      });

      toast({
        title: "Success",
        description: "Deal created successfully",
      });

      setFormData({
        title: '',
        customer_id: '',
        value: '',
        stage: 'Prospecting',
        probability: '',
        close_date: '',
      });
      setOpen(false);
      onDealAdded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create deal",
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
          Add Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Deal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter deal title"
              required
            />
          </div>

          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select onValueChange={(value) => handleInputChange('customer_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Deal Value</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => handleInputChange('value', e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="stage">Stage</Label>
            <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prospecting">Prospecting</SelectItem>
                <SelectItem value="Qualification">Qualification</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
                <SelectItem value="Closed Lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="probability">Probability (%)</Label>
            <Input
              id="probability"
              type="number"
              value={formData.probability}
              onChange={(e) => handleInputChange('probability', e.target.value)}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          <div>
            <Label htmlFor="close_date">Expected Close Date</Label>
            <Input
              id="close_date"
              type="date"
              value={formData.close_date}
              onChange={(e) => handleInputChange('close_date', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealDialog;
