import React from 'react';
import { TimeLimit } from '../types/game';
import { Clock } from 'lucide-react';

interface TimeSelectorProps {
  timeLimit: TimeLimit;
  onSelect: (time: TimeLimit) => void;
}

export function TimeSelector({ timeLimit, onSelect }: TimeSelectorProps) {
  const times: TimeLimit[] = [30, 60, 90, 120, 'untimed'];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center items-center gap-2 text-gray-600 dark:text-gray-400">
        <Clock size={20} />
        <span>Time Limit</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`px-4 py-2 rounded-full transition-colors ${
              timeLimit === time
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {time === 'untimed' ? '∞' : `${time}s`}
          </button>
        ))}
      </div>
    </div>
  );
}