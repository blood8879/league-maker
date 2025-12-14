import { useState, useEffect, useCallback } from 'react';
import { MatchTimer, TimerPhase } from '@/types/match';

const HALF_DURATION = 45 * 60; // 45 minutes in seconds

export function useMatchTimer() {
  const [timer, setTimer] = useState<MatchTimer>({
    phase: 'first-half',
    minute: 0,
    second: 0,
    isRunning: false,
  });

  const [, setTotalSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer.isRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          const newTotal = prev + 1;
          const minute = Math.floor((newTotal % HALF_DURATION) / 60);
          const second = newTotal % 60;

          let phase: TimerPhase = timer.phase;

          // Phase 전환 로직
          if (newTotal >= HALF_DURATION * 2) {
            phase = 'finished';
          } else if (newTotal >= HALF_DURATION) {
            phase = 'second-half';
          }

          setTimer((prevTimer) => ({
            ...prevTimer,
            minute,
            second,
            phase,
          }));

          return newTotal;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.phase]);

  const start = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resume = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const finish = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      phase: 'finished',
    }));
  }, []);

  const reset = useCallback(() => {
    setTimer({
      phase: 'first-half',
      minute: 0,
      second: 0,
      isRunning: false,
    });
    setTotalSeconds(0);
  }, []);

  const getCurrentMinute = useCallback((): number => {
    if (timer.phase === 'first-half') {
      return timer.minute;
    } else if (timer.phase === 'second-half') {
      return 45 + timer.minute;
    }
    return 90;
  }, [timer.minute, timer.phase]);

  return {
    timer,
    start,
    pause,
    resume,
    finish,
    reset,
    getCurrentMinute,
  };
}
