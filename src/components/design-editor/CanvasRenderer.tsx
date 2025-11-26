import type { Design } from '@/types/design';
import { ImageElement, ShapeElement, SvgIconElement, TextElement } from '@/components/design-editor/canvas-elements';
import { generateTextStyle, useCanvasRenderer } from '@/hooks/useCanvasRenderer';

type CanvasRendererProps = {
  designData: Design;
};

export function CanvasRenderer({ designData }: CanvasRendererProps) {
  const { renderCanvasObjects } = useCanvasRenderer(designData);

  return (
    <>
      {renderCanvasObjects.map((item: any) => {
        if (!item) {
          return null;
        }

        const { object: obj, index, baseStyle, elementType } = item;

        // Handle Text elements
        if (elementType === 'text') {
          const textStyle = generateTextStyle(obj, index);
          return <TextElement key={`text-${obj.id || index}`} obj={obj} index={index} textStyle={textStyle} />;
        }

        // Handle Shape elements
        if (elementType === 'shape') {
          return <ShapeElement key={`shape-${obj.id || index}`} obj={obj} index={index} baseStyle={baseStyle} />;
        }

        // Handle Image elements
        if (elementType === 'image') {
          return <ImageElement key={`image-${obj.id || index}`} obj={obj} index={index} designData={designData} />;
        }

        // Handle SVG Icon elements
        if (elementType === 'svgIcon') {
          return <SvgIconElement key={`svg-icon-${obj.id || index}`} obj={obj} index={index} designData={designData} />;
        }

        // Handle basic geometric shapes
        if (obj.type === 'rect') {
          return (
            <div
              key={`canvas-rect-${obj.id || index}`}
              style={{
                ...baseStyle,
                backgroundColor: obj.fill || '#cccccc',
                borderRadius: `${obj.rx || 0}px`,
                border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
                boxSizing: 'border-box',
              }}
            />
          );
        }

        if (obj.type === 'circle') {
          return (
            <div
              key={`canvas-circle-${obj.id || index}`}
              style={{
                ...baseStyle,
                backgroundColor: obj.fill || '#cccccc',
                borderRadius: '50%',
                border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
                boxSizing: 'border-box',
              }}
            />
          );
        }

        if (obj.type === 'triangle') {
          const left = obj.left || 0;
          const top = obj.top || 0;
          const width = (obj.width || 0) * (obj.scaleX || 1);
          const height = (obj.height || 0) * (obj.scaleY || 1);
          const angle = obj.angle || 0;

          return (
            <svg
              key={`canvas-triangle-${obj.id || index}`}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                opacity: obj.opacity !== undefined ? obj.opacity : 1,
                zIndex: index + 1,
              }}
              viewBox={`0 0 ${width} ${height}`}
            >
              <polygon
                points={`${width / 2},0 0,${height} ${width},${height}`}
                fill={obj.fill || '#cccccc'}
                stroke={obj.stroke || 'none'}
                strokeWidth={obj.strokeWidth || 0}
              />
            </svg>
          );
        }

        if (obj.type === 'polygon') {
          const left = obj.left || 0;
          const top = obj.top || 0;
          const width = (obj.width || 0) * (obj.scaleX || 1);
          const height = (obj.height || 0) * (obj.scaleY || 1);
          const angle = obj.angle || 0;

          return (
            <svg
              key={`canvas-polygon-${obj.id || index}`}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                opacity: obj.opacity !== undefined ? obj.opacity : 1,
                zIndex: index + 1,
              }}
              viewBox={`0 0 ${width} ${height}`}
            >
              <polygon
                points={obj.points || ''}
                fill={obj.fill || '#cccccc'}
                stroke={obj.stroke || 'none'}
                strokeWidth={obj.strokeWidth || 0}
              />
            </svg>
          );
        }

        if (obj.type === 'line') {
          const left = obj.left || 0;
          const top = obj.top || 0;
          const width = (obj.width || 0) * (obj.scaleX || 1);
          const height = (obj.height || 0) * (obj.scaleY || 1);
          const angle = obj.angle || 0;

          return (
            <svg
              key={`canvas-line-${obj.id || index}`}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                opacity: obj.opacity !== undefined ? obj.opacity : 1,
                zIndex: index + 1,
              }}
              viewBox={`0 0 ${width} ${height}`}
            >
              <line
                x1="0"
                y1="0"
                x2={width}
                y2={height}
                stroke={obj.stroke || '#000000'}
                strokeWidth={obj.strokeWidth || 2}
              />
            </svg>
          );
        }

        return null;
      })}
    </>
  );
}
