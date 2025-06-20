
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { industryOptions } from "@/data/onboardingOptions";

interface IndustryStepProps {
  selectedIndustry: string | null;
  onSelect: (industry: string) => void;
  onComplete: () => void;
  isLoading: boolean;
}

export const IndustryStep = ({ selectedIndustry, onSelect, onComplete, isLoading }: IndustryStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-medium text-gray-900">
          What industry are you in?
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {industryOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={isLoading}
            className={`
              px-4 py-3 rounded-lg border text-center font-medium transition-all
              ${selectedIndustry === option.id
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
          onClick={onComplete}
          disabled={!selectedIndustry || isLoading}
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
              Complete Setup
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
