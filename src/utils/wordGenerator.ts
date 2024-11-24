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
  // Fixed letter count of 7 for consistent gameplay
  const letterCount = 7;
  
  // Adjust target word count based on difficulty and time limit
  const baseWordCount = timeLimit === 'untimed' ? 
    UNTIMED_BASE_WORDS : 
    Math.floor(parseInt(timeLimit.toString()) / (difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7));

  // Adjust target word count based on difficulty
  const targetWordCount = Math.floor(baseWordCount * (
    difficulty === 'easy' ? 0.7 :
    difficulty === 'medium' ? 1 :
    1.3
  ));

  let attempts = 0;
  let letters: string;
  let possibleWords: string[];

  do {
    letters = generateRandomLetters(letterCount);
    possibleWords = getSubwords(letters, difficulty === 'easy' ? 3 : 4);
    attempts++;

    // Adjust word count requirements based on difficulty
    const minWordCount = Math.floor(targetWordCount * 0.8);
    const maxWordCount = Math.ceil(targetWordCount * 1.2);

    if (attempts >= 100) {
      console.warn('Falling back to easier word requirements');
      break;
    }

    // Ensure we have an appropriate number of words for the difficulty level
    if (possibleWords.length >= minWordCount && possibleWords.length <= maxWordCount) {
      break;
    }
  } while (true);

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