import { useState, useCallback } from 'react';
import { WordSet, Difficulty, WordSubmitResult } from '../types/game';
import { generateWordSet } from '../utils/wordGenerator';

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

export function useGameLogic() {
  const [wordSet, setWordSet] = useState<WordSet>({ letters: '', possibleWords: [], foundWords: [] });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [streak, setStreak] = useState(0);
  const [streakPoints, setStreakPoints] = useState<{ [key: string]: number }>({});

  const initializeGame = useCallback((difficulty: Difficulty) => {
    const newWordSet = generateWordSet(difficulty);
    setWordSet(newWordSet);
    setScore(0);
    setStreak(0);
    setStreakPoints({});
  }, []);

  const submitWord = useCallback((word: string): WordSubmitResult => {
    const normalizedWord = word.toLowerCase();

    if (normalizedWord.length < 3) {
      return { valid: false, message: 'Word must be at least 3 letters long' };
    }

    const availableLetters = [...wordSet.letters.toLowerCase()];
    const wordLetters = [...normalizedWord];
    
    for (const letter of wordLetters) {
      const index = availableLetters.indexOf(letter);
      if (index === -1) {
        return { valid: false, message: 'Invalid letters used' };
      }
      availableLetters.splice(index, 1);
    }

    if (wordSet.foundWords.includes(normalizedWord)) {
      return { valid: false, message: 'Word already found' };
    }

    if (!wordSet.possibleWords.includes(normalizedWord)) {
      return { valid: false, message: 'Not a valid word' };
    }

    const basePoints = Math.floor(
      word.length * 10 * 
      DIFFICULTY_MULTIPLIERS[wordSet.letters.length <= 6 ? 'easy' : wordSet.letters.length <= 7 ? 'medium' : 'hard']
    );
    const streakBonus = streak * 5;
    const totalPoints = basePoints + streakBonus;
    const newScore = score + totalPoints;
    
    setScore(newScore);
    setStreak(prev => prev + 1);
    setStreakPoints(prev => ({
      ...prev,
      [normalizedWord]: streakBonus
    }));
    setWordSet(prev => ({
      ...prev,
      foundWords: [...prev.foundWords, normalizedWord]
    }));

    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('highScore', newScore.toString());
    }

    return { 
      valid: true, 
      message: `+${totalPoints} points! (${basePoints} + ${streakBonus} streak bonus)`
    };
  }, [wordSet, score, streak, highScore]);

  return {
    wordSet,
    score,
    highScore,
    streak,
    streakPoints,
    initializeGame,
    submitWord
  };
}