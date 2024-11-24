import { WordSet, Difficulty, TimeLimit } from '../types/game';
import { generateRandomLetters, UNTIMED_BASE_WORDS } from './letterGenerator';
import { shuffleString } from './stringUtils';
import words from 'an-array-of-english-words';

// Filter the dictionary to only include words of length 3 or more
const validWords = words.filter(word => word.length >= 3);

function getSubwords(letters: string, minLength: number = 3): string[] {
  const letterCount = new Map<string, number>();
  letters.toLowerCase().split('').forEach(letter => {
    letterCount.set(letter, (letterCount.get(letter) || 0) + 1);
  });

  return validWords.filter(word => {
    if (word.length < minLength) return false;
    
    const wordCount = new Map<string, number>();
    word.split('').forEach(letter => {
      wordCount.set(letter, (wordCount.get(letter) || 0) + 1);
    });

    for (const [letter, count] of wordCount) {
      if ((letterCount.get(letter) || 0) < count) {
        return false;
      }
    }
    return true;
  });
}

// Add this function to get total possible word count
export function getPossibleWordCount(letters: string[]): number {
  return getSubwords(letters.join('')).length;
}

export function generateWordSet(difficulty: Difficulty, timeLimit: TimeLimit): WordSet {
  const letterCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 7 : 8;
  const targetWordCount = timeLimit === 'untimed' ? 
    UNTIMED_BASE_WORDS : 
    timeLimit / (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);

  let attempts = 0;
  let letters: string;
  let possibleWords: string[];

  do {
    letters = generateRandomLetters(letterCount);
    possibleWords = getSubwords(letters);
    attempts++;

    if (attempts >= 100) {
      console.warn('Falling back to easier word requirements');
      break;
    }
  } while (possibleWords.length < targetWordCount);

  return {
    letters: letters.split(''),
    possibleWords,
    foundWords: []
  };
}

export const isWordInDictionary = (word: string): boolean => {
  // Implementation here
  return true; // Replace with actual dictionary check
};