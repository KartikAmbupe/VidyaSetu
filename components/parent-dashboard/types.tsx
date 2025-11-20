// components/parent-dashboard/types.ts
import { LucideIcon } from "lucide-react";

export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  grade: string;
}

export interface SessionDataPoint {
  day: string;
  minutes: number;
}

export interface FocusDataPoint {
  day: string;
  focus: number;
}

export interface TopicDataPoint {
  subject: string;
  completed: number;
}

export interface ProgressMetrics {
  weeklyTime: number;
  focusScore: number;
  topicsCompleted: number;
  streakDays: number;
}

export interface AISuggestion {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  icon: LucideIcon;
}

export interface Achievement {
  title: string;
  date: string;
  icon: string;
  color: string;
}