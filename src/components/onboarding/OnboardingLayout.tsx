
import { Card } from "@/components/ui/card";
import { OnboardingDecorations } from "./OnboardingDecorations";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900 ml-3">ai design CRM</span>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-8 bg-white shadow-sm">
          {children}
        </Card>

        <OnboardingDecorations />
      </div>
    </div>
  );
};
