
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface CompanyInfoStepProps {
  industry: string;
  jobRole: string;
  onIndustryChange: (industry: string) => void;
  onJobRoleChange: (jobRole: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isLoading: boolean;
}

export const CompanyInfoStep = ({ 
  industry, 
  jobRole, 
  onIndustryChange, 
  onJobRoleChange, 
  onBack, 
  onContinue, 
  isLoading 
}: CompanyInfoStepProps) => {
  const [industryFocused, setIndustryFocused] = useState(false);
  const [jobRoleFocused, setJobRoleFocused] = useState(false);

  const clearIndustry = () => {
    onIndustryChange("");
  };

  const clearJobRole = () => {
    onJobRoleChange("");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Industry Input */}
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-gray-900">
            What industry is your company in?
          </h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Professional Training and Coaching"
              value={industry}
              onChange={(e) => onIndustryChange(e.target.value)}
              onFocus={() => setIndustryFocused(true)}
              onBlur={() => setIndustryFocused(false)}
              disabled={isLoading}
              className="pl-10 pr-10 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {industry && (
              <button
                onClick={clearIndustry}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Job Role Input */}
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-gray-900">
            What is your job role?
          </h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Creative Director"
              value={jobRole}
              onChange={(e) => onJobRoleChange(e.target.value)}
              onFocus={() => setJobRoleFocused(true)}
              onBlur={() => setJobRoleFocused(false)}
              disabled={isLoading}
              className="pl-10 pr-10 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {jobRole && (
              <button
                onClick={clearJobRole}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
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
          onClick={onContinue}
          disabled={!industry.trim() || !jobRole.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
