
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  revenue: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers...');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Customers response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Ensure revenue is a number for all customers
      const processedData = (data || []).map(customer => ({
        ...customer,
        revenue: Number(customer.revenue) || 0
      }));
      
      console.log('Processed customers:', processedData);
      setCustomers(processedData);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('customers')
        .insert([{ ...customerData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add customer');
    }
  };

  const updateCustomer = async (customerId: string, customerData: Partial<Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId ? data : customer
      ));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update customer');
    }
  };

  const deleteCustomers = async (customerIds: string[]) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .in('id', customerIds);

      if (error) throw error;
      
      setCustomers(prev => prev.filter(customer => !customerIds.includes(customer.id)));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete customers');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomers,
  };
};
