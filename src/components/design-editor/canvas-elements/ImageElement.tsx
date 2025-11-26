import type { CanvasObject } from '@/hooks/useCanvasRenderer';
import type { Design } from '@/types/design';
import { handlePhoneClick } from '@/utils/phoneUtils';
import { formatUrl, handleUrlClick } from '@/utils/urlUtils';

type ImageElementProps = {
  obj: CanvasObject;
  index: number;
  designData: Design;
};

export function ImageElement({ obj, index, designData }: ImageElementProps) {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);
  const angle = obj.angle || 0;

  // Handle social icons with special styling
  if (obj.elementType === 'socialIcon') {
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

    return (
      <div
        key={`canvas-social-icon-${obj.id || index}`}
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
          position: 'absolute',
          left: `${actualLeft}px`,
          top: `${actualTop}px`,
          width: `${width}px`,
          height: `${height}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: obj.originX === 'center' && obj.originY === 'center'
            ? 'center center'
            : obj.originX === 'center'
              ? 'center top'
              : obj.originY === 'center'
                ? 'left center'
                : 'left top',
          opacity: obj.opacity !== undefined ? obj.opacity : 1,
          zIndex: index + 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          borderRadius: '8px',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `rotate(${angle}deg) scale(1.05)`;
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `rotate(${angle}deg) scale(1)`;
          e.currentTarget.style.boxShadow = 'none';
        }}
        onClick={() => {
          const url = obj.url || obj.URL;
          if (url) {
            handleUrlClick(url, obj.urlType, obj.name);
          }
        }}
      >
        <img
          src={obj.src || ''}
          alt={obj.name || 'Social Icon'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // Regular image handling
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

  // If image has a URL, make it interactive
  if (obj.url || obj.URL) {
    return (
      <button
        key={`canvas-image-${obj.id || index}`}
        type="button"
        onClick={() => {
          const url = obj.url || obj.URL;
          if (url) {
            const formattedUrl = formatUrl(url, obj.urlType);
            if (obj.urlType === 'phone' || formattedUrl.startsWith('tel:')) {
              handlePhoneClick(formattedUrl, 'copy');
            } else {
              window.open(formattedUrl, '_blank');
            }
          }
        }}
        style={{
          position: 'absolute',
          left: `${imageLeft}px`,
          top: `${imageTop}px`,
          width: `${width}px`,
          height: `${height}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'left top',
          opacity: obj.opacity !== undefined ? obj.opacity : 1,
          zIndex: index + 1,
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        <img
          src={obj.src || ''}
          alt="Design element"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            display: 'block',
            maxWidth: 'none',
            maxHeight: 'none',
          }}
        />
      </button>
    );
  }

  return (
    <img
      key={`canvas-image-${obj.id || index}`}
      src={obj.src || ''}
      alt="Design element"
      style={{
        position: 'absolute',
        left: `${imageLeft}px`,
        top: `${imageTop}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left top',
        opacity: obj.opacity !== undefined ? obj.opacity : 1,
        zIndex: index + 1,
        objectFit: 'fill',
        boxSizing: 'border-box',
        maxWidth: 'none',
        maxHeight: 'none',
      }}
    />
  );
}
