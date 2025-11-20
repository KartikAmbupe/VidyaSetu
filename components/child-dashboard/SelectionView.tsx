// components/child-dashboard/SelectionViews.tsx
import React from 'react';
import { ArrowLeft, BookText, Zap } from "lucide-react";
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { subjectsData } from './data';
import { Subject, CardData, SubjectsData, View } from "./types";

// --- SUBJECT SELECTION ---
export const SubjectSelection: React.FC<{ onSelectSubject: (subjectKey: keyof SubjectsData) => void; onBack: () => void; }> = ({ onSelectSubject, onBack }) => (
    <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
        <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Dashboard</Button>
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

// --- MODULE SELECTION ---
export const ModuleSelection: React.FC<{ subject: Subject; onStartModule: (deck: CardData[]) => void; onBack: () => void; }> = ({ subject, onStartModule, onBack }) => (
    <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
        <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Subjects</Button>
        <h1 className={clsx("text-4xl text-center mb-2 font-bold", subject.textColor)}>{subject.title}</h1>
        <p className="text-xl text-center text-gray-600 mb-12">{subject.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.modules.map(module => (
                <Card key={module.title} onClick={() => onStartModule(module.deck)} className={clsx("p-6 h-full flex flex-col justify-between cursor-pointer", subject.borderColor, subject.bgColor, subject.hoverBgColor)}>
                    <div><h2 className={clsx("text-2xl font-bold mb-2", subject.textColor)}>{module.title}</h2><p className="text-gray-700">{module.description}</p></div>
                    <div className="text-right mt-4 font-bold text-gray-500">Start &rarr;</div>
                </Card>
            ))}
        </div>
    </div>
);

// --- GAME SELECTION ---
export const GameSelection: React.FC<{ onStartGame: (game: 'english-game' | 'maths-game') => void; onBack: () => void; gameTimeRemaining: number; playtimeCooldownEnd: number | null; }> = ({ onStartGame, onBack, gameTimeRemaining, playtimeCooldownEnd }) => {
    const formatTime = (seconds: number) => new Date(seconds * 1000).toISOString().substr(14, 5);
    const CooldownMessage = () => { if (!playtimeCooldownEnd) return null; const remaining = Math.round((playtimeCooldownEnd - Date.now()) / 1000); return (<div className="text-center mt-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200"><p className="text-xl font-bold">Games are resting! Come back in {formatTime(remaining > 0 ? remaining : 0)}.</p></div>); };
    return (
        <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
            <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Dashboard</Button>
            <h1 className="text-4xl text-center text-gray-800 font-bold mb-2">Choose a Game</h1>
            <p className="text-xl text-center text-gray-600 mb-8">Let's play and learn!</p>
            <div className="text-center mb-6 p-3 bg-white rounded-lg shadow-sm border max-w-sm mx-auto"><p className="text-2xl">Play Time Remaining: <span className="font-bold text-teal-600">{formatTime(gameTimeRemaining)}</span></p></div>
            <div className={clsx("grid grid-cols-1 md:grid-cols-2 gap-8", { "opacity-50 pointer-events-none": !!playtimeCooldownEnd })}>
                <Card onClick={() => onStartGame('english-game')} className="p-6 border-rose-400 bg-rose-50 hover:bg-rose-100 cursor-pointer"><h2 className="text-3xl font-bold text-rose-700 mb-3">Letter Match</h2><p className="text-lg text-gray-700">Match the letter to the right picture!</p></Card>
                <Card onClick={() => onStartGame('maths-game')} className="p-6 border-green-400 bg-green-50 hover:bg-green-100 cursor-pointer"><h2 className="text-3xl font-bold text-green-700 mb-3">Number Catch</h2><p className="text-lg text-gray-700">Catch the falling numbers!</p></Card>
            </div>
            <CooldownMessage />
        </div>
    );
};

// --- STORY SELECTION ---
export const StoryTimeSelection: React.FC<{ onNavigate: (view: View) => void, onBack: () => void }> = ({ onNavigate, onBack }) => (
    <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
        <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Dashboard</Button>
        <h1 className="text-4xl text-center text-gray-800 font-bold mb-2">Story Time</h1>
        <p className="text-xl text-center text-gray-600 mb-12">How would you like to enjoy a story today?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card onClick={() => onNavigate('read-along-story')} className="p-6 border-purple-400 bg-purple-50 hover:bg-purple-100 cursor-pointer"><div className="flex flex-col items-center text-center"><BookText size={48} className="text-purple-600 mb-4" /><h2 className="text-3xl font-bold text-purple-700 mb-3">Read-Along Stories</h2><p className="text-lg text-gray-700">Listen to stories with words that light up as they are read to you.</p></div></Card>
            <Card onClick={() => onNavigate('interactive-story')} className="p-6 border-indigo-400 bg-indigo-50 hover:bg-indigo-100 cursor-pointer"><div className="flex flex-col items-center text-center"><Zap size={48} className="text-indigo-600 mb-4" /><h2 className="text-3xl font-bold text-indigo-700 mb-3">Interactive Adventures</h2><p className="text-lg text-gray-700">You decide what happens next!</p></div></Card>
        </div>
    </div>
);