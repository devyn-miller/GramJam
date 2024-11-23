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
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GramJam Score',
          text
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          await copyScore();
        }
      }
    } else {
      await copyScore();
    }
  };

  const shareWithGraph = async () => {
    const graphsElement = document.querySelector('.performance-graphs');
    if (!graphsElement) {
      showMessage('Could not capture graphs');
      return;
    }

    try {
      const canvas = await html2canvas(graphsElement as HTMLElement, {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        scale: 2,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'GramJam Score',
            text: formatShareText(shareData),
            files: [new File([blob], 'performance.png', { type: 'image/png' })]
          });
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gramjam-performance.png';
            a.click();
            URL.revokeObjectURL(url);
            showMessage('Graph saved to downloads');
          }
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gramjam-performance.png';
        a.click();
        URL.revokeObjectURL(url);
        showMessage('Graph saved to downloads');
      }
    } catch (err) {
      showMessage('Failed to capture graphs');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <button
          onClick={copyScore}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          title="Copy Score"
        >
          <Copy size={20} />
          <span>Copy Score</span>
        </button>
        <button
          onClick={shareScore}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          title="Share Score"
        >
          <Share2 size={20} />
          <span>Share Score</span>
        </button>
        <button
          onClick={shareWithGraph}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          title="Share with Graph"
        >
          <Image size={20} />
          <span>Share with Graph</span>
        </button>
      </div>
      {message && (
        <div className="text-sm text-indigo-600 dark:text-indigo-400">
          {message}
        </div>
      )}
    </div>
  );
}
