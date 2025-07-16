import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { useBusinesses } from "../hooks/useBusinesses";

// Props: open (bool), onClose (fn), customer (object), onSave (fn)
export default function EditCustomerDialog({ open, onClose, customer, onSave }) {
  const { businesses, loading } = useBusinesses();
  console.log('Fetched businesses:', businesses);
  const [name, setName] = useState(customer?.name || "");
  const [industry, setIndustry] = useState(customer?.industry || "");
  const [revenue, setRevenue] = useState(customer?.revenue || 0);
  const [status, setStatus] = useState(customer?.status || "Active");
  const [businessId, setBusinessId] = useState(customer?.business_id || "");

  // Sync state when customer changes (e.g., dialog opens for a different customer)
  useEffect(() => {
    setName(customer?.name || "");
    setIndustry(customer?.industry || "");
    setRevenue(customer?.revenue || 0);
    setStatus(customer?.status || "Active");
    setBusinessId(customer?.business_id || "");
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessId) {
      alert("Please select a business.");
      return;
    }
    // Call onSave with updated customer data
    onSave({
      ...customer,
      name,
      industry,
      revenue,
      status,
      business_id: businessId,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Industry</label>
            <Input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Industry" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Revenue (GBP)</label>
            <Input
              type="number"
              value={revenue}
              onChange={e => setRevenue(Number(e.target.value))}
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Business</label>
            <Select value={businessId} onValueChange={setBusinessId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Loading..." : "Select a business"} />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((biz) => (
                  <SelectItem key={biz.id} value={biz.id}>
                    {biz.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
