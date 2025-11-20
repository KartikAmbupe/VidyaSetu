import { Clock, Brain, Target, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressMetrics } from "./types";

export const OverviewStats = ({ metrics }: { metrics: ProgressMetrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">Weekly Time</p>
          <p className="text-3xl font-bold text-gray-900">{Math.floor(metrics.weeklyTime / 60)}h {metrics.weeklyTime % 60}m</p>
          <p className="text-sm text-green-600 font-semibold mt-1">+15% from last week</p>
        </div>
        <Clock className="h-10 w-10 text-blue-500" />
      </CardContent>
    </Card>
    {/* Duplicate similar structure for Focus, Topics, Streak using the metrics prop... */}
    <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
            <div><p className="text-sm font-semibold text-gray-600 mb-1">Focus Score</p><p className="text-3xl font-bold text-gray-900">{metrics.focusScore}%</p><p className="text-sm text-green-600 font-semibold mt-1">Excellent level</p></div>
            <Brain className="h-10 w-10 text-green-500" />
        </CardContent>
    </Card>
    <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
            <div><p className="text-sm font-semibold text-gray-600 mb-1">Topics Completed</p><p className="text-3xl font-bold text-gray-900">{metrics.topicsCompleted}</p><p className="text-sm text-purple-600 font-semibold mt-1">This week</p></div>
            <Target className="h-10 w-10 text-purple-500" />
        </CardContent>
    </Card>
    <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
            <div><p className="text-sm font-semibold text-gray-600 mb-1">Learning Streak</p><p className="text-3xl font-bold text-gray-900">{metrics.streakDays} days</p><p className="text-sm text-orange-600 font-semibold mt-1">Keep it up! 🔥</p></div>
            <Award className="h-10 w-10 text-orange-500" />
        </CardContent>
    </Card>
  </div>
);