import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const ForceRefreshButton: React.FC = () => {
  const handleForceRefresh = async () => {
    try {
      console.log('Force refreshing customers...');
      
      // Direct query to test
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Direct query result:', { 
        count: data?.length || 0, 
        error: error?.message,
        firstCustomer: data?.[0]?.name 
      });

      if (error) {
        console.error('Direct query error:', error);
        alert(`Error: ${error.message}`);
      } else {
        alert(`Found ${data?.length || 0} customers in database`);
      }
    } catch (err) {
      console.error('Force refresh error:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Button onClick={handleForceRefresh} variant="outline" size="sm">
      <RefreshCw className="mr-2 h-4 w-4" />
      Force Refresh
    </Button>
  );
}; 