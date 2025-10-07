"use client"

import { useState } from "react"
import {
  BarChart3,
  Clock,
  Target,
  Settings,
  Plus,
  Eye,
  Brain,
  BookOpen,
  Play,
  Award,
  TrendingUp,
  Users,
  Lightbulb,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("alex")
  const [timeRange, setTimeRange] = useState("week")
  const [dailyTimeGoal, setDailyTimeGoal] = useState([30])
  // const [formatPreferences, setFormatPreferences] = useState({
  //   videos: true,
  //   games: true,
  //   reading: true,
  //   stories: true,
  // })

  const children = [
    { id: "alex", name: "Alex", age: 7, avatar: "👦", grade: "Grade 2" },
    { id: "emma", name: "Emma", age: 6, avatar: "👧", grade: "Grade 1" },
  ]

  const currentChild = children.find((child) => child.id === selectedChild) || children[0]

  // Sample data for charts
  const sessionData = [
    { day: "Mon", minutes: 25 },
    { day: "Tue", minutes: 35 },
    { day: "Wed", minutes: 20 },
    { day: "Thu", minutes: 40 },
    { day: "Fri", minutes: 30 },
    { day: "Sat", minutes: 45 },
    { day: "Sun", minutes: 28 },
  ]

  const focusData = [
    { day: "Mon", focus: 75 },
    { day: "Tue", focus: 85 },
    { day: "Wed", focus: 70 },
    { day: "Thu", focus: 90 },
    { day: "Fri", focus: 80 },
    { day: "Sat", focus: 95 },
    { day: "Sun", focus: 82 },
  ]

  const topicsData = [
    { subject: "Math", completed: 12 },
    { subject: "Reading", completed: 8 },
    { subject: "Science", completed: 6 },
    { subject: "Art", completed: 10 },
  ]

  const engagementData = [
    { name: "Videos", value: 45, color: "#ef4444" },
    { name: "Games", value: 35, color: "#22c55e" },
    { name: "Reading", value: 15, color: "#3b82f6" },
    { name: "Stories", value: 5, color: "#a855f7" },
  ]

  const progressData = {
    weeklyTime: 223, // minutes
    focusScore: 85,
    topicsCompleted: 36,
    streakDays: 5,
  }

  const aiSuggestions = [
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
  ]

  const recentAchievements = [
    { title: "Math Wizard", date: "2 days ago", icon: "🧮", color: "bg-blue-100" },
    { title: "Reading Star", date: "4 days ago", icon: "📚", color: "bg-green-100" },
    { title: "Focus Champion", date: "1 week ago", icon: "🎯", color: "bg-purple-100" },
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b-2 border-blue-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🌟 VidyaSetu Parent Dashboard
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                      <SelectTrigger className="w-56 h-12 text-lg font-semibold border-2 border-blue-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {children.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{child.avatar}</span>
                              <div>
                                <span className="font-semibold">{child.name}</span>
                                <span className="text-sm text-gray-500 ml-2">({child.grade})</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select which child's progress to view</p>
                  </TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-green-200 hover:bg-green-50 bg-transparent"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Child
                </Button>

                <Button variant="outline" size="lg" className="border-2 border-gray-200 bg-transparent">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Weekly Time</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.floor(progressData.weeklyTime / 60)}h {progressData.weeklyTime % 60}m
                    </p>
                    <p className="text-sm text-green-600 font-semibold mt-1">+15% from last week</p>
                  </div>
                  <Clock className="h-10 w-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Focus Score</p>
                    <p className="text-3xl font-bold text-gray-900">{progressData.focusScore}%</p>
                    <p className="text-sm text-green-600 font-semibold mt-1">Excellent level</p>
                  </div>
                  <Brain className="h-10 w-10 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Topics Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{progressData.topicsCompleted}</p>
                    <p className="text-sm text-purple-600 font-semibold mt-1">This week</p>
                  </div>
                  <Target className="h-10 w-10 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Learning Streak</p>
                    <p className="text-3xl font-bold text-gray-900">{progressData.streakDays} days</p>
                    <p className="text-sm text-orange-600 font-semibold mt-1">Keep it up! 🔥</p>
                  </div>
                  <Award className="h-10 w-10 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Session Time Chart */}
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <BarChart3 className="h-6 w-6" />
                    <span>Daily Session Time</span>
                  </CardTitle>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sessionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Focus Level Chart */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <TrendingUp className="h-6 w-6" />
                    <span>Focus Level Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={focusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Line
                        type="monotone"
                        dataKey="focus"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Topics Completed */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <BookOpen className="h-6 w-6" />
                    <span>Topics Completed by Subject</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topicsData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="subject" type="category" />
                      <Bar dataKey="completed" fill="#a855f7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Format Engagement */}
              {/* <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <Eye className="h-6 w-6" />
                    <span>Learning Format Engagement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                      {engagementData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          <span className="text-lg font-bold">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* AI Suggestions */}
              <Card className="shadow-lg border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    <span>AI-Powered Insights & Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiSuggestions.map((suggestion, index) => {
                      const IconComponent = suggestion.icon
                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="p-3 bg-white rounded-full shadow-sm">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-bold text-lg">{suggestion.title}</h4>
                              <Badge
                                variant={
                                  suggestion.priority === "high"
                                    ? "destructive"
                                    : suggestion.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-sm font-semibold"
                              >
                                {suggestion.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600 font-medium">{suggestion.description}</p>
                          </div>
                          <Button variant="outline" size="sm" className="font-semibold bg-transparent">
                            Apply
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Child Profile */}
              <Card className="shadow-lg border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Child Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg">
                      {currentChild.avatar}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{currentChild.name}</h3>
                      <p className="text-gray-600 font-semibold">{currentChild.age} years old</p>
                      <p className="text-blue-600 font-semibold">{currentChild.grade}</p>
                    </div>
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">Learning Level:</span>
                        <span className="font-bold text-blue-600">Intermediate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">Preferred Format:</span>
                        <span className="font-bold text-green-600">Visual</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">Focus Duration:</span>
                        <span className="font-bold text-purple-600">15-20 min</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="shadow-lg border-2 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAchievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 p-4 ${achievement.color} rounded-xl border-2 border-opacity-50`}
                      >
                        <span className="text-3xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{achievement.title}</p>
                          <p className="text-xs text-gray-600 font-semibold">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Goal Setting */}
              <Card className="shadow-lg border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sliders className="h-5 w-5 text-green-500" />
                    <span>Set the Time Goal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold">Daily Time Goal</span>
                      <span className="text-lg font-bold text-green-600">{dailyTimeGoal[0]} min</span>
                    </div>
                    <Slider
                      value={dailyTimeGoal}
                      onValueChange={setDailyTimeGoal}
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

                  {/* <div> */}
                    {/* <h4 className="font-bold mb-4">Format Preferences</h4>
                    <div className="space-y-3">
                      {Object.entries(formatPreferences).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="font-semibold capitalize">{key}</span>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => setFormatPreferences((prev) => ({ ...prev, [key]: checked }))}
                          />
                        </div>
                      ))}
                    </div> */}
                  {/* </div> */}

                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold">
                    Set Timing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
