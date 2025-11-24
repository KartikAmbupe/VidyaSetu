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
import { LockScreen } from './child-dashboard/Lockscreen';

export default function ChildDashboard() {
    const [currentView, setCurrentView] = useState<View>('child-home');
    const [currentDeck, setCurrentDeck] = useState<CardData[]>([]);
    const [selectedSubjectKey, setSelectedSubjectKey] = useState<keyof SubjectsData | null>(null);
    const [currentModuleInfo, setCurrentModuleInfo] = useState<{ subject: string; moduleName: string } | null>(null);

    const CURRENT_CHILD_ID = "654c6014e760c41d117462fa"; 

    // Game timer: 5 minutes play, 30 minutes cooldown
    const GAME_PLAY_TIME_SECONDS = 300; 
    const GAME_COOLDOWN_SECONDS = 1800; 

    // Parent timer: for learning activities (quiz, learning module, stories)
    const [parentTimeRemaining, setParentTimeRemaining] = useState(0); // in seconds
    const [isParentTimerRunning, setIsParentTimerRunning] = useState(false);
    
    // Game timer: separate timer for gaming modules
    const [gameTimeRemaining, setGameTimeRemaining] = useState(GAME_PLAY_TIME_SECONDS);
    const [isGameTimerRunning, setIsGameTimerRunning] = useState(false);
    const [playtimeCooldownEnd, setPlaytimeCooldownEnd] = useState<number | null>(null);
    
    // Track active learning activity
    const [isLearningActivityActive, setIsLearningActivityActive] = useState(false);
    
    const [tourStep, setTourStep] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const gameTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const cooldownTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const tourIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const parentTimerRef = useRef<number>(0); // Track current timer value

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

        // Function to send Heartbeat to the server (for parent timer)
        const sendHeartbeat = async () => {
            try {
                await fetch("/api/settings/heartbeat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ childId: CURRENT_CHILD_ID }),
                });
            } catch (error) {
                console.error("Heartbeat failed:", error);
            }
        };

        useEffect(() => {
            if (isParentTimerRunning && isLearningActivityActive && !playtimeCooldownEnd) {
                // Start heartbeat timer only when parent timer is running and learning activity is active
                heartbeatIntervalRef.current = setInterval(() => {
                    sendHeartbeat();
                }, 60000); // Send heartbeat every 60 seconds (1 minute)
    
            } else if (heartbeatIntervalRef.current) {
                // Stop heartbeat if timer is not running or app is locked
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
    
            return () => { 
                if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current); 
            };
        }, [isParentTimerRunning, isLearningActivityActive, playtimeCooldownEnd]);
    

    useEffect(() => {
        async function checkTimeAndInitialize() {
            try {
                // 1. Check time limit (for parent timer)
                const checkRes = await fetch(`/api/settings/check-time?childId=${CURRENT_CHILD_ID}`);
                const checkData = await checkRes.json();

                if (checkData.status === "LOCKED") {
                    setCurrentView("locked-screen");
                    setPlaytimeCooldownEnd(checkData.until);
                    setIsParentTimerRunning(false);
                    setIsGameTimerRunning(false);
                    return;
                }

                // 2. If OK, set the remaining time for parent timer (but don't start it yet)
                const minutesLeft = checkData.minutesLeft;
                const timeInSeconds = minutesLeft * 60;
                setParentTimeRemaining(timeInSeconds);
                parentTimerRef.current = timeInSeconds; // Sync ref
                // Don't start parent timer automatically - it will start when learning activity begins

                // 3. Initialize game timer separately (5 minutes)
                setGameTimeRemaining(GAME_PLAY_TIME_SECONDS);
            } catch (error) {
                console.error("Failed to check time:", error);
            }
        }

        checkTimeAndInitialize();
    }, []); // Runs only on mount

    // Parent timer: only ticks when learning activity is active
    useEffect(() => {
        if (isParentTimerRunning && isLearningActivityActive) {
            const parentTimerInterval = setInterval(() => {
                setParentTimeRemaining(prev => {
                    const newTime = prev <= 1 ? 0 : prev - 1;
                    parentTimerRef.current = newTime; // Keep ref in sync
                    return newTime;
                });
            }, 1000);
            
            return () => clearInterval(parentTimerInterval);
        }
    }, [isParentTimerRunning, isLearningActivityActive]);

    // Check if parent timer reached zero
    useEffect(() => {
        if (isParentTimerRunning && parentTimeRemaining === 0) {
            setIsParentTimerRunning(false);
            setIsLearningActivityActive(false);
            triggerExitAndNavigate('locked-screen');
        }
    }, [parentTimeRemaining, isParentTimerRunning]);

    // Game timer: ticks when game is running
    useEffect(() => {
        if (isGameTimerRunning) {
            gameTimerIntervalRef.current = setInterval(() => { 
                setGameTimeRemaining(prev => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                }); 
            }, 1000);
        }
        
        return () => { 
            if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current); 
        };
    }, [isGameTimerRunning]);
    

    useEffect(() => {
        if (isGameTimerRunning && gameTimeRemaining === 0) {
            setIsGameTimerRunning(false);
            // Set 30 minute cooldown for games
            setPlaytimeCooldownEnd(Date.now() + GAME_COOLDOWN_SECONDS * 1000);
            // Navigate back to game selection (which will show cooldown)
            triggerExitAndNavigate('game-selection');
        }
    }, [gameTimeRemaining, isGameTimerRunning]);

    useEffect(() => { 
        if (playtimeCooldownEnd) { 
            cooldownTimerIntervalRef.current = setInterval(() => { 
                if (Date.now() >= playtimeCooldownEnd) { 
                    setPlaytimeCooldownEnd(null);
                    // Reset game timer when cooldown ends
                    setGameTimeRemaining(GAME_PLAY_TIME_SECONDS);
                    if (cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current); 
                }
            }, 1000); 
        } 
        return () => { 
            if (cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current); 
        }; 
    }, [playtimeCooldownEnd]);

    

    // useEffect(() => { if (isGameTimerRunning && gameTimeRemaining > 0) { gameTimerIntervalRef.current = setInterval(() => { setGameTimeRemaining(prev => prev - 1); }, 1000); } else if (gameTimeRemaining <= 0) { if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current); setIsGameTimerRunning(false); setPlaytimeCooldownEnd(Date.now() + COOLDOWN_SECONDS * 1000); setCurrentView('game-selection'); } return () => { if (gameTimerIntervalRef.current) clearInterval(gameTimerIntervalRef.current); }; }, [isGameTimerRunning, gameTimeRemaining]);
    // useEffect(() => { if (playtimeCooldownEnd) { cooldownTimerIntervalRef.current = setInterval(() => { if (Date.now() >= playtimeCooldownEnd) { setPlaytimeCooldownEnd(null); setGameTimeRemaining(PLAY_TIME_SECONDS); if (cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current); } else { setPlaytimeCooldownEnd(p => p); } }, 1000); } return () => { if (cooldownTimerIntervalRef.current) clearInterval(cooldownTimerIntervalRef.current); }; }, [playtimeCooldownEnd]);

    

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

    const checkTimeRemainingAndNavigate = async (targetView: View) => {
        try {
            // Check server time immediately (for parent timer)
            const checkRes = await fetch(`/api/settings/check-time?childId=${CURRENT_CHILD_ID}`);
            const checkData = await checkRes.json();
    
            if (checkData.status === "LOCKED") {
                // If locked, immediately show the lock screen
                setPlaytimeCooldownEnd(checkData.until);
                setIsParentTimerRunning(false);
                setIsGameTimerRunning(false);
                setIsLearningActivityActive(false);
                triggerExitAndNavigate('locked-screen');
            } else {
                // If not locked, update the parent timer and navigate to the target view
                const minutesLeft = checkData.minutesLeft;
                const timeInSeconds = minutesLeft * 60;
                setParentTimeRemaining(timeInSeconds);
                parentTimerRef.current = timeInSeconds;
                triggerExitAndNavigate(targetView);
            }
        } catch (error) {
            console.error("Failed time check during navigation:", error);
            // Fallback: still navigate back even if check failed
            triggerExitAndNavigate(targetView);
        }
    };


    const handleNavigate = (view: View) => {
        if (view === 'module-selection') playAudio(["Great choice! It's time to learn something new.", "What would you like to learn today?"]);
        if (view === 'game-selection') playAudio("Let's play a game!");
        if (view === 'story-time') playAudio("Awesome, let's have an adventure!");
        if (view === 'quiz-suite') {
            playAudio("Time for a challenge! Let's check your learning!");
            // Start parent timer when entering quiz suite
            setIsLearningActivityActive(true);
            setIsParentTimerRunning(true);
            fetch("/api/settings/start-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ childId: CURRENT_CHILD_ID }),
            }).catch(err => console.error("Failed to start session:", err));
        }
        if (view === 'interactive-story') {
            // Start parent timer immediately for interactive stories
            setIsLearningActivityActive(true);
            setIsParentTimerRunning(true);
            fetch("/api/settings/start-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ childId: CURRENT_CHILD_ID }),
            }).catch(err => console.error("Failed to start session:", err));
        }
        triggerExitAndNavigate(view);
    };

    const handleBack = () => {
        if (typeof window.speechSynthesis !== 'undefined') speechSynthesis.cancel();
        
        // Stop parent timer when leaving learning activities
        if (currentView === 'quiz-suite' || currentView === 'interactive-story' || currentView === 'read-along-story') {
            setIsLearningActivityActive(false);
            setIsParentTimerRunning(false);
        }
        
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

    const handleStartModule = (deck: CardData[], moduleTitle: string) => {
        // Start parent timer when learning module starts
        setIsLearningActivityActive(true);
        setIsParentTimerRunning(true);
        // Start session on server
        fetch("/api/settings/start-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ childId: CURRENT_CHILD_ID }),
        }).catch(err => console.error("Failed to start session:", err));
        
        // Determine subject name from selectedSubjectKey
        const subjectName = selectedSubjectKey === 'english' ? 'English Fun' : 'Math Adventures';
        
        // Store module info for completion tracking
        setCurrentModuleInfo({
            subject: subjectName,
            moduleName: moduleTitle
        });
        
        triggerExitAndNavigate('module', () => setCurrentDeck(deck));
    };

    const handleSubjectSelect = (key: keyof SubjectsData) => {
        setSelectedSubjectKey(key);
        if (key === 'english') playAudio("English Fun it is! Awesome!");
        else if (key === 'maths') playAudio("Math Adventures, let's go!");
    };

    const logActivity = async (type: string, score: number, durationSeconds: number) => {
        try {
            await fetch("/api/activity/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    childId: CURRENT_CHILD_ID,
                    activityType: type,
                    score: score,
                    timeSpent: durationSeconds, // Stored in seconds
                }),
            });
        } catch (error) {
            console.error("Failed to log activity:", error);
        }
    };

    const handleCloseModule = async (totalCardsViewed: number, durationSeconds: number) => {
        if (typeof window.speechSynthesis !== 'undefined') speechSynthesis.cancel();
        
        // Stop parent timer when leaving learning module
        setIsLearningActivityActive(false);
        setIsParentTimerRunning(false);
        
        // Log the activity. We use totalCardsViewed as the 'score' for reporting.
        await logActivity('Learning Module', totalCardsViewed, durationSeconds);
        
        // Mark module as completed if we have module info and all cards were viewed
        if (currentModuleInfo && totalCardsViewed >= currentDeck.length) {
            try {
                await fetch("/api/module/complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        childId: CURRENT_CHILD_ID,
                        subject: currentModuleInfo.subject,
                        moduleName: currentModuleInfo.moduleName
                    }),
                });
            } catch (error) {
                console.error("Failed to mark module as completed:", error);
            }
        }
        
        // Clear module info
        setCurrentModuleInfo(null);
        
        // Calculate new time by subtracting the time spent from current timer value
        // Use the ref to get the most current value
        const currentTime = parentTimerRef.current;
        const newTime = Math.max(0, currentTime - durationSeconds);
        
        // Update both state and ref
        setParentTimeRemaining(newTime);
        parentTimerRef.current = newTime;
        
        // Check if timer reached zero
        if (newTime <= 0) {
            // Timer reached zero, check server for lock status
            try {
                const checkRes = await fetch(`/api/settings/check-time?childId=${CURRENT_CHILD_ID}`);
                const checkData = await checkRes.json();
                
                if (checkData.status === "LOCKED") {
                    setPlaytimeCooldownEnd(checkData.until);
                    setIsParentTimerRunning(false);
                    setIsLearningActivityActive(false);
                    triggerExitAndNavigate('locked-screen');
                } else {
                    // Update with server value (should be 0 or very close)
                    const minutesLeft = checkData.minutesLeft;
                    const timeInSeconds = minutesLeft * 60;
                    setParentTimeRemaining(timeInSeconds);
                    parentTimerRef.current = timeInSeconds;
                    triggerExitAndNavigate('module-selection');
                }
            } catch (err) {
                console.error("Failed time check:", err);
                triggerExitAndNavigate('module-selection');
            }
        } else {
            // Timer still has time, navigate normally without checking server
            // This prevents the timer from being reset incorrectly
            triggerExitAndNavigate('module-selection');
        }
    };

    const handleStartGame = (game: 'english-game' | 'maths-game') => {
        if (playtimeCooldownEnd || gameTimeRemaining <= 0) return;
        // Start game timer when game starts
        setIsGameTimerRunning(true);
        triggerExitAndNavigate(game);
    };

    

    const handleCloseGame = (finalScore: number,gameDurationSeconds: number) => {
        if (typeof window.speechSynthesis !== 'undefined') speechSynthesis.cancel();
        
        // Stop game timer when leaving game
        setIsGameTimerRunning(false);
        
        logActivity(currentView === 'english-game' ? 'English Game' : 'Math Game', finalScore, gameDurationSeconds); 

        checkTimeRemainingAndNavigate('game-selection')
    };

    const renderView = () => {
        switch (currentView) {
            case 'child-home': return <DashboardHome onNavigate={handleNavigate} parentTimeRemaining={parentTimeRemaining} />;
            case 'module-selection':
                return selectedSubjectKey 
                    ? <ModuleSelection subject={subjectsData[selectedSubjectKey]} onStartModule={handleStartModule} onBack={handleBack} />
                    : <SubjectSelection onSelectSubject={handleSubjectSelect} onBack={handleBack} />;
            case 'module': return <LearningModule deck={currentDeck} onClose={handleCloseModule} />;
            case 'game-selection': return <GameSelection onStartGame={handleStartGame} onBack={handleBack} gameTimeRemaining={gameTimeRemaining} playtimeCooldownEnd={playtimeCooldownEnd} />;
            case 'english-game': return <EnglishGame onClose={handleCloseGame} playAudio={playAudio} />;
            case 'maths-game': return <MathsGame onClose={handleCloseGame} />;
            case 'story-time': return <StoryTimeSelection onNavigate={handleNavigate} onBack={handleBack} />;
            case 'interactive-story': return <InteractiveStory onBack={handleBack} playAudio={playAudio} />;
            case 'read-along-story': {
                const handleStoryStart = () => {
                    setIsLearningActivityActive(true);
                    setIsParentTimerRunning(true);
                    fetch("/api/settings/start-session", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ childId: CURRENT_CHILD_ID }),
                    }).catch(err => console.error("Failed to start session:", err));
                };
                const handleStoryEnd = () => {
                    setIsLearningActivityActive(false);
                    setIsParentTimerRunning(false);
                };
                return <ReadAlongStory onClose={handleBack} onStoryStart={handleStoryStart} onStoryEnd={handleStoryEnd} />;
            }
            case 'quiz-suite': {
                const handleQuizStart = () => {
                    setIsLearningActivityActive(true);
                    setIsParentTimerRunning(true);
                };
                const handleQuizEnd = () => {
                    setIsLearningActivityActive(false);
                    setIsParentTimerRunning(false);
                };
                return <AdaptiveLearningSuite onExit={handleBack} onQuizStart={handleQuizStart} onQuizEnd={handleQuizEnd} />;
            }
            case 'locked-screen': return <LockScreen playtimeCooldownEnd={playtimeCooldownEnd} />
            default: return <DashboardHome onNavigate={handleNavigate} parentTimeRemaining={parentTimeRemaining} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 pb-40">
            {renderView()}
            <SmartMascot currentView={currentView} isSpeaking={false} tourStep={tourStep} isExiting={isExiting} />
        </div>
    );
}