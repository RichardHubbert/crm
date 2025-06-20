
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useAuthContext } from "@/components/AuthProvider";
import { useOnboarding } from "@/hooks/useOnboarding";

const purposeOptions = [
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal" },
  { id: "school", label: "School" },
  { id: "nonprofits", label: "Nonprofits" }
];

const roleOptions = [
  { id: "business_owner", label: "Business owner" },
  { id: "team_leader", label: "Team leader" },
  { id: "team_member", label: "Team member" },
  { id: "freelancer", label: "Freelancer" },
  { id: "director", label: "Director" },
  { id: "c_level", label: "C-Level" },
  { id: "vp", label: "VP" }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { completeOnboarding, isLoading } = useOnboarding();

  const handlePurposeContinue = () => {
    if (selectedPurpose) {
      setCurrentStep(2);
    }
  };

  const handleRoleContinue = async () => {
    if (selectedPurpose && selectedRole && user) {
      console.log('Completing onboarding with purpose:', selectedPurpose, 'and role:', selectedRole);
      
      const success = await completeOnboarding(selectedPurpose, selectedRole);
      
      if (success) {
        // Force reload to update onboarding state
        window.location.reload();
      }
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
                    disabled={isLoading}
                    className={`
                      p-4 rounded-lg border-2 text-left font-medium transition-all
                      ${selectedPurpose === option.id
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handlePurposeContinue}
                  disabled={!selectedPurpose || isLoading}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6"
                  variant="secondary"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-medium text-gray-900">
                  What best describes your current role?
                </h1>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.slice(0, 4).map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedRole(option.id)}
                      disabled={isLoading}
                      className={`
                        px-4 py-3 rounded-full border text-center font-medium transition-all
                        ${selectedRole === option.id
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {roleOptions.slice(4).map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedRole(option.id)}
                      disabled={isLoading}
                      className={`
                        px-4 py-3 rounded-full border text-center font-medium transition-all
                        ${selectedRole === option.id
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleRoleContinue}
                  disabled={!selectedRole || isLoading}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6"
                  variant="secondary"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Setting up...
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
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
