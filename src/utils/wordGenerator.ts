import { WordSet, Difficulty } from '../types/game';
import { generateRandomLetters } from './letterGenerator';
import words from 'an-array-of-english-words';

export function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

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

export function isWordInDictionary(word: string): boolean {
  return validWords.includes(word.toLowerCase());
}

export function generateWordSet(difficulty: Difficulty): WordSet {
  const letterCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 7 : 8;
  const letters = generateRandomLetters(letterCount);
  const possibleWords = getSubwords(letters);

  // Ensure there are at least a few possible words
  if (possibleWords.length < 3) {
    return generateWordSet(difficulty); // Try again with new letters
  }

  return {
    letters,
    possibleWords,
    foundWords: []
  };
}