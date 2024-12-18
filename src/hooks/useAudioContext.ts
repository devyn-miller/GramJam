import { useRef, useCallback } from 'react';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'shuffle') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const frequency = type === 'correct' ? 800 : type === 'wrong' ? 200 : 400;
    const context = audioContextRef.current;
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  }, []);

  return { playSound };
}