import React from 'react';
import { X } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

export function Tutorial({ onClose }: TutorialProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">How to Play</h2>
        
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <p>• Find words using the displayed letters</p>
          <p>• Words must be 3+ letters long</p>
          <p>• Each letter can only be used once</p>
          <p>• Score points based on word length</p>
          <p>• Build streaks for bonus points</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Tips</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>Use settings ⚙️ to adjust difficulty</li>
            <li>Click 🔄 to shuffle letters</li>
            <li>Press Enter to submit words</li>
          </ul>
        </div>
      </div>
    </div>
  );
}