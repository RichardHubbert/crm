
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { IndustrySelector } from "@/components/IndustrySelector";
import { useAuthContext } from "@/components/AuthProvider";

const Index = () => {
  const { user } = useAuthContext();

  // If user is already authenticated, they shouldn't see this page
  // The routing will handle redirecting them appropriately
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">ai design crm</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            <Globe className="w-4 h-4 mr-2" />
            Contact sales
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            Get Started →
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
            The AI-powered CRM your<br />
            team will love
          </h1>
          
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Sell faster with the most intuitive CRM - powered by AI and code-free automations.
          </p>
          
          <p className="text-lg font-semibold text-gray-900 mb-12">
            What would you like to manage with your CRM?
          </p>
        </div>

        {/* Industry Selection */}
        <IndustrySelector />

        {/* CTA Button - This now leads to authentication */}
        <div className="mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            Get Started →
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
