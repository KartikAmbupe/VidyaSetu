// components/child-dashboard/stories/ReadAlongStory.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, RotateCcw, Gauge } from "lucide-react";
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Story } from "../types";
import { stories } from "../data";

interface ReadAlongStoryProps {
    onClose: () => void;
}

export const ReadAlongStory: React.FC<ReadAlongStoryProps> = ({ onClose }) => {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [currentWordInSentence, setCurrentWordInSentence] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [rate, setRate] = useState(0.9);
    const [isMuted, setIsMuted] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const isSpeakingRef = useRef(false);

    const [simplifiedSentences, setSimplifiedSentences] = useState<string[] | null>(null);
    const [showSimplified, setShowSimplified] = useState<boolean>(false);
    const [isSimplifying, setIsSimplifying] = useState<boolean>(false);

    useEffect(() => { return () => { window.speechSynthesis.cancel(); isSpeakingRef.current = false; }; }, []);

    useEffect(() => {
        if (!selectedStory) {
            setSimplifiedSentences(null);
            setShowSimplified(false);
            return;
        }
      
        if (simplifiedSentences !== null || isSimplifying) return;
      
        const simplifyStory = async () => {
            setIsSimplifying(true);
            try {
                const response = await fetch('/api/simplify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ textToSimplify: selectedStory.text }),
                });
          
                if (!response.ok) {
                    throw new Error('API request failed');
                }
          
                const data = await response.json();
                setSimplifiedSentences(data.simplifiedSentences);
          
            } catch (error) {
                console.error('Failed to simplify story:', error);
                setSimplifiedSentences([]); // Set to empty array on error
            } finally {
                setIsSimplifying(false);
            }
        };
      
        simplifyStory();
      
    }, [selectedStory, simplifiedSentences, isSimplifying]);

    const speakSentence = (sentenceIndex: number) => {
        const currentSentences = (showSimplified && simplifiedSentences && simplifiedSentences.length > 0)
            ? simplifiedSentences
            : selectedStory?.sentences;

            if (!selectedStory || sentenceIndex >= selectedStory.sentences.length ||!currentSentences || sentenceIndex >= currentSentences.length) {
                setIsPlaying(false);
                isSpeakingRef.current = false;
                return;
            }
            
        const sentence = currentSentences[sentenceIndex];
        const utterance = new SpeechSynthesisUtterance(sentence);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google IN English') || v.name.includes('Microsoft Heera') || v.name.includes('Heera') || (v.lang.startsWith('en-') && v.name.includes('Female')));
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = rate;
        utterance.pitch = 1.05;
        utterance.volume = isMuted ? 0 : volume;
        utterance.lang = 'en-IN';

        let wordIndex = 0;
        utterance.onboundary = (event) => {
            if (event.name === 'word' && isSpeakingRef.current) {
                setCurrentWordInSentence(wordIndex);
                wordIndex++;
            }
        };
        utterance.onstart = () => { setCurrentSentenceIndex(sentenceIndex); setCurrentWordInSentence(0); };
        utterance.onend = () => { if (isSpeakingRef.current) { setTimeout(() => speakSentence(sentenceIndex + 1), 300); } };
        utterance.onerror = (event) => { console.error('Speech synthesis error:', event); setIsPlaying(false); isSpeakingRef.current = false; };
        window.speechSynthesis.speak(utterance);
        utteranceRef.current = utterance;
    };

    const handlePlayPause = () => {
        if (!selectedStory) return;
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            isSpeakingRef.current = false;
        } else {
            setIsPlaying(true);
            isSpeakingRef.current = true;
            speakSentence(currentSentenceIndex);
        }
    };

    const handleRestart = () => {
        window.speechSynthesis.cancel();
        setCurrentSentenceIndex(0);
        setCurrentWordInSentence(0);
        setIsPlaying(false);
        isSpeakingRef.current = false;
    };

    const getCurrentWordCount = () => {
        if (!selectedStory) return { current: 0, total: 0 };

        // Ensure calculations use the active sentence list
        const currentSentences = (showSimplified && simplifiedSentences && simplifiedSentences.length > 0)
            ? simplifiedSentences
            : selectedStory.sentences;
            
        let totalWords = currentSentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0);
        let currentWords = 0;
        
        currentSentences.forEach((sentence, idx) => {
            const wordCount = sentence.split(/\s+/).length;
            
            if (idx < currentSentenceIndex) {
                currentWords += wordCount;
            } else if (idx === currentSentenceIndex) {
                currentWords += currentWordInSentence;
            }
        });
        
        return { current: currentWords, total: totalWords };
    };

    const getTotalProgress = () => {
        const { current, total } = getCurrentWordCount();
        return total > 0 ? (current / total) * 100 : 0;
    };
    
    
    if (!selectedStory) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
                <Button onClick={onClose} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Story Menu</Button>
                <div className="text-center mb-12"><h1 className="text-5xl font-black text-gray-800 mb-4">📖 Read-Along Stories</h1><p className="text-2xl text-gray-600 font-semibold">Choose a story and follow along as the words light up!</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map((story) => (
                        <Card key={story.id} onClick={() => setSelectedStory(story)} className="cursor-pointer hover:scale-105 transition-transform duration-300 border-4 border-purple-200 hover:border-purple-400 overflow-hidden shadow-xl">
                            <img src={story.coverImage} alt={story.title} className="w-full h-64 object-cover" />
                            <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-pink-50"><h3 className="text-2xl font-bold text-purple-700 mb-2">{story.title}</h3><p className="text-gray-600 font-medium">by {story.author}</p></CardContent>
                            <div className="h-1 w-full bg-gray-100"><div className="h-full bg-green-500" style={{ width: '0%' }}></div></div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const progress = getTotalProgress();
    const wordCount = getCurrentWordCount();
    const activeSentences = (showSimplified && simplifiedSentences && simplifiedSentences.length > 0)
        ? simplifiedSentences
        : selectedStory.sentences;

        

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <Button onClick={() => { window.speechSynthesis.cancel(); setSelectedStory(null); }} className="mb-6 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Library</Button>
            <Card className="border-4 border-purple-300 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 p-6 text-white"><h2 className="text-4xl font-black mb-2">{selectedStory.title}</h2><p className="text-xl opacity-90">by {selectedStory.author}</p></div>
                <CardContent className="p-8">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl mb-6 min-h-[400px] border-4 border-yellow-200 shadow-inner">
                        <div className="text-3xl leading-relaxed font-semibold text-gray-800 space-y-4">
                            {selectedStory.sentences.map((sentence, sentenceIdx) => (
                                <p key={sentenceIdx} className="inline">
                                    {sentence.split(/\s+/).map((word, wordIdx) => (
                                        <span key={`${sentenceIdx}-${wordIdx}`} className={clsx("inline-block transition-all duration-200 px-2 py-1 rounded-lg mx-1", { 'bg-green-400 text-white scale-110 font-bold shadow-lg transform -translate-y-1': sentenceIdx === currentSentenceIndex && wordIdx === currentWordInSentence, 'text-gray-400': sentenceIdx < currentSentenceIndex || (sentenceIdx === currentSentenceIndex && wordIdx < currentWordInSentence) })}>{word}</span>
                                    ))}
                                    {' '}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4">
                            <Button onClick={handleRestart} variant="outline" size="lg" className="rounded-full w-16 h-16 border-2 hover:bg-gray-100"><RotateCcw size={28} /></Button>
                            <Button onClick={handlePlayPause} size="lg" className="rounded-full w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl transform hover:scale-105 transition-transform">{isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}</Button>
                            <Button onClick={() => setIsMuted(!isMuted)} variant="outline" size="lg" className="rounded-full w-16 h-16 border-2 hover:bg-gray-100">{isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}</Button>
                        </div>
                        <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm"><div className="flex items-center gap-4"><Volume2 size={20} className="text-gray-600" /><div className="flex-1"><p className="text-sm font-semibold text-gray-600 mb-2">Volume</p><Slider value={[isMuted ? 0 : volume]} max={1} step={0.1} onValueChange={(val) => setVolume(val[0])} disabled={isMuted} /></div><span className="text-sm font-bold text-gray-600 w-12 text-right">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                        </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm"><div className="flex items-center gap-4"><Gauge size={20} className="text-gray-600" /><div className="flex-1"><p className="text-sm font-semibold text-gray-600 mb-2">Reading Speed</p><Slider value={[rate]} min={0.5} max={1.5} step={0.1} onValueChange={(val) => setRate(val[0])} /></div><span className="text-sm font-bold text-gray-600 w-12 text-right">{rate.toFixed(1)}x</span></div></div>

                        {/* ---  PROGRESS INDICATOR JSX --- */}
                        <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-blue-700">Progress</span>
                                <span className="text-sm font-bold text-blue-700">
                                  {wordCount.current} / {wordCount.total} words
                                </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                            </div>
                         </div>

                         {/* ---  SIMPLIFY TOGGLE BUTTON JSX --- */}
                         <div className="text-center p-2">
                            {isSimplifying && (
                                <p className="font-semibold text-gray-600 animate-pulse">
                                  ✨ Simplifying text for you...
                                </p>
                            )}
                            {simplifiedSentences && simplifiedSentences.length > 0 && !isSimplifying && (
                                <Button
                                  onClick={() => {
                                    handleRestart(); // Stop TTS when toggling
                                    setShowSimplified(!showSimplified);
                                  }}
                                  variant="outline"
                                  className="border-2 border-purple-500 text-purple-600 font-bold hover:bg-purple-50 hover:text-purple-700"
                                >
                                  {showSimplified ? 'Show Original Text' : 'Show Simplified Text'}
                                </Button>
                            )}
                            {simplifiedSentences && simplifiedSentences.length === 0 && !isSimplifying && (
                                <p className="font-semibold text-red-500">
                                  ⚠️ Simplification failed. Showing original text.
                                </p>
                            )}
                         </div>

                         <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
                            <p className="text-center text-green-700 font-semibold text-lg">
                                👀 Follow the{' '}
                                <span className="bg-green-400 text-white px-3 py-1 rounded-lg shadow">
                                  green highlighted words
                                </span>{' '}
                                as the story plays!
                            </p>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};