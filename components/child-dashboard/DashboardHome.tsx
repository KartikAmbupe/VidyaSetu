// components/child-dashboard/DashboardHome.tsx
import React, { useState } from 'react';
import { Heart, Settings, LogOut, HelpCircle } from "lucide-react";
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FontToggle from "./font-toggle";
import { View } from "./types";

export const DashboardHome: React.FC<{ onNavigate: (view: View) => void; parentTimeRemaining: number }> = ({ onNavigate, parentTimeRemaining }) => {
    const [xpCount, setXpCount] = useState(1250);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    const moods = [{ emoji: "😊", label: "Happy", value: "happy", color: "bg-green-100 hover:bg-green-200" }, { emoji: "😐", label: "Okay", value: "okay", color: "bg-yellow-100 hover:bg-yellow-200" }, { emoji: "😢", label: "Sad", value: "sad", color: "bg-blue-100 hover:bg-blue-200" }];
    const mainActivities = [
        { title: "Start Learning", description: "Begin your magical learning adventure!", emoji: "🎓", color: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500", hoverColor: "hover:from-yellow-300 hover:via-orange-300 hover:to-red-400", size: "large", view: 'module-selection' },
        { title: "Take a Quiz", description: "Quizzes to challenge your brain", emoji: "🧠", color: "bg-gradient-to-br from-red-400 via-pink-400 to-purple-500", hoverColor: "hover:from-red-300 hover:via-pink-300 hover:to-purple-400", size: "medium", view: 'quiz-suite' },
        { title: "Play a Game", description: "Interactive puzzles and quizzes!", emoji: "🧩", color: "bg-gradient-to-br from-green-400 via-teal-400 to-blue-500", hoverColor: "hover:from-green-300 hover:via-teal-300 hover:to-blue-400", size: "medium", view: 'game-selection' },
        { title: "Story Time", description: "Listen to amazing stories with read-along", emoji: "📖", color: "bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-500", hoverColor: "hover:from-purple-300 hover:via-indigo-300 hover:to-blue-400", size: "medium", view: 'story-time' },
        { title: "My Rewards", description: "See all your awesome badges and stickers!", emoji: "🏅", color: "bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500", hoverColor: "hover:from-amber-300 hover:via-yellow-300 hover:to-orange-400", size: "medium", view: 'child-home' },
    ];

    const handleButtonClick = (view: View) => { setClickedButton(view); setXpCount((prev) => prev + 5); setTimeout(() => { onNavigate(view); setClickedButton(null); }, 300); }

    return (
        <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-5xl font-black text-gray-800 mb-4">Welcome back, Sam! 🎉</h1>
                        <p className="text-2xl text-gray-600 font-semibold">Ready for a learning adventure?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mainActivities.map((activity) => {
                            const isLarge = activity.size === "large";
                            const isClicked = clickedButton === activity.view;
                            return (
                                <Card key={activity.title} className={clsx("text-white hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-white shadow-2xl", isLarge && "md:col-span-2 lg:col-span-2", activity.color, activity.hoverColor, isClicked && "scale-95 shadow-inner")} onClick={() => handleButtonClick(activity.view as View)}>
                                    <CardContent className={clsx("p-8", isLarge && "text-center")}>
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className={clsx("bg-white/30 rounded-full flex items-center justify-center", isLarge ? "w-24 h-24" : "w-20 h-20")}><span className={clsx(isLarge ? "text-5xl" : "text-4xl")}>{activity.emoji}</span></div>
                                            <div><h3 className={clsx("font-black mb-2", isLarge ? "text-4xl" : "text-3xl")}>{activity.title}</h3><p className={clsx("opacity-90 font-semibold", isLarge ? "text-xl" : "text-lg")}>{activity.description}</p></div>
                                            {activity.title === "Start Learning" && (<Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-black text-xl px-8 py-3 rounded-full shadow-lg">Let's Go! 🚀</Button>)}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
                <div className="space-y-8">
                    <Card className="border-2 border-pink-200 shadow-xl"><CardContent className="p-6"><h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center"><Heart className="h-6 w-6 text-pink-500 mr-2" /> How are you?</h3><div className="grid grid-cols-3 gap-2">{moods.map(mood => <Button key={mood.value} variant={selectedMood === mood.value ? "default" : "outline"} className={clsx("h-16 text-lg", mood.color, selectedMood === mood.value && "ring-2 ring-pink-400")} onClick={() => setSelectedMood(mood.value)}><span className="text-3xl">{mood.emoji}</span></Button>)}</div></CardContent></Card>
                    <Card className="border-2 border-blue-200 shadow-xl">
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-black text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Dialog><DialogTrigger asChild><Button variant="outline" className="w-full justify-start text-lg py-5"> <Settings className="mr-3" /> Settings </Button></DialogTrigger><DialogContent><DialogHeader> <DialogTitle>Settings</DialogTitle> </DialogHeader><div className="p-4 space-y-4"> <p>Accessibility Options:</p> <FontToggle /> </div></DialogContent></Dialog>
                                <Button variant="outline" className="w-full justify-start text-lg py-5"> <HelpCircle className="mr-3" /> Help </Button>
                                <Button variant="outline" className="w-full justify-start text-lg py-5 text-red-600 hover:bg-red-50 hover:text-red-700"> <LogOut className="mr-3" /> Logout </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-green-200 shadow-xl">
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">⏱️</span>
                                Learning Time
                            </h3>
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-2 border-green-300">
                                <p className="text-sm font-semibold text-gray-600 mb-2">Time Remaining</p>
                                <p className="text-3xl font-black text-green-700">
                                    {Math.floor(parentTimeRemaining / 60)}:{(parentTimeRemaining % 60).toString().padStart(2, '0')}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Timer runs during learning activities</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};