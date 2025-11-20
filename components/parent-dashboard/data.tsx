// components/parent-dashboard/data.ts
import { Play, Clock, Target } from "lucide-react";
import { Child, SessionDataPoint, FocusDataPoint, TopicDataPoint, ProgressMetrics, AISuggestion, Achievement } from "./types";

export const childrenData: Child[] = [
  { id: "alex", name: "Alex", age: 7, avatar: "👦", grade: "Grade 2" },
  { id: "emma", name: "Emma", age: 6, avatar: "👧", grade: "Grade 1" },
];

export const sessionData: SessionDataPoint[] = [
  { day: "Mon", minutes: 25 },
  { day: "Tue", minutes: 35 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 40 },
  { day: "Fri", minutes: 30 },
  { day: "Sat", minutes: 45 },
  { day: "Sun", minutes: 28 },
];

export const focusData: FocusDataPoint[] = [
  { day: "Mon", focus: 75 },
  { day: "Tue", focus: 85 },
  { day: "Wed", focus: 70 },
  { day: "Thu", focus: 90 },
  { day: "Fri", focus: 80 },
  { day: "Sat", focus: 95 },
  { day: "Sun", focus: 82 },
];

export const topicsData: TopicDataPoint[] = [
  { subject: "Math", completed: 12 },
  { subject: "Reading", completed: 8 },
  { subject: "Science", completed: 6 },
  { subject: "Art", completed: 10 },
];

export const progressMetrics: ProgressMetrics = {
  weeklyTime: 223,
  focusScore: 85,
  topicsCompleted: 36,
  streakDays: 5,
};

export const aiSuggestions: AISuggestion[] = [
  {
    title: "Increase Video Content",
    description: "Alex shows 40% better focus with video-based math lessons",
    priority: "high",
    icon: Play,
  },
  {
    title: "Morning Learning Sessions",
    description: "Peak attention observed between 9-11 AM",
    priority: "medium",
    icon: Clock,
  },
  {
    title: "Break Frequency",
    description: "Consider 5-minute breaks every 15 minutes",
    priority: "low",
    icon: Target,
  },
];

export const recentAchievements: Achievement[] = [
  { title: "Math Wizard", date: "2 days ago", icon: "🧮", color: "bg-blue-100" },
  { title: "Reading Star", date: "4 days ago", icon: "📚", color: "bg-green-100" },
  { title: "Focus Champion", date: "1 week ago", icon: "🎯", color: "bg-purple-100" },
];