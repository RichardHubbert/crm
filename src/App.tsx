import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider } from "./components/AuthProvider";
import { SignOutHelper } from "./components/SignOutHelper";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Deals from "./pages/Deals";
import DealView from "./pages/DealView";
import Contacts from "./pages/Contacts";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset } from "./components/ui/sidebar";
import { useAuthContext } from "./components/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "./hooks/useIsAdmin";

// Create the QueryClient outside of the component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedLayout = () => {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/deals/:id" element={<DealView />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

const ProtectedRoutes = () => {
  const { user } = useAuthContext();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        console.log('Checking onboarding status for user:', user.id);
        console.log('User is admin:', isAdmin);
        
        // If user is admin, skip onboarding entirely
        if (isAdmin) {
          console.log('Admin user detected, skipping onboarding check');
          setHasCompletedOnboarding(true);
          return;
        }
        
        // First check localStorage for quick response
        const localCompleted = localStorage.getItem(`onboarding_completed_${user.id}`);
        
        // Then check database for authoritative answer
        try {
          const { data, error } = await supabase
            .from('onboarding_data')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking onboarding status:', error);
            // Fall back to localStorage
            setHasCompletedOnboarding(localCompleted === 'true');
            return;
          }

          const dbCompleted = !!data;
          console.log('Database onboarding check:', dbCompleted);
          
          // Sync localStorage with database
          if (dbCompleted && localCompleted !== 'true') {
            localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
          } else if (!dbCompleted && localCompleted === 'true') {
            localStorage.removeItem(`onboarding_completed_${user.id}`);
          }
          
          setHasCompletedOnboarding(dbCompleted);
        } catch (error) {
          console.error('Unexpected error checking onboarding:', error);
          // Fall back to localStorage
          setHasCompletedOnboarding(localCompleted === 'true');
        }
      } else {
        setHasCompletedOnboarding(null);
      }
    };

    // Only check onboarding status after admin status is determined
    if (!adminLoading) {
      checkOnboardingStatus();
    }
  }, [user, isAdmin, adminLoading]);

  // Show loading while checking admin status or onboarding status for authenticated users
  if (user && (adminLoading || hasCompletedOnboarding === null)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is authenticated but hasn't completed onboarding and is not admin, show onboarding
  if (user && hasCompletedOnboarding === false && !isAdmin) {
    return <Onboarding />;
  }

  // If user is authenticated and (has completed onboarding OR is admin), show main app
  if (user && (hasCompletedOnboarding === true || isAdmin)) {
    return <ProtectedLayout />;
  }

  // If not authenticated, redirect to landing page
  return <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route - landing page */}
      <Route path="/" element={<Index />} />
      
      {/* Sign out route */}
      <Route path="/signout" element={<SignOutHelper />} />
      
      {/* Protected routes - using wildcard to allow nested routing */}
      <Route path="/*" element={<ProtectedRoutes />} />
      
      {/* Catch all - redirect to landing page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
