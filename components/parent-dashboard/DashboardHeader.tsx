import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Child } from "./types";

interface HeaderProps {
  selectedChild: string;
  setSelectedChild: (id: string) => void;
  children: Child[];
}

export const DashboardHeader = ({ selectedChild, setSelectedChild, children }: HeaderProps) => (
  <header className="bg-white shadow-sm border-b-2 border-blue-200 sticky top-16 z-40">
    <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🌟 VidyaSetu Parent Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="w-56 h-12 text-lg font-semibold border-2 border-blue-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {children.map((child) => (
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
);