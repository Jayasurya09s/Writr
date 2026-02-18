import { useRef, useCallback } from "react";

/**
 * Custom debounce hook.
 * Returns a debounced version of the callback that only fires after `delay` ms of inactivity.
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
        timerRef.current = null;
      }, delay);
    },
    [callback, delay]
  );

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { debouncedFn, flush };
}
