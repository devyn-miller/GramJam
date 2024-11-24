import { shuffleString } from './stringUtils';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

export const UNTIMED_BASE_WORDS = 120; // Base word count for untimed mode

export function generateRandomLetters(count: number): string {
  const minVowels = Math.floor(count * 0.3); // At least 30% vowels
  const maxVowels = Math.ceil(count * 0.5); // At most 50% vowels
  const vowelCount = Math.floor(Math.random() * (maxVowels - minVowels + 1)) + minVowels;
  const consonantCount = count - vowelCount;

  const letters: string[] = [];
  
  // Add vowels
  for (let i = 0; i < vowelCount; i++) {
    letters.push(VOWELS[Math.floor(Math.random() * VOWELS.length)]);
  }
  
  // Add consonants
  for (let i = 0; i < consonantCount; i++) {
    letters.push(CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)]);
  }

  // Shuffle the letters
  return shuffleString(letters.join(''));
}