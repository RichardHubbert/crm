import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

export interface Business {
  id: string;
  name: string;
}

export function useBusinesses(): { businesses: Business[]; loading: boolean } {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const { data } = await supabase.from("businesses").select("id, name");
        setBusinesses(data || []);
      } catch (error) {
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, []);

  return { businesses, loading };
} 