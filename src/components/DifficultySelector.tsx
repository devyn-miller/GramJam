import React from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ difficulty, onSelect }: DifficultySelectorProps) {
  return (
    <div className="flex justify-center gap-4">
      {(['easy', 'medium', 'hard'] as const).map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className={`px-4 py-2 rounded-full capitalize transition-colors ${
            difficulty === d
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  );
}