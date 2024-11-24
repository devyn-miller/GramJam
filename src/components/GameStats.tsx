import React from 'react';
import { TimeLimit, Difficulty } from '../types/game';

interface GameStatsProps {
  score: number;
  highScore: number;
  timeLeft: number | string;
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6 game-stats">
      <div className="bg-white dark:bg-gray-700 p-3 md:p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Score</h3>
        <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{score}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">High: {highScore}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-3 md:p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Time</h3>
        <p className={`text-xl md:text-2xl font-bold transition-colors duration-200 ${
          isTimeWarning 
            ? 'text-red-600 dark:text-red-400 animate-pulse' 
            : 'text-indigo-600 dark:text-indigo-400'
        }`}>
          {timeLeft}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {timeLimit === 'untimed' ? 'Untimed' : `${timeLimit}s total`}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-3 md:p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Streak</h3>
        <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{streak}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-3 md:p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Mode</h3>
        <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 capitalize">{difficulty}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty</p>
      </div>
    </div>
  );
}