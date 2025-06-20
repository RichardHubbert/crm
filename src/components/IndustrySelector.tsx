
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Briefcase, 
  Building2, 
  Code, 
  Megaphone, 
  Settings, 
  DollarSign, 
  ShoppingBag, 
  Heart, 
  MoreHorizontal 
} from "lucide-react";

const industries = [
  {
    id: "business-services",
    name: "Business services",
    icon: Briefcase,
    color: "text-teal-600"
  },
  {
    id: "real-estate",
    name: "Real estate",
    icon: Building2,
    color: "text-blue-600"
  },
  {
    id: "software-it",
    name: "Software & IT services",
    icon: Code,
    color: "text-cyan-600"
  },
  {
    id: "media-communications",
    name: "Media & communications",
    icon: Megaphone,
    color: "text-teal-600"
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: Settings,
    color: "text-teal-600"
  },
  {
    id: "financial-services",
    name: "Financial services",
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    id: "consumer-goods",
    name: "Consumer goods",
    icon: ShoppingBag,
    color: "text-teal-600"
  },
  {
    id: "healthcare",
    name: "Healthcare services",
    icon: Heart,
    color: "text-blue-600"
  },
  {
    id: "other",
    name: "Other",
    icon: MoreHorizontal,
    color: "text-teal-600"
  }
];

export const IndustrySelector = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 max-w-7xl mx-auto">
      {industries.map((industry) => {
        const Icon = industry.icon;
        const isSelected = selectedIndustry === industry.id;
        
        return (
          <Card
            key={industry.id}
            className={`
              p-6 cursor-pointer transition-all duration-200 hover:shadow-md
              ${isSelected 
                ? 'border-2 border-teal-400 bg-teal-50' 
                : 'border border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => setSelectedIndustry(industry.id)}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-lg bg-gray-50 ${isSelected ? 'bg-teal-100' : ''}`}>
                <Icon className={`w-6 h-6 ${industry.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-900 leading-tight">
                {industry.name}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
