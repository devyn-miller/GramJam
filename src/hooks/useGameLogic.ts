import { useState, useCallback } from 'react';
import { WordSet, Difficulty, WordSubmitResult, GameStats, PerformanceData, GamePerformance } from '../types/game';
import { generateWordSet, shuffleString, isWordInDictionary } from '../utils/wordGenerator';

const LETTER_MULTIPLIERS: Record<number, number> = {
  6: 1,
  7: 1.5,
  8: 2,
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
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [displayLetters, setDisplayLetters] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gamePerformance, setGamePerformance] = useState<GamePerformance>([]);
  const [startTime] = useState(() => Date.now());
  const [wordSet, setWordSet] = useState<WordSet>({ letters: '', possibleWords: [] });

  const initializeGame = useCallback((difficulty: Difficulty, letterCount: number) => {
    const newWordSet = generateWordSet(difficulty);
    setWordSet(newWordSet);
    setDisplayLetters(newWordSet.letters);
    setScore(0);
    setStreak(0);
    setFoundWords([]);
    setErrorMessage('');
    setSuccessMessage('');
    setGamePerformance([]);
  }, []);

  const generateLetters = (count: number, difficulty: Difficulty): string => {
    const vowels = 'aeiou';
    const commonConsonants = 'rstlnm';
    const uncommonConsonants = 'bcdfghjkpqvwxyz';
    
    let letters = '';
    let vowelCount = Math.floor(count * 0.4); // 40% vowels
    
    // Add vowels
    while (vowelCount > 0) {
      letters += vowels[Math.floor(Math.random() * vowels.length)];
      vowelCount--;
    }
    
    // Fill remaining with consonants based on difficulty
    while (letters.length < count) {
      let consonantPool = '';
      switch (difficulty) {
        case 'easy':
          consonantPool = commonConsonants;
          break;
        case 'medium':
          consonantPool = commonConsonants + uncommonConsonants;
          break;
        case 'hard':
          consonantPool = uncommonConsonants;
          break;
      }
      letters += consonantPool[Math.floor(Math.random() * consonantPool.length)];
    }
    
    return shuffleString(letters);
  };

  const isValidWord = (word: string, letters: string): boolean => {
    const wordLetters = [...word];
    const availableLetters = [...letters];
    
    for (const letter of wordLetters) {
      const index = availableLetters.indexOf(letter);
      if (index === -1) {
        return false;
      }
      availableLetters.splice(index, 1);
    }
    
    return true;
  };

  const calculateWordScore = (word: string): number => {
    const letterMultiplier = LETTER_MULTIPLIERS[word.length] || 1;
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS['easy']; // Default to easy for now
    const basePoints = Math.floor(word.length * 10 * letterMultiplier * difficultyMultiplier);
    const streakBonus = streak * 5;  // 5 points per word in streak
    return basePoints + streakBonus;
  };

  const handleSubmit = useCallback((word: string) => {
    if (word.length < 3) {
      setErrorMessage('Words must be at least 3 letters long');
      return false;
    }

    if (foundWords.includes(word)) {
      setErrorMessage('Word already found!');
      return false;
    }

    if (!isValidWord(word, displayLetters)) {
      setErrorMessage('Invalid word! Use only the given letters.');
      return false;
    }

    // Check if word exists in dictionary
    if (!isWordInDictionary(word)) {
      setErrorMessage('Not a valid word!');
      return false;
    }

    const wordScore = calculateWordScore(word);
    setScore(prevScore => prevScore + wordScore);
    setStreak(prevStreak => prevStreak + 1);
    setFoundWords(prev => [...prev, word]);
    setSuccessMessage(`+${wordScore} points!`);
    setGamePerformance(prev => [...prev, { word, score: wordScore, timestamp: Date.now() }]);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }

    return true;
  }, [displayLetters, foundWords, score, streak, highScore]);

  const getGameStats = useCallback((): GameStats => ({
    score,
    streak,
    wordsFound: foundWords.length,
    elapsedTime: Math.floor((Date.now() - startTime) / 1000)
  }), [score, streak, foundWords.length, startTime]);

  return {
    score,
    highScore,
    streak,
    displayLetters,
    errorMessage,
    successMessage,
    gamePerformance,
    foundWords,
    wordSet,
    initializeGame,
    handleSubmit,
    shuffleLetters: () => setDisplayLetters(shuffleString(displayLetters)),
    getGameStats
  };
}