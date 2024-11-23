import React from 'react';
import { Difficulty, TimeLimit } from '../types/game';

interface GameStatsProps {
  score: number;
  highScore: number;
  timeLeft: number;
  streak: number;
  difficulty: Difficulty;
  timeLimit: TimeLimit;
}

export function GameStats({ score, highScore, timeLeft, streak, difficulty, timeLimit }: GameStatsProps) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{score}</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">High Score</p>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{highScore}</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {timeLimit === 'untimed' ? '∞' : `${timeLeft}s`}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{streak}🔥</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 capitalize">{difficulty}</p>
      </div>
    </div>
  );
}