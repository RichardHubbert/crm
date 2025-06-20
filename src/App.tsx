
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider } from "./components/AuthProvider";
import AuthWrapper from "./components/AuthWrapper";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Deals from "./pages/Deals";
import DealView from "./pages/DealView";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset } from "./components/ui/sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <Routes>
                  <Route path="/" element={<Index />} />
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
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
