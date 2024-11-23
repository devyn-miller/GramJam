import React from 'react';

interface TutorialProps {
  onClose: () => void;
}

export function Tutorial({ onClose }: TutorialProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">How to Play GramJam</h2>
        
        <div className="space-y-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Game Rules</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>🎯 Form valid words using the given letters</li>
              <li>📝 Words must be at least 3 letters long</li>
              <li>⏱️ Race against the timer to find as many words as possible</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Scoring System</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>📊 Base points = Word Length × 10</li>
              <li>🔥 Streak bonus = 5 points per consecutive word</li>
              <li>⭐ Difficulty multipliers:
                <ul className="ml-4 mt-1">
                  <li>- Easy (6 letters): 1×</li>
                  <li>- Medium (7 letters): 1.5×</li>
                  <li>- Hard (8 letters): 2×</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Tips</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>🔄 Use shuffle when stuck</li>
              <li>⏸️ Pause anytime to take a break</li>
              <li>📱 Share your high scores with friends</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}