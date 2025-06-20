
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useAuthContext } from "@/components/AuthProvider";

const purposeOptions = [
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal" },
  { id: "school", label: "School" },
  { id: "nonprofits", label: "Nonprofits" }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleContinue = () => {
    if (currentStep === 1 && selectedPurpose && user) {
      // Mark onboarding as completed
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      // Navigate to dashboard - the app will automatically show the main interface
      window.location.reload(); // Force reload to update onboarding state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900 ml-3">ai design CRM</span>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-8 bg-white shadow-sm">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-medium text-gray-900">
                  Hey there, what brings you here today?
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {purposeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPurpose(option.id)}
                    className={`
                      p-4 rounded-lg border-2 text-left font-medium transition-all
                      ${selectedPurpose === option.id
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleContinue}
                  disabled={!selectedPurpose}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6"
                  variant="secondary"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Decorative elements - floating cards on the right */}
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 space-y-4 hidden lg:block">
          <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-100 rounded w-2/3"></div>
            </div>
          </div>
          
          <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3 ml-8">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>

          <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>

          <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3 ml-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-100 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
