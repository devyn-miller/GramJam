const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

export function generateRandomLetters(length: number = 7): string {
  // Ensure at least 2 vowels
  const letters: string[] = [];
  const vowelCount = 2;
  
  // Add required vowels
  for (let i = 0; i < vowelCount; i++) {
    const randomVowel = VOWELS[Math.floor(Math.random() * VOWELS.length)];
    letters.push(randomVowel);
  }
  
  // Fill remaining positions with random letters
  while (letters.length < length) {
    const useVowel = Math.random() < 0.3; // 30% chance for additional vowels
    const pool = useVowel ? VOWELS : CONSONANTS;
    const randomLetter = pool[Math.floor(Math.random() * pool.length)];
    letters.push(randomLetter);
  }
  
  // Shuffle the array
  return letters.sort(() => Math.random() - 0.5).join('');
}