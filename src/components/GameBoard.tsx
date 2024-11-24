import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, PauseCircle, PlayCircle, HelpCircle, Share2, Shuffle, RotateCcw, Sun, Moon, Settings } from 'lucide-react';
import { useAudioContext } from '../hooks/useAudioContext';
import { useGameLogic } from '../hooks/useGameLogic';
import GameStats from './GameStats';
import { Tutorial } from './Tutorial';
import { FoundWords } from './FoundWords';
import { StartScreen } from './StartScreen';
import { ShareResults } from './ShareResults';
import { Difficulty, TimeLimit, GameState } from '../types/game';
import { shuffleString } from '../utils/stringUtils';
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
  const [showTimesUp, setShowTimesUp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTimeWarning, setIsTimeWarning] = useState(false);

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
    getGameStats,
    foundWords,
    shuffleLetters,
    updateGameTime
  } = useGameLogic();

useEffect(() => {
  document.documentElement.classList.toggle('dark', isDarkMode);
}, [isDarkMode]);

useEffect(() => {
  const init = () => {
    initializeGame(difficulty, letterCount);
    setDisplayLetters(wordSet.letters.join(''));
  };
  init();
}, []); // Only run once when component mounts

useEffect(() => {
  setDisplayLetters(wordSet.letters.join(''));
}, [wordSet]);

useEffect(() => {
  let timer: NodeJS.Timeout;
  if (gameState === 'playing' && !isPaused && timeLimit !== 'untimed') {
    timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setGameState('gameover');
          setShowTimesUp(true);
          return 0;
        }
        updateGameTime(prev - 1, Number(timeLimit));
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(timer);
}, [gameState, isPaused, timeLimit, updateGameTime]);

useEffect(() => {
  if (showTimesUp) {
    const timer = setTimeout(() => {
      setShowTimesUp(false);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [showTimesUp]);

useEffect(() => {
  if (gameState === 'countdown' && countdown >= 0) {
    const timer = setInterval(() => {
        setCountdown((c) => {
            if (c > 0 && c <= 3 && !isMuted) {
                playSound('countdown', c); // Play sound only for "3," "2," "1"
            }

            if (c === 0) {
                setGameState('playing'); // Transition to "playing"
                setTimeLeft(timeLimit === 'untimed' ? Infinity : timeLimit);
            }

            return c - 1; // Decrease countdown
        });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer
  }

}, [countdown, gameState, timeLimit, isMuted, playSound]);

useEffect(() => {
  if (timeLeft <= 3 && timeLeft > 0 && !isPaused && gameState === 'playing') {
    setIsTimeWarning(true);
    if (!isMuted) {
      playSound('timeWarning');
    }
  } else {
    setIsTimeWarning(false);
  }
}, [timeLeft, isPaused, gameState, isMuted, playSound]);

useEffect(() => {
  if (timeLeft === 0 && !isMuted) {
    playSound('timeUp');
  }
}, [timeLeft, isMuted, playSound]);


  const handleStart = () => {
    setGameState('countdown');
    setCountdown(3);
    initializeGame(difficulty, letterCount);
    setDisplayLetters(wordSet.letters.join(''));
    if (!isMuted) playSound('click');
  };

  const handleRestart = () => {
    setGameState('setup');
    setUserInput('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const result = await submitWord(userInput.trim());
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
    const shuffled = shuffleLetters();
    setDisplayLetters(shuffled);
  };

  const handleSettingsClick = () => {
    setGameState('setup');
    playSound('click');
  };

  const getTimeDisplay = () => {
    if (timeLimit === 'untimed') return '∞';
    if (timeLeft <= 0) return "Time's Up!";
    if (timeLeft <= 3) return timeLeft; // Show just the number for last 3 seconds
    return timeLeft;
  };

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
        {showTimesUp && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transform scale-100 animate-bounce">
              <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Time's Up!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Final Score: {score}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">GramJam</h1>
            <button
              onClick={handleSettingsClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Settings"
            >
              <Settings size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTutorial(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="How to Play"
            >
              <HelpCircle size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX size={24} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Volume2 size={24} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? (
                <Sun size={24} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon size={24} className="text-gray-600 dark:text-gray-400" />
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
              timeLeft={getTimeDisplay()} 
              streak={streak} 
              difficulty={difficulty} 
              timeLimit={timeLimit}
              isTimeWarning={isTimeWarning}
            />

            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="col-span-2">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex justify-center gap-4">
                      {displayLetters.split('').map((letter, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 flex items-center justify-center text-3xl font-bold 
                            bg-indigo-100 dark:bg-indigo-900 
                            text-indigo-800 dark:text-indigo-100 
                            rounded-lg shadow-lg transition-all 
                            hover:scale-110 hover:rotate-3 
                            border-2 border-indigo-300 dark:border-indigo-600 
                            cursor-pointer"
                          style={{
                            transform: `rotate(${Math.random() * 6 - 3}deg)`,
                            animation: 'float 3s ease-in-out infinite',
                          }}
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
                        <Shuffle size={24} className="text-gray-600 dark:text-gray-400" />
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
                    {/* Message container with fixed height to prevent layout shifts */}
                    <div className="h-6 mt-2">
                      <div
                        className={`text-sm transition-opacity duration-200 ${
                          errorMessage || successMessage ? 'opacity-100' : 'opacity-0'
                        } ${
                          errorMessage
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {errorMessage || successMessage || '\u00A0'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <PerformanceGraph
                    performanceData={performanceData}
                    isDarkMode={isDarkMode}
                    timeLimit={timeLimit}
                    currentTime={Number(timeLimit) - timeLeft}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <FoundWords
                  words={foundWords}
                  totalPossible={wordSet.possibleWords.length}
                  difficulty={difficulty}
                  streakPoints={Object.fromEntries(
                    foundWords.map((word, index) => [word, index * 5])
                  )}
                />
              </div>
            </div>

            {gameState === 'gameover' && (
              <div className="mt-8 space-y-8">
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
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setGameState('countdown');
                      setCountdown(3);
                      initializeGame(difficulty, letterCount);
                      if (!isMuted) playSound('click');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <RotateCcw size={20} />
                    <span>Play Again</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setGameState('setup');
                      if (!isMuted) playSound('click');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Settings size={20} />
                    <span>Change Settings</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showTutorial && (
        <Tutorial onClose={() => setShowTutorial(false)} />
      )}
      {showSettings && (
        <StartScreen
          onClose={() => setShowSettings(false)}
          onStart={handleStart}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
        />
      )}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
        <div className="container mx-auto flex justify-center items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span> 2024 Devyn Miller</span>
          <div className="flex space-x-4">
            <a
              href="https://linkedin.com/in/devyn-c-miller/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://github.com/devyn-miller"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="GitHub Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
        `
      }} />
    </div>
  );
}