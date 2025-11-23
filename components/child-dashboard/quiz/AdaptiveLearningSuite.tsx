'use client';

import React, { useState } from 'react';
import { 
  Star, 
  Brain, 
  ChevronRight, 
  TrendingUp, 
  Calculator, 
  BookOpen, 
  Play, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

// ----------------------------------------------------------------------
// 1. TYPES & INTERFACES
// ----------------------------------------------------------------------

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Performance = 'LOW' | 'MID' | 'HIGH';
export type Action = 'DECREASE' | 'STAY' | 'INCREASE';

export interface Question {
  id: number;
  text: string;
  answer: string | number;
  options: (string | number)[];
}

export interface HistoryItem {
  diff: Difficulty;
  score: number;
  reward: number;
}

export type QTable = Record<string, number[]>; 

// ----------------------------------------------------------------------
// 2. CONSTANTS & CONFIGURATION
// ----------------------------------------------------------------------

const ALPHA = 0.5;   
const EPSILON = 0.1; // Reduced Epsilon to make it less random once it learns
const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];
const PERFORMANCES: Performance[] = ['LOW', 'MID', 'HIGH'];
const ACTIONS: Action[] = ['DECREASE', 'STAY', 'INCREASE'];

const INITIAL_Q_TABLE = (): QTable => {
  const initial: QTable = {};
  DIFFICULTIES.forEach((d) => {
    PERFORMANCES.forEach((p) => {
      initial[`${d}-${p}`] = [0, 0, 0];
    });
  });
  return initial;
};

/**
 * FIXED REWARD FUNCTION
 * Now evaluates the specific ACTION taken given the context.
 */
const GET_REWARD = (difficultyIdx: number, performanceIdx: number, actionIdx: number): number => {
  // actionIdx: 0 = DECREASE, 1 = STAY, 2 = INCREASE
  
  // CASE 1: High Performance (Student is acing it)
  if (performanceIdx === 2) { 
    if (difficultyIdx === 2) {
      // Already at HARD + High Score = Optimal State (Flow)
      return actionIdx === 1 ? 20 : -5; // STAY is best, don't change
    }
    // At EASY or MEDIUM + High Score -> Should INCREASE
    if (actionIdx === 2) return 15; // Reward for increasing
    if (actionIdx === 1) return -5; // Penalty for staying (Boredom)
    return -20; // Heavy penalty for decreasing
  }

  // CASE 2: Low Performance (Student is struggling)
  if (performanceIdx === 0) {
    if (difficultyIdx === 0) {
      // Already at EASY + Low Score -> Support needed
      return actionIdx === 1 ? 5 : -5; // STAY is acceptable
    }
    // At MEDIUM or HARD + Low Score -> Should DECREASE
    if (actionIdx === 0) return 15; // Reward for decreasing (Mercy)
    return -15; // Penalty for staying or increasing (Frustration)
  }

  // CASE 3: Mid Performance (Student is challenged but coping)
  // Ideal action is usually to STAY
  if (actionIdx === 1) return 10;
  return -5; // Changing difficulty might disrupt flow
};

// ----------------------------------------------------------------------
// 3. CONTENT GENERATORS
// ----------------------------------------------------------------------

const generateMathQuestions = (difficultyLevel: Difficulty): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < 5; i++) {
    let num1: number, num2: number, operator: string, answer: number, text: string;
    
    if (difficultyLevel === 'EASY') {
      num1 = Math.floor(Math.random() * 6);
      num2 = Math.floor(Math.random() * 5);
      answer = num1 + num2;
      text = `${num1} + ${num2} = ?`;
    } else if (difficultyLevel === 'MEDIUM') {
      operator = Math.random() > 0.5 ? '+' : '-';
      if (operator === '+') {
        num1 = Math.floor(Math.random() * 11) + 5;
        num2 = Math.floor(Math.random() * 9) + 1;
        answer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * 5);
        answer = num1 - num2;
      }
      text = `${num1} ${operator} ${num2} = ?`;
    } else {
      operator = Math.random() > 0.5 ? '+' : '-';
      if (operator === '+') {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 20) + 5;
        answer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 - num2;
      }
      text = `${num1} ${operator} ${num2} = ?`;
    }

    const options = new Set<number>([answer]);
    while (options.size < 3) {
      let offset = Math.floor(Math.random() * 5) + 1;
      if (Math.random() > 0.5) offset = -offset;
      const decoy = answer + offset;
      if (decoy >= 0) options.add(decoy);
    }

    questions.push({ id: i, text, answer, options: Array.from(options).sort(() => Math.random() - 0.5) });
  }
  return questions;
};

const generateEnglishQuestions = (difficultyLevel: Difficulty): Question[] => {
  const questions: Question[] = [];
  const rhymeSets = [
    { w: 'Cat', a: 'Hat', d: ['Dog', 'Pig'] },
    { w: 'Pen', a: 'Hen', d: ['Cow', 'Box'] },
    { w: 'Sun', a: 'Run', d: ['Hot', 'Red'] },
    { w: 'Frog', a: 'Log', d: ['Fly', 'Cat'] }
  ];
  const opposites = [
    { w: 'Hot', a: 'Cold', d: ['Big', 'Red'] },
    { w: 'Up', a: 'Down', d: ['Left', 'Sad'] },
    { w: 'Happy', a: 'Sad', d: ['Mad', 'Glad'] },
    { w: 'Big', a: 'Small', d: ['Tall', 'Fat'] }
  ];
  const sentences = [
    { q: "I ___ an apple.", a: "eat", d: ["fly", "sleep"] },
    { q: "The sky is ___.", a: "blue", d: ["green", "loud"] },
    { q: "A cat says ___.", a: "meow", d: ["moo", "woof"] },
    { q: "She ___ to school.", a: "walks", d: ["sleeps", "eats"] }
  ];

  for (let i = 0; i < 5; i++) {
    let item: any, text: string, answer: string, decoys: string[];
    if (difficultyLevel === 'EASY') {
      item = rhymeSets[Math.floor(Math.random() * rhymeSets.length)];
      text = `Rhymes with ${item.w}?`;
      answer = item.a;
      decoys = item.d;
    } else if (difficultyLevel === 'MEDIUM') {
      item = opposites[Math.floor(Math.random() * opposites.length)];
      text = `Opposite of ${item.w}?`;
      answer = item.a;
      decoys = item.d;
    } else {
      item = sentences[Math.floor(Math.random() * sentences.length)];
      text = item.q;
      answer = item.a;
      decoys = item.d;
    }
    const options = [answer, ...decoys].sort(() => Math.random() - 0.5);
    questions.push({ id: i, text, answer, options });
  }
  return questions;
};

// ----------------------------------------------------------------------
// 4. SHARED COMPONENTS
// ----------------------------------------------------------------------

interface QTableProps {
  qTable: QTable;
  currentDiff: Difficulty;
  lastAction: number | null;
  lastReward: number | null;
  themeColor: string;
}

const QTableDisplay: React.FC<QTableProps> = ({ qTable, currentDiff, lastAction, lastReward, themeColor }) => {
  return (
    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono w-full shadow-xl border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Brain className={`w-5 h-5 ${themeColor}`} />
          <span className={`text-sm font-bold ${themeColor} uppercase`}>AI Brain</span>
        </div>
        <div className="text-right">
           {lastReward !== null && (
             <span className={lastReward > 0 ? "text-green-400" : "text-red-400"}>
               Reward: {lastReward > 0 ? '+' : ''}{lastReward}
             </span>
           )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 text-center mb-2 opacity-50 text-[10px]">
        <div>State</div>
        <div>Decr</div>
        <div>Stay</div>
        <div>Incr</div>
      </div>

      {DIFFICULTIES.map((d) => 
        PERFORMANCES.map((p) => {
          const stateKey = `${d}-${p}`;
          const isCurrentContext = currentDiff === d; 
          const ringColor = themeColor.replace('text-', 'ring-');
          const activeClass = isCurrentContext ? `bg-slate-800 ring-1 ${ringColor}/30` : '';

          return (
            <div key={stateKey} className={`grid grid-cols-4 gap-1 mb-1 items-center p-1 rounded ${activeClass}`}>
              <div className="text-[9px] text-left text-slate-400 tracking-tighter">{stateKey}</div>
              {ACTIONS.map((_, idx) => {
                const val = qTable[stateKey][idx];
                let colorClass = "text-slate-500";
                if (val > 0) colorClass = "text-green-400 font-bold";
                if (val < 0) colorClass = "text-red-400";
                
                return (
                  <div key={idx} className={`${colorClass} relative`}>
                    {val.toFixed(1)}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 5. MAIN LOGIC HOOK
// ----------------------------------------------------------------------

const useAdaptiveTutor = (subject: 'MATH' | 'ENGLISH', onQuizStart?: () => void, onQuizEnd?: () => void) => {
  const [gamePhase, setGamePhase] = useState<'WELCOME' | 'QUIZ' | 'FEEDBACK'>('WELCOME');
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [qTable, setQTable] = useState<QTable>(INITIAL_Q_TABLE);
  const [lastAction, setLastAction] = useState<number | null>(null);
  const [lastReward, setLastReward] = useState<number | null>(null);

  const startQuiz = (diff: Difficulty) => {
    const q = subject === 'MATH' ? generateMathQuestions(diff) : generateEnglishQuestions(diff);
    setQuestions(q);
    setScore(0);
    setCurrentQIndex(0);
    setGamePhase('QUIZ');
    // Notify parent that quiz has started
    if (onQuizStart) onQuizStart();
  };

  const handleAnswer = (selectedOption: string | number) => {
    const isCorrect = selectedOption === questions[currentQIndex].answer;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentQIndex < 4) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 500);
    } else {
      setTimeout(() => processQuizResult(score + (isCorrect ? 1 : 0)), 500);
    }
  };

  const processQuizResult = (finalScore: number) => {
    let performance: Performance;
    let perfIndex: number;

    if (finalScore <= 2) { performance = 'LOW'; perfIndex = 0; }
    else if (finalScore <= 4) { performance = 'MID'; perfIndex = 1; }
    else { performance = 'HIGH'; perfIndex = 2; }

    const currentStateKey = `${difficulty}-${performance}`;
    const currentDiffIndex = DIFFICULTIES.indexOf(difficulty);

    // 1. DECIDE ACTION (Epsilon-Greedy)
    let actionIndex: number;
    if (Math.random() < EPSILON) {
      actionIndex = Math.floor(Math.random() * 3); // Explore
    } else {
      const currentQValues = qTable[currentStateKey];
      const maxVal = Math.max(...currentQValues);
      const bestActions = currentQValues.map((v, i) => (v === maxVal ? i : -1)).filter((i) => i !== -1);
      actionIndex = bestActions[Math.floor(Math.random() * bestActions.length)];
    }
    setLastAction(actionIndex);

    // 2. CALCULATE REWARD (Crucial Fix: Pass actionIndex to reward function)
    // Now the agent gets specific feedback on its choice
    const reward = GET_REWARD(currentDiffIndex, perfIndex, actionIndex);
    setLastReward(reward);

    // 3. UPDATE Q-TABLE
    setQTable((prev) => {
      const newTable = { ...prev };
      const currentQ = newTable[currentStateKey][actionIndex];
      newTable[currentStateKey][actionIndex] = currentQ + ALPHA * (reward - currentQ);
      return newTable;
    });

    // 4. EXECUTE ACTION
    let nextDiffIndex = currentDiffIndex;
    if (ACTIONS[actionIndex] === 'DECREASE') nextDiffIndex = Math.max(0, currentDiffIndex - 1);
    if (ACTIONS[actionIndex] === 'INCREASE') nextDiffIndex = Math.min(2, currentDiffIndex + 1);
    const nextDiff = DIFFICULTIES[nextDiffIndex];

    setHistory((prev) => [...prev, { diff: difficulty, score: finalScore, reward }]);
    
    setTimeout(() => {
      setDifficulty(nextDiff);
      setGamePhase('FEEDBACK');
      // Notify parent that quiz round has ended (but quiz suite is still active)
      // We'll only call onQuizEnd when user exits the quiz suite entirely
    }, 500);
  };

  return {
    gamePhase, setGamePhase,
    difficulty,
    questions,
    currentQIndex,
    score,
    history,
    qTable,
    lastAction,
    lastReward,
    startQuiz,
    handleAnswer
  };
};

// ----------------------------------------------------------------------
// 6. COMPONENT: MATH ADVENTURE
// ----------------------------------------------------------------------

const MathAdventure: React.FC<{ onBack: () => void; onQuizStart?: () => void; onQuizEnd?: () => void }> = ({ onBack, onQuizStart, onQuizEnd }) => {
  const tutor = useAdaptiveTutor('MATH', onQuizStart, onQuizEnd);

  const getDifficultyColor = (d: Difficulty) => {
    if (d === 'EASY') return 'bg-green-500';
    if (d === 'MEDIUM') return 'bg-blue-500';
    return 'bg-purple-600';
  };

  if (tutor.gamePhase === 'WELCOME') {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 animate-in fade-in bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border-b-8 border-blue-600">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Math Adventure</h1>
          <p className="text-slate-500 mb-8">Adaptive math puzzles that grow with you.</p>
          <div className="space-y-3">
            <button onClick={() => tutor.startQuiz(tutor.difficulty)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <Play className="w-5 h-5 fill-current" /> Start Learning
            </button>
            <button onClick={onBack} className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-50">
      {/* Game Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
             <span className="font-bold text-slate-700 hidden md:block">Math Adventure</span>
             <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(tutor.difficulty)}`}>{tutor.difficulty}</div>
          </div>
          <button onClick={() => tutor.setGamePhase('WELCOME')} className="text-xs text-slate-400 hover:text-blue-600 font-bold uppercase tracking-wide flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col items-center justify-center p-6">
             {tutor.gamePhase === 'QUIZ' && tutor.questions.length > 0 && (
               <div className="max-w-lg w-full">
                 <div className="flex gap-2 mb-6">{[0,1,2,3,4].map(i => (<div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < tutor.currentQIndex ? 'bg-blue-500' : 'bg-slate-200'}`} />))}</div>
                 <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-b-8 border-blue-200">
                   <div className="text-5xl md:text-6xl font-bold text-slate-800 mb-10 font-mono">{tutor.questions[tutor.currentQIndex].text}</div>
                   <div className="grid grid-cols-3 gap-3 md:gap-4">
                     {tutor.questions[tutor.currentQIndex].options.map((opt, idx) => (
                       <button key={idx} onClick={() => tutor.handleAnswer(opt)} className="py-4 md:py-6 bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-400 rounded-2xl text-2xl md:text-3xl font-bold text-slate-700 transition-all active:scale-95">{opt}</button>
                     ))}
                   </div>
                 </div>
               </div>
             )}
             {tutor.gamePhase === 'FEEDBACK' && (
               <div className="text-center animate-in fade-in zoom-in">
                  <div className="mb-6 flex justify-center gap-2">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-10 h-10 ${i < tutor.score ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />))}</div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">{tutor.score === 5 ? 'Math Wizard!' : 'Good Job!'}</h2>
                  <button onClick={() => tutor.startQuiz(tutor.difficulty)} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto">Next Round <ChevronRight className="w-5 h-5" /></button>
               </div>
             )}
          </div>
        </main>
      </div>
      
      {/* Dashboard Sidebar */}
      <div className="w-full md:w-80 bg-slate-950 p-4 border-l border-slate-800 h-auto md:h-full overflow-y-auto shrink-0">
        <QTableDisplay qTable={tutor.qTable} currentDiff={tutor.difficulty} lastAction={tutor.lastAction} lastReward={tutor.lastReward} themeColor="text-blue-400" />
        <div className="mt-6 space-y-2">
            <h4 className="text-slate-500 text-xs font-bold uppercase">Recent History</h4>
            {tutor.history.slice().reverse().map((h, i) => (
                <div key={i} className="bg-slate-900 p-2 rounded flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(h.diff)}`}></div>
                      <span>{h.diff}</span>
                    </div>
                    <span className={h.reward > 0 ? 'text-green-400' : 'text-red-400'}>{h.score}/5 ({h.reward > 0 ? '+' : ''}{h.reward})</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 7. COMPONENT: ENGLISH FUN
// ----------------------------------------------------------------------

const EnglishFun: React.FC<{ onBack: () => void; onQuizStart?: () => void; onQuizEnd?: () => void }> = ({ onBack, onQuizStart, onQuizEnd }) => {
  const tutor = useAdaptiveTutor('ENGLISH', onQuizStart, onQuizEnd);

  const getDifficultyColor = (d: Difficulty) => {
    if (d === 'EASY') return 'bg-green-500';
    if (d === 'MEDIUM') return 'bg-blue-500';
    return 'bg-purple-600';
  };

  if (tutor.gamePhase === 'WELCOME') {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 animate-in fade-in bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border-b-8 border-pink-600">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-pink-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-4">English Fun</h1>
          <p className="text-slate-500 mb-8">Rhymes, opposites, and word games powered by AI.</p>
          <div className="space-y-3">
            <button onClick={() => tutor.startQuiz(tutor.difficulty)} className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <Play className="w-5 h-5 fill-current" /> Start Playing
            </button>
            <button onClick={onBack} className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-50">
      {/* Game Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
             <span className="font-bold text-slate-700 hidden md:block">English Fun</span>
             <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(tutor.difficulty)}`}>{tutor.difficulty}</div>
          </div>
          <button onClick={() => tutor.setGamePhase('WELCOME')} className="text-xs text-slate-400 hover:text-pink-600 font-bold uppercase tracking-wide flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col items-center justify-center p-6">
             {tutor.gamePhase === 'QUIZ' && tutor.questions.length > 0 && (
               <div className="max-w-lg w-full">
                 <div className="flex gap-2 mb-6">{[0,1,2,3,4].map(i => (<div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < tutor.currentQIndex ? 'bg-pink-500' : 'bg-slate-200'}`} />))}</div>
                 <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-b-8 border-pink-200">
                   <div className="text-4xl md:text-5xl font-bold text-slate-800 mb-10 font-sans">{tutor.questions[tutor.currentQIndex].text}</div>
                   <div className="grid grid-cols-1 gap-3 md:gap-4">
                     {tutor.questions[tutor.currentQIndex].options.map((opt, idx) => (
                       <button key={idx} onClick={() => tutor.handleAnswer(opt)} className="py-4 md:py-5 bg-slate-50 hover:bg-pink-50 border-2 border-slate-100 hover:border-pink-400 rounded-2xl text-xl md:text-2xl font-bold text-slate-700 transition-all active:scale-95">{opt}</button>
                     ))}
                   </div>
                 </div>
               </div>
             )}
             {tutor.gamePhase === 'FEEDBACK' && (
               <div className="text-center animate-in fade-in zoom-in">
                  <div className="mb-6 flex justify-center gap-2">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-10 h-10 ${i < tutor.score ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />))}</div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">{tutor.score === 5 ? 'Amazing!' : 'Great Job!'}</h2>
                  <button onClick={() => tutor.startQuiz(tutor.difficulty)} className="mt-8 px-8 py-3 bg-pink-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto">Next Round <ChevronRight className="w-5 h-5" /></button>
               </div>
             )}
          </div>
        </main>
      </div>
      
      {/* Dashboard Sidebar */}
      <div className="w-full md:w-80 bg-slate-950 p-4 border-l border-slate-800 h-auto md:h-full overflow-y-auto shrink-0">
        <QTableDisplay qTable={tutor.qTable} currentDiff={tutor.difficulty} lastAction={tutor.lastAction} lastReward={tutor.lastReward} themeColor="text-pink-400" />
        <div className="mt-6 space-y-2">
            <h4 className="text-slate-500 text-xs font-bold uppercase">Recent History</h4>
            {tutor.history.slice().reverse().map((h, i) => (
                <div key={i} className="bg-slate-900 p-2 rounded flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(h.diff)}`}></div>
                      <span>{h.diff}</span>
                    </div>
                    <span className={h.reward > 0 ? 'text-green-400' : 'text-red-400'}>{h.score}/5 ({h.reward > 0 ? '+' : ''}{h.reward})</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 8. MAIN PAGE
// ----------------------------------------------------------------------
interface SuiteProps {
    onExit: () => void;
    onQuizStart?: () => void;
    onQuizEnd?: () => void;
}

export default function AdaptiveLearningSuite({ onExit, onQuizStart, onQuizEnd }: SuiteProps) {
  const [selectedSubject, setSelectedSubject] = useState<'MATH' | 'ENGLISH' | null>(null);

  // Force full screen height to prevent double scrollbars on body
  if (selectedSubject === 'MATH') {
    return (
      <div className="h-screen w-full overflow-hidden">
        <MathAdventure onBack={() => {
          setSelectedSubject(null);
          if (onQuizEnd) onQuizEnd();
        }} onQuizStart={onQuizStart} onQuizEnd={onQuizEnd} />
      </div>
    );
  }

  if (selectedSubject === 'ENGLISH') {
    return (
      <div className="h-screen w-full overflow-hidden">
        <EnglishFun onBack={() => {
          setSelectedSubject(null);
          if (onQuizEnd) onQuizEnd();
        }} onQuizStart={onQuizStart} onQuizEnd={onQuizEnd} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-4xl w-full text-center relative">
        <div className="absolute top-0 left-0">
            <button 
              onClick={() => {
                if (onQuizEnd) onQuizEnd();
                onExit();
              }} 
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-100 text-slate-600 font-bold border border-slate-200"
            >
               <ArrowLeft className="w-4 h-4" />
               Back to Dashboard
            </button>
        </div>

        <div className="mt-16 mb-12">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Brain className="w-12 h-12 text-teal-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Adaptive Learning Suite</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Powered by <span className="font-bold text-teal-600">Q-Learning</span>. Choose a subject to instantiate a personalized AI tutor agent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Math Card */}
          <button 
            onClick={() => setSelectedSubject('MATH')}
            className="group relative bg-white p-8 rounded-3xl shadow-xl border border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Math Adventure</h2>
              <p className="text-slate-500 mb-6">Logic & Operations</p>
              <div className="flex items-center text-blue-600 font-bold">
                Launch Agent <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* English Card */}
          <button 
            onClick={() => setSelectedSubject('ENGLISH')}
            className="group relative bg-white p-8 rounded-3xl shadow-xl border border-slate-200 hover:border-pink-500 hover:shadow-2xl transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">English Fun</h2>
              <p className="text-slate-500 mb-6">Language & Vocabulary</p>
              <div className="flex items-center text-pink-600 font-bold">
                Launch Agent <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}