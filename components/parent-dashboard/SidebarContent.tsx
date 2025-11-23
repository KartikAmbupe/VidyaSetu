import { Users, Award, Sliders } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Child, Achievement } from "./types";
import React from "react";

export const ChildProfile = ({ child }: { child: Child }) => (
  <Card className="shadow-lg border-2 border-purple-200">
    <CardHeader><CardTitle className="flex items-center space-x-2"><Users className="h-5 w-5" /><span>Child Profile</span></CardTitle></CardHeader>
    <CardContent>
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg">{child.avatar}</div>
        <div><h3 className="text-2xl font-bold">{child.name}</h3><p className="text-gray-600 font-semibold">{child.age} years old</p><p className="text-blue-600 font-semibold">{child.grade}</p></div>
        <div className="space-y-3 text-left">
            <div className="flex justify-between text-sm"><span className="font-semibold">Learning Level:</span><span className="font-bold text-blue-600">Intermediate</span></div>
            <div className="flex justify-between text-sm"><span className="font-semibold">Preferred Format:</span><span className="font-bold text-green-600">Visual</span></div>
            <div className="flex justify-between text-sm"><span className="font-semibold">Focus Duration:</span><span className="font-bold text-purple-600">15-20 min</span></div>
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">Edit Profile</Button>
      </div>
    </CardContent>
  </Card>
);

export const AchievementList = ({ achievements }: { achievements: Achievement[] }) => (
  <Card className="shadow-lg border-2 border-yellow-200">
    <CardHeader><CardTitle className="flex items-center space-x-2"><Award className="h-5 w-5 text-yellow-500" /><span>Recent Achievements</span></CardTitle></CardHeader>
    <CardContent>
      <div className="space-y-4">
        {achievements.map((ach, i) => (
          <div key={i} className={`flex items-center space-x-4 p-4 ${ach.color} rounded-xl border-2 border-opacity-50`}>
            <span className="text-3xl">{ach.icon}</span>
            <div className="flex-1"><p className="font-bold text-sm">{ach.title}</p><p className="text-xs text-gray-600 font-semibold">{ach.date}</p></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// export const GoalSetter = ({ goal, setGoal }: { goal: number[], setGoal: (val: number[]) => void }) => (
//   <Card className="shadow-lg border-2 border-green-200">
//     <CardHeader><CardTitle className="flex items-center space-x-2"><Sliders className="h-5 w-5 text-green-500" /><span>Set Time Goal</span></CardTitle></CardHeader>
//     <CardContent className="space-y-6">
//       <div>
//         <div className="flex justify-between items-center mb-3"><span className="text-sm font-bold">Daily Time Goal</span><span className="text-lg font-bold text-green-600">{goal[0]} min</span></div>
//         <Slider value={goal} onValueChange={setGoal} max={60} min={15} step={5} className="w-full" />
//         <div className="flex justify-between text-xs text-gray-500 mt-1"><span>15 min</span><span>60 min</span></div>
//       </div>
//       <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold">Set Timing</Button>
//     </CardContent>
//   </Card>
// );
export const GoalSetter = ({
  goal,
  setGoal,
}: {
  goal: number[];
  setGoal: (val: number[]) => void;
}) => {
  // Optional: loading state for button feedback
  const [saving, setSaving] = React.useState(false);

  async function updateTimeLimit() {
    setSaving(true);

    try {
      await fetch("/api/parent/update-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: "654c6014e760c41d117462fa", // Sam's ID from your seed script
          dailyTimeLimit: goal[0],             // slider value
        }),
      });

      alert("Daily time limit updated!");
    } catch (err) {
      alert("Error updating time limit.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="shadow-lg border-2 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-green-500" />
          <span>Set Time Goal</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold">Daily Time Goal</span>
            <span className="text-lg font-bold text-green-600">
              {goal[0]} min
            </span>
          </div>

          <Slider
            value={goal}
            onValueChange={setGoal}
            max={60}
            min={15}
            step={5}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>15 min</span>
            <span>60 min</span>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold"
          onClick={updateTimeLimit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Set Timing"}
        </Button>
      </CardContent>
    </Card>
  );
};
