export interface AudioStoryData {
  id: string;
  title: string;
  author: string;
  audioFile: string; // Path to audio file
  coverImage: string;
  words: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

// To generate word timings from audio, you can use:
// 1. Google Cloud Speech-to-Text API with word-level timestamps
// 2. AWS Transcribe with word-level timestamps
// 3. Web Speech API (browser-based, less accurate)