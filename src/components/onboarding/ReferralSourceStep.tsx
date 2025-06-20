
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { referralSourceOptions } from "@/data/onboardingOptions";

interface ReferralSourceStepProps {
  selectedSources: string[];
  onSelect: (sources: string[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const ReferralSourceStep = ({ selectedSources, onSelect, onComplete, onBack, isLoading }: ReferralSourceStepProps) => {
  const handleSourceToggle = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      onSelect(selectedSources.filter(id => id !== sourceId));
    } else {
      onSelect([...selectedSources, sourceId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-medium text-gray-900">
          How did you hear about us?
        </h1>
        <p className="text-gray-600">
          Select all that apply (optional)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {referralSourceOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSourceToggle(option.id)}
            disabled={isLoading}
            className={`
              px-4 py-3 rounded-lg border text-left font-medium transition-all
              ${selectedSources.includes(option.id)
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

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          disabled={isLoading}
          variant="outline"
          className="px-6 text-gray-600 border-gray-300 hover:bg-gray-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={onComplete}
          disabled={isLoading}
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
              Complete
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
