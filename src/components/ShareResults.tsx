import React, { useState } from 'react';
import { Share2, Copy, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import { TimeLimit, ShareData } from '../types/game';

interface ShareResultsProps {
  shareData: ShareData;
  isDarkMode: boolean;
}

export function ShareResults({ shareData, isDarkMode }: ShareResultsProps) {
  const [message, setMessage] = useState('');

  const formatShareText = (data: ShareData): string => {
    const text = [
      '🎮 GramJam Challenge!',
      `🎯 Score: ${data.score} points`,
      `🔤 Letters: ${data.letters}`,
      `🔥 Longest Streak: ${data.longestStreak}`,
      data.timeLimit !== 'untimed' ? `⏱️ Time: ${data.timeLimit}s` : '',
      `🏆 High Score: ${data.highScore}`,
      '',
      'Play now at [game-url]'
    ].filter(Boolean).join('\n');

    return text;
  };

  const captureGraphs = async () => {
    const graphsElement = document.querySelector('.performance-graphs');
    if (!graphsElement) return null;
    
    try {
      const canvas = await html2canvas(graphsElement as HTMLElement, {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        scale: 2, // Higher resolution
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing graphs:', error);
      return null;
    }
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const copyScore = async () => {
    const text = formatShareText(shareData);
    await navigator.clipboard.writeText(text);
    showMessage('Score copied to clipboard!');
  };

  const shareScore = async () => {
    const text = formatShareText(shareData);
    const graphImage = await captureGraphs();
    
    if (navigator.share) {
      try {
        const shareData: ShareData & { files?: File[] } = {
          title: 'GramJam Score',
          text
        };

        if (graphImage) {
          // Convert base64 to blob
          const response = await fetch(graphImage);
          const blob = await response.blob();
          const file = new File([blob], 'gramjam-performance.png', { type: 'image/png' });
          shareData.files = [file];
        }

        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          await copyScore();
        }
      }
    } else {
      await copyScore();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
        <button
          onClick={copyScore}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm sm:text-base rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          title="Copy Score"
        >
          <Copy size={18} />
          <span>Copy Score</span>
        </button>
        <button
          onClick={shareScore}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm sm:text-base rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          title="Share Score"
        >
          <Share2 size={18} />
          <span>Share Score</span>
        </button>
      </div>
      {message && (
        <p className="text-sm text-green-600 dark:text-green-400 animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );
}
