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

    const frequency = (type === 'countdown' || type === 'timeWarning') ? COUNTDOWN_FREQUENCY : // Same frequency for all countdown sounds
                     type === 'correct' ? 800 : 
                     type === 'wrong' ? 200 : 
                     type === 'click' ? 600 :
                     type === 'timeUp' ? COUNTDOWN_FREQUENCY : // Use same frequency for time's up
                     type === 'shuffle' ? 400 : 
                     400;

    const COUNTDOWN_DURATION = 0.15;

    const duration = (type === 'countdown' || type === 'timeWarning' || type === 'timeUp') ? COUNTDOWN_DURATION : 
                    0.1;

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    if (type === 'countdown' || type === 'timeWarning' || type === 'timeUp') {
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);
    } else {
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);
    }
    
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }, []);

  return { playSound };
}