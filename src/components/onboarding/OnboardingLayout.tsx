
import { Card } from "@/components/ui/card";
import { OnboardingDecorations } from "./OnboardingDecorations";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
            </div>
            <span className="text-2xl font-bold text-slate-800 ml-4 tracking-tight">ai design CRM</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to your workspace</h1>
            <p className="text-lg text-slate-600 font-medium">Let's get you set up in just a few steps</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-0 bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="p-10">
            {children}
          </div>
        </Card>

        <OnboardingDecorations />
      </div>
    </div>
  );
};
