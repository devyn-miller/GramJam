export type Difficulty = 'easy' | 'medium' | 'hard';
export type TimeLimit = 30 | 60 | 90 | 120;
export type GameState = 'setup' | 'countdown' | 'playing' | 'gameover';

export interface GameSettings {
  difficulty: Difficulty;
  timeLimit: TimeLimit;
}

export interface WordSet {
  letters: string;
  possibleWords: string[];
  foundWords: string[];
}

export interface WordSubmitResult {
  valid: boolean;
  message: string;
}