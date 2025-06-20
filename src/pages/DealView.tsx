
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Mail, User, DollarSign, Target, MoreHorizontal } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";

const DealView = () => {
  const { id } = useParams();
  const { deals } = useDeals();
  
  // For demo purposes, we'll use the first deal or create a mock deal
  const deal = deals.find(d => d.id === id) || {
    id: "1",
    title: "Moon Inc. deal",
    customer: { name: "Daphne Glück" },
    value: 119000,
    stage: "Proposal",
    probability: 75,
    close_date: "2024-03-15"
  };

  const stages = [
    { name: "Lead", status: "completed", color: "bg-teal-600" },
    { name: "Qualified lead", status: "completed", color: "bg-teal-600" },
    { name: "Proposal", status: "current", color: "bg-teal-600" },
    { name: "Negotiation", status: "pending", color: "bg-gray-300" },
    { name: "Contract sent", status: "pending", color: "bg-gray-300" },
    { name: "Closed", status: "pending", color: "bg-gray-300" }
  ];

  const activities = [
    {
      type: "meeting",
      icon: Calendar,
      title: "Meeting",
      subtitle: "with Nate G.",
      time: "2 hours ago",
      color: "bg-teal-500"
    },
    {
      type: "email",
      icon: Mail,
      title: "Email",
      subtitle: "from Florence Hugh",
      description: "Re: Thanks for contacting me!",
      time: "1 day ago",
      color: "bg-blue-500"
    }
  ];

  const conversionData = [
    { stage: "Qualified", value: 40, height: "h-8" },
    { stage: "Proposal", value: 80, height: "h-16" },
    { stage: "Negotiation", value: 60, height: "h-12" },
    { stage: "Won", value: 45, height: "h-10" }
  ];

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold text-gray-900">{deal.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Deal Stages and Deal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deal Stages */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-700">Deal stages</CardTitle>
              <div className="flex space-x-2">
                <Badge className="bg-green-500 hover:bg-green-600 text-white">Won</Badge>
                <Badge className="bg-red-500 hover:bg-red-600 text-white">Lost</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center">
                    <div className={`px-4 py-2 text-sm font-medium text-white rounded-l-lg ${
                      index === stages.length - 1 ? 'rounded-r-lg' : ''
                    } ${stage.color} ${stage.status === 'current' ? 'relative' : ''}`}>
                      {stage.name}
                    </div>
                    {index < stages.length - 1 && (
                      <div className="w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-gray-300 border-b-8 border-b-gray-300 relative -ml-2 z-10"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deal Info and Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deal Info */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-700">Deal info</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact name</label>
                  <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{deal.customer?.name}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Deal value</label>
                  <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">${deal.value.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emails & Activities */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-700">Emails & activities</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <activity.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{activity.title}</span>
                        <span className="text-sm text-gray-500">{activity.subtitle}</span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Q1 Goals and Funnel */}
        <div className="space-y-6">
          {/* Q1 Goals */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Q1 goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-500">$8.12M</div>
                <div className="text-sm text-gray-500">Goal $10.54M</div>
                <Progress value={77} className="mt-3 h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Funnel Chart */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end justify-between space-x-2 h-24">
                  {conversionData.map((item, index) => (
                    <div key={item.stage} className="flex-1 flex flex-col items-center">
                      <div className={`w-full ${item.height} bg-teal-500 rounded-t-sm mb-2`}></div>
                      <span className="text-xs text-gray-600 text-center">{item.stage}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">38%</div>
                  <div className="text-sm text-gray-500">Conversion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealView;
