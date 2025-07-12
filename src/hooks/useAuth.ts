
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, businessName: string) => {
    // Use the current origin for email redirect
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          business_name: businessName.trim(),
        }
      }
    });

    // If signup was successful, save profile data
    if (data.user && !error) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email || '',
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            business_name: businessName.trim(),
          });

        if (profileError) {
          console.error('Error saving profile data:', profileError);
          // Don't fail the signup if profile save fails
        }
      } catch (profileError) {
        console.error('Unexpected error saving profile data:', profileError);
        // Don't fail the signup if profile save fails
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    console.log('Starting sign out process...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      console.log('Sign out successful');
      // Clear any localStorage items related to onboarding
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('onboarding_completed_')) {
          localStorage.removeItem(key);
        }
      });
    }
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
