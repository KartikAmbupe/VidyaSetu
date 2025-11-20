// components/child-dashboard/stories/InteractiveStory.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InteractiveStoryProps {
    onBack: () => void;
    playAudio: (text: string | string[]) => void;
}

export const InteractiveStory: React.FC<InteractiveStoryProps> = ({ onBack, playAudio }) => {
    const story = [
        { id: 1, text: "Leo the lion was walking through the jungle when he saw a small, crying monkey sitting under a big leaf. What should Leo do?", choices: [{ text: "Ask the monkey why it's crying.", goTo: 2 }, { text: "Ignore the monkey and keep walking.", goTo: 3 }] },
        { id: 2, text: "Leo walked over and gently asked, 'What's wrong, little one?' The monkey sniffled, 'I lost my favorite banana!' How should Leo help?", choices: [{ text: "Climb a tall tree to look for it.", goTo: 4 }, { text: "Ask other jungle animals for help.", goTo: 5 }] },
        { id: 3, text: "Leo decided he was too busy to stop and walked right past the crying monkey. As he walked, the jungle felt quiet and he started to feel a little lonely.", choices: [{ text: "Go back and help the monkey.", goTo: 6 }, { text: "Keep walking by himself.", goTo: 7 }] },
        { id: 4, text: "Leo bravely climbed a very tall tree! From the top, he could see everything. 'I see it!' he roared. 'The banana is near the sparkling river!'", choices: [{ text: "Hooray! Let's go to the river!", goTo: 8 }] },
        { id: 5, text: "Leo found a wise old parrot. 'Have you seen a banana?' Leo asked. The parrot squawked, 'Yes! I saw a silly toucan drop one near the sparkling river!'", choices: [{ text: "Thank the parrot and go to the river.", goTo: 8 }] },
        { id: 6, text: "Leo felt bad for not helping. He turned around and went back to the monkey. 'I'm sorry I walked past,' he said. 'I want to help you find your banana.'", choices: [{ text: "Let's work together!", goTo: 2 }] },
        { id: 7, text: "Leo kept walking alone. He finished his walk, but he couldn't stop thinking about the sad little monkey. He learned that helping others feels much better than walking alone. The End.", choices: [{ text: "Play Again", goTo: 1 }] },
        { id: 8, text: "Leo and the monkey raced to the river and found the banana! The monkey was so happy, it shared the banana with Leo. They ate their snack together and became the best of friends. The End.", choices: [{ text: "Play Again", goTo: 1 }] },
    ];
    
    const [currentPage, setCurrentPage] = useState(story[0]);

    useEffect(() => {
        playAudio(currentPage.text);
    }, [currentPage, playAudio]);

    const handleChoice = (goToId: number) => {
        const nextPage = story.find(p => p.id === goToId);
        if (nextPage) setCurrentPage(nextPage);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 animate-in fade-in duration-500">
            <Button onClick={onBack} className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16} /> Back to Story Menu</Button>
            <Card className="p-8 text-center border-purple-300 border-2">
                <img src="https://placehold.co/600x300/e9d5ff/a855f7?text=Interactive+Adventure" alt="Story Illustration" className="rounded-lg mx-auto mb-6" />
                <p className="text-2xl text-gray-800 mb-8 min-h-[100px]">{currentPage.text}</p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {currentPage.choices.map((choice) => (
                        <Button key={choice.goTo + currentPage.id} onClick={() => handleChoice(choice.goTo)} className="bg-purple-500 hover:bg-purple-600 text-white text-lg py-6 flex-1">{choice.text}</Button>
                    ))}
                </div>
            </Card>
        </div>
    );
};