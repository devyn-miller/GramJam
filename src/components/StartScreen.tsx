import React from 'react';
import { DifficultySelector } from './DifficultySelector';
import { TimeSelector } from './TimeSelector';
import { LetterSelector } from './LetterSelector';
import { Difficulty, TimeLimit } from '../types/game';
import { Brain } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  timeLimit: TimeLimit;
  setTimeLimit: (t: TimeLimit) => void;
  letterCount: number;
  setLetterCount: (c: number) => void;
  isDarkMode: boolean;
}

export function StartScreen({
  onStart,
  difficulty,
  setDifficulty,
  timeLimit,
  setTimeLimit,
  letterCount,
  setLetterCount,
  isDarkMode
}: StartScreenProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-indigo-900' : 'from-indigo-500 to-purple-600'} flex items-center justify-center p-4`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">GramJam</h1>
          <p className="text-gray-600 dark:text-gray-400">Unscramble words, score points, beat the clock!</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Select Difficulty</h2>
            <DifficultySelector difficulty={difficulty} onSelect={setDifficulty} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Select Time Limit</h2>
            <TimeSelector timeLimit={timeLimit} onSelect={setTimeLimit} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Select Letter Count</h2>
            <LetterSelector letterCount={letterCount} onSelect={setLetterCount} />
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}