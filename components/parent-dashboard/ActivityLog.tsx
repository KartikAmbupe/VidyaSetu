import React from 'react';
import { CheckCircle2, Circle, BookOpen, Calculator } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- STATIC DATA: Only Learning Modules (English & Math) ---
const learningChecklist = [
  // ENGLISH MODULES
  {
    id: 1,
    subject: 'English Fun',
    module: 'Learn Letters',
    description: 'Master the alphabet from A to Z',
    status: 'Completed',
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    id: 2,
    subject: 'English Fun',
    module: 'Learn Verbs',
    description: 'Discover action words like run, jump',
    status: 'Completed',
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    id: 3,
    subject: 'English Fun',
    module: 'Learn Adjectives',
    description: 'Describe the world (big, small)',
    status: 'Pending', // Not done yet
    icon: BookOpen,
    color: 'text-gray-400', // Greyed out
    bgColor: 'bg-gray-100',
  },

  // MATH MODULES
  {
    id: 4,
    subject: 'Math Adventures',
    module: 'Learn Numbers',
    description: 'Get to know numbers 0-9',
    status: 'Completed',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 5,
    subject: 'Math Adventures',
    module: 'Addition',
    description: 'Learn how to add numbers together',
    status: 'Pending',
    icon: Calculator,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
  },
  {
    id: 6,
    subject: 'Math Adventures',
    module: 'Subtraction',
    description: 'Practice taking numbers away',
    status: 'Pending',
    icon: Calculator,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
  },
  {
    id: 7,
    subject: 'Math Adventures',
    module: 'Multiplication',
    description: 'Start multiplying with simple examples',
    status: 'Pending',
    icon: Calculator,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
  },
  {
    id: 8,
    subject: 'Math Adventures',
    module: 'Division',
    description: 'Understand how to share things',
    status: 'Pending',
    icon: Calculator,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
  },
];

export function ActivityLog() {
  return (
    // FIX: Removed 'h-full' from className below
    <Card className="shadow-sm border-t-4 border-t-indigo-500">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-indigo-500" /> 
          Learning Roadmap Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {/* Limited height to 500px, scrolls if list is longer */}
        <div className="flex flex-col max-h-[500px] overflow-y-auto pr-2">
          {learningChecklist.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors group">
              <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div className={`p-3 rounded-xl ${task.bgColor}`}>
                  <task.icon className={`h-6 w-6 ${task.color}`} />
                </div>
                
                {/* Text Info */}
                <div>
                  <h4 className={`font-bold text-lg ${task.status === 'Completed' ? 'text-slate-800' : 'text-slate-400'}`}>
                    {task.module}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">{task.subject}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge - Pure Checklist Style */}
              <div className="flex items-center gap-3">
                {task.status === 'Completed' ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 px-3 py-1 flex gap-1">
                        <CheckCircle2 size={14} /> Done
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200 px-3 py-1 flex gap-1">
                        <Circle size={14} /> To Do
                    </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}