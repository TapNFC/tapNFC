import { useCallback, useMemo, useRef } from 'react';

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay],
  );
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callback(...args);
        }, delay - (now - lastRunRef.current));
      }
    }) as T,
    [callback, delay],
  );
}

/**
 * Coalesce multiple canvas.renderAll() calls into a single rAF tick
 */
export function useCanvasRenderScheduler(canvas: any) {
  const rafIdRef = useRef<number | null>(null);

  return useCallback(() => {
    if (!canvas) {
      return;
    }
    if (rafIdRef.current !== null) {
      return;
    }
    rafIdRef.current = requestAnimationFrame(() => {
      canvas.renderAll?.();
      rafIdRef.current = null;
    });
  }, [canvas]);
}

/**
 * Memoized object comparison for canvas states
 */
export function useCanvasStateMemo(canvasState: any) {
  return useMemo(() => {
    if (!canvasState) {
      return null;
    }

    // Create a stable reference for canvas state to prevent unnecessary re-renders
    return {
      ...canvasState,
      // Sort objects to ensure consistent comparison
      objects: canvasState.objects
        ? [...canvasState.objects].sort((a, b) => {
            const aId = a.id || a.uuid || '';
            const bId = b.id || b.uuid || '';
            return aId.localeCompare(bId);
          })
        : [],
    };
  }, [canvasState]);
}

/**
 * Stable callback hook for event handlers
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    [],
  );
}

/**
 * Performance monitoring hook for development
 */
export function usePerformanceMonitor(name: string, deps: any[] = []) {
  const startTimeRef = useRef<number>(0);

  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      startTimeRef.current = performance.now();
    }
  }, deps);

  useMemo(() => {
    if (process.env.NODE_ENV === 'development' && startTimeRef.current) {
      const endTime = performance.now();
      const duration = endTime - startTimeRef.current;
      if (duration > 16) { // More than one frame (16ms)
        console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
      }
    }
  }, deps);
}
