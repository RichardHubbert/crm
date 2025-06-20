
import { useState } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PurposeStep } from "@/components/onboarding/PurposeStep";
import { RoleStep } from "@/components/onboarding/RoleStep";
import { CompanyInfoStep } from "@/components/onboarding/CompanyInfoStep";
import { SizeStep } from "@/components/onboarding/SizeStep";
import { IndustryStep } from "@/components/onboarding/IndustryStep";
import { ReferralSourceStep } from "@/components/onboarding/ReferralSourceStep";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedReferralSources, setSelectedReferralSources] = useState<string[]>([]);
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

  const handleCompanyInfoContinue = () => {
    if (companyIndustry.trim() && jobRole.trim()) {
      setCurrentStep(4);
    }
  };

  const handleCompanyInfoBack = () => {
    setCurrentStep(2);
  };

  const handleSizeContinue = () => {
    if (selectedTeamSize && selectedCompanySize) {
      setCurrentStep(5);
    }
  };

  const handleSizeBack = () => {
    setCurrentStep(3);
  };

  const handleIndustryContinue = () => {
    if (selectedIndustry) {
      setCurrentStep(6);
    }
  };

  const handleIndustryBack = () => {
    setCurrentStep(4);
  };

  const handleReferralSourceContinue = async () => {
    if (selectedPurpose && selectedRole && selectedTeamSize && selectedCompanySize && selectedIndustry && user) {
      console.log('Completing onboarding with:', {
        purpose: selectedPurpose,
        role: jobRole || selectedRole,
        teamSize: selectedTeamSize,
        companySize: selectedCompanySize,
        industry: selectedIndustry,
        referralSources: selectedReferralSources
      });
      
      const success = await completeOnboarding(
        selectedPurpose, 
        jobRole || selectedRole,
        selectedTeamSize, 
        selectedCompanySize, 
        selectedIndustry,
        selectedReferralSources
      );
      
      if (success) {
        window.location.reload();
      }
    }
  };

  const handleReferralSourceBack = () => {
    setCurrentStep(5);
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
          <CompanyInfoStep
            industry={companyIndustry}
            jobRole={jobRole}
            onIndustryChange={setCompanyIndustry}
            onJobRoleChange={setJobRole}
            onBack={handleCompanyInfoBack}
            onContinue={handleCompanyInfoContinue}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <SizeStep
            selectedTeamSize={selectedTeamSize}
            selectedCompanySize={selectedCompanySize}
            onSelectTeamSize={setSelectedTeamSize}
            onSelectCompanySize={setSelectedCompanySize}
            onContinue={handleSizeContinue}
            onBack={handleSizeBack}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <IndustryStep
            selectedIndustry={selectedIndustry}
            onSelect={setSelectedIndustry}
            onComplete={handleIndustryContinue}
            onBack={handleIndustryBack}
            isLoading={isLoading}
          />
        );
      case 6:
        return (
          <ReferralSourceStep
            selectedSources={selectedReferralSources}
            onSelect={setSelectedReferralSources}
            onComplete={handleReferralSourceContinue}
            onBack={handleReferralSourceBack}
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
