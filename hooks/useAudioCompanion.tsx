import { useState, useEffect, useCallback, useRef } from 'react';

// A simple queue that lives outside of React's state to avoid re-renders
const speechQueue: string[] = [];
let isSpeaking = false;
let voices: SpeechSynthesisVoice[] = [];

const processQueue = () => {
    if (isSpeaking || speechQueue.length === 0 || typeof window.speechSynthesis === 'undefined' || voices.length === 0) {
        return;
    }

    isSpeaking = true;
    const text = speechQueue[0];
    const utterance = new SpeechSynthesisUtterance(text);

    const preferredVoice =
        voices.find(v => v.name === 'Microsoft Heera - English (India)') ||
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-'));

    utterance.voice = preferredVoice || voices[0];
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onend = () => {
        isSpeaking = false;
        speechQueue.shift();
        processQueue();
    };

    utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        isSpeaking = false;
        speechQueue.shift();
        processQueue();
    };
    
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
};

export const useAudioCompanion = () => {
  // This state is only here to trigger a re-render once voices are loaded
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleVoicesChanged = () => {
        voices = window.speechSynthesis.getVoices();
        setIsReady(true);
    };

    if (typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      // Also call it once in case the voices are already loaded
      handleVoicesChanged();
    }

    // Cleanup function to remove the event listener
    return () => {
      if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = null;
        speechSynthesis.cancel();
      }
    };
  }, []);

  const playAudio = useCallback((textToSpeak: string | string[]) => {
    if (typeof window.speechSynthesis === 'undefined') return;
    
    // Immediately cancel any ongoing speech to be responsive
    isSpeaking = false;
    speechSynthesis.cancel();
    
    const messages = Array.isArray(textToSpeak) ? textToSpeak : [textToSpeak];
    speechQueue.length = 0; // Clear the existing queue
    speechQueue.push(...messages); // Add new messages
    
    processQueue();
  }, []); // The hook's functions are stable and don't need to change

  return { playAudio, isReady };
};