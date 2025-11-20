// components/child-dashboard/data.ts
import { CardData, SubjectsData, Story } from "./types";

export const lettersDeck: CardData[] = [
    { image: '/images/A.jpeg', text: 'A', simpleText: 'A is for Apple.' },
    // ... (Paste the rest of your A-Z array here) ...
    { image: '/images/Z.jpeg', text: 'Z', simpleText: 'Z is for Zip.' }
];

export const numbersDeck: CardData[] = [{ image: 'https://placehold.co/400x200/E5E5E5/000000?text=0', text: 'Zero', simpleText: 'This is the number zero.' }, /* ... rest of numbers ... */];
export const verbsDeck: CardData[] = [{ image: 'https://placehold.co/400x200/FFADAD/000000?text=Run', text: 'Run', simpleText: 'The girl can run very fast.' }, /* ... rest of verbs ... */];
export const adjectivesDeck: CardData[] = [{ image: 'https://placehold.co/400x200/FFC8DD/000000?text=Big', text: 'Big', simpleText: 'The elephant is big.' }, /* ... rest of adjectives ... */];
export const additionDeck: CardData[] = [{ image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=1%2B1=2', text: '1 + 1 = 2', simpleText: 'One plus one equals two.' }, /* ... rest ... */];
export const subtractionDeck: CardData[] = [{ image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=2-1=1', text: '2 - 1 = 1', simpleText: 'Two minus one equals one.' }, /* ... rest ... */];
export const multiplicationDeck: CardData[] = [{ image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=2x1=2', text: '2 x 1 = 2', simpleText: 'Two times one equals two.' }, /* ... rest ... */];
export const divisionDeck: CardData[] = [{ image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=4%C3%B72=2', text: '4 ÷ 2 = 2', simpleText: 'Four divided by two is two.' }, /* ... rest ... */];

export const subjectsData: SubjectsData = {
    english: { title: "English Fun", description: "Learn letters, sounds, and first words. It's as easy as A-B-C!", borderColor: "border-amber-400", textColor: "text-amber-700", bgColor: "bg-amber-50", hoverBgColor: "hover:bg-amber-100", modules: [{ title: "Learn Letters", description: "Master the alphabet from A to Z.", deck: lettersDeck }, { title: "Learn Verbs", description: "Discover action words like run, jump, and sing.", deck: verbsDeck }, { title: "Learn Adjectives", description: "Describe the world with words like big, small, and happy.", deck: adjectivesDeck }] },
    maths: { title: "Math Adventures", description: "Let's count numbers and have fun with shapes!", borderColor: "border-sky-400", textColor: "text-sky-700", bgColor: "bg-sky-50", hoverBgColor: "hover:bg-sky-100", modules: [{ title: "Learn Numbers", description: "Get to know numbers from zero to nine.", deck: numbersDeck }, { title: "Addition", description: "Learn how to add numbers together.", deck: additionDeck }, { title: "Subtraction", description: "Practice taking numbers away.", deck: subtractionDeck }, { title: "Multiplication", description: "Start multiplying with simple examples.", deck: multiplicationDeck }, { title: "Division", description: "Understand how to share things equally.", deck: divisionDeck }] }
};

export const gameOverMessages: string[] = ["Great try! Every game helps you learn.", "Awesome effort! Ready for another round?", "You did great! Practice makes perfect.", "Wow, you were so close! Let's play again!", "Good game! Let's see if you can beat your score."];
export const quizEndMessages: string[] = ["Fantastic job! Look at that score!", "You're a superstar! Well done!", "Amazing work! You're getting so good at this!", "Incredible! You finished the quiz!"];

export const stories: Story[] = [
    { id: 'friendly-star', title: 'The Friendly Star', author: 'VidyaSetu Stories', coverImage: 'https://placehold.co/400x500/4F46E5/FFFFFF?text=The+Friendly+Star+⭐', text: '', sentences: ['Once upon a time, there was a little star named Stella.', 'Stella lived high up in the night sky.', 'Every night, she would twinkle and shine bright.', 'One day, Stella noticed a sad little boy below.', 'He was afraid of the dark.', 'Stella decided to help.', 'She shone extra bright, making beautiful patterns in the sky.', 'The boy looked up and smiled.', 'From that night on, Stella became his special friend.', 'And whenever he felt scared, he would look up at Stella.', 'The End.'], },
    // ... (Add other stories here)
];
stories.forEach(story => { story.text = story.sentences.join(' '); });