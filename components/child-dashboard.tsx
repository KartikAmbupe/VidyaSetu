"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, Star, Gamepad2, Settings, LogOut, Smile, Meh, Frown, Heart, User, HelpCircle, Sparkles } from "lucide-react";
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- TYPE DEFINITIONS ---
type View = 'child-home' | 'module-selection' | 'module' | 'game-selection' | 'english-game' | 'maths-game';

interface CardData {
    image: string;
    text: string;
    simpleText: string;
}

interface EnglishQuestion {
    letter: string;
    correct: string;
    options: string[];
}

interface Module {
    title: string;
    description: string;
    deck: CardData[];
}

interface Subject {
    title: string;
    description: string;
    modules: Module[];
    borderColor: string;
    textColor: string;
    bgColor: string;
    hoverBgColor: string;
}

type SubjectsData = {
    english: Subject;
    maths: Subject;
}

// --- DATA CONSTANTS ---
const lettersDeck: CardData[] = [
    { image: 'https://placehold.co/400x200/FFC8DD/000000?text=Aa+-+Apple', text: 'A', simpleText: 'A is for Apple.' },
    { image: 'https://placehold.co/400x200/A2D2FF/000000?text=Bb+-+Ball', text: 'B', simpleText: 'B is for Ball.' },
    { image: 'https://placehold.co/400x200/BDE0FE/000000?text=Cc+-+Cat', text: 'C', simpleText: 'C is for Cat.' },
    { image: 'https://placehold.co/400x200/CDB4DB/000000?text=Dd+-+Dog', text: 'D', simpleText: 'D is for Dog.' },
    { image: 'https://placehold.co/400x200/FFADAD/000000?text=Ee+-+Elephant', text: 'E', simpleText: 'E is for Elephant.' },
    { image: 'https://placehold.co/400x200/FFD6A5/000000?text=Ff+-+Fish', text: 'F', simpleText: 'F is for Fish.' },
    { image: 'https://placehold.co/400x200/FDFFB6/000000?text=Gg+-+Goat', text: 'G', simpleText: 'G is for Goat.' },
    { image: 'https://placehold.co/400x200/CAFFBF/000000?text=Hh+-+Hat', text: 'H', simpleText: 'H is for Hat.' },
    { image: 'https://placehold.co/400x200/9BF6FF/000000?text=Ii+-+Igloo', text: 'I', simpleText: 'I is for Igloo.' },
    { image: 'https://placehold.co/400x200/A0C4FF/000000?text=Jj+-+Jar', text: 'J', simpleText: 'J is for Jar.' },
    { image: 'https://placehold.co/400x200/BDB2FF/000000?text=Kk+-+Kite', text: 'K', simpleText: 'K is for Kite.' },
    { image: 'https://placehold.co/400x200/FFB3DE/000000?text=Ll+-+Lion', text: 'L', simpleText: 'L is for Lion.' },
    { image: 'https://placehold.co/400x200/FFC8DD/000000?text=Mm+-+Mouse', text: 'M', simpleText: 'M is for Mouse.' },
    { image: 'https://placehold.co/400x200/A2D2FF/000000?text=Nn+-+Nest', text: 'N', simpleText: 'N is for Nest.' },
    { image: 'https://placehold.co/400x200/BDE0FE/000000?text=Oo+-+Octopus', text: 'O', simpleText: 'O is for Octopus.' },
    { image: 'https://placehold.co/400x200/CDB4DB/000000?text=Pp+-+Pig', text: 'P', simpleText: 'P is for Pig.' },
    { image: 'https://placehold.co/400x200/FFADAD/000000?text=Qq+-+Queen', text: 'Q', simpleText: 'Q is for Queen.' },
    { image: 'https://placehold.co/400x200/FFD6A5/000000?text=Rr+-+Rabbit', text: 'R', simpleText: 'R is for Rabbit.' },
    { image: 'https://placehold.co/400x200/FDFFB6/000000?text=Ss+-+Sun', text: 'S', simpleText: 'S is for Sun.' },
    { image: 'https://placehold.co/400x200/CAFFBF/000000?text=Tt+-+Tiger', text: 'T', simpleText: 'T is for Tiger.' },
    { image: 'https://placehold.co/400x200/9BF6FF/000000?text=Uu+-+Umbrella', text: 'U', simpleText: 'U is for Umbrella.' },
    { image: 'https://placehold.co/400x200/A0C4FF/000000?text=Vv+-+Vase', text: 'V', simpleText: 'V is for Vase.' },
    { image: 'https://placehold.co/400x200/BDB2FF/000000?text=Ww+-+Whale', text: 'W', simpleText: 'W is for Whale.' },
    { image: 'https://placehold.co/400x200/FFB3DE/000000?text=Xx+-+Xylophone', text: 'X', simpleText: 'X is for Xylophone.' },
    { image: 'https://placehold.co/400x200/FFC8DD/000000?text=Yy+-+Yak', text: 'Y', simpleText: 'Y is for Yak.' },
    { image: 'https://placehold.co/400x200/A2D2FF/000000?text=Zz+-+Zebra', text: 'Z', simpleText: 'Z is for Zebra.' },
];

const numbersDeck: CardData[] = [
    { image: 'https://placehold.co/400x200/E5E5E5/000000?text=0', text: 'Zero', simpleText: 'This is the number zero.' },
    { image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=1', text: 'One', simpleText: 'This is the number one.' },
    { image: 'https://placehold.co/400x200/A3B18A/FFFFFF?text=2', text: 'Two', simpleText: 'This is the number two.' },
    { image: 'https://placehold.co/400x200/588157/FFFFFF?text=3', text: 'Three', simpleText: 'This is the number three.' },
    { image: 'https://placehold.co/400x200/3A5A40/FFFFFF?text=4', text: 'Four', simpleText: 'This is the number four.' },
    { image: 'https://placehold.co/400x200/344E41/FFFFFF?text=5', text: 'Five', simpleText: 'This is the number five.' },
    { image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=6', text: 'Six', simpleText: 'This is the number six.' },
    { image: 'https://placehold.co/400x200/E76F51/FFFFFF?text=7', text: 'Seven', simpleText: 'This is the number seven.' },
    { image: 'https://placehold.co/400x200/DDA15E/FFFFFF?text=8', text: 'Eight', simpleText: 'This is the number eight.' },
    { image: 'https://placehold.co/400x200/BC6C25/FFFFFF?text=9', text: 'Nine', simpleText: 'This is the number nine.' },
];

const verbsDeck: CardData[] = [ { image: 'https://placehold.co/400x200/FFADAD/000000?text=Run', text: 'Run', simpleText: 'The girl can run very fast.' }, { image: 'https://placehold.co/400x200/FFD6A5/000000?text=Jump', text: 'Jump', simpleText: 'Frogs can jump high.' }, { image: 'https://placehold.co/400x200/FDFFB6/000000?text=Read', text: 'Read', simpleText: 'He loves to read books.' }, { image: 'https://placehold.co/400x200/CAFFBF/000000?text=Sing', text: 'Sing', simpleText: 'She likes to sing a song.' }, { image: 'https://placehold.co/400x200/9BF6FF/000000?text=Eat', text: 'Eat', simpleText: 'It is time to eat lunch.' }, ];
const adjectivesDeck: CardData[] = [ { image: 'https://placehold.co/400x200/FFC8DD/000000?text=Big', text: 'Big', simpleText: 'The elephant is big.' }, { image: 'https://placehold.co/400x200/A2D2FF/000000?text=Small', text: 'Small', simpleText: 'The mouse is small.' }, { image: 'https://placehold.co/400x200/BDE0FE/000000?text=Happy', text: 'Happy', simpleText: 'The smiley face is happy.' }, { image: 'https://placehold.co/400x200/CDB4DB/000000?text=Sad', text: 'Sad', simpleText: 'The crying child is sad.' }, { image: 'https://placehold.co/400x200/FFC8DD/000000?text=Red', text: 'Red', simpleText: 'The apple is red.' }, ];
const additionDeck: CardData[] = [ { image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=1%2B1=2', text: '1 + 1 = 2', simpleText: 'One plus one equals two.' }, { image: 'https://placehold.co/400x200/A3B18A/FFFFFF?text=2%2B1=3', text: '2 + 1 = 3', simpleText: 'Two plus one equals three.' }, { image: 'https://placehold.co/400x200/588157/FFFFFF?text=2%2B2=4', text: '2 + 2 = 4', simpleText: 'Two plus two equals four.' }, { image: 'https://placehold.co/400x200/3A5A40/FFFFFF?text=3%2B2=5', text: '3 + 2 = 5', simpleText: 'Three plus two equals five.' }, { image: 'https://placehold.co/400x200/344E41/FFFFFF?text=4%2B1=5', text: '4 + 1 = 5', simpleText: 'Four plus one equals five.' }, ];
const subtractionDeck: CardData[] = [ { image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=2-1=1', text: '2 - 1 = 1', simpleText: 'Two minus one equals one.' }, { image: 'https://placehold.co/400x200/A3B18A/FFFFFF?text=3-1=2', text: '3 - 1 = 2', simpleText: 'Three minus one equals two.' }, { image: 'https://placehold.co/400x200/588157/FFFFFF?text=4-2=2', text: '4 - 2 = 2', simpleText: 'Four minus two equals two.' }, { image: 'https://placehold.co/400x200/3A5A40/FFFFFF?text=5-3=2', text: '5 - 3 = 2', simpleText: 'Five minus three equals two.' }, { image: 'https://placehold.co/400x200/344E41/FFFFFF?text=5-1=4', text: '5 - 1 = 4', simpleText: 'Five minus one equals four.' }, ];
const multiplicationDeck: CardData[] = [ { image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=2x1=2', text: '2 x 1 = 2', simpleText: 'Two times one equals two.' }, { image: 'https://placehold.co/400x200/E76F51/FFFFFF?text=2x2=4', text: '2 x 2 = 4', simpleText: 'Two times two equals four.' }, { image: 'https://placehold.co/400x200/DDA15E/FFFFFF?text=3x2=6', text: '3 x 2 = 6', simpleText: 'Three times two equals six.' }, { image: 'https://placehold.co/400x200/BC6C25/FFFFFF?text=4x2=8', text: '4 x 2 = 8', simpleText: 'Four times two equals eight.' }, { image: 'https://placehold.co/400x200/606C38/FFFFFF?text=5x2=10', text: '5 x 2 = 10', simpleText: 'Five times two equals ten.' }, ];
const divisionDeck: CardData[] = [ { image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=4%C3%B72=2', text: '4 ÷ 2 = 2', simpleText: 'Four divided by two is two.' }, { image: 'https://placehold.co/400x200/E76F51/FFFFFF?text=6%C3%B72=3', text: '6 ÷ 2 = 3', simpleText: 'Six divided by two is three.' }, { image: 'https://placehold.co/400x200/DDA15E/FFFFFF?text=8%C3%B74=2', text: '8 ÷ 4 = 2', simpleText: 'Eight divided by four is two.' }, { image: 'https://placehold.co/400x200/BC6C25/FFFFFF?text=9%C3%B73=3', text: '9 ÷ 3 = 3', simpleText: 'Nine divided by three is three.' }, { image: 'https://placehold.co/400x200/606C38/FFFFFF?text=10%C3%B72=5', text: '10 ÷ 2 = 5', simpleText: 'Ten divided by two is five.' }, ];

const subjectsData: SubjectsData = {
    english: { title: "English Fun", description: "Learn letters, sounds, and first words. It's as easy as A-B-C!", borderColor: "border-amber-400", textColor: "text-amber-700", bgColor: "bg-amber-50", hoverBgColor: "hover:bg-amber-100", modules: [ { title: "Learn Letters", description: "Master the alphabet from A to Z.", deck: lettersDeck }, { title: "Learn Verbs", description: "Discover action words like run, jump, and sing.", deck: verbsDeck }, { title: "Learn Adjectives", description: "Describe the world with words like big, small, and happy.", deck: adjectivesDeck } ] },
    maths: { title: "Math Adventures", description: "Let's count numbers and have fun with shapes!", borderColor: "border-sky-400", textColor: "text-sky-700", bgColor: "bg-sky-50", hoverBgColor: "hover:bg-sky-100", modules: [ { title: "Learn Numbers", description: "Get to know numbers from zero to nine.", deck: numbersDeck }, { title: "Addition", description: "Learn how to add numbers together.", deck: additionDeck }, { title: "Subtraction", description: "Practice taking numbers away.", deck: subtractionDeck }, { title: "Multiplication", description: "Start multiplying with simple examples.", deck: multiplicationDeck }, { title: "Division", description: "Understand how to share things equally.", deck: divisionDeck } ] }
};

const gameOverMessages: string[] = ["Great try! Every game helps you learn.", "Awesome effort! Ready for another round?", "You did great! Practice makes perfect.", "Wow, you were so close! Let's play again!", "Good game! Let's see if you can beat your score."];
const quizEndMessages: string[] = ["Fantastic job! Look at that score!", "You're a superstar! Well done!", "Amazing work! You're getting so good at this!", "Incredible! You finished the quiz!"];

// --- VIEW COMPONENTS ---

const DashboardHome: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
    const [xpCount, setXpCount] = useState(1250);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [clickedButton, setClickedButton] = useState<string | null>(null);

    const moods = [ { emoji: "😊", label: "Happy", value: "happy", color: "bg-green-100 hover:bg-green-200" }, { emoji: "😐", label: "Okay", value: "okay", color: "bg-yellow-100 hover:bg-yellow-200" }, { emoji: "😢", label: "Sad", value: "sad", color: "bg-blue-100 hover:bg-blue-200" }, ];
    
    const mainActivities = [
        { title: "Start Learning", description: "Begin your magical learning adventure!", emoji: "🎓", color: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500", hoverColor: "hover:from-yellow-300 hover:via-orange-300 hover:to-red-400", size: "large", tooltip: "Start your personalized learning path with fun activities!", view: 'module-selection' },
        { title: "Watch a Video", description: "Fun educational videos just for you", emoji: "📺", color: "bg-gradient-to-br from-red-400 via-pink-400 to-purple-500", hoverColor: "hover:from-red-300 hover:via-pink-300 hover:to-purple-400", size: "medium", tooltip: "Watch safe and fun educational videos!", view: 'child-home' },
        { title: "Play a Game", description: "Interactive puzzles and quizzes!", emoji: "🧩", color: "bg-gradient-to-br from-green-400 via-teal-400 to-blue-500", hoverColor: "hover:from-green-300 hover:via-teal-300 hover:to-blue-400", size: "medium", tooltip: "Play fun games while learning new things!", view: 'game-selection' },
        { title: "Story Time", description: "Listen to amazing stories with read-along", emoji: "📖", color: "bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-500", hoverColor: "hover:from-purple-300 hover:via-indigo-300 hover:to-blue-400", size: "medium", tooltip: "Listen to stories with word highlighting and voice reading!", view: 'child-home' },
        { title: "My Rewards", description: "See all your awesome badges and stickers!", emoji: "🏅", color: "bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500", hoverColor: "hover:from-amber-300 hover:via-yellow-300 hover:to-orange-400", size: "medium", tooltip: "Check out all the cool badges and stickers you've earned!", view: 'child-home' },
    ];

    const handleButtonClick = (view: View) => {
        setClickedButton(view);
        setXpCount((prev) => prev + 5);
        setTimeout(() => {
            onNavigate(view);
            setClickedButton(null);
        }, 300);
    }
    
    return (
        <TooltipProvider>
            <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-5xl font-black text-gray-800 mb-4">Welcome back, Alex! 🎉</h1>
                            <p className="text-2xl text-gray-600 font-semibold">Ready for a learning adventure?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mainActivities.map((activity) => {
                                const isLarge = activity.size === "large";
                                const isClicked = clickedButton === activity.view;
                                return (
                                    <Tooltip key={activity.title}>
                                        <TooltipTrigger asChild>
                                            <Card
                                                className={clsx( "text-white hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-white shadow-2xl", isLarge && "md:col-span-2 lg:col-span-2", activity.color, activity.hoverColor, isClicked && "scale-95 shadow-inner" )}
                                                onClick={() => handleButtonClick(activity.view as View)}
                                            >
                                                <CardContent className={clsx("p-8", isLarge && "text-center")}>
                                                    <div className="flex flex-col items-center space-y-4">
                                                        <div className={clsx("bg-white/30 rounded-full flex items-center justify-center", isLarge ? "w-24 h-24" : "w-20 h-20")}>
                                                            <span className={clsx(isLarge ? "text-5xl" : "text-4xl")}>{activity.emoji}</span>
                                                        </div>
                                                        <div>
                                                            <h3 className={clsx("font-black mb-2", isLarge ? "text-4xl" : "text-3xl")}>{activity.title}</h3>
                                                            <p className={clsx("opacity-90 font-semibold", isLarge ? "text-xl" : "text-lg")}>{activity.description}</p>
                                                        </div>
                                                        {activity.title === "Start Learning" && ( <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-black text-xl px-8 py-3 rounded-full shadow-lg">Let's Go! 🚀</Button> )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-lg font-semibold">{activity.tooltip}</p></TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <Card className="border-2 border-pink-200 shadow-xl"><CardContent className="p-6"><h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center"><Heart className="h-6 w-6 text-pink-500 mr-2"/> How are you?</h3><div className="grid grid-cols-3 gap-2">{moods.map(mood => <Button key={mood.value} variant={selectedMood === mood.value ? "default" : "outline"} className={clsx("h-16 text-lg", mood.color, selectedMood === mood.value && "ring-2 ring-pink-400")} onClick={() => setSelectedMood(mood.value)}><span className="text-3xl">{mood.emoji}</span></Button>)}</div></CardContent></Card>
                        <Card className="border-2 border-blue-200 shadow-xl"><CardContent className="p-6"><h3 className="text-2xl font-black text-gray-800 mb-4">Quick Actions</h3><div className="space-y-3"><Dialog><DialogTrigger asChild><Button variant="outline" className="w-full justify-start text-lg py-5"><Settings className="mr-3"/> Settings</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Settings</DialogTitle></DialogHeader><div className="p-4">App settings will be here.</div></DialogContent></Dialog><Button variant="outline" className="w-full justify-start text-lg py-5"><HelpCircle className="mr-3"/> Help</Button><Button variant="outline" className="w-full justify-start text-lg py-5 text-red-600 hover:bg-red-50 hover:text-red-700"><LogOut className="mr-3"/> Logout</Button></div></CardContent></Card>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};


const SubjectSelection: React.FC<{ onSelectSubject: (subjectKey: keyof SubjectsData) => void; onBack: () => void; }> = ({ onSelectSubject, onBack }) => (
    <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
         <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Dashboard
        </Button>
        <h1 className="text-4xl text-center text-gray-800 font-bold mb-2">Choose a Subject</h1>
         <p className="text-xl text-center text-gray-600 mb-12">What would you like to learn today?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card onClick={() => onSelectSubject('english')} className="p-6 border-amber-400 bg-amber-50 hover:bg-amber-100 cursor-pointer">
                <h2 className="text-3xl font-bold text-amber-700 mb-3">English Fun</h2>
                <p className="text-lg text-gray-700">{subjectsData.english.description}</p>
            </Card>
            <Card onClick={() => onSelectSubject('maths')} className="p-6 border-sky-400 bg-sky-50 hover:bg-sky-100 cursor-pointer">
                <h2 className="text-3xl font-bold text-sky-700 mb-3">Math Adventures</h2>
                <p className="text-lg text-gray-700">{subjectsData.maths.description}</p>
            </Card>
        </div>
    </div>
);

const GameSelection: React.FC<{ 
    onStartGame: (game: 'english-game' | 'maths-game') => void; 
    onBack: () => void;
    gameTimeRemaining: number;
    playtimeCooldownEnd: number | null;
}> = ({ onStartGame, onBack, gameTimeRemaining, playtimeCooldownEnd }) => {
    const formatTime = (seconds: number) => new Date(seconds * 1000).toISOString().substr(14, 5);

    const CooldownMessage = () => {
        if (!playtimeCooldownEnd) return null;
        const remaining = Math.round((playtimeCooldownEnd - Date.now()) / 1000);
        return (
            <div className="text-center mt-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                <p className="text-xl font-bold">Games are resting! Come back in {formatTime(remaining > 0 ? remaining : 0)}.</p>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
            <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2">
                <ArrowLeft size={16} /> Back to Dashboard
            </Button>
            <h1 className="text-4xl text-center text-gray-800 font-bold mb-2">Choose a Game</h1>
            <p className="text-xl text-center text-gray-600 mb-8">Let's play and learn!</p>

            <div className="text-center mb-6 p-3 bg-white rounded-lg shadow-sm border max-w-sm mx-auto">
                <p className="text-2xl">Play Time Remaining: <span className="font-bold text-teal-600">{formatTime(gameTimeRemaining)}</span></p>
            </div>

            <div className={clsx("grid grid-cols-1 md:grid-cols-2 gap-8", { "opacity-50 pointer-events-none": !!playtimeCooldownEnd })}>
                <Card onClick={() => onStartGame('english-game')} className="p-6 border-rose-400 bg-rose-50 hover:bg-rose-100 cursor-pointer">
                    <h2 className="text-3xl font-bold text-rose-700 mb-3">Letter Match</h2>
                    <p className="text-lg text-gray-700">Match the letter to the right picture!</p>
                </Card>
                <Card onClick={() => onStartGame('maths-game')} className="p-6 border-green-400 bg-green-50 hover:bg-green-100 cursor-pointer">
                    <h2 className="text-3xl font-bold text-green-700 mb-3">Number Catch</h2>
                    <p className="text-lg text-gray-700">Catch the falling numbers!</p>
                </Card>
            </div>
            <CooldownMessage />
        </div>
    );
};


const ModuleSelection: React.FC<{ subject: Subject; onStartModule: (deck: CardData[]) => void; onBack: () => void; }> = ({ subject, onStartModule, onBack }) => (
    <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
        <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Subjects</Button>
        <h1 className={clsx("text-4xl text-center mb-2 font-bold", subject.textColor)}>{subject.title}</h1>
        <p className="text-xl text-center text-gray-600 mb-12">{subject.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.modules.map(module => (
                <Card key={module.title} onClick={() => onStartModule(module.deck)} className={clsx("p-6 h-full flex flex-col justify-between cursor-pointer", subject.borderColor, subject.bgColor, subject.hoverBgColor)}>
                    <div>
                        <h2 className={clsx("text-2xl font-bold mb-2", subject.textColor)}>{module.title}</h2>
                        <p className="text-gray-700">{module.description}</p>
                    </div>
                    <div className="text-right mt-4 font-bold text-gray-500">Start &rarr;</div>
                </Card>
            ))}
        </div>
    </div>
);

const LearningModule: React.FC<{ deck: CardData[]; onClose: () => void }> = ({ deck, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [useSimpleText, setUseSimpleText] = useState(false);
    const card = deck[currentIndex];
    
    const speak = (text: string) => {
        if (typeof window.speechSynthesis === 'undefined') return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    };

    const textToDisplay = useSimpleText ? card.simpleText : card.text;

    return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
            <Card className="relative w-full max-w-2xl p-8 flex flex-col md:flex-row items-center gap-8 border-gray-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl">&times;</button>
                <img src="https://placehold.co/150x150/f59e0b/FFFFFF?text=Leo" alt="Leo the Lion" className="rounded-full w-24 h-24 md:w-32 md:h-32 border-4 border-amber-200" />
                <div className="flex-1 text-center md:text-left">
                    <img src={card.image} alt="Learning Image" className="w-full h-48 object-contain rounded-xl mb-4 bg-gray-50 p-2 border" />
                    <p className={clsx("font-bold text-gray-800 mb-4 h-20 flex items-center justify-center md:justify-start", useSimpleText ? 'text-2xl' : 'text-5xl')}>{textToDisplay}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                        <Button onClick={() => speak(textToDisplay)} className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600"><Volume2 size={24} /></Button>
                        <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-full">
                            <Button onClick={() => setUseSimpleText(false)} className={clsx("px-3 text-sm", !useSimpleText && 'bg-white shadow rounded-full')}>Regular</Button>
                            <Button onClick={() => setUseSimpleText(true)} className={clsx("px-3 text-sm", useSimpleText && 'bg-white shadow rounded-full')}>Simple</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Prev</Button>
                        <p className="text-gray-500 font-semibold">{currentIndex + 1} / {deck.length}</p>
                        <Button onClick={() => setCurrentIndex(i => i + 1)} disabled={currentIndex === deck.length - 1} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const EnglishGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [questions, setQuestions] = useState<EnglishQuestion[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ text: string, color: string } | null>(null);
    const [gameState, setGameState] = useState<'loading' | 'active' | 'finished' | 'error'>('loading');
    const [endMessage, setEndMessage] = useState('');

    const generateQuiz = async () => {
        setGameState('loading');
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Gemini API key is missing.");
            setGameState('error');
            return;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const prompt = "Generate a JSON array of 10 unique quiz questions for a 'letter match' game. Each object must have 'letter', 'correct', and 'options' properties. The two distractor nouns in 'options' MUST NOT start with the question's 'letter'. All words must be for a 5-7 year old. IMPORTANT: Respond ONLY with the raw JSON array, without any surrounding text or markdown formatting.";

        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                const errorBody = await response.json();
                console.error("API Error Response:", errorBody);
                throw new Error(`API Error: ${response.status}`);
            }
            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (jsonText) {
                const cleanedJsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
                const parsedQuestions = JSON.parse(cleanedJsonText);
                if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
                    setQuestions(parsedQuestions);
                    setQuestionIndex(0);
                    setScore(0);
                    setFeedback(null);
                    setGameState('active');
                } else { throw new Error("Invalid question format received."); }
            } else { throw new Error("No questions generated in the response."); }
        } catch (error) {
            console.error("Failed to generate or parse quiz:", error);
            setGameState('error');
        }
    };
    
    useEffect(() => { generateQuiz(); }, []);
    
    const handleAnswer = (selectedOption: string) => {
        if (feedback) return;
        const isCorrect = selectedOption === questions[questionIndex].correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback({ text: 'Correct! 🎉', color: 'text-green-500' });
        } else {
            setFeedback({ text: 'Not quite!', color: 'text-red-500' });
        }
        setTimeout(() => {
            setFeedback(null);
            if (questionIndex < questions.length - 1) {
                setQuestionIndex(prev => prev + 1);
            } else {
                setEndMessage(quizEndMessages[Math.floor(Math.random() * quizEndMessages.length)]);
                setGameState('finished');
            }
        }, 1500);
    };

     const renderGameContent = () => {
        switch (gameState) {
            case 'loading': return <div className="text-2xl animate-pulse">✨ Generating your quiz...</div>;
            case 'error': return (<div><p className="text-xl text-red-500 mb-4">Oops! We couldn't create a quiz right now.</p><Button onClick={generateQuiz} className="bg-rose-500 text-white hover:bg-rose-600">Try Again</Button></div>);
            case 'finished': return (<div><h2 className="text-4xl font-bold text-rose-600 mb-4">Quiz Complete!</h2><p className="text-2xl text-gray-700 mb-2">{endMessage}</p><p className="text-5xl font-bold text-teal-600 my-6">{score} / {questions.length}</p><Button onClick={generateQuiz} className="bg-rose-500 text-white py-3 px-8 rounded-xl text-xl hover:bg-rose-600">Play Again</Button></div>);
            case 'active':
                if (questions.length === 0) return null;
                const question = questions[questionIndex];
                return (
                    <div className="flex flex-col items-center w-full">
                        <h2 className="text-3xl font-bold text-rose-600 mb-2">Letter Match Game ({questionIndex + 1}/{questions.length})</h2>
                        <p className="text-xl text-gray-600 mb-6">Which picture starts with the letter...</p>
                        <div className="grid md:grid-cols-2 items-center justify-items-center gap-8 w-full px-4">
                            <p className="text-9xl font-bold text-gray-800 justify-self-center md:justify-self-end">{question.letter}</p>
                            <div className="flex flex-col gap-4 justify-self-center md:justify-self-start">
                                {question.options.map(option => (
                                    <button key={option} onClick={() => handleAnswer(option)} className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 flex items-center gap-3 text-left w-64 border hover:border-gray-300" disabled={!!feedback}>
                                        <img src={`https://placehold.co/80x60/FFFFFF/000000?text=${option}`} alt={option} className="rounded-md bg-white" />
                                        <p className="text-xl flex-grow">{option}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-8 mt-4">{feedback && <p className={`text-2xl font-bold ${feedback.color}`}>{feedback.text}</p>}</div>
                    </div>
                );
        }
    };
    
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in"><Card className="relative w-full max-w-4xl p-8 text-center min-h-[500px] flex items-center justify-center border-gray-200"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl">&times;</button>{renderGameContent()}</Card></div>);
};

const MathsGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [score, setScore] = useState(0);
    const [catchCount, setCatchCount] = useState(0);
    const [lives, setLives] = useState(5);
    const [bubbles, setBubbles] = useState<any[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState("");
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const intervalsRef = useRef<NodeJS.Timeout[]>([]);

    const startGame = () => {
        setScore(0);
        setCatchCount(0);
        setLives(5);
        setBubbles([]);
        setGameOver(false);
        intervalsRef.current.forEach(clearInterval);
        intervalsRef.current = [];

        const bubbleInterval = setInterval(() => {
            setBubbles(prev => [...prev, { id: Date.now(), value: Math.ceil(Math.random() * 5), left: `${Math.random() * 90}%`, top: -50 }]);
        }, 1200);
        intervalsRef.current.push(bubbleInterval);
    };

    useEffect(() => {
        startGame();
        return () => { intervalsRef.current.forEach(clearInterval); };
    }, []);

    useEffect(() => {
        if (lives <= 0 && !gameOver) {
            setGameOver(true);
            setGameOverMessage(gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)]);
            intervalsRef.current.forEach(clearInterval);
            intervalsRef.current = [];
        }
    }, [lives, gameOver]);

    const handlePop = (id: number, value: number) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setCatchCount(c => c + 1);
        setScore(s => s + value);
    };

    const handleMiss = (id: number) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setLives(l => l - 1);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
            <Card className="relative w-full max-w-3xl p-8 text-center overflow-hidden border-gray-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl">&times;</button>
                {!gameOver ? (
                    <>
                        <h2 className="text-3xl font-bold text-green-600 mb-2">Number Catch Game</h2>
                        <div className="flex justify-between items-center px-4">
                            <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => (<span key={i} className={clsx("text-2xl", i < lives ? 'text-green-500' : 'text-gray-300')}>●</span>))}</div>
                            <div>
                                <p className="text-lg text-gray-600">Catches: <span className="font-bold">{catchCount}</span></p>
                                <p className="text-lg text-gray-800">Score: <span className="font-bold">{score}</span></p>
                            </div>
                        </div>
                        <div ref={gameAreaRef} className="relative w-full h-96 bg-sky-100 mt-4 rounded-lg border-2 border-sky-300 overflow-hidden">
                            {bubbles.map(bubble => (<Bubble key={bubble.id} {...bubble} onPop={handlePop} onMiss={handleMiss} gameAreaRef={gameAreaRef} />))}
                        </div>
                    </>
                ) : (
                    <div>
                        <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h2>
                        <p className="text-xl text-gray-600 mb-4">{gameOverMessage}</p>
                        <p className="text-2xl text-gray-700">Final Score: <span className="font-bold">{score}</span></p>
                        <p className="text-2xl text-gray-700 mb-8">You Caught: <span className="font-bold">{catchCount}</span> bubbles</p>
                        <Button onClick={startGame} className="bg-green-500 text-white py-3 px-8 rounded-xl text-2xl hover:bg-green-600">Play Again</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

const Bubble: React.FC<{ id: number; value: number; left: string; onPop: (id: number, value: number) => void; onMiss: (id: number) => void; gameAreaRef: React.RefObject<HTMLDivElement> }> = ({ id, value, left, onPop, onMiss, gameAreaRef }) => {
    const [top, setTop] = useState(-50);
    const poppedRef = useRef(false);
    
    useEffect(() => {
        const interval = setInterval(() => setTop(t => t + 5), 30);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (gameAreaRef.current && top > gameAreaRef.current.offsetHeight) {
            if (!poppedRef.current) {
                onMiss(id);
            }
        }
    }, [top, gameAreaRef, onMiss, id]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (poppedRef.current) return;
        poppedRef.current = true;
        const target = e.currentTarget;
        target.classList.add('animate-out', 'fade-out', 'scale-150');
        setTimeout(() => onPop(id, value), 200);
    };

    return <div onMouseDown={handleMouseDown} className="absolute text-3xl font-bold text-white bg-green-500 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer select-none" style={{ left, top: `${top}px` }}>{value}</div>;
};

// --- MAIN CHILD DASHBOARD COMPONENT ---
export function ChildDashboard() {
    const [currentView, setCurrentView] = useState<View>('child-home');
    const [currentDeck, setCurrentDeck] = useState<CardData[]>([]);
    const [selectedSubjectKey, setSelectedSubjectKey] = useState<keyof SubjectsData | null>(null);

    const PLAY_TIME_SECONDS = 300; // 5 minutes
    const COOLDOWN_SECONDS = 1800; // 30 minutes
    const [gameTimeRemaining, setGameTimeRemaining] = useState(PLAY_TIME_SECONDS);
    const [isGameTimerRunning, setIsGameTimerRunning] = useState(false);
    const [playtimeCooldownEnd, setPlaytimeCooldownEnd] = useState<number | null>(null);

    const gameTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const cooldownTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isGameTimerRunning && gameTimeRemaining > 0) {
            gameTimerIntervalRef.current = setInterval(() => {
                setGameTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (gameTimeRemaining <= 0) {
            if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current);
            setIsGameTimerRunning(false);
            setPlaytimeCooldownEnd(Date.now() + COOLDOWN_SECONDS * 1000);
            setCurrentView('game-selection'); 
        }
        return () => {
            if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current);
        };
    }, [isGameTimerRunning, gameTimeRemaining]);

    useEffect(() => {
        if (playtimeCooldownEnd) {
            cooldownTimerIntervalRef.current = setInterval(() => {
                if (Date.now() >= playtimeCooldownEnd) {
                    setPlaytimeCooldownEnd(null);
                    setGameTimeRemaining(PLAY_TIME_SECONDS);
                    if(cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current);
                } else {
                    setPlaytimeCooldownEnd(p => p);
                }
            }, 1000);
        }
        return () => {
            if (cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current);
        };
    }, [playtimeCooldownEnd]);

    const handleNavigate = (view: View) => {
        setCurrentView(view);
    };

     const handleStartGame = (game: 'english-game' | 'maths-game') => {
        if (playtimeCooldownEnd || gameTimeRemaining <= 0) return;
        if (!isGameTimerRunning) {
            setIsGameTimerRunning(true);
        }
        setCurrentView(game);
    };
    
    const handleCloseGame = () => {
        setIsGameTimerRunning(false);
        setCurrentView('game-selection');
    };

    const renderView = () => {
        switch (currentView) {
            case 'child-home':
                return <DashboardHome onNavigate={handleNavigate} />;
            case 'module-selection':
                 const subject = selectedSubjectKey ? subjectsData[selectedSubjectKey] : null;
                if (!subject) return <SubjectSelection onSelectSubject={(key) => {setSelectedSubjectKey(key);}} onBack={() => setCurrentView('child-home')} />;
                return <ModuleSelection subject={subject} onStartModule={(deck) => {setCurrentDeck(deck); setCurrentView('module');}} onBack={() => {setSelectedSubjectKey(null); setCurrentView('child-home');}} />;
            case 'module':
                return <LearningModule deck={currentDeck} onClose={() => setCurrentView('module-selection')} />;
            case 'game-selection':
                return <GameSelection 
                            onStartGame={handleStartGame} 
                            onBack={() => setCurrentView('child-home')}
                            gameTimeRemaining={gameTimeRemaining}
                            playtimeCooldownEnd={playtimeCooldownEnd}
                        />
            case 'english-game':
                return <EnglishGame onClose={handleCloseGame} />;
            case 'maths-game':
                return <MathsGame onClose={handleCloseGame} />;
            default:
                return <DashboardHome onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
           {renderView()}
        </div>
    );
}

