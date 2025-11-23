// components/child-dashboard/games/EnglishGame.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EnglishQuestion } from "../types";
import { quizEndMessages } from "../data";

interface EnglishGameProps {
    // onClose: () => void;
    // playAudio: (text: string) => void;
    onClose: (score: number, duration: number) => void;
    playAudio: (text: string | string[]) => void;
}

export const EnglishGame: React.FC<EnglishGameProps> = ({ onClose, playAudio }) => {
    const [questions, setQuestions] = useState<EnglishQuestion[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ text: string, color: string } | null>(null);
    const [gameState, setGameState] = useState<'loading' | 'active' | 'finished' | 'error'>('loading');
    const [endMessage, setEndMessage] = useState('');

    const startTimeRef = useRef(Date.now()); 

    const generateQuiz = useCallback(async () => {
        setGameState('loading');
        startTimeRef.current = Date.now();
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Gemini API key is missing.");
            setGameState('error');
            return;
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const prompt = "Generate a JSON array of 10 unique quiz questions for a 'letter match' game. Each object must have 'letter', 'correct', and 'options' properties. The two distractor nouns in 'options' MUST NOT start with the question's 'letter'. All words must be for a 5-7 year old. IMPORTANT: Respond ONLY with the raw JSON array, without any surrounding text or markdown formatting.";
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        const maxRetries = 3;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
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
        }
    }, []);

    useEffect(() => { generateQuiz(); }, [generateQuiz]);

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
                playAudio("Wow, you did an amazing job on that quiz!");
                setEndMessage(quizEndMessages[Math.floor(Math.random() * quizEndMessages.length)]);
                setGameState('finished');
            }
        }, 1500);
    };


    const handleGameExit = () => {
        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
        
        // Call the updated onClose prop with the required arguments
        onClose(score, durationSeconds);
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

    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in"><Card className="relative w-full max-w-4xl p-8 text-center min-h-[500px] flex items-center justify-center border-gray-200"><button onClick={handleGameExit} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl">&times;</button>{renderGameContent()}</Card></div>);
};