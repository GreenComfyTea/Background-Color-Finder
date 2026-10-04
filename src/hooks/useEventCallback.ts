import { useCallback, useEffect, useRef } from "react";

/**
 * A React hook that returns a stable callback reference that always invokes the latest version of the provided callback.
 *
 * This is an alternative to React's `useEffectEvent` hook. It solves the stale closure problem
 * by storing the callback in a ref and updating it after each render, while returning a memoized callback
 * with an empty dependency array that always calls the latest version.
 *
 * @template T - The function type of the callback.
 * @param callback - The callback function to stabilize.
 * @returns A stable callback that always invokes the latest version of the provided callback.
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *
 *   const handleClick = useEventCallback(() => {
 *     console.log(count); // Always logs the current count, not stale value
 *   });
 *
 *   return <button onClick={handleClick}>{count}</button>;
 * }
 * ```
 */
const useEventCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
): T => {
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    (...args: unknown[]) => callbackRef.current.apply(void 0, args),
    [],
  ) as T;
};

export default useEventCallback;
