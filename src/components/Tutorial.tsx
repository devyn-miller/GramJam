import React from 'react';
import { X } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

export function Tutorial({ onClose }: TutorialProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-600 dark:text-gray-400" />
        </button>

        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">How to Play GramJam</h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-lg font-semibold mb-2">Game Setup</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose your preferred number of letters (6-9)</li>
              <li>Select a time limit (30s, 60s, 90s, or untimed)</li>
              <li>Pick your difficulty level (easy, medium, or hard)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Gameplay</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create as many words as possible using the given letters</li>
              <li>Words must be at least 3 letters long</li>
              <li>Each letter can only be used once per word</li>
              <li>Build your streak by finding valid words consecutively</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Scoring</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Longer words earn more points</li>
              <li>Maintain a streak for bonus points</li>
              <li>Different difficulty levels offer score multipliers</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click the settings icon to change game parameters</li>
              <li>Use the shuffle button to rearrange letters</li>
              <li>Toggle dark/light mode for your preference</li>
              <li>Mute/unmute sound effects as needed</li>
              <li>Share your results with friends</li>
            </ul>
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Press Enter or click Submit to check your word. Good luck!
          </p>
        </div>
      </div>
    </div>
  );
}