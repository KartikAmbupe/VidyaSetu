"use client"

import { useState } from "react"
import {
  Star,
  Play,
  BookOpen,
  Gamepad2,
  Award,
  Settings,
  LogOut,
  Smile,
  Meh,
  Frown,
  Heart,
  User,
  Volume2,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ChildDashboard() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [clickedButton, setClickedButton] = useState<string | null>(null)
  const [xpCount, setXpCount] = useState(1250)

  const moods = [
    { emoji: "😊", label: "Happy", value: "happy", icon: Smile, color: "bg-green-100 hover:bg-green-200" },
    { emoji: "😐", label: "Okay", value: "okay", icon: Meh, color: "bg-yellow-100 hover:bg-yellow-200" },
    { emoji: "😢", label: "Sad", value: "sad", icon: Frown, color: "bg-blue-100 hover:bg-blue-200" },
  ]

  const mainActivities = [
    {
      title: "Start Learning",
      description: "Begin your magical learning adventure!",
      icon: Star,
      emoji: "🎓",
      color: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
      hoverColor: "hover:from-yellow-300 hover:via-orange-300 hover:to-red-400",
      textColor: "text-white",
      size: "large",
      tooltip: "Start your personalized learning path with fun activities!",
    },
    {
      title: "Watch a Video",
      description: "Fun educational videos just for you",
      icon: Play,
      emoji: "📺",
      color: "bg-gradient-to-br from-red-400 via-pink-400 to-purple-500",
      hoverColor: "hover:from-red-300 hover:via-pink-300 hover:to-purple-400",
      textColor: "text-white",
      size: "medium",
      tooltip: "Watch safe and fun educational videos!",
    },
    {
      title: "Play a Game",
      description: "Interactive puzzles and quizzes!",
      icon: Gamepad2,
      emoji: "🧩",
      color: "bg-gradient-to-br from-green-400 via-teal-400 to-blue-500",
      hoverColor: "hover:from-green-300 hover:via-teal-300 hover:to-blue-400",
      textColor: "text-white",
      size: "medium",
      tooltip: "Play fun games while learning new things!",
    },
    {
      title: "Story Time",
      description: "Listen to amazing stories with read-along",
      icon: BookOpen,
      emoji: "📖",
      color: "bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-500",
      hoverColor: "hover:from-purple-300 hover:via-indigo-300 hover:to-blue-400",
      textColor: "text-white",
      size: "medium",
      tooltip: "Listen to stories with word highlighting and voice reading!",
    },
    {
      title: "My Rewards",
      description: "See all your awesome badges and stickers!",
      icon: Award,
      emoji: "🏅",
      color: "bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500",
      hoverColor: "hover:from-amber-300 hover:via-yellow-300 hover:to-orange-400",
      textColor: "text-white",
      size: "medium",
      tooltip: "Check out all the cool badges and stickers you've earned!",
    },
  ]

  const handleButtonClick = (buttonName: string) => {
    setClickedButton(buttonName)
    // Add XP for interaction
    setXpCount((prev) => prev + 5)

    // Reset animation after a short delay
    setTimeout(() => setClickedButton(null), 300)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        {/* Top Navigation */}
        <nav className="bg-white shadow-lg border-b-4 border-rainbow-gradient p-4 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                🌟 VidyaSetu
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full border-3 border-yellow-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Sparkles className="h-7 w-7 text-yellow-600 animate-spin" />
                    <span className="text-2xl font-black text-yellow-700">{xpCount}</span>
                    <span className="text-lg font-bold text-yellow-600">XP</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg">Your experience points! Keep learning to earn more! ⭐</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full border-3 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                      <User className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-xl font-bold text-blue-700">Alex</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg">Your profile - that's you! 👋</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-5xl font-black text-gray-800 mb-4 animate-fade-in">Welcome back, Alex! 🎉</h1>
                <p className="text-2xl text-gray-600 font-semibold">Ready for another amazing learning adventure?</p>
              </div>

              {/* Main Activities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mainActivities.map((activity, index) => {
                  const IconComponent = activity.icon
                  const isLarge = activity.size === "large"
                  const isClicked = clickedButton === activity.title

                  return (
                    <Tooltip key={activity.title}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`${isLarge ? "md:col-span-2 lg:col-span-2" : ""} 
                            ${activity.color} ${activity.hoverColor} ${activity.textColor}
                            hover:scale-110 transition-all duration-500 cursor-pointer 
                            border-4 border-white shadow-2xl hover:shadow-3xl
                            ${isClicked ? "scale-95 shadow-inner" : ""}
                            transform-gpu will-change-transform`}
                          onClick={() => handleButtonClick(activity.title)}
                        >
                          <CardContent className={`p-10 ${isLarge ? "text-center" : ""}`}>
                            <div className="flex flex-col items-center space-y-6">
                              <div
                                className={`${isLarge ? "w-24 h-24" : "w-20 h-20"} 
                                bg-white bg-opacity-30 rounded-full flex items-center justify-center
                                hover:bg-opacity-40 transition-all duration-300 hover:rotate-12`}
                              >
                                <span className={`${isLarge ? "text-5xl" : "text-4xl"}`}>{activity.emoji}</span>
                              </div>
                              <div>
                                <h3 className={`${isLarge ? "text-4xl" : "text-3xl"} font-black mb-3`}>
                                  {activity.title}
                                </h3>
                                <p className={`${isLarge ? "text-xl" : "text-lg"} opacity-90 font-semibold`}>
                                  {activity.description}
                                </p>
                              </div>
                              {activity.title === "Start Learning" && (
                                <Button
                                  size="lg"
                                  className="bg-white text-orange-600 hover:bg-gray-100 font-black text-xl px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                  Let's Go! 🚀
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg font-semibold">{activity.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>

              {/* Recent Achievements */}
              <div className="mt-12">
                <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center">
                  🏆 Recent Achievements
                  <Sparkles className="ml-3 h-8 w-8 text-yellow-500 animate-pulse" />
                </h2>
                <div className="flex flex-wrap gap-4">
                  {["Math Star ⭐", "Reading Hero 📚", "Story Master 📖", "Game Champion 🎮"].map((badge, index) => (
                    <Badge
                      key={badge}
                      className="text-xl py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Mood Tracker */}
              <Card className="border-4 border-pink-300 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center">
                    <Heart className="h-7 w-7 text-pink-500 mr-3 animate-pulse" />
                    How do you feel today?
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {moods.map((mood) => (
                      <Tooltip key={mood.value}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={selectedMood === mood.value ? "default" : "outline"}
                            className={`h-20 flex items-center justify-start text-xl font-bold px-6
                              ${mood.color} border-3 transition-all duration-300 hover:scale-105
                              ${
                                selectedMood === mood.value
                                  ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white border-pink-300 shadow-lg"
                                  : "hover:shadow-md"
                              }`}
                            onClick={() => setSelectedMood(mood.value)}
                          >
                            <span className="text-3xl mr-4">{mood.emoji}</span>
                            <span className="text-lg">{mood.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-lg">Tell us how you're feeling today!</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-4 border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-black text-gray-800 mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-xl py-6 hover:bg-blue-50 bg-transparent border-3 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 font-bold"
                        >
                          <Settings className="h-6 w-6 mr-4" />
                          Settings ⚙️
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">Settings ⚙️</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                          <Button className="w-full text-lg py-3 bg-transparent" variant="outline">
                            🔊 Sound Settings
                          </Button>
                          <Button className="w-full text-lg py-3 bg-transparent" variant="outline">
                            🎨 Theme Colors
                          </Button>
                          <Button className="w-full text-lg py-3 bg-transparent" variant="outline">
                            📱 Accessibility
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-xl py-6 hover:bg-blue-50 bg-transparent border-3 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 font-bold"
                        >
                          <Volume2 className="h-6 w-6 mr-4" />
                          Sound On/Off 🔊
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg">Turn sounds on or off</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-xl py-6 hover:bg-blue-50 bg-transparent border-3 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 font-bold"
                        >
                          <HelpCircle className="h-6 w-6 mr-4" />
                          Help & Tips 💡
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg">Get help and learn tips!</p>
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-xl py-6 hover:bg-red-50 text-red-600 bg-transparent border-3 border-red-200 hover:border-red-300 transition-all duration-300 hover:scale-105 font-bold"
                    >
                      <LogOut className="h-6 w-6 mr-4" />
                      Logout 🔓
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Goal */}
              <Card className="border-4 border-green-300 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-black text-gray-800 mb-6">Today's Goal 🎯</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Learning Time</span>
                      <span className="font-black text-green-600 text-xl">15/30 min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-1000 shadow-lg"
                        style={{ width: "50%" }}
                      ></div>
                    </div>
                    <p className="text-lg text-gray-600 font-semibold">Great job! You're halfway there! 🌟</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
