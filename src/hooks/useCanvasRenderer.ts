import type { Design } from '@/types/design';
import { useMemo } from 'react';

export type CanvasObject = any; // Using any for now to maintain compatibility

export type BaseStyle = {
  position: 'absolute';
  left: string;
  top: string;
  width: string;
  height: string;
  transform: string;
  transformOrigin: string;
  opacity: number;
  zIndex: number;
};

export type TextStyle = {
  color: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  whiteSpace: string;
  lineHeight: string;
  boxSizing: 'border-box';
  display: string;
  alignItems: string;
  fontStyle: string;
  textDecoration: string;
  minHeight: string;
  justifyContent: string;
  padding: string;
  margin: string;
  backgroundColor: string;
  border: string;
  outline: string;
  textShadow: string;
} & BaseStyle;

export function useCanvasRenderer(designData: Design) {
  const renderCanvasObjects = useMemo(() => {
    if (!designData?.canvas_data?.objects || !Array.isArray(designData.canvas_data.objects)) {
      return [];
    }

    return designData.canvas_data.objects.map((obj: CanvasObject, index: number) => {
      if (!obj) {
        return null;
      }

      return {
        object: obj,
        index,
        baseStyle: generateBaseStyle(obj, index),
        elementType: detectElementType(obj),
      };
    });
  }, [designData]);

  return { renderCanvasObjects };
}

// Helper function to generate base style for canvas objects
export function generateBaseStyle(obj: CanvasObject, index: number): BaseStyle {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);
  const angle = obj.angle || 0;

  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: 'center center',
    opacity: obj.opacity !== undefined ? obj.opacity : 1,
    zIndex: index + 1,
  };
}

// Helper function to detect element type
export function detectElementType(obj: CanvasObject): string {
  if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
    return 'text';
  }
  if (obj.type === 'rect') {
    return 'rect';
  }
  if (obj.type === 'circle') {
    return 'circle';
  }
  if (obj.type === 'triangle') {
    return 'triangle';
  }
  if (obj.elementType === 'shape' && obj.shapeData) {
    return 'shape';
  }
  if (obj.type === 'polygon') {
    return 'polygon';
  }
  if (obj.type === 'line') {
    return 'line';
  }
  if (obj.type === 'image') {
    return 'image';
  }
  if (obj.svgCode && obj.isSvgIcon) {
    return 'svgIcon';
  }
  return 'unknown';
}

// Helper function to calculate text positioning
export function calculateTextPosition(obj: CanvasObject) {
  const fontSize = obj.fontSize || 16;
  let adjustedLeft = obj.left || 0;
  let adjustedTop = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);

  // Adjust for text origin and alignment
  if (obj.originX === 'center') {
    adjustedLeft = (obj.left || 0) - (width / 2);
  } else if (obj.originX === 'right') {
    adjustedLeft = (obj.left || 0) - width;
  }

  if (obj.originY === 'center') {
    adjustedTop = (obj.top || 0) - (height / 2);
  } else if (obj.originY === 'bottom') {
    adjustedTop = (obj.top || 0) - height;
  }

  // Additional adjustment for text baseline
  if (obj.textBaseline === 'alphabetic' || obj.textBaseline === 'baseline') {
    adjustedTop = adjustedTop - fontSize * 0.2;
  } else if (obj.textBaseline === 'middle') {
    adjustedTop = adjustedTop - fontSize * 0.1;
  }

  return { adjustedLeft, adjustedTop, width, height, fontSize };
}

// Helper function to generate text style
export function generateTextStyle(obj: CanvasObject, index: number): TextStyle {
  const { adjustedLeft, adjustedTop, width, height, fontSize } = calculateTextPosition(obj);

  return {
    position: 'absolute',
    left: `${adjustedLeft}px`,
    top: `${adjustedTop}px`,
    width: obj.type === 'textbox' ? `${width}px` : 'auto',
    height: obj.type === 'textbox' ? `${height}px` : 'auto',
    transform: `rotate(${obj.angle || 0}deg)`,
    transformOrigin: 'left top',
    opacity: obj.opacity !== undefined ? obj.opacity : 1,
    zIndex: index + 1,
    color: obj.fill || '#000000',
    fontFamily: obj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: `${fontSize}px`,
    fontWeight: obj.fontWeight || 'normal',
    textAlign: obj.textAlign || 'left',
    whiteSpace: 'pre-wrap',
    lineHeight: obj.lineHeight || 1.2,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'flex-start',
    fontStyle: obj.fontStyle === 'italic' ? 'italic' : 'normal',
    textDecoration: `${obj.underline ? 'underline' : ''} ${obj.linethrough ? 'line-through' : ''}`.trim(),
    minHeight: `${fontSize * (obj.lineHeight || 1.2)}px`,
    justifyContent: obj.textAlign === 'center' ? 'center' : obj.textAlign === 'right' ? 'flex-end' : 'flex-start',
    padding: '0',
    margin: '0',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    textShadow: obj.fill === '#ffffff' || obj.fill === '#FFFFFF' ? '0 0 2px rgba(0,0,0,0.5)' : 'none',
  };
}

// Helper function to calculate image positioning
export function calculateImagePosition(obj: CanvasObject) {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);

  let imageLeft = left;
  let imageTop = top;

  if (obj.originX === 'center') {
    imageLeft = left - (width / 2);
  } else if (obj.originX === 'right') {
    imageLeft = left - width;
  }

  if (obj.originY === 'center') {
    imageTop = top - (height / 2);
  } else if (obj.originY === 'bottom') {
    imageTop = top - height;
  }

  return { imageLeft, imageTop, width, height };
}

// Helper function to calculate SVG icon positioning
export function calculateSvgIconPosition(obj: CanvasObject, designData: Design) {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = obj.width || 0;
  const height = obj.height || 0;

  let actualLeft = left;
  let actualTop = top;

  if (obj.originX === 'center') {
    actualLeft = left - (width / 2);
  } else if (obj.originX === 'right') {
    actualLeft = left - width;
  }

  if (obj.originY === 'center') {
    actualTop = top - (height / 2);
  } else if (obj.originY === 'bottom') {
    actualTop = top - height;
  }

  if (!obj.originX && !obj.originY) {
    const canvasWidth = designData?.width || 800;
    const canvasHeight = designData?.height || 600;

    if (Math.abs(left - canvasWidth / 2) < canvasWidth / 3 && Math.abs(top - canvasHeight / 2) < canvasHeight / 3) {
      actualLeft = left - (width / 2);
      actualTop = top - (height / 2);
    }
  }

  return { actualLeft, actualTop, width, height };
}
