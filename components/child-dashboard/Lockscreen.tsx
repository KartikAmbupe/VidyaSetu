import React, { useState, useEffect } from 'react';

interface LockScreenProps {
    playtimeCooldownEnd: number | null;
}

export const LockScreen: React.FC<LockScreenProps> = ({ playtimeCooldownEnd }) => {
    const [cooldownTime, setCooldownTime] = useState('');

    useEffect(() => {
        if (!playtimeCooldownEnd) {
            setCooldownTime("until midnight (approx)");
            return;
        }
        // ... timer logic is here
        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = playtimeCooldownEnd - now;

            if (remaining <= 0) {
                setCooldownTime("Ready to play! Please refresh.");
                clearInterval(interval);
                return;
            }

            const totalSeconds = Math.floor(remaining / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setCooldownTime(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [playtimeCooldownEnd]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-red-500/10">
            <div className="p-10 bg-white rounded-3xl shadow-2xl border-4 border-red-500 max-w-lg w-full">
                <span className="text-6xl mb-4" role="img" aria-label="Lock">🔒</span>
                <h2 className="text-4xl font-bold text-red-600 mb-4">Time's Up for Today!</h2>
                <p className="text-xl text-gray-700 mb-6">
                    You have reached your daily learning goal time limit. Great job on your focus! 
                    Your parent has set a cool-down period.
                </p>
                <div className="text-2xl font-extrabold text-blue-800 bg-blue-100 p-4 rounded-xl">
                    Resume Play In: {cooldownTime}
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                    Check Status Again
                </button>
            </div>
        </div>
    );
};