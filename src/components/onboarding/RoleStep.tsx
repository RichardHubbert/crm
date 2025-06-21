
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoleOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "sales_manager",
    title: "Sales Manager",
    description: "Leading sales teams and managing deals",
    icon: "📊"
  },
  {
    id: "sales_rep",
    title: "Sales Representative",
    description: "Direct sales and customer relationships",
    icon: "🎯"
  },
  {
    id: "business_owner",
    title: "Business Owner",
    description: "Running and growing your business",
    icon: "👔"
  },
  {
    id: "team_member",
    title: "Team Member",
    description: "Contributing to team goals and projects",
    icon: "🤝"
  },
  {
    id: "other",
    title: "Other",
    description: "Different role or multiple responsibilities",
    icon: "⚡"
  }
];

interface RoleStepProps {
  selectedRole: string | null;
  onSelect: (role: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const RoleStep = ({
  selectedRole,
  onSelect,
  onContinue,
  onBack,
  isLoading,
}: RoleStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          What's your role?
        </h2>
        <p className="text-gray-600">
          Understanding your role helps us tailor the features and workflows for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roleOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === option.id
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
          disabled={!selectedRole || isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};
