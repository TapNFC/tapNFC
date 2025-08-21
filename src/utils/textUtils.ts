/**
 * Utility functions for text object handling in Fabric.js canvas
 */

/**
 * Check if an object is a text object
 */
export function isTextObject(obj: any): boolean {
  return obj && (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox');
}

/**
 * Normalize a single text object by converting scaling to fontSize
 */
export function normalizeTextObject(obj: any): void {
  if (!isTextObject(obj)) {
    return;
  }

  const scaleX = obj.scaleX || 1;
  const scaleY = obj.scaleY || 1;

  // If there's any scaling, convert it to fontSize
  if (scaleX !== 1 || scaleY !== 1) {
    const originalFontSize = obj.fontSize || 16;
    const scaleFactor = Math.max(scaleX, scaleY);
    const newFontSize = Math.round(originalFontSize * scaleFactor);

    obj.set({
      fontSize: newFontSize,
      scaleX: 1,
      scaleY: 1,
    });
  }
}

/**
 * Normalize all text objects in a canvas by converting scaling to fontSize
 */
export function normalizeTextObjects(canvas: any): void {
  if (!canvas || !canvas.getObjects) {
    return;
  }

  const objects = canvas.getObjects();
  objects.forEach((obj: any) => {
    normalizeTextObject(obj);
  });
}

/**
 * Calculate font size from scaling factors
 */
export function calculateFontSizeFromScaling(originalFontSize: number, scaleX: number, scaleY: number): number {
  const scaleFactor = Math.max(scaleX || 1, scaleY || 1);
  return Math.round(originalFontSize * scaleFactor);
}

/**
 * Get the effective font size of a text object (considering scaling)
 */
export function getEffectiveFontSize(obj: any): number {
  if (!isTextObject(obj)) {
    return 16;
  }

  const baseFontSize = obj.fontSize || 16;
  const scaleX = obj.scaleX || 1;
  const scaleY = obj.scaleY || 1;

  return calculateFontSizeFromScaling(baseFontSize, scaleX, scaleY);
}
