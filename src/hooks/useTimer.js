import { useEffect, useState } from 'react';

// Counts down from `seconds` and calls `onExpire` once when it reaches zero.
// `resetKey` restarts the countdown whenever it changes - we pass the
// current question's id, so every new question gets a fresh timer.
export function useTimer(seconds, onExpire, resetKey) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return timeLeft;
}
