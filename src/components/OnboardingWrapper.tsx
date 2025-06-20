
import React, { useState, useEffect } from 'react';
import { useAuthContext } from './AuthProvider';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children }) => {
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

  // Don't render anything while checking onboarding status
  if (user && hasCompletedOnboarding === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingWrapper;
