
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { referralSourceOptions } from "@/data/onboardingOptions";

interface ReferralSourceStepProps {
  selectedSources: string[];
  onSelect: (sources: string[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const ReferralSourceStep = ({ 
  selectedSources, 
  onSelect, 
  onComplete, 
  onBack, 
  isLoading 
}: ReferralSourceStepProps) => {
  const handleSourceToggle = (sourceId: string) => {
    const updatedSources = selectedSources.includes(sourceId)
      ? selectedSources.filter(id => id !== sourceId)
      : [...selectedSources, sourceId];
    onSelect(updatedSources);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-medium text-gray-900">
          One last question, how did you hear about us?
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {referralSourceOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <Checkbox
              id={option.id}
              checked={selectedSources.includes(option.id)}
              onCheckedChange={() => handleSourceToggle(option.id)}
              disabled={isLoading}
              className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
            />
            <label
              htmlFor={option.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
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
          className="bg-blue-600 text-white hover:bg-blue-700 px-6"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
  );
};
