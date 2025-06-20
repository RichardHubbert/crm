
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { teamSizeOptions, companySizeOptions } from "@/data/onboardingOptions";

interface SizeStepProps {
  selectedTeamSize: string | null;
  selectedCompanySize: string | null;
  onSelectTeamSize: (size: string) => void;
  onSelectCompanySize: (size: string) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export const SizeStep = ({ 
  selectedTeamSize, 
  selectedCompanySize, 
  onSelectTeamSize, 
  onSelectCompanySize, 
  onContinue, 
  isLoading 
}: SizeStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-medium text-gray-900">
          How big is your team?
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {teamSizeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectTeamSize(option.id)}
            disabled={isLoading}
            className={`
              px-4 py-3 rounded-full border text-center font-medium transition-all
              ${selectedTeamSize === option.id
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

      <div className="text-center space-y-4">
        <h1 className="text-2xl font-medium text-gray-900">
          How big is your company?
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {companySizeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectCompanySize(option.id)}
            disabled={isLoading}
            className={`
              px-4 py-3 rounded-full border text-center font-medium transition-all
              ${selectedCompanySize === option.id
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
          onClick={onContinue}
          disabled={!selectedTeamSize || !selectedCompanySize || isLoading}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6"
          variant="secondary"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
