import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AISuggestion } from "./types";

export const AIInsights = ({ suggestions }: { suggestions: AISuggestion[] }) => (
  <Card className="shadow-lg border-2 border-blue-200">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2 text-xl"><Lightbulb className="h-6 w-6 text-yellow-500" /><span>AI-Powered Insights</span></CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100 hover:shadow-md transition-all">
              <div className="p-3 bg-white rounded-full shadow-sm"><IconComponent className="h-6 w-6 text-blue-600" /></div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-bold text-lg">{suggestion.title}</h4>
                  <Badge variant={suggestion.priority === "high" ? "destructive" : suggestion.priority === "medium" ? "default" : "secondary"}>{suggestion.priority.toUpperCase()}</Badge>
                </div>
                <p className="text-gray-600 font-medium">{suggestion.description}</p>
              </div>
              <Button variant="outline" size="sm" className="font-semibold bg-transparent">Apply</Button>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);