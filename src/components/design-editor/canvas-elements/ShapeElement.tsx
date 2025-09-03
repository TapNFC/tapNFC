import type { BaseStyle, CanvasObject } from '@/hooks/useCanvasRenderer';

type ShapeElementProps = {
  obj: CanvasObject;
  index: number;
  baseStyle: BaseStyle;
};

export function ShapeElement({ obj, index, baseStyle }: ShapeElementProps) {
  const shapeData = obj.shapeData;
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);
  const angle = obj.angle || 0;

  if (shapeData?.type === 'rectangle') {
    return (
      <div
        key={`canvas-shape-rectangle-${obj.id || index}`}
        style={{
          ...baseStyle,
          backgroundColor: shapeData.fill || obj.fill || '#cccccc',
          border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
          borderRadius: obj.rx || 8,
          boxSizing: 'border-box',
        }}
      />
    );
  }

  if (shapeData?.type === 'circle') {
    return (
      <div
        key={`canvas-shape-circle-${obj.id || index}`}
        style={{
          ...baseStyle,
          backgroundColor: shapeData.fill || obj.fill || '#cccccc',
          border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
          borderRadius: '50%',
          boxSizing: 'border-box',
        }}
      />
    );
  }

  if (shapeData?.type === 'triangle') {
    return (
      <div
        key={`canvas-shape-triangle-${obj.id || index}`}
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'center center',
          opacity: obj.opacity !== undefined ? obj.opacity : 1,
          zIndex: index + 1,
          width: 0,
          height: 0,
          borderLeft: `${width / 2}px solid transparent`,
          borderRight: `${width / 2}px solid transparent`,
          borderBottom: `${height}px solid ${shapeData.fill || obj.fill || '#cccccc'}`,
          ...(shapeData.stroke || obj.stroke
            ? {
                filter: `drop-shadow(0 0 0 ${shapeData.strokeWidth || obj.strokeWidth || 1}px ${shapeData.stroke || obj.stroke})`,
              }
            : {}),
        }}
      />
    );
  }

  if (shapeData?.type === 'diamond') {
    return (
      <div
        key={`canvas-shape-diamond-${obj.id || index}`}
        style={{
          ...baseStyle,
          backgroundColor: shapeData.fill || obj.fill || '#cccccc',
          border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
          transform: `rotate(${angle}deg) rotate(45deg)`,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
    );
  }

  if (shapeData?.type === 'line') {
    return (
      <div
        key={`canvas-shape-line-${obj.id || index}`}
        style={{
          ...baseStyle,
          backgroundColor: shapeData.stroke || obj.stroke || '#000000',
          border: 'none',
          height: shapeData.strokeWidth || obj.strokeWidth || 2,
          borderRadius: 1,
          boxSizing: 'border-box',
        }}
      />
    );
  }

  return null;
}
