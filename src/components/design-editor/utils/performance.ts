import { useCallback, useMemo, useRef } from 'react';
import { safeRenderAll } from './canvasSafety';

/**
 * Debounce utility for optimizing frequent function calls
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
 * Throttle utility for limiting function execution frequency
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        return callback(...args);
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
      // Use safeRenderAll instead of direct canvas.renderAll
      safeRenderAll(canvas);
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
    return {
      objects: canvasState.objects?.length || 0,
      width: canvasState.width,
      height: canvasState.height,
      backgroundColor: canvasState.backgroundColor,
    };
  }, [canvasState]);
}

/**
 * Optimize canvas object interactions for better performance
 */
export function useCanvasObjectOptimization(canvas: any) {
  return useCallback((object: any) => {
    if (!object || !canvas) {
      return;
    }

    // Disable object caching during interactions for better performance
    if (object.set) {
      object.set({
        objectCaching: false,
        statefullCache: false,
        noScaleCache: false,
      });
    }
  }, [canvas]);
}

/**
 * Memoized fabric object creation with performance optimizations
 */
export function useOptimizedFabricObject(
  type: string,
  options: any,
  dependencies: any[],
) {
  return useMemo(() => {
    if (!type || !options) {
      return null;
    }

    // Common performance optimizations for all fabric objects
    const optimizedOptions = {
      ...options,
      objectCaching: true,
      statefullCache: true,
      noScaleCache: false,
      hoverCursor: 'move',
      moveCursor: 'move',
    };

    return {
      type,
      options: optimizedOptions,
    };
  }, [type, options, ...dependencies]);
}

/**
 * Performance-optimized text normalization for fabric objects
 */
export function normalizeTextObjects(canvas: any): void {
  if (!canvas || typeof canvas.getObjects !== 'function') {
    console.warn('Canvas not available for text normalization');
    return;
  }

  try {
    const objects = canvas.getObjects();
    if (!Array.isArray(objects)) {
      return;
    }

    objects.forEach((obj: any) => {
      if (obj && (obj.type === 'textbox' || obj.type === 'text')) {
        // Reset text scaling issues
        if (typeof obj.set === 'function') {
          obj.set({
            scaleX: 1,
            scaleY: 1,
            fontSize: obj.fontSize || 20,
          });
        }
      }
    });
  } catch (error) {
    console.error('Error normalizing text objects:', error);
  }
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
