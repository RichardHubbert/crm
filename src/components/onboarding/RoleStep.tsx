
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { roleOptions } from "@/data/onboardingOptions";

interface RoleStepProps {
  selectedRole: string | null;
  onSelect: (role: string) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export const RoleStep = ({ selectedRole, onSelect, onContinue, isLoading }: RoleStepProps) => {
  return (
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
              onClick={() => onSelect(option.id)}
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
              onClick={() => onSelect(option.id)}
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
          onClick={onContinue}
          disabled={!selectedRole || isLoading}
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
