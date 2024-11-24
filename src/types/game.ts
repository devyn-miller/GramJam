export type Difficulty = 'easy' | 'medium' | 'hard';
export type TimeLimit = 30 | 60 | 90 | 120 | 'untimed';
export type GameState = 'setup' | 'countdown' | 'playing' | 'gameover';

export interface GameSettings {
  difficulty: Difficulty;
  timeLimit: TimeLimit;
}

export interface WordSet {
  letters: string[];
  possibleWords: string[];
  foundWords: string[];
}

export interface WordSubmitResult {
  valid: boolean;
  message: string;
}

export interface GameStats {
  score: number;
  streak: number;
  longestStreak: number;
  wordsFound: number;
  elapsedTime: number;
}

export interface PerformanceData {
  timestamp: number;
  score: number;
  wordsFound: number;
}

export interface ShareData {
  score: number;
  letters: number;
  longestStreak: number;
  timeLimit: TimeLimit;
  highScore: number;
  title?: string;
  text?: string;
}

export interface GamePerformance {
  word: string;
  score: number;
  timestamp: number;
  streak: number;
}

export type GamePerformanceHistory = GamePerformance[];