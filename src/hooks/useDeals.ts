import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Deal {
  id: string;
  title: string;
  customer_id: string | null;
  value: number;
  stage: string;
  probability: number;
  close_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
  };
  user?: {
    email: string;
  };
}

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          customer:customers(name),
          user:auth.users(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDeals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addDeal = async (dealData: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'customer'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('deals')
        .insert([{ ...dealData, user_id: user.id }])
        .select(`
          *,
          customer:customers(name),
          user:auth.users(email)
        `)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) throw new Error('Failed to create deal');
      
      setDeals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add deal');
    }
  };

  const updateDeal = async (id: string, dealData: Partial<Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'customer'>>) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update(dealData)
        .eq('id', id)
        .select(`
          *,
          customer:customers(name),
          user:auth.users(email)
        `)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) throw new Error('Failed to update deal');
      
      setDeals(prev => prev.map(deal => deal.id === id ? data : deal));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update deal');
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDeals(prev => prev.filter(deal => deal.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete deal');
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
    addDeal,
    updateDeal,
    deleteDeal,
  };
};
