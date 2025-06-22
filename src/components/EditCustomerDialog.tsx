import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomers";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  revenue: number;
}

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

const EditCustomerDialog = ({ open, onOpenChange, customer }: EditCustomerDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    revenue: "",
    status: "Active"
  });

  const { updateCustomer } = useCustomers();

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        industry: customer.industry || "",
        revenue: customer.revenue?.toString() || "0",
        status: customer.status || "Active"
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    setIsLoading(true);
    try {
      await updateCustomer(customer.id, {
        name: formData.name,
        industry: formData.industry || null,
        revenue: parseFloat(formData.revenue) || 0,
        status: formData.status,
      });

      toast.success("Customer updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update customer");
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              placeholder="Industry"
            />
          </div>

          <div>
            <Label htmlFor="revenue">Revenue (GBP)</Label>
            <Input
              id="revenue"
              type="number"
              value={formData.revenue}
              onChange={(e) => handleInputChange("revenue", e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
