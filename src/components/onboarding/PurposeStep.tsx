
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { purposeOptions } from "@/data/onboardingOptions";

interface PurposeStepProps {
  selectedPurpose: string | null;
  onSelect: (purpose: string) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export const PurposeStep = ({ selectedPurpose, onSelect, onContinue, isLoading }: PurposeStepProps) => {
  return (
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
            onClick={() => onSelect(option.id)}
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
          onClick={onContinue}
          disabled={!selectedPurpose || isLoading}
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
