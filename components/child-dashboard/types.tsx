// components/child-dashboard/types.ts

export type View = 'child-home' | 'module-selection' | 'module' | 'game-selection' | 'english-game' | 'maths-game' | 'story-time' | 'interactive-story' | 'read-along-story';

export interface CardData {
    image: string;
    text: string;
    simpleText: string;
}

export interface EnglishQuestion {
    letter: string;
    correct: string;
    options: string[];
}

export interface Module {
    title: string;
    description: string;
    deck: CardData[];
}

export interface Subject {
    title: string;
    description: string;
    modules: Module[];
    borderColor: string;
    textColor: string;
    bgColor: string;
    hoverBgColor: string;
}

export type SubjectsData = {
    english: Subject;
    maths: Subject;
}

export interface Story {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    text: string;
    sentences: string[];
}