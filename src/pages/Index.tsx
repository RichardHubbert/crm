
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users, Handshake, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Blue Octopus CRM
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your customers, deals, and contacts all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
            <p className="text-gray-600">View your business metrics</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Customers</h3>
            <p className="text-gray-600">Manage customer accounts</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Handshake className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Deals</h3>
            <p className="text-gray-600">Track sales opportunities</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Contacts</h3>
            <p className="text-gray-600">Maintain contact relationships</p>
          </div>
        </div>

        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link to="/dashboard">Get Started</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
