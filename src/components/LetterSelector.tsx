import React from 'react';
import { AlignJustify } from 'lucide-react';

interface LetterSelectorProps {
  letterCount: number;
  onSelect: (count: number) => void;
}

export function LetterSelector({ letterCount, onSelect }: LetterSelectorProps) {
  const counts = [6, 7, 8, 9];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center items-center gap-2 text-gray-600 dark:text-gray-400">
        <AlignJustify size={20} />
        <span>Letter Count</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {counts.map((count) => (
          <button
            key={count}
            onClick={() => onSelect(count)}
            className={`px-4 py-2 rounded-full transition-colors ${
              letterCount === count
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {count} letters
          </button>
        ))}
      </div>
    </div>
  );
}
