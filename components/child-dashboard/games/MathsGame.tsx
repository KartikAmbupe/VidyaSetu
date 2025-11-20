// components/child-dashboard/games/MathsGame.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { gameOverMessages } from "../data";

interface MathsGameProps {
    onClose: () => void;
}

export const MathsGame: React.FC<MathsGameProps> = ({ onClose }) => {
    const [score, setScore] = useState(0);
    const [catchCount, setCatchCount] = useState(0);
    const [lives, setLives] = useState(5);
    const [bubbles, setBubbles] = useState<any[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState("");
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const intervalsRef = useRef<NodeJS.Timeout[]>([]);

    const startGame = useCallback(() => {
        setScore(0); setCatchCount(0); setLives(5); setBubbles([]); setGameOver(false);
        intervalsRef.current.forEach(clearInterval); intervalsRef.current = [];
        const bubbleInterval = setInterval(() => {
            setBubbles(prev => [...prev, { id: Date.now(), value: Math.ceil(Math.random() * 5), left: `${Math.random() * 90}%`, top: -50 }]);
        }, 1200);
        intervalsRef.current.push(bubbleInterval);
    }, []);

    useEffect(() => { startGame(); return () => { intervalsRef.current.forEach(clearInterval); }; }, [startGame]);

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
                            <div><p className="text-lg text-gray-600">Catches: <span className="font-bold">{catchCount}</span></p><p className="text-lg text-gray-800">Score: <span className="font-bold">{score}</span></p></div>
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
    useEffect(() => { const interval = setInterval(() => setTop(t => t + 5), 30); return () => clearInterval(interval); }, []);
    useEffect(() => { if (gameAreaRef.current && top > gameAreaRef.current.offsetHeight) { if (!poppedRef.current) { onMiss(id); } } }, [top, gameAreaRef, onMiss, id]);
    const handleMouseDown = (e: React.MouseEvent) => { e.preventDefault(); if (poppedRef.current) return; poppedRef.current = true; const target = e.currentTarget; target.classList.add('animate-out', 'fade-out', 'scale-150'); setTimeout(() => onPop(id, value), 200); };
    return <div onMouseDown={handleMouseDown} className="absolute text-3xl font-bold text-white bg-green-500 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer select-none" style={{ left, top: `${top}px` }}>{value}</div>;
};