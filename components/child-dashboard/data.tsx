// components/child-dashboard/data.ts
import { CardData, SubjectsData, Story } from "./types";

export const lettersDeck: CardData[] = [
    { image: '/images/A.jpeg', text: 'A', simpleText: 'A is for Apple.' }, 
    { image: '/images/B.jpeg', text: 'B', simpleText: 'B is for Ball.' }, 
    { image: '/images/C.jpeg', text: 'C', simpleText: 'C is for Cat.' }, 
    { image: '/images/D.jpeg', text: 'D', simpleText: 'D is for Dog.' }, 
    { image: '/images/E.jpeg', text: 'E', simpleText: 'E is for Egg.' }, 
    { image: '/images/F.jpeg', text: 'F', simpleText: 'F is for Fish.' }, 
    { image: '/images/G.jpeg', text: 'G', simpleText: 'G is for Goat.' }, 
    { image: '/images/H.jpeg', text: 'H', simpleText: 'H is for Hat.' }, 
    { image: '/images/I.jpeg', text: 'I', simpleText: 'I is for Igloo.' }, 
    { image: '/images/J.jpeg', text: 'J', simpleText: 'J is for Jam.' }, 
    { image: '/images/K.jpeg', text: 'K', simpleText: 'K is for King.' }, 
    { image: '/images/L.jpeg', text: 'L', simpleText: 'L is for Lion.' }, 
    { image: '/images/M.jpeg', text: 'M', simpleText: 'M is for Moon.' }, 
    { image: '/images/N.jpeg', text: 'N', simpleText: 'N is for Nut.' }, 
    { image: '/images/O.jpeg', text: 'O', simpleText: 'O is for Orange.' }, 
    { image: '/images/P.jpeg', text: 'P', simpleText: 'P is for Pig.' }, 
    { image: '/images/Q.jpeg', text: 'Q', simpleText: 'Q is for Queen.' }, 
    { image: '/images/R.jpeg', text: 'R', simpleText: 'R is for Rocket.' }, 
    { image: '/images/S.jpeg', text: 'S', simpleText: 'S is for Sun.' }, 
    { image: '/images/T.jpeg', text: 'T', simpleText: 'T is for Tree.' }, 
    { image: '/images/U.jpeg', text: 'U', simpleText: 'U is for Umbrella.' }, 
    { image: '/images/V.jpeg', text: 'V', simpleText: 'V is for Van.' }, 
    { image: '/images/W.jpeg', text: 'W', simpleText: 'W is for Watch.' }, 
    { image: '/images/X.jpeg', text: 'X', simpleText: 'X is for X-ray.' }, 
    { image: '/images/Y.jpeg', text: 'Y', simpleText: 'Y is for Yo-Yo.' }, 
    { image: '/images/Z.jpeg', text: 'Z', simpleText: 'Z is for Zip.' }
];

export const numbersDeck: CardData[] = [{ image: 'https://placehold.co/400x200/E5E5E5/000000?text=0', text: 'Zero', simpleText: 'This is the number zero.' }, { image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=1', text: 'One', simpleText: 'This is the number one.' }, { image: 'https://placehold.co/400x200/A3B18A/FFFFFF?text=2', text: 'Two', simpleText: 'This is the number two.' }, { image: 'https://placehold.co/400x200/588157/FFFFFF?text=3', text: 'Three', simpleText: 'This is the number three.' }, { image: 'https://placehold.co/400x200/3A5A40/FFFFFF?text=4', text: 'Four', simpleText: 'This is the number four.' }, { image: 'https://placehold.co/400x200/344E41/FFFFFF?text=5', text: 'Five', simpleText: 'This is the number five.' }, { image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=6', text: 'Six', simpleText: 'This is the number six.' }, { image: 'https://placehold.co/400x200/E76F51/FFFFFF?text=7', text: 'Seven', simpleText: 'This is the number seven.' }, { image: 'https://placehold.co/400x200/DDA15E/FFFFFF?text=8', text: 'Eight', simpleText: 'This is the number eight.' }, { image: 'https://placehold.co/400x200/BC6C25/FFFFFF?text=9', text: 'Nine', simpleText: 'This is the number nine.' }];
export const verbsDeck: CardData[] = [{ image: 'https://placehold.co/400x200/FFADAD/000000?text=Run', text: 'Run', simpleText: 'The girl can run very fast.' }, { image: 'https://placehold.co/400x200/FFD6A5/000000?text=Jump', text: 'Jump', simpleText: 'Frogs can jump high.' }, { image: 'https://placehold.co/400x200/FDFFB6/000000?text=Read', text: 'Read', simpleText: 'He loves to read books.' }, { image: 'https://placehold.co/400x200/CAFFBF/000000?text=Sing', text: 'Sing', simpleText: 'She likes to sing a song.' }, { image: 'https://placehold.co/400x200/9BF6FF/000000?text=Eat', text: 'Eat', simpleText: 'It is time to eat lunch.' }];
export const adjectivesDeck: CardData[] = [{ image: 'https://placehold.co/400x200/FFC8DD/000000?text=Big', text: 'Big', simpleText: 'The elephant is big.' }, { image: 'https://placehold.co/400x200/A2D2FF/000000?text=Small', text: 'Small', simpleText: 'The mouse is small.' }, { image: 'https://placehold.co/400x200/BDE0FE/000000?text=Happy', text: 'Happy', simpleText: 'The smiley face is happy.' }, { image: 'https://placehold.co/400x200/CDB4DB/000000?text=Sad', text: 'Sad', simpleText: 'The crying child is sad.' }, { image: 'https://placehold.co/400x200/FFC8DD/000000?text=Red', text: 'Red', simpleText: 'The apple is red.' },];
export const additionDeck: CardData[] = [{ image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=1%2B1=2', text: '1 + 1 = 2', simpleText: 'One plus one equals two.' }, { image: 'https://placehold.co/400x200/A3B18A/FFFFFF?text=2%2B1=3', text: '2 + 1 = 3', simpleText: 'Two plus one equals three.' }, { image: 'https://placehold.co/400x200/588157/FFFFFF?text=2%2B2=4', text: '2 + 2 = 4', simpleText: 'Two plus two equals four.' }, { image: 'https://placehold.co/400x200/3A5A40/FFFFFF?text=3%2B2=5', text: '3 + 2 = 5', simpleText: 'Three plus two equals five.' }, { image: 'https://placehold.co/400x200/344E41/FFFFFF?text=4%2B1=5', text: '4 + 1 = 5', simpleText: 'Four plus one equals five.' },];
export const subtractionDeck: CardData[] = [{ image: 'https://placehold.co/400x200/D4A373/FFFFFF?text=2-1=1', text: '2 - 1 = 1', simpleText: 'Two minus one equals one.' }, { image: 'https://placehold.co/400x200/A3B18A/FFFFFF?text=3-1=2', text: '3 - 1 = 2', simpleText: 'Three minus one equals two.' }, { image: 'https://placehold.co/400x200/588157/FFFFFF?text=4-2=2', text: '4 - 2 = 2', simpleText: 'Four minus two equals two.' }, { image: 'https://placehold.co/400x200/3A5A40/FFFFFF?text=5-3=2', text: '5 - 3 = 2', simpleText: 'Five minus three equals two.' }, { image: 'https://placehold.co/400x200/344E41/FFFFFF?text=5-1=4', text: '5 - 1 = 4', simpleText: 'Five minus one equals four.' }, ];
export const multiplicationDeck: CardData[] = [{ image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=2x1=2', text: '2 x 1 = 2', simpleText: 'Two times one equals two.' }, { image: 'https://placehold.co/400x200/E76F51/FFFFFF?text=2x2=4', text: '2 x 2 = 4', simpleText: 'Two times two equals four.' }, { image: 'https://placehold.co/400x200/DDA15E/FFFFFF?text=3x2=6', text: '3 x 2 = 6', simpleText: 'Three times two equals six.' }, { image: 'https://placehold.co/400x200/BC6C25/FFFFFF?text=4x2=8', text: '4 x 2 = 8', simpleText: 'Four times two equals eight.' }, { image: 'https://placehold.co/400x200/606C38/FFFFFF?text=5x2=10', text: '5 x 2 = 10', simpleText: 'Five times two equals ten.' },];
export const divisionDeck: CardData[] = [{ image: 'https://placehold.co/400x200/F4A261/FFFFFF?text=4%C3%B72=2', text: '4 ÷ 2 = 2', simpleText: 'Four divided by two is two.' }, { image: 'https://placehold.co/400x200/E76F51/FFFFFF?text=6%C3%B72=3', text: '6 ÷ 2 = 3', simpleText: 'Six divided by two is three.' }, { image: 'https://placehold.co/400x200/DDA15E/FFFFFF?text=8%C3%B74=2', text: '8 ÷ 4 = 2', simpleText: 'Eight divided by four is two.' }, { image: 'https://placehold.co/400x200/BC6C25/FFFFFF?text=9%C3%B73=3', text: '9 ÷ 3 = 3', simpleText: 'Nine divided by three is three.' }, { image: 'https://placehold.co/400x200/606C38/FFFFFF?text=10%C3%B72=5', text: '10 ÷ 2 = 5', simpleText: 'Ten divided by two is five.' }, ];

export const subjectsData: SubjectsData = {
    english: { title: "English Fun", description: "Learn letters, sounds, and first words. It's as easy as A-B-C!", borderColor: "border-amber-400", textColor: "text-amber-700", bgColor: "bg-amber-50", hoverBgColor: "hover:bg-amber-100", modules: [{ title: "Learn Letters", description: "Master the alphabet from A to Z.", deck: lettersDeck }, { title: "Learn Verbs", description: "Discover action words like run, jump, and sing.", deck: verbsDeck }, { title: "Learn Adjectives", description: "Describe the world with words like big, small, and happy.", deck: adjectivesDeck }] },
    maths: { title: "Math Adventures", description: "Let's count numbers and have fun with shapes!", borderColor: "border-sky-400", textColor: "text-sky-700", bgColor: "bg-sky-50", hoverBgColor: "hover:bg-sky-100", modules: [{ title: "Learn Numbers", description: "Get to know numbers from zero to nine.", deck: numbersDeck }, { title: "Addition", description: "Learn how to add numbers together.", deck: additionDeck }, { title: "Subtraction", description: "Practice taking numbers away.", deck: subtractionDeck }, { title: "Multiplication", description: "Start multiplying with simple examples.", deck: multiplicationDeck }, { title: "Division", description: "Understand how to share things equally.", deck: divisionDeck }] }
};

export const gameOverMessages: string[] = ["Great try! Every game helps you learn.", "Awesome effort! Ready for another round?", "You did great! Practice makes perfect.", "Wow, you were so close! Let's play again!", "Good game! Let's see if you can beat your score."];
export const quizEndMessages: string[] = ["Fantastic job! Look at that score!", "You're a superstar! Well done!", "Amazing work! You're getting so good at this!", "Incredible! You finished the quiz!"];

export const stories: Story[] = [
    {
        id: 'friendly-star',
        title: 'The Friendly Star',
        author: 'VidyaSetu Stories',
        coverImage: 'https://placehold.co/400x500/4F46E5/FFFFFF?text=The+Friendly+Star+⭐',
        text: '',
        sentences: [
            'Once upon a time, there was a little star named Stella.',
            'Stella lived high up in the night sky.',
            'Every night, she would twinkle and shine bright.',
            'One day, Stella noticed a sad little boy below.',
            'He was afraid of the dark.',
            'Stella decided to help.',
            'She shone extra bright, making beautiful patterns in the sky.',
            'The boy looked up and smiled.',
            'From that night on, Stella became his special friend.',
            'And whenever he felt scared, he would look up at Stella.',
            'The End.'
        ],
    },
    {
        id: 'brave-cloud',
        title: 'The Brave Little Cloud',
        author: 'VidyaSetu Stories',
        coverImage: 'https://placehold.co/400x500/06B6D4/FFFFFF?text=The+Brave+Cloud+☁️',
        text: '',
        sentences: [
            'There once was a tiny cloud named Fluffy.',
            'Fluffy was smaller than all the other clouds.',
            'The big clouds would float high in the sky.',
            'But Fluffy was too small and stayed low.',
            'One hot summer day, the flowers were very thirsty.',
            'They needed water badly.',
            'The big clouds were too far away to help.',
            'But brave little Fluffy knew what to do.',
            'She gathered all her strength and made it rain!',
            'The flowers drank the water and bloomed beautifully.',
            'Everyone thanked Fluffy for being so brave.',
            'From that day on, Fluffy knew that being small was okay.',
            'You can still do big things!',
            'The End.'
        ],
    },
    {
        id: 'colorful-day',
        title: "Max's Colorful Day",
        author: 'VidyaSetu Stories',
        coverImage: 'https://placehold.co/400x500/F59E0B/FFFFFF?text=Max+Colorful+Day+🎨',
        text: '',
        sentences: [
            'Max woke up to a gray morning.',
            'Everything looked dull and boring.',
            'Max felt sad and did not want to get up.',
            'Then his mom came in with a surprise.',
            'She gave him a box of bright crayons!',
            'Max started to draw.',
            'He drew a big yellow sun.',
            'He drew green trees and blue flowers.',
            'He drew red birds and orange butterflies.',
            'Soon his whole room was full of colors!',
            'Max smiled and felt happy again.',
            'He learned that he could make his own colorful day.',
            'Even when things seem gray, you can add your own colors!',
            'The End.'
        ],
    },
];

stories.forEach(story => { story.text = story.sentences.join(' '); });