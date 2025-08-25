/**
 * Canvas safety utilities to prevent errors when canvas context is not ready
 */

/**
 * Check if canvas context is fully ready for operations
 */
export function isCanvasContextReady(canvas: any): boolean {
  try {
    return !!(
      canvas
      && canvas.contextContainer
      && typeof canvas.contextContainer.clearRect === 'function'
      && typeof canvas.renderAll === 'function'
      && typeof canvas.loadFromJSON === 'function'
      && typeof canvas.toJSON === 'function'
      && typeof canvas.getWidth === 'function'
      && typeof canvas.getHeight === 'function'
    );
  } catch {
    return false;
  }
}

/**
 * Safely execute a canvas operation with context validation
 */
export function safeCanvasOperation<T>(
  canvas: any,
  operation: () => T,
  fallback?: T,
): T | undefined {
  try {
    // Check if canvas and context are ready
    if (!canvas || !canvas.contextContainer) {
      console.warn('Canvas or context not ready for operation');
      return fallback;
    }

    // Test if context is working
    const ctx = canvas.contextContainer;
    if (!ctx || typeof ctx.clearRect !== 'function') {
      console.warn('Canvas context not properly initialized');
      return fallback;
    }

    // Try to execute the operation
    return operation();
  } catch (error) {
    console.error('Canvas operation failed:', error);
    return fallback;
  }
}

/**
 * Safely call canvas.renderAll() with context validation
 */
export function safeRenderAll(canvas: any): boolean {
  return safeCanvasOperation(
    canvas,
    () => {
      canvas.renderAll();
      return true;
    },
    false,
  ) || false;
}

/**
 * Safely call canvas.clear() with context validation
 */
export function safeClear(canvas: any): boolean {
  return safeCanvasOperation(
    canvas,
    () => {
      canvas.clear();
      return true;
    },
    false,
  ) || false;
}

/**
 * Safely call canvas.setDimensions() with context validation
 */
export function safeSetDimensions(canvas: any, dimensions: { width: number; height: number }): boolean {
  return safeCanvasOperation(
    canvas,
    () => {
      canvas.setDimensions(dimensions);
      return true;
    },
    false,
  ) || false;
}

/**
 * Check if canvas is safe to use
 */
export function isCanvasSafe(canvas: any): boolean {
  try {
    return !!(
      canvas
      && canvas.contextContainer
      && typeof canvas.contextContainer.clearRect === 'function'
    );
  } catch {
    return false;
  }
}
