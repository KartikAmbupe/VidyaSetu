"use client"

import { useState } from "react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings } from "lucide-react";

import { OverviewStats } from "./parent-dashboard/OverviewStats";
import { AIInsights } from "./parent-dashboard/AIInsights"; 
import { ChildProfile, AchievementList, GoalSetter } from "./parent-dashboard/SidebarContent";
import { SessionChart } from "./parent-dashboard/charts/SessionChart";
import { FocusChart } from "./parent-dashboard/charts/FocusChart";
import { TopicChart } from "./parent-dashboard/charts/TopicChart";

import { 
    childrenData, 
    sessionData, 
    focusData, 
    topicsData, 
    progressMetrics, 
    aiSuggestions, 
    recentAchievements 
} from "./parent-dashboard/data";

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("alex");
  const [timeRange, setTimeRange] = useState("week");
  const [dailyTimeGoal, setDailyTimeGoal] = useState([30]);

  const currentChild = childrenData.find((child) => child.id === selectedChild) || childrenData[0];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        
        {/* HEADER (Merged directly here so it scrolls) */}
        <header className="bg-white shadow-sm border-b-2 border-blue-200">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌟 VidyaSetu Parent Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                    <SelectTrigger className="w-56 h-12 text-lg font-semibold border-2 border-blue-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {childrenData.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                            <div className="flex items-center space-x-3"><span className="text-2xl">{child.avatar}</span><div><span className="font-semibold">{child.name}</span><span className="text-sm text-gray-500 ml-2">({child.grade})</span></div></div>
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </TooltipTrigger>
                <TooltipContent><p>Select which child's progress to view</p></TooltipContent>
                </Tooltip>
                <Button variant="outline" size="lg" className="border-2 border-green-200 hover:bg-green-50 bg-transparent"><Plus className="h-5 w-5 mr-2" /> Add Child</Button>
                <Button variant="outline" size="lg" className="border-2 border-gray-200 bg-transparent"><Settings className="h-5 w-5" /></Button>
            </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          
          <OverviewStats metrics={progressMetrics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              <SessionChart data={sessionData} timeRange={timeRange} setTimeRange={setTimeRange} />
              <FocusChart data={focusData} />
              <TopicChart data={topicsData} />
              <AIInsights suggestions={aiSuggestions} />
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              <ChildProfile child={currentChild} />
              <AchievementList achievements={recentAchievements} />
              <GoalSetter goal={dailyTimeGoal} setGoal={setDailyTimeGoal} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}