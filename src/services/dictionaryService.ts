import words from 'an-array-of-english-words';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const API_TIMEOUT = 3000; // 3 seconds timeout for API calls

interface CacheEntry {
  valid: boolean;
  timestamp: number;
  source: 'local' | 'api';
}

const wordCache = new Map<string, CacheEntry>();
const validWords = new Set(words.filter(word => word.length >= 3));

// Helper function to check word against local dictionary
const checkLocalDictionary = (word: string): boolean => {
  return validWords.has(word);
};

// Helper function to check word against API with timeout
const checkDictionaryAPI = async (word: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Dictionary API request timed out');
    } else {
      console.error('Dictionary API error:', error);
    }
    return false;
  }
};

export async function validateWord(word: string): Promise<boolean> {
  const normalizedWord = word.toLowerCase().trim();
  
  // Check cache first
  const cached = wordCache.get(normalizedWord);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.valid;
  }

  // First check local dictionary
  if (checkLocalDictionary(normalizedWord)) {
    wordCache.set(normalizedWord, {
      valid: true,
      timestamp: Date.now(),
      source: 'local'
    });
    return true;
  }

  // If not in local dictionary and word is short (≤ 4 letters), skip API check
  if (normalizedWord.length <= 4) {
    wordCache.set(normalizedWord, {
      valid: false,
      timestamp: Date.now(),
      source: 'local'
    });
    return false;
  }

  // For longer words not in local dictionary, try API
  const isValidAPI = await checkDictionaryAPI(normalizedWord);
  
  wordCache.set(normalizedWord, {
    valid: isValidAPI,
    timestamp: Date.now(),
    source: 'api'
  });

  return isValidAPI;
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