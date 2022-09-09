import { useEffect, useRef, useState } from "react";

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function useThrottle(value: any, limit: number) {
  let [throttledValue, setThrottledValue] = useState(value);
  let lastRan = useRef(Date.now());

  useEffect(() => {
    let handler = window.setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => window.clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}
