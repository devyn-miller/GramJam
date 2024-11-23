import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, PauseCircle, PlayCircle, HelpCircle, Share2, Shuffle, RotateCcw, Sun, Moon } from 'lucide-react';
import { useAudioContext } from '../hooks/useAudioContext';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameStats } from './GameStats';
import { Tutorial } from './Tutorial';
import { FoundWords } from './FoundWords';
import { StartScreen } from './StartScreen';
import { ShareResults } from './ShareResults';
import { Difficulty, TimeLimit, GameState } from '../types/game';
import { shuffleString } from '../utils/wordGenerator';
import { PerformanceGraph } from './PerformanceGraph';

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(60);
  const [letterCount, setLetterCount] = useState(7);
  const [timeLeft, setTimeLeft] = useState(timeLimit === 'untimed' ? Infinity : timeLimit);
  const [gameState, setGameState] = useState<GameState>('setup');
  const [countdown, setCountdown] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [displayLetters, setDisplayLetters] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const { playSound } = useAudioContext();
  const { 
    wordSet, 
    score, 
    highScore, 
    streak,
    longestStreak,
    performanceData,
    initializeGame, 
    submitWord,
    getGameStats 
  } = useGameLogic();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleStart = () => {
    initializeGame(difficulty, letterCount);
    setGameState('countdown');
    setCountdown(3);
  };

  const handleRestart = () => {
    setGameState('setup');
    setUserInput('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const result = submitWord(userInput.trim());
    if (result.valid) {
      if (!isMuted) playSound('correct');
      setSuccessMessage(result.message);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 1500);
    } else {
      if (!isMuted) playSound('wrong');
      setErrorMessage(result.message);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 1500);
    }
    setUserInput('');
  };

  const handleShuffle = () => {
    if (!isMuted) playSound('shuffle');
    setDisplayLetters(shuffleString(wordSet.letters));
  };

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setTimeLeft(timeLimit === 'untimed' ? Infinity : timeLimit);
      setDisplayLetters(shuffleString(wordSet.letters));
    }
  }, [countdown, gameState, timeLimit, wordSet.letters]);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused && timeLeft > 0 && timeLimit !== 'untimed') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, isPaused, timeLeft, timeLimit]);

  if (gameState === 'setup') {
    return <StartScreen 
      onStart={handleStart} 
      difficulty={difficulty} 
      setDifficulty={setDifficulty} 
      timeLimit={timeLimit} 
      setTimeLimit={setTimeLimit}
      letterCount={letterCount}
      setLetterCount={setLetterCount}
      isDarkMode={isDarkMode}
    />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-indigo-900' : 'from-indigo-500 to-purple-600'} p-4`}>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">GramJam</h1>
            <button
              onClick={handleRestart}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Restart Game"
            >
              <RotateCcw size={24} className="dark:text-gray-200" />
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="How to Play"
            >
              <HelpCircle size={24} className="dark:text-gray-200" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX size={24} className="dark:text-gray-200" />
              ) : (
                <Volume2 size={24} className="dark:text-gray-200" />
              )}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? (
                <PlayCircle size={24} className="dark:text-gray-200" />
              ) : (
                <PauseCircle size={24} className="dark:text-gray-200" />
              )}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? (
                <Sun size={24} className="dark:text-gray-200" />
              ) : (
                <Moon size={24} className="text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {gameState === 'countdown' ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              {countdown}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Get Ready!</p>
          </div>
        ) : (
          <>
            <GameStats 
              score={score} 
              highScore={highScore} 
              timeLeft={timeLeft} 
              streak={streak} 
              difficulty={difficulty} 
              timeLimit={timeLimit}
            />

            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="col-span-2">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex justify-center gap-4">
                      {displayLetters.split('').map((letter, index) => (
                        <div
                          key={index}
                          className="w-14 h-14 flex items-center justify-center text-2xl font-bold bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-md transition-transform hover:scale-105 border-2 border-indigo-200 dark:border-indigo-800"
                        >
                          {letter.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {difficulty} mode • {timeLimit === 'untimed' ? 'Untimed' : `${timeLeft}s`}
                      </p>
                      <button
                        onClick={handleShuffle}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Shuffle Letters"
                      >
                        <Shuffle size={24} className="dark:text-gray-200" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value.toLowerCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit();
                      }}
                      className="w-full p-4 text-xl border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-colors"
                      placeholder="Type your word..."
                      disabled={gameState !== 'playing' || isPaused}
                    />
                    {(errorMessage || successMessage) && (
                      <div
                        className={`mt-2 text-sm ${
                          errorMessage
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {errorMessage || successMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12">
                  <PerformanceGraph
                    performanceData={performanceData}
                    isDarkMode={isDarkMode}
                    timeLimit={timeLimit}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <FoundWords
                  words={wordSet.foundWords}
                  total={wordSet.possibleWords.length}
                  difficulty={difficulty}
                  streakPoints={Object.fromEntries(
                    wordSet.foundWords.map((word, index) => [word, index * 5])
                  )}
                />
              </div>
            </div>

            {gameState === 'gameover' && (
              <div className="mt-8">
                <ShareResults
                  shareData={{
                    score,
                    letters: wordSet.letters.length,
                    longestStreak,
                    timeLimit,
                    highScore
                  }}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </>
        )}
      </div>

      {showTutorial && (
        <Tutorial onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}