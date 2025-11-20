// components/child-dashboard/SmartMascot.tsx
import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";
import { View } from "./types";

interface SmartMascotProps {
    currentView: View;
    isSpeaking: boolean;
    tourStep: number;
    isExiting: boolean;
}

const Sparkle = ({ style }: { style: React.CSSProperties }) => (
    <div className="absolute animate-ping opacity-75" style={{ ...style, width: '8px', height: '8px', backgroundColor: '#FCD34D', borderRadius: '50%', zIndex: 10 }} />
);

export const SmartMascot: React.FC<SmartMascotProps> = ({ currentView, isSpeaking, tourStep, isExiting }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [pose, setPose] = useState<'idle' | 'teaching' | 'happy'>('idle');

    const getMascotState = () => {
        switch (currentView) {
            case 'child-home': return { text: "Welcome back! Pick a card to start.", pose: 'idle' };
            case 'module-selection':
                const texts = ["Check this out!", "Or maybe this one?", "This looks fun too!"];
                return { text: texts[tourStep % 3], pose: 'teaching' };
            case 'game-selection': return { text: "It's game time! Win some stars! 🌟", pose: 'happy' };
            case 'english-game': return { text: "You can do it! Match the letters!", pose: 'idle' };
            case 'maths-game': return { text: "Be quick! Catch the numbers!", pose: 'happy' };
            case 'story-time': return { text: "Shh... let's listen to a story.", pose: 'idle' };
            default: return { text: "I'm here to help!", pose: 'idle' };
        }
    };

    const state = getMascotState();

    useEffect(() => { setPose(state.pose as any); }, [currentView, tourStep]);

    if (!isVisible) return (
        <Button onClick={() => setIsVisible(true)} className="fixed bottom-4 right-4 rounded-full w-16 h-16 bg-amber-400 border-4 border-white shadow-xl z-50 flex items-center justify-center animate-bounce"><span className="text-3xl">🐝</span></Button>
    );

    let positionClasses = "fixed bottom-6 right-6 z-50 flex flex-col items-end";
    if (isExiting) {
        positionClasses = "fixed top-[-200px] right-[-200px] z-50 transition-all duration-700 ease-in-out transform rotate-45 scale-50";
    } else if (currentView === 'module-selection') {
        if (tourStep === 0) positionClasses = "fixed bottom-10 left-[15%] z-50 flex flex-col items-center";
        else if (tourStep === 1) positionClasses = "fixed bottom-10 left-[50%] translate-x-[-50%] z-50 flex flex-col items-center";
        else positionClasses = "fixed bottom-10 left-[85%] translate-x-[-100%] z-50 flex flex-col items-center";
    }

    let shouldFlip = false;
    if (isExiting) shouldFlip = true;
    else if (currentView === 'module-selection' && tourStep !== 2) shouldFlip = true;

    return (
        <div className={`${positionClasses} transition-all duration-700 ease-in-out pointer-events-none`}>
            <div className={clsx("pointer-events-auto bg-white p-4 rounded-2xl shadow-xl border-4 border-amber-300 mb-2 max-w-xs relative transform transition-all duration-300", isExiting ? "opacity-0 scale-0" : "opacity-100 scale-100 hover:scale-110", (currentView === 'module-selection' && tourStep !== 2) ? 'rounded-bl-none' : 'rounded-br-none')}>
                <button onClick={() => setIsVisible(false)} className="absolute -top-3 -left-3 bg-red-400 text-white rounded-full p-1 hover:bg-red-500 z-10 shadow-sm"><X size={12} strokeWidth={3} /></button>
                <p className="text-lg font-black text-gray-700 leading-tight">{state.text}</p>
            </div>
            <div className={clsx("relative transition-all duration-500 pointer-events-auto", "animate-float", isSpeaking && "animate-bounce-rhythm", pose === 'happy' && "animate-bounce")}>
                <Sparkle style={{ top: '-10px', right: '10px', animationDelay: '0s' }} />
                <Sparkle style={{ top: '50%', left: '-10px', animationDelay: '0.5s' }} />
                <div className="w-48 h-48 md:w-60 md:h-60 relative filter drop-shadow-2xl">
                    <img src="/bee-mascot.gif" alt="Vidya Bee" className={clsx("w-full h-full object-contain transition-transform duration-500", shouldFlip ? "scale-x-[-1] rotate-6" : "")} onError={(e) => { e.currentTarget.src = "https://placehold.co/300x300/f59e0b/FFFFFF?text=🐝"; }} />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-sm font-black px-4 py-1 rounded-full border-2 border-white shadow-lg whitespace-nowrap rotate-2">Vidya Bee</div>
            </div>
            <style jsx global>{` @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } } .animate-float { animation: float 2.5s ease-in-out infinite; } @keyframes bounce-rhythm { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05) translateY(-5px); } } .animate-bounce-rhythm { animation: bounce-rhythm 0.5s ease-in-out infinite; } `}</style>
        </div>
    );
};