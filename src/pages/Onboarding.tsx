
import { useState } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PurposeStep } from "@/components/onboarding/PurposeStep";
import { RoleStep } from "@/components/onboarding/RoleStep";
import { SizeStep } from "@/components/onboarding/SizeStep";
import { IndustryStep } from "@/components/onboarding/IndustryStep";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { completeOnboarding, isLoading } = useOnboarding();

  const handlePurposeContinue = () => {
    if (selectedPurpose) {
      setCurrentStep(2);
    }
  };

  const handleRoleContinue = () => {
    if (selectedRole) {
      setCurrentStep(3);
    }
  };

  const handleSizeContinue = () => {
    if (selectedTeamSize && selectedCompanySize) {
      setCurrentStep(4);
    }
  };

  const handleIndustryContinue = async () => {
    if (selectedPurpose && selectedRole && selectedTeamSize && selectedCompanySize && selectedIndustry && user) {
      console.log('Completing onboarding with:', {
        purpose: selectedPurpose,
        role: selectedRole,
        teamSize: selectedTeamSize,
        companySize: selectedCompanySize,
        industry: selectedIndustry
      });
      
      const success = await completeOnboarding(selectedPurpose, selectedRole, selectedTeamSize, selectedCompanySize, selectedIndustry);
      
      if (success) {
        // Force reload to update onboarding state
        window.location.reload();
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PurposeStep
            selectedPurpose={selectedPurpose}
            onSelect={setSelectedPurpose}
            onContinue={handlePurposeContinue}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <RoleStep
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
            onContinue={handleRoleContinue}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <SizeStep
            selectedTeamSize={selectedTeamSize}
            selectedCompanySize={selectedCompanySize}
            onSelectTeamSize={setSelectedTeamSize}
            onSelectCompanySize={setSelectedCompanySize}
            onContinue={handleSizeContinue}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <IndustryStep
            selectedIndustry={selectedIndustry}
            onSelect={setSelectedIndustry}
            onComplete={handleIndustryContinue}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout>
      {renderCurrentStep()}
    </OnboardingLayout>
  );
};

export default Onboarding;
