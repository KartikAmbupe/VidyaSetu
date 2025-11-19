import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

// Story data structure
interface Story {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  text: string;
  sentences: string[];
}

// Sample stories - perfect for ADHD/Dyslexic children
const stories: Story[] = [
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

// Prepare stories by joining sentences
stories.forEach(story => {
  story.text = story.sentences.join(' ');
});

export function StoryTime({ onClose }: { onClose: () => void }) {
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Clear old simplified text if we go back to library
    if (!selectedStory) {
      setSimplifiedSentences(null);
      setShowSimplified(false);
      return;
    }
  
    // If we already have this story's simple text, don't re-fetch
    // Also, only run this if simplification hasn't been done yet
    if (simplifiedSentences !== null || isSimplifying) return;
  
    const simplifyStory = async () => {
      setIsSimplifying(true);
      try {
        // The Next.js App Router URL is still /api/simplify
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
        setSimplifiedSentences([]); // Set to empty array to prevent infinite re-fetching on error
      } finally {
        setIsSimplifying(false);
      }
    };
  
    simplifyStory();
  
  }, [selectedStory, simplifiedSentences, isSimplifying]); // Dependencies include simplifiedSentences/isSimplifying for proper state check

  // Speak story sentence by sentence with word tracking
// In your story-time.tsx file

// Speak story sentence by sentence with word tracking
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
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // --- THIS IS THE UPDATED VOICE SELECTION LOGIC ---
    const preferredVoice =
        voices.find(v => v.name === 'Microsoft Heera - English (India)') ||
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-'));
    // --- END OF UPDATE ---
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
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

    utterance.onstart = () => {
        setCurrentSentenceIndex(sentenceIndex);
        setCurrentWordInSentence(0);
    };

    utterance.onend = () => {
        if (isSpeakingRef.current) {
            setTimeout(() => {
                speakSentence(sentenceIndex + 1);
            }, 300);
        }
    };

    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
    utteranceRef.current = utterance;
};

  const handlePlayPause = () => {
    if (!selectedStory) return;
    
    if (isPlaying) {
      // Stop
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      isSpeakingRef.current = false;
    } else {
      // Start/Resume
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

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleRateChange = (value: number[]) => {
    setRate(value[0]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Calculate total progress
  const getTotalProgress = () => {
    if (!selectedStory) return 0;

    const currentSentences = (showSimplified && simplifiedSentences && simplifiedSentences.length > 0)
    ? simplifiedSentences
    : selectedStory.sentences;
    
    let totalWords = 0;
    let currentWords = 0;
    
    currentSentences.forEach((sentence, idx) => {
      const wordCount = sentence.split(/\s+/).length;
      totalWords += wordCount;
      
      if (idx < currentSentenceIndex) {
        currentWords += wordCount;
      } else if (idx === currentSentenceIndex) {
        currentWords += currentWordInSentence;
      }
    });
    
    return totalWords > 0 ? (currentWords / totalWords) * 100 : 0;
  };

  const getCurrentWordCount = () => {
    if (!selectedStory) return { current: 0, total: 0 };

    const currentSentences = (showSimplified && simplifiedSentences && simplifiedSentences.length > 0)
    ? simplifiedSentences
    : selectedStory.sentences;
    
    let totalWords = 0;
    let currentWords = 0;
    
    currentSentences.forEach((sentence, idx) => {
      const wordCount = sentence.split(/\s+/).length;
      totalWords += wordCount;
      
      if (idx < currentSentenceIndex) {
        currentWords += wordCount;
      } else if (idx === currentSentenceIndex) {
        currentWords += currentWordInSentence;
      }
    });
    
    return { current: currentWords, total: totalWords };
  };

  // Story Library View
  if (!selectedStory) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Button
          onClick={onClose}
          className="mb-8 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-800 mb-4">📖 Story Time</h1>
          <p className="text-2xl text-gray-600 font-semibold">
            Choose a story and follow along as the words light up!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card
              key={story.id}
              onClick={() => {
                setSelectedStory(story);
                setCurrentSentenceIndex(0);
                setCurrentWordInSentence(0);
                setIsPlaying(false);
              }}
              className="cursor-pointer hover:scale-105 transition-transform duration-300 border-4 border-purple-200 hover:border-purple-400 overflow-hidden shadow-xl"
            >
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <h3 className="text-2xl font-bold text-purple-700 mb-2">
                  {story.title}
                </h3>
                <p className="text-gray-600 font-medium">by {story.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const wordCount = getCurrentWordCount();
  const progress = getTotalProgress();

  const activeSentences: string[] = (showSimplified && simplifiedSentences && simplifiedSentences.length > 0)
    ? simplifiedSentences
    : selectedStory!.sentences; // Use '!' since selectedStory is guaranteed here

  // Story Reader View
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Button
        onClick={() => {
          window.speechSynthesis.cancel();
          isSpeakingRef.current = false;
          setSelectedStory(null);
          setIsPlaying(false);
          handleRestart();
        }}
        className="mb-6 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back to Library
      </Button>

      <Card className="border-4 border-purple-300 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 p-6 text-white">
          <h2 className="text-4xl font-black mb-2">{selectedStory.title}</h2>
          <p className="text-xl opacity-90">by {selectedStory.author}</p>
        </div>

        <CardContent className="p-8">
          {/* Story Text Display with Word Highlighting */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl mb-6 min-h-[400px] border-4 border-yellow-200 shadow-inner">
            <div className="text-3xl leading-relaxed font-semibold text-gray-800 space-y-4">
              {activeSentences.map((sentence, sentenceIdx) => {
                const words = sentence.split(/\s+/);
                const isSentenceActive = sentenceIdx === currentSentenceIndex;
                const isSentencePast = sentenceIdx < currentSentenceIndex;
                
                return (
                  <div key={sentenceIdx} className="inline">
                    {words.map((word, wordIdx) => {
                      const isWordActive = isSentenceActive && wordIdx === currentWordInSentence;
                      const isWordPast = isSentencePast || (isSentenceActive && wordIdx < currentWordInSentence);
                      
                      return (
                        <span
                          key={`${sentenceIdx}-${wordIdx}`}
                          className={`inline-block transition-all duration-200 px-2 py-1 rounded-lg mx-1 ${
                            isWordActive
                              ? 'bg-green-400 text-white scale-110 font-bold shadow-lg transform -translate-y-1'
                              : isWordPast
                              ? 'text-gray-400'
                              : 'text-gray-800'
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                    {' '}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="space-y-6">
            {/* Main Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleRestart}
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 border-2 hover:bg-gray-100"
              >
                <RotateCcw size={28} />
              </Button>

              <Button
                onClick={handlePlayPause}
                size="lg"
                className="rounded-full w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl transform hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={40} />
                ) : (
                  <Play size={40} className="ml-1" />
                )}
              </Button>

              <Button
                onClick={toggleMute}
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 border-2 hover:bg-gray-100"
              >
                {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
              </Button>
            </div>

            {/* Volume Control */}
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <Volume2 size={20} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Volume</p>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    disabled={isMuted}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-sm font-bold text-gray-600 w-12 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>

            {/* Speed Control */}
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <Gauge size={20} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Reading Speed</p>
                  <Slider
                    value={[rate]}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    onValueChange={handleRateChange}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-sm font-bold text-gray-600 w-12 text-right">
                  {rate.toFixed(1)}x
                </span>
              </div>
            </div>

            {/* Progress Indicator */}
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
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-center p-2">
              {isSimplifying && (
                <p className="font-semibold text-gray-600 animate-pulse">
                  ✨ Simplifying text for you...
                </p>
              )}
              {simplifiedSentences && simplifiedSentences.length > 0 && !isSimplifying && (
                <Button
                  onClick={() => {
                    // Stop TTS when toggling modes
                    handleRestart();
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

            {/* Helpful Tips */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200"></div>
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
}