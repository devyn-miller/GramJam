import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, PauseCircle, PlayCircle, HelpCircle, Share2, Shuffle, RotateCcw, Sun, Moon } from 'lucide-react';
import { useAudioContext } from '../hooks/useAudioContext';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameStats } from './GameStats';
import { Tutorial } from './Tutorial';
import { FoundWords } from './FoundWords';
import { StartScreen } from './StartScreen';
import { Difficulty, TimeLimit, GameState } from '../types/game';
import { shuffleString } from '../utils/wordGenerator';

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(60);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
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
  const { wordSet, score, highScore, streak, streakPoints, initializeGame, submitWord } = useGameLogic();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleStart = () => {
    initializeGame(difficulty);
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

  const shareScore = async () => {
    const text = `🎮 GramJam Challenge!\n🎯 Score: ${score} points\n🔥 Streak: ${streak}\n⏱️ Time: ${timeLimit}s\n🏆 High Score: ${highScore}\n\nCan you beat my score? Play now at [game-url]`;
    
    try {
      await navigator.share({
        title: 'GramJam Score',
        text
      });
    } catch (err) {
      navigator.clipboard.writeText(text);
      setSuccessMessage('Score copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 1500);
    }
  };

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setTimeLeft(timeLimit);
      setDisplayLetters(shuffleString(wordSet.letters));
    }
  }, [countdown, gameState, timeLimit, wordSet.letters]);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused && timeLeft > 0) {
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
  }, [gameState, isPaused, timeLeft]);

  if (gameState === 'setup') {
    return <StartScreen onStart={handleStart} difficulty={difficulty} setDifficulty={setDifficulty} timeLimit={timeLimit} setTimeLimit={setTimeLimit} isDarkMode={isDarkMode} />;
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
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun size={24} className="text-gray-200" /> : <Moon size={24} />}
            </button>
            <button
              onClick={shareScore}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Share Score"
            >
              <Share2 size={24} className="dark:text-gray-200" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={24} className="dark:text-gray-200" /> : <Volume2 size={24} className="dark:text-gray-200" />}
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="How to Play"
            >
              <HelpCircle size={24} className="dark:text-gray-200" />
            </button>
          </div>
        </div>

        {gameState === 'countdown' ? (
          <div className="text-center py-20">
            <h2 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
              {countdown}
            </h2>
          </div>
        ) : (
          <>
            <GameStats 
              score={score} 
              highScore={highScore} 
              timeLeft={timeLeft} 
              streak={streak} 
              difficulty={difficulty}
            />

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="flex justify-center gap-4 items-center">
                  {displayLetters.split('').map((letter, index) => (
                    <div
                      key={index}
                      className="w-14 h-14 flex items-center justify-center text-2xl font-bold bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200 rounded-lg shadow-md transition-transform hover:scale-105"
                    >
                      {letter.toUpperCase()}
                    </div>
                  ))}
                  <button
                    onClick={handleShuffle}
                    className="ml-4 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all hover:rotate-180"
                    title="Shuffle Letters"
                  >
                    <Shuffle size={24} className="dark:text-gray-200" />
                  </button>
                </div>

                {(errorMessage || successMessage) && (
                  <div className="text-center py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className={successMessage ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
                      {successMessage || errorMessage}
                    </p>
                  </div>
                )}

                {gameState === 'playing' && (
                  <>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        className="flex-1 p-4 text-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-400 outline-none transition-colors"
                        placeholder="Type your word..."
                        autoFocus
                      />
                      <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={isPaused ? "Resume" : "Pause"}
                      >
                        {isPaused ? <PlayCircle size={24} className="dark:text-gray-200" /> : <PauseCircle size={24} className="dark:text-gray-200" />}
                      </button>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                    >
                      Submit
                    </button>
                  </>
                )}

                {gameState === 'gameover' && (
                  <div className="text-center space-y-6 bg-gray-50 dark:bg-gray-700 p-8 rounded-xl">
                    <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Game Over!</h2>
                    <div className="space-y-2">
                      <p className="text-2xl dark:text-white">Final Score: {score}</p>
                      <p className="text-lg text-gray-600 dark:text-gray-400">Best Streak: {streak}🔥</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleRestart}
                        className="px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={shareScore}
                        className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Share Score
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <FoundWords 
                words={wordSet.foundWords} 
                total={wordSet.possibleWords.length} 
                difficulty={difficulty}
                streakPoints={streakPoints}
              />
            </div>
          </>
        )}

        {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      </div>
    </div>
  );
}