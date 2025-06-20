
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider } from "./components/AuthProvider";
import AuthWrapper from "./components/AuthWrapper";
import OnboardingWrapper from "./components/OnboardingWrapper";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Deals from "./pages/Deals";
import DealView from "./pages/DealView";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset } from "./components/ui/sidebar";
import { useAuthContext } from "./components/AuthProvider";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuthContext();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      const completed = localStorage.getItem(`onboarding_completed_${user.id}`);
      setHasCompletedOnboarding(completed === 'true');
    } else {
      setHasCompletedOnboarding(null);
    }
  }, [user]);

  // If user is authenticated but hasn't completed onboarding, show onboarding
  if (user && hasCompletedOnboarding === false) {
    return <Onboarding />;
  }

  // If user is authenticated and has completed onboarding, show main app
  if (user && hasCompletedOnboarding === true) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/deals/:id" element={<DealView />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // For non-authenticated users, show landing page
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <AppRoutes />
        </AuthWrapper>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
