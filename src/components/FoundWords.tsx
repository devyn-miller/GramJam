import React from 'react';
import { Difficulty } from '../types/game';

interface FoundWordsProps {
  words: string[];
  total: number;
  difficulty: Difficulty;
  streakPoints: { [key: string]: number };
}

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

export function FoundWords({ words, total, difficulty, streakPoints }: FoundWordsProps) {
  const calculatePoints = (word: string, streakBonus: number) => {
    const basePoints = Math.floor(
      word.length * 10 * 
      DIFFICULTY_MULTIPLIERS[difficulty]
    );
    return basePoints + streakBonus;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Found Words</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {words.length} / {total}
        </span>
      </div>
      <div className="h-[400px] overflow-y-auto space-y-2">
        {words.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center italic">No words found yet...</p>
        ) : (
          words.map((word) => (
            <div
              key={word}
              className="bg-white dark:bg-gray-700 p-2 rounded shadow-sm flex justify-between items-center"
            >
              <span className="font-medium dark:text-gray-200">{word}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {calculatePoints(word, streakPoints[word] || 0)} pts
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}