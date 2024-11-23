import React from 'react';
import { DifficultySelector } from './DifficultySelector';
import { TimeSelector } from './TimeSelector';
import { Difficulty, TimeLimit } from '../types/game';
import { Brain } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  timeLimit: TimeLimit;
  setTimeLimit: (t: TimeLimit) => void;
}

export function StartScreen({
  onStart,
  difficulty,
  setDifficulty,
  timeLimit,
  setTimeLimit
}: StartScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain size={48} className="text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Word Wizard</h1>
          <p className="text-gray-600">Unscramble words, score points, beat the clock!</p>
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

          <button
            onClick={onStart}
            className="w-full py-4 bg-indigo-600 text-white rounded-lg text-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}