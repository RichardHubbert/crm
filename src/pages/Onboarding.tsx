
import { useState } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { UserInfoStep } from "@/components/onboarding/UserInfoStep";
import { PurposeStep } from "@/components/onboarding/PurposeStep";
import { RoleStep } from "@/components/onboarding/RoleStep";
import { CompanyInfoStep } from "@/components/onboarding/CompanyInfoStep";
import { SizeStep } from "@/components/onboarding/SizeStep";
import { IndustryStep } from "@/components/onboarding/IndustryStep";
import { ReferralSourceStep } from "@/components/onboarding/ReferralSourceStep";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
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

  const handleUserInfoContinue = async () => {
    if (firstName.trim() && lastName.trim() && user) {
      try {
        // Update the user's profile with name and business information
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email || '',
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            business_name: businessName.trim() || null,
          });

        if (error) {
          console.error('Error updating profile:', error);
          toast.error("Failed to save profile information");
          return;
        }

        console.log('Profile updated successfully');
        setCurrentStep(2);
      } catch (error) {
        console.error('Unexpected error updating profile:', error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleUserInfoBack = () => {
    // This is the first step, so we don't go back
  };

  const handlePurposeContinue = () => {
    if (selectedPurpose) {
      setCurrentStep(3);
    }
  };

  const handlePurposeBack = () => {
    setCurrentStep(1);
  };

  const handleRoleContinue = () => {
    if (selectedRole) {
      setCurrentStep(4);
    }
  };

  const handleRoleBack = () => {
    setCurrentStep(2);
  };

  const handleCompanyInfoContinue = () => {
    if (companyIndustry.trim() && jobRole.trim()) {
      setCurrentStep(5);
    }
  };

  const handleCompanyInfoBack = () => {
    setCurrentStep(3);
  };

  const handleSizeContinue = () => {
    if (selectedTeamSize && selectedCompanySize) {
      setCurrentStep(6);
    }
  };

  const handleSizeBack = () => {
    setCurrentStep(4);
  };

  const handleIndustryContinue = () => {
    if (selectedIndustry) {
      setCurrentStep(7);
    }
  };

  const handleIndustryBack = () => {
    setCurrentStep(5);
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
    setCurrentStep(6);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UserInfoStep
            firstName={firstName}
            lastName={lastName}
            businessName={businessName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onBusinessNameChange={setBusinessName}
            onContinue={handleUserInfoContinue}
            onBack={handleUserInfoBack}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <PurposeStep
            selectedPurpose={selectedPurpose}
            onSelect={setSelectedPurpose}
            onContinue={handlePurposeContinue}
            onBack={handlePurposeBack}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <RoleStep
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
            onContinue={handleRoleContinue}
            onBack={handleRoleBack}
            isLoading={isLoading}
          />
        );
      case 4:
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
      case 5:
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
      case 6:
        return (
          <IndustryStep
            selectedIndustry={selectedIndustry}
            onSelect={setSelectedIndustry}
            onComplete={handleIndustryContinue}
            onBack={handleIndustryBack}
            isLoading={isLoading}
          />
        );
      case 7:
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
