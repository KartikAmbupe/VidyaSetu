"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, BookOpen, Calculator } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- STATIC CHECKLIST STRUCTURE: Only Learning Modules (English & Math) ---
const learningChecklist = [
  // ENGLISH MODULES
  {
    id: 1,
    subject: 'English Fun',
    module: 'Learn Letters',
    description: 'Master the alphabet from A to Z',
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    id: 2,
    subject: 'English Fun',
    module: 'Learn Verbs',
    description: 'Discover action words like run, jump',
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    id: 3,
    subject: 'English Fun',
    module: 'Learn Adjectives',
    description: 'Describe the world (big, small)',
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },

  // MATH MODULES
  {
    id: 4,
    subject: 'Math Adventures',
    module: 'Learn Numbers',
    description: 'Get to know numbers 0-9',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 5,
    subject: 'Math Adventures',
    module: 'Addition',
    description: 'Learn how to add numbers together',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 6,
    subject: 'Math Adventures',
    module: 'Subtraction',
    description: 'Practice taking numbers away',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 7,
    subject: 'Math Adventures',
    module: 'Multiplication',
    description: 'Start multiplying with simple examples',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 8,
    subject: 'Math Adventures',
    module: 'Division',
    description: 'Understand how to share things',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
];

interface ActivityLogProps {
  childId?: string;
}

export function ActivityLog({ childId = "654c6014e760c41d117462fa" }: ActivityLogProps) {
  const [completionMap, setCompletionMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompletions() {
      try {
        const response = await fetch(`/api/module/completions?childId=${childId}`);
        const data = await response.json();
        if (data.success && data.completionMap) {
          setCompletionMap(data.completionMap);
        }
      } catch (error) {
        console.error("Failed to fetch module completions:", error);
      } finally {
        setLoading(false);
      }
    }

    if (childId) {
      fetchCompletions();
    }
  }, [childId]);

  const getModuleStatus = (subject: string, module: string): 'Completed' | 'Pending' => {
    const key = `${subject}|${module}`;
    return completionMap[key] ? 'Completed' : 'Pending';
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-indigo-500" /> 
            Learning Roadmap Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex items-center justify-center p-8">
            <p className="text-slate-500">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
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
          {learningChecklist.map((task) => {
            const status = getModuleStatus(task.subject, task.module);
            return (
              <div key={task.id} className="flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors group">
                <div className="flex items-center gap-4">
                  {/* Icon Box */}
                  <div className={`p-3 rounded-xl ${task.bgColor}`}>
                    <task.icon className={`h-6 w-6 ${status === 'Completed' ? task.color : 'text-gray-400'}`} />
                  </div>
                  
                  {/* Text Info */}
                  <div>
                    <h4 className={`font-bold text-lg ${status === 'Completed' ? 'text-slate-800' : 'text-slate-400'}`}>
                      {task.module}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">{task.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge - Pure Checklist Style */}
                <div className="flex items-center gap-3">
                  {status === 'Completed' ? (
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}