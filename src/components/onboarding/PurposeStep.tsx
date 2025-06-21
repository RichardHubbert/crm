
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PurposeOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const purposeOptions: PurposeOption[] = [
  {
    id: "work",
    title: "Work",
    description: "Managing business relationships and deals",
    icon: "💼"
  },
  {
    id: "personal",
    title: "Personal",
    description: "Organizing personal contacts and activities",
    icon: "👤"
  },
  {
    id: "school",
    title: "School",
    description: "Academic projects and networking",
    icon: "🎓"
  },
  {
    id: "nonprofits",
    title: "Non-profits",
    description: "Community outreach and donor management",
    icon: "🤝"
  }
];

interface PurposeStepProps {
  selectedPurpose: string | null;
  onSelect: (purpose: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const PurposeStep = ({
  selectedPurpose,
  onSelect,
  onContinue,
  onBack,
  isLoading,
}: PurposeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          What will you primarily use this CRM for?
        </h2>
        <p className="text-gray-600">
          This helps us customize your experience and suggest relevant features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {purposeOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPurpose === option.id
                ? "ring-2 ring-teal-500 border-teal-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(option.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">{option.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
              <p className="text-gray-600 text-sm">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={!selectedPurpose || isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};
