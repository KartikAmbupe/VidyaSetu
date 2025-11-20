// components/child-dashboard/LearningModule.tsx
import React, { useState, useEffect } from 'react';
import { Volume2 } from "lucide-react";
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardData } from "./types";

interface LearningModuleProps {
    deck: CardData[];
    onClose: () => void;
}

export const LearningModule: React.FC<LearningModuleProps> = ({ deck, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [useSimpleText, setUseSimpleText] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    
    const card = deck[currentIndex];

    useEffect(() => {
        const loadVoices = () => { setVoices(window.speechSynthesis.getVoices()); };
        if (typeof window.speechSynthesis !== 'undefined') {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }
        return () => {
            if (typeof window.speechSynthesis !== 'undefined') {
                window.speechSynthesis.onvoiceschanged = null;
                speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = (text: string) => {
        if (typeof window.speechSynthesis === 'undefined' || voices.length === 0) {
            console.error("TTS not supported or voices not loaded.");
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const preferredVoice = voices.find(v => v.name === 'Microsoft Heera - English (India)') || voices.find(v => v.lang === 'en-IN') || voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-'));
        utterance.voice = preferredVoice || voices[0];
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    };

    const textToDisplay = useSimpleText ? card.simpleText : card.text;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
            <Card className="relative w-full max-w-2xl p-8 flex flex-col md:flex-row items-center gap-8 border-gray-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl">&times;</button>
                <div className="flex-1 text-center md:text-left w-full">
                    <img src={card.image} alt="Learning Image" className="w-full h-48 object-contain rounded-xl mb-4 bg-gray-50 p-2 border" />
                    <p className={clsx("font-bold text-gray-800 mb-4 h-20 flex items-center justify-center md:justify-start", useSimpleText ? 'text-2xl' : 'text-5xl')}>{textToDisplay}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                        <Button onClick={() => speak(textToDisplay)} className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600"><Volume2 size={24} /></Button>
                        <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-full border">
                            <Button onClick={() => setUseSimpleText(false)} className={clsx("px-4 text-md transition-all duration-200", !useSimpleText ? 'bg-white shadow rounded-full text-gray-800' : 'bg-transparent text-gray-500')}>Letter</Button>
                            <Button onClick={() => setUseSimpleText(true)} className={clsx("px-4 text-md transition-all duration-200", useSimpleText ? 'bg-white shadow rounded-full text-gray-800' : 'bg-transparent text-gray-500')}>Example</Button>
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