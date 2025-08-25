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
      // Additional check for context before rendering
      if (!canvas.contextContainer || typeof canvas.contextContainer.clearRect !== 'function') {
        console.warn('Canvas context not ready for rendering');
        return false;
      }

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
  // Validate dimensions before attempting to set them
  if (!dimensions || typeof dimensions.width !== 'number' || typeof dimensions.height !== 'number') {
    console.warn('Invalid dimensions provided to safeSetDimensions:', dimensions);
    return false;
  }

  if (dimensions.width <= 0 || dimensions.height <= 0) {
    console.warn('Dimensions must be positive numbers:', dimensions);
    return false;
  }

  return safeCanvasOperation(
    canvas,
    () => {
      // Additional check to ensure canvas has the setDimensions method
      if (typeof canvas.setDimensions !== 'function') {
        console.warn('Canvas does not have setDimensions method');
        return false;
      }

      canvas.setDimensions(dimensions);
      return true;
    },
    false,
  ) || false;
}

/**
 * Safely call canvas.setBackgroundColor() with context validation
 */
export function safeSetBackgroundColor(canvas: any, color: string, callback?: () => void): boolean {
  // Validate color parameter
  if (!color || typeof color !== 'string') {
    console.warn('Invalid color provided to safeSetBackgroundColor:', color);
    return false;
  }

  return safeCanvasOperation(
    canvas,
    () => {
      // Additional check to ensure canvas has the setBackgroundColor method
      if (typeof canvas.setBackgroundColor !== 'function') {
        console.warn('Canvas does not have setBackgroundColor method');
        return false;
      }

      // Check if context is available before setting background
      if (!canvas.contextContainer || typeof canvas.contextContainer.clearRect !== 'function') {
        console.warn('Canvas context not ready for background color operation');
        return false;
      }

      canvas.setBackgroundColor(color, () => {
        // Only call renderAll if canvas is still safe
        if (canvas.contextContainer && typeof canvas.renderAll === 'function') {
          canvas.renderAll();
        }
        // Execute callback if provided
        if (callback && typeof callback === 'function') {
          callback();
        }
      });
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
