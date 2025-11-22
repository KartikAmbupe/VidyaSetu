"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAudioCompanion } from "@/hooks/useAudioCompanion";
import { subjectsData } from "./child-dashboard/data";
import { View, CardData, SubjectsData } from "./child-dashboard/types";
import { SmartMascot } from "./child-dashboard/Mascot"; 

import { DashboardHome } from "./child-dashboard/DashboardHome";
import { LearningModule } from "./child-dashboard/LearningModule";
import { EnglishGame } from "./child-dashboard/games/EnglishGame";
import { MathsGame } from "./child-dashboard/games/MathsGame";
import { ReadAlongStory } from "./child-dashboard/stories/ReadAlongStory";
import { InteractiveStory } from "./child-dashboard/stories/InteractiveStory";
import { SubjectSelection, ModuleSelection, GameSelection, StoryTimeSelection } from "./child-dashboard/SelectionView";
import AdaptiveLearningSuite from './child-dashboard/quiz/AdaptiveLearningSuite';

export default function ChildDashboard() {
    const [currentView, setCurrentView] = useState<View>('child-home');
    const [currentDeck, setCurrentDeck] = useState<CardData[]>([]);
    const [selectedSubjectKey, setSelectedSubjectKey] = useState<keyof SubjectsData | null>(null);

    const PLAY_TIME_SECONDS = 300; 
    const COOLDOWN_SECONDS = 1800; 
    const [gameTimeRemaining, setGameTimeRemaining] = useState(PLAY_TIME_SECONDS);
    const [isGameTimerRunning, setIsGameTimerRunning] = useState(false);
    const [playtimeCooldownEnd, setPlaytimeCooldownEnd] = useState<number | null>(null);
    
    const [tourStep, setTourStep] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const gameTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const cooldownTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const tourIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { playAudio, isReady } = useAudioCompanion();
    const hasWelcomed = useRef(false);

    // --- FIXED: Audio triggers immediately without click ---
    useEffect(() => {
        if (isReady && !hasWelcomed.current) {
            // 500ms delay ensures the browser is ready to play audio
            const timer = setTimeout(() => {
                playAudio("Hi Sam! It's me, Vidya Bee! I'm so happy to see you. Are you ready for a fun learning adventure today?");
                hasWelcomed.current = true;
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isReady, playAudio]);

    useEffect(() => { if (isGameTimerRunning && gameTimeRemaining > 0) { gameTimerIntervalRef.current = setInterval(() => { setGameTimeRemaining(prev => prev - 1); }, 1000); } else if (gameTimeRemaining <= 0) { if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current); setIsGameTimerRunning(false); setPlaytimeCooldownEnd(Date.now() + COOLDOWN_SECONDS * 1000); setCurrentView('game-selection'); } return () => { if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current); }; }, [isGameTimerRunning, gameTimeRemaining]);
    useEffect(() => { if (playtimeCooldownEnd) { cooldownTimerIntervalRef.current = setInterval(() => { if (Date.now() >= playtimeCooldownEnd) { setPlaytimeCooldownEnd(null); setGameTimeRemaining(PLAY_TIME_SECONDS); if (cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current); } else { setPlaytimeCooldownEnd(p => p); } }, 1000); } return () => { if (cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current); }; }, [playtimeCooldownEnd]);

    useEffect(() => {
        if (currentView === 'module-selection') {
            tourIntervalRef.current = setInterval(() => {
                setTourStep(prev => (prev + 1) % 3);
            }, 3500);
        } else {
            if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
            setTourStep(0);
        }
        return () => { if (tourIntervalRef.current) clearInterval(tourIntervalRef.current); };
    }, [currentView]);

    const triggerExitAndNavigate = (nextView: View, callback?: () => void) => {
        setIsExiting(true);
        setTimeout(() => {
            setCurrentView(nextView);
            setIsExiting(false);
            if (callback) callback();
        }, 800);
    };

    const handleNavigate = (view: View) => {
        if (view === 'module-selection') playAudio(["Great choice! It's time to learn something new.", "What would you like to learn today?"]);
        if (view === 'game-selection') playAudio("Let's play a game!");
        if (view === 'story-time') playAudio("Awesome, let's have an adventure!");
        if (view === 'quiz-suite') playAudio("Time for a challenge! Let's check your learning!"); 
        triggerExitAndNavigate(view);
        
        
    };

    const handleBack = () => {
        if (typeof window.speechSynthesis !== 'undefined') speechSynthesis.cancel();
        setIsExiting(true);
        setTimeout(() => {
            if (currentView === 'module-selection' && selectedSubjectKey) setSelectedSubjectKey(null);
            else if (currentView === 'quiz-suite') setCurrentView('child-home');
            else if (currentView === 'module') setCurrentView('module-selection');
            else if (currentView === 'interactive-story' || currentView === 'read-along-story') setCurrentView('story-time');
            else setCurrentView('child-home');
            setIsExiting(false);
        }, 600);
    };

    const handleStartModule = (deck: CardData[]) => {
        triggerExitAndNavigate('module', () => setCurrentDeck(deck));
    };

    const handleSubjectSelect = (key: keyof SubjectsData) => {
        setSelectedSubjectKey(key);
        if (key === 'english') playAudio("English Fun it is! Awesome!");
        else if (key === 'maths') playAudio("Math Adventures, let's go!");
    };

    const handleStartGame = (game: 'english-game' | 'maths-game') => {
        if (playtimeCooldownEnd || gameTimeRemaining <= 0) return;
        if (!isGameTimerRunning) setIsGameTimerRunning(true);
        triggerExitAndNavigate(game);
    };

    const handleCloseGame = () => {
        if (typeof window.speechSynthesis !== 'undefined') speechSynthesis.cancel();
        setIsGameTimerRunning(false);
        triggerExitAndNavigate('game-selection');
    };

    const renderView = () => {
        switch (currentView) {
            case 'child-home': return <DashboardHome onNavigate={handleNavigate} />;
            case 'module-selection':
                return selectedSubjectKey 
                    ? <ModuleSelection subject={subjectsData[selectedSubjectKey]} onStartModule={handleStartModule} onBack={handleBack} />
                    : <SubjectSelection onSelectSubject={handleSubjectSelect} onBack={handleBack} />;
            case 'module': return <LearningModule deck={currentDeck} onClose={handleBack} />;
            case 'game-selection': return <GameSelection onStartGame={handleStartGame} onBack={handleBack} gameTimeRemaining={gameTimeRemaining} playtimeCooldownEnd={playtimeCooldownEnd} />;
            case 'english-game': return <EnglishGame onClose={handleCloseGame} playAudio={playAudio} />;
            case 'maths-game': return <MathsGame onClose={handleCloseGame} />;
            case 'story-time': return <StoryTimeSelection onNavigate={handleNavigate} onBack={handleBack} />;
            case 'interactive-story': return <InteractiveStory onBack={handleBack} playAudio={playAudio} />;
            case 'read-along-story': return <ReadAlongStory onClose={handleBack} />;
            case 'quiz-suite': return <AdaptiveLearningSuite onExit={handleBack} />;
            default: return <DashboardHome onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 pb-40">
            {renderView()}
            <SmartMascot currentView={currentView} isSpeaking={false} tourStep={tourStep} isExiting={isExiting} />
        </div>
    );
}