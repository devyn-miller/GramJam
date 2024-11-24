import { useState, useCallback, useEffect, useRef } from 'react';
import { WordSet, Difficulty, WordSubmitResult, GameStats, GamePerformanceHistory } from '../types/game';
import { generateWordSet, isWordInDictionary } from '../utils/wordGenerator';
import { shuffleString } from '../utils/stringUtils';
import { generateRandomLetters } from '../utils/letterGenerator';
import { validateWord } from '../services/dictionaryService';

const LETTER_MULTIPLIERS: Record<number, number> = {
  3: 1,    // Base multiplier for 3-letter words
  4: 1.2,  // Slightly higher for 4-letter words
  5: 1.4,  // And so on...
  6: 1.6,
  7: 1.8,
  8: 2.0,
  9: 2.5
};

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

export function useGameLogic() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('highScore') || '0');
    }
    return 0;
  });
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [displayLetters, setDisplayLetters] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gamePerformance, setGamePerformance] = useState<GamePerformanceHistory>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');
  const startTimeRef = useRef(Date.now());
  const [possibleWords, setPossibleWords] = useState<string[]>([]);

  const calculateWordScore = (word: string): number => {
    const letterMultiplier = LETTER_MULTIPLIERS[word.length] || 1;
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[currentDifficulty];
    const basePoints = Math.floor(word.length * 10 * letterMultiplier * difficultyMultiplier);
    const streakBonus = streak * 5;  // 5 points per word in streak
    return basePoints + streakBonus;
  };

  const initializeGame = useCallback((difficulty: Difficulty, letterCount: number) => {
    const wordSet = generateWordSet(difficulty, 60);
    setDisplayLetters(wordSet.letters.join(''));
    setPossibleWords(wordSet.possibleWords);
    setCurrentDifficulty(difficulty);
    setScore(0);
    setStreak(0);
    setLongestStreak(0);
    setFoundWords([]);
    setErrorMessage('');
    setSuccessMessage('');
    setGamePerformance([]);
    startTimeRef.current = Date.now();
  }, []);

  const handleSubmit = useCallback(async (word: string): Promise<WordSubmitResult> => {
    const normalizedWord = word.trim().toLowerCase();

    // Basic validation checks
    if (normalizedWord.length < 3) {
      setStreak(0); // Reset streak for invalid words
      return { valid: false, message: 'Words must be at least 3 letters long' };
    }

    if (foundWords.includes(normalizedWord)) {
      // Don't reset streak for repeated words
      return { valid: false, message: 'Word already found!' };
    }

    if (!isValidWord(normalizedWord, displayLetters)) {
      setStreak(0); // Reset streak for invalid words
      return { valid: false, message: 'Invalid word! Use only the given letters.' };
    }

    // Dictionary check
    const isValid = await validateWord(normalizedWord);
    if (!isValid) {
      setStreak(0); // Reset streak for invalid words
      return { valid: false, message: 'Not a valid word!' };
    }

    // Word is valid - calculate score and update state
    const wordScore = calculateWordScore(normalizedWord);
    const newStreak = streak + 1;
    
    setScore(prevScore => prevScore + wordScore);
    setStreak(newStreak);
    setLongestStreak(prev => Math.max(prev, newStreak));
    setFoundWords(prev => [...prev, normalizedWord]);
    
    setGamePerformance(prev => [...prev, {
      word: normalizedWord,
      score: wordScore,
      timestamp: Date.now(),
      streak: newStreak
    }]);

    // Update high score if needed
    const newTotalScore = score + wordScore;
    if (newTotalScore > highScore) {
      setHighScore(newTotalScore);
      localStorage.setItem('highScore', newTotalScore.toString());
    }

    return { valid: true, message: `+${wordScore} points!` };
  }, [displayLetters, foundWords, score, streak, highScore, currentDifficulty]);

  const getGameStats = useCallback((): GameStats => ({
    score,
    streak,
    longestStreak,
    wordsFound: foundWords.length,
    elapsedTime: Math.floor((Date.now() - startTimeRef.current) / 1000)
  }), [score, streak, longestStreak, foundWords.length]);

  const shuffleLetters = useCallback(() => {
    const shuffled = shuffleString(displayLetters);
    setDisplayLetters(shuffled);
    return shuffled;
  }, [displayLetters]);

  return {
    wordSet: {
      letters: displayLetters.split(''),
      possibleWords,
      foundWords
    },
    score,
    highScore,
    streak,
    longestStreak,
    performanceData: gamePerformance,
    foundWords,
    totalPossibleWords: possibleWords.length,
    initializeGame,
    submitWord: handleSubmit,
    getGameStats,
    shuffleLetters
  };
}

// Helper function to validate word construction from available letters
function isValidWord(word: string, letters: string): boolean {
  const letterPool = new Map<string, number>();
  
  // Count available letters
  for (const letter of letters.toLowerCase()) {
    letterPool.set(letter, (letterPool.get(letter) || 0) + 1);
  }
  
  // Check if word can be constructed from available letters
  for (const letter of word.toLowerCase()) {
    const count = letterPool.get(letter) || 0;
    if (count === 0) return false;
    letterPool.set(letter, count - 1);
  }
  
  return true;
}