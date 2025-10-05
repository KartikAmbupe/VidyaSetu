"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChildDashboard } from "@/components/child-dashboard"
import { ParentDashboard } from "@/components/parent-dashboard"

export default function VidyaSetuDashboard() {
  const [activeTab, setActiveTab] = useState("child")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-purple-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-1">
              <TabsTrigger
                value="child"
                className="text-lg font-bold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
              >
                🧒 Child View
              </TabsTrigger>
              <TabsTrigger
                value="parent"
                className="text-lg font-bold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
              >
                👨‍👩‍👧 Parent View
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="child" className="mt-0">
          <ChildDashboard />
        </TabsContent>

        <TabsContent value="parent" className="mt-0">
          <ParentDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
