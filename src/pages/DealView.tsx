import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, Handshake, Building2, Percent, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserInfo } from "@/components/UserInfo";
import { Deal } from "@/hooks/useDeals";
import { formatGBP } from "@/lib/utils";

const DealView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('deals')
          .select(`
            *,
            customer:customers(name)
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Deal not found');
        }

        setDeal(data);
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching the deal.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospecting":
        return "bg-gray-100 text-gray-700";
      case "Qualification":
        return "bg-blue-100 text-blue-700";
      case "Proposal":
        return "bg-yellow-100 text-yellow-700";
      case "Negotiation":
        return "bg-purple-100 text-purple-700";
      case "Closed Won":
        return "bg-green-100 text-green-700";
      case "Closed Lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <Button variant="ghost" onClick={() => navigate('/deals')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Deals
            </Button>
          </div>
          <UserInfo />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <Button variant="ghost" onClick={() => navigate('/deals')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Deals
            </Button>
          </div>
          <UserInfo />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">{error || "Deal not found"}</p>
        </div>
      </div>
    );
  }

  const stageColor = getStageColor(deal.stage);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Button variant="ghost" onClick={() => navigate('/deals')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Deals
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <UserInfo />
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Deal
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{deal.title}</CardTitle>
          <CardDescription>
            <Badge className={stageColor}>{deal.stage}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Customer</div>
              <div className="text-gray-600">
                {deal.customer?.name || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Value</div>
              <div className="text-gray-600">
                <Handshake className="mr-2 inline-block h-4 w-4" />
                {formatGBP(deal.value)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Close Date</div>
              <div className="text-gray-600">
                <Calendar className="mr-2 inline-block h-4 w-4" />
                {deal.close_date ? new Date(deal.close_date).toLocaleDateString() : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Probability</div>
              <div className="text-gray-600">
                <Percent className="mr-2 inline-block h-4 w-4" />
                {deal.probability}%
              </div>
            </div>
          </div>

          {deal.user_id && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Created by</div>
                <div className="text-gray-600">
                  <User className="mr-2 inline-block h-4 w-4" />
                  {deal.user_id.substring(0, 8)}...
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DealView;
