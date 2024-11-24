import words from 'an-array-of-english-words';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheEntry {
  valid: boolean;
  timestamp: number;
}

const wordCache = new Map<string, CacheEntry>();
const validWords = new Set(words.filter(word => word.length >= 3));

export async function validateWord(word: string): Promise<boolean> {
  const normalizedWord = word.toLowerCase().trim();
  
  // Check cache first
  const cached = wordCache.get(normalizedWord);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.valid;
  }

  try {
    // First check local dictionary for faster response
    if (validWords.has(normalizedWord)) {
      wordCache.set(normalizedWord, {
        valid: true,
        timestamp: Date.now()
      });
      return true;
    }

    // If not in local dictionary, check API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);
    const isValid = response.ok;
    
    // Update cache
    wordCache.set(normalizedWord, {
      valid: isValid,
      timestamp: Date.now()
    });

    return isValid;
  } catch (error) {
    console.error('Dictionary API error:', error);
    // Fallback to local dictionary
    return validWords.has(normalizedWord);
  }
}

// Clean cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [word, entry] of wordCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      wordCache.delete(word);
    }
  }
}, CACHE_DURATION); 