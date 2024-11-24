import { useRef, useCallback } from 'react';

type SoundType = 'correct' | 'wrong' | 'shuffle' | 'click' | 'countdown' | 'timeWarning' | 'timeUp';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: SoundType, countdownStep?: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Constants
    const COUNTDOWN_FREQUENCY = 800; // Consistent frequency for countdown
    const COUNTDOWN_DURATION = 0.15;
    const COUNTDOWN_GAIN = 0.15;

    const CORRECT_FREQUENCY = 600;
    const WRONG_FREQUENCY = 200;
    const CLICK_FREQUENCY = 400;
    const SHUFFLE_FREQUENCY = 300;
    const TIME_WARNING_FREQUENCY = 523.25; // C5 note

    if (type === 'countdown') {
      if (countdownStep && countdownStep >= 1 && countdownStep <= 3) {
          // Ensure consistent frequency (800Hz) for all countdown steps
          oscillator.frequency.setValueAtTime(800, context.currentTime);
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.02); // Fade-in
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.15);    // Fade-out
          oscillator.start();
          oscillator.stop(context.currentTime + 0.15); // Ensure clean stop
      }
      // Prevent sound from playing for countdownStep === 0
      return;
  }
  

    // Time warning and time up sounds
    if (type === 'timeWarning' || type === 'timeUp') {
      oscillator.frequency.setValueAtTime(TIME_WARNING_FREQUENCY, context.currentTime);
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(COUNTDOWN_GAIN, context.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + COUNTDOWN_DURATION);
      oscillator.start();
      oscillator.stop(context.currentTime + COUNTDOWN_DURATION);
      return;
    }

    // Other sound types
    const frequency = type === 'correct' ? CORRECT_FREQUENCY : 
                     type === 'wrong' ? WRONG_FREQUENCY : 
                     type === 'click' ? CLICK_FREQUENCY :
                     type === 'shuffle' ? SHUFFLE_FREQUENCY : 
                     CLICK_FREQUENCY;

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  }, []);

  return { playSound };
}
