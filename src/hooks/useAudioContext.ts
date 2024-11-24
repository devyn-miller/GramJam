import { useRef, useCallback } from 'react';

type SoundType = 'correct' | 'wrong' | 'shuffle' | 'click' | 'countdown' | 'timeWarning' | 'timeUp';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: SoundType) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    const COUNTDOWN_FREQUENCY = 523.25; // C5 note
    const COUNTDOWN_DURATION = 0.15;
    const COUNTDOWN_GAIN = 0.15;

    // Use consistent frequency and duration for all countdown-related sounds
    if (type === 'countdown' || type === 'timeWarning' || type === 'timeUp') {
      oscillator.frequency.setValueAtTime(COUNTDOWN_FREQUENCY, context.currentTime);
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(COUNTDOWN_GAIN, context.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + COUNTDOWN_DURATION);
      oscillator.start();
      oscillator.stop(context.currentTime + COUNTDOWN_DURATION);
      return;
    }

    // Other sound types
    const frequency = type === 'correct' ? 800 : 
                     type === 'wrong' ? 200 : 
                     type === 'click' ? 600 :
                     type === 'shuffle' ? 400 : 
                     400;

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  }, []);

  return { playSound };
}