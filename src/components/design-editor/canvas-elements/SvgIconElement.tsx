import type { CanvasObject } from '@/hooks/useCanvasRenderer';
import type { Design } from '@/types/design';
import { handleUrlClick } from '@/utils/urlUtils';

type SvgIconElementProps = {
  obj: CanvasObject;
  index: number;
  designData: Design;
};

export function SvgIconElement({ obj, index, designData }: SvgIconElementProps) {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = obj.width || 0;
  const height = obj.height || 0;
  const angle = obj.angle || 0;

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

  const svgStyle = {
    position: 'absolute' as const,
    left: `${actualLeft - (obj.width / 2)}px`,
    top: `${actualTop - (obj.height / 2)}px`,
    width: `${obj.width}px`,
    height: `${obj.height}px`,
    transform: `rotate(${angle}deg) scale(${obj.scaleX || 1}, ${obj.scaleY || 1})`,
    transformOrigin: obj.originX === 'center' && obj.originY === 'center'
      ? 'center center'
      : obj.originX === 'center'
        ? 'center top'
        : obj.originY === 'center'
          ? 'left center'
          : 'left top',
    opacity: obj.opacity !== undefined ? obj.opacity : 1,
    zIndex: index + 1,
    cursor: obj.url || obj.URL ? 'pointer' : 'default',
    transition: 'all 0.2s ease-in-out',
  };

  // If SVG has a URL, make it interactive
  if (obj.url || obj.URL) {
    return (
      <div
        key={`canvas-svg-icon-${obj.id || index}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const url = obj.url || obj.URL;
            if (url) {
              handleUrlClick(url, obj.urlType, obj.name);
            }
          }
        }}
        style={{
          ...svgStyle,
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onClick={() => {
          const url = obj.url || obj.URL;
          if (url) {
            handleUrlClick(url, obj.urlType, obj.name);
          }
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: obj.svgCode || '' }}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  return (
    <div
      key={`canvas-svg-icon-${obj.id || index}`}
      style={svgStyle}
      dangerouslySetInnerHTML={{ __html: obj.svgCode || '' }}
    />
  );
}
