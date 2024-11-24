import React from 'react';
import { TimeLimit, Difficulty } from '../types/game';

interface GameStatsProps {
  score: number;
  highScore: number;
  timeLeft: number;
  streak: number;
  difficulty: Difficulty;
  timeLimit: TimeLimit;
  isTimeWarning: boolean;
}

export default function GameStats({ 
  score, 
  highScore, 
  timeLeft, 
  streak, 
  difficulty, 
  timeLimit,
  isTimeWarning 
}: GameStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 truncate">Score</h3>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 truncate">{score}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">High: {highScore}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 truncate">Time</h3>
        <p className={`text-2xl font-bold transition-colors duration-200 truncate ${
          isTimeWarning 
            ? 'text-red-600 dark:text-red-400 animate-pulse' 
            : 'text-indigo-600 dark:text-indigo-400'
        }`}>
          {timeLimit === 'untimed' ? '∞' : timeLeft}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {timeLimit === 'untimed' ? 'Untimed' : `${timeLimit}s total`}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 truncate">Streak</h3>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 truncate">{streak}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Current</p>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 truncate">Mode</h3>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 capitalize truncate">{difficulty}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Difficulty</p>
      </div>
    </div>
  );
}