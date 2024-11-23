import React from 'react';

interface GameStatsProps {
  score: number;
  highScore: number;
  timeLeft: number;
  streak: number;
}

export function GameStats({ score, highScore, timeLeft, streak }: GameStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Score</p>
        <p className="text-2xl font-bold text-indigo-600">{score}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">High Score</p>
        <p className="text-2xl font-bold text-indigo-600">{highScore}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Time</p>
        <p className="text-2xl font-bold text-indigo-600">{timeLeft}s</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Streak</p>
        <p className="text-2xl font-bold text-indigo-600">{streak}🔥</p>
      </div>
    </div>
  );
}