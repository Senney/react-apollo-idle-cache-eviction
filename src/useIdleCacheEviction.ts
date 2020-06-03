import { useRef, useEffect, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';

export type UseIdleCacheEvictionOptions = {
  /**
   * Defines how often the "idle" check should be performed.
   */
  checkInterval: number;

  /**
   * Defines how long the user must be idle for to quality
   * for their cache to be evicted.
   */
  minimumIdleMs: number;

  /**
   * Called when the cache is cleared. Can be used for logging,
   * or to triggle some other effect.
   */
  onCacheClear: () => void;
};

type WindowEventName = keyof WindowEventMap;
type WindowEventCallback<K extends WindowEventName> = (
  this: Window,
  ev: WindowEventMap[K]
) => any;

const useWindowEvent = <K extends WindowEventName>(
  event: K,
  callback: WindowEventCallback<K>
): void => {
  useEffect(() => {
    window.addEventListener(event, callback);

    return () => window.removeEventListener(event, callback);
  }, [event, callback]);
};

const checkIdleTime = (
  lastActiveTime: number,
  minimumIdleMs: number
): Boolean => new Date().getTime() - lastActiveTime > minimumIdleMs;

const useIdleCacheEviction = ({
  checkInterval,
  minimumIdleMs,
  onCacheClear
}: UseIdleCacheEvictionOptions): void => {
  const lastActiveTime = useRef(new Date().getTime());
  const client = useApolloClient();

  const updateLastActiveTime = useCallback(() => {
    lastActiveTime.current = new Date().getTime();
  }, []);

  useWindowEvent('touchstart', updateLastActiveTime);
  useWindowEvent('click', updateLastActiveTime);
  useWindowEvent('keypress', updateLastActiveTime);
  useWindowEvent('scroll', updateLastActiveTime);
  useWindowEvent('mousemove', updateLastActiveTime);

  useEffect(() => {
    const intervalHandle = setInterval(() => {
      if (checkIdleTime(lastActiveTime.current, minimumIdleMs)) {
        client.cache.gc();
        onCacheClear && onCacheClear();

        // Prevent the cache from immediately being cleared again on the
        // next call.
        updateLastActiveTime();
      }
    }, checkInterval);

    return () => clearInterval(intervalHandle);
  }, [
    checkInterval,
    minimumIdleMs,
    client,
    onCacheClear,
    updateLastActiveTime
  ]);
};

export default useIdleCacheEviction;
