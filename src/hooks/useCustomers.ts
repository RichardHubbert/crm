import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  revenue: number;
  user_id: string;
  business_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers...');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          business:businesses(name)
        `)
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

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching businesses:', error);
        return;
      }

      setBusinesses(data || []);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'user_id' | 'business_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the user's business
      const { data: businessData, error: businessError } = await supabase
        .from('business_users')
        .select('business_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (businessError) {
        console.error('Error fetching user business:', businessError);
        throw new Error('Failed to get user business');
      }

      if (!businessData?.business_id) {
        throw new Error('User is not associated with any business');
      }

      const { data, error } = await supabase
        .from('customers')
        .insert([{ 
          ...customerData, 
          user_id: user.id,
          business_id: businessData.business_id
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      
      if (!data) throw new Error('Failed to create customer');
      
      setCustomers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add customer');
    }
  };

  const updateCustomer = async (customerId: string, customerData: Partial<Omit<Customer, 'id' | 'user_id' | 'business_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', customerId)
        .select()
        .maybeSingle();

      if (error) throw error;
      
      if (!data) throw new Error('Failed to update customer');
      
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

  const createBusiness = async (businessData: { name: string; industry?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('businesses')
        .insert([{ 
          ...businessData, 
          created_by: user.id 
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      
      if (!data) throw new Error('Failed to create business');
      
      // Create business_user relationship
      const { error: relationshipError } = await supabase
        .from('business_users')
        .insert([{
          business_id: data.id,
          user_id: user.id,
          role: 'owner'
        }]);

      if (relationshipError) {
        console.error('Error creating business relationship:', relationshipError);
      }

      setBusinesses(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create business');
    }
  };

  const getUserBusiness = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('business_users')
        .select(`
          business_id,
          role,
          businesses (*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user business:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting user business:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchBusinesses();
  }, []);

  return {
    customers,
    businesses,
    loading,
    error,
    refetch: fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomers,
    createBusiness,
    getUserBusiness,
  };
};
