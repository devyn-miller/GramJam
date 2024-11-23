import React from 'react';
import { TimeLimit } from '../types/game';

interface TimeSelectorProps {
  timeLimit: TimeLimit;
  onSelect: (time: TimeLimit) => void;
}

export function TimeSelector({ timeLimit, onSelect }: TimeSelectorProps) {
  const times: TimeLimit[] = [30, 60, 90, 120];

  return (
    <div className="flex justify-center gap-4">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => onSelect(time)}
          className={`px-4 py-2 rounded-full transition-colors ${
            timeLimit === time
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {time}s
        </button>
      ))}
    </div>
  );
}