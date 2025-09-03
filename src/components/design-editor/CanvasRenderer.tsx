import type { Design } from '@/types/design';
import { useMemo } from 'react';
import { handlePhoneClick } from '@/utils/phoneUtils';
import { handleUrlClick } from '@/utils/urlUtils';

type CanvasRendererProps = {
  designData: Design;
};

export function CanvasRenderer({ designData }: CanvasRendererProps) {
  const renderCanvasObjects = useMemo(() => {
    if (!designData?.canvas_data?.objects || !Array.isArray(designData.canvas_data.objects)) {
      return [];
    }

    return designData.canvas_data.objects.map((obj: any, index: number) => {
      if (!obj) {
        return null;
      }

      // Common properties that apply to most objects
      const left = obj.left || 0;
      const top = obj.top || 0;
      const width = (obj.width || 0) * (obj.scaleX || 1);
      const height = (obj.height || 0) * (obj.scaleY || 1);
      const angle = obj.angle || 0;

      const baseStyle: React.CSSProperties = {
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

      // Handle Text elements
      if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
        return renderTextElement(obj, index, baseStyle);
      }

      // Handle Rect elements
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

      // Handle Circle elements
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

      // Handle Triangle elements
      if (obj.type === 'triangle') {
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

      // Handle custom shape elements
      if (obj.elementType === 'shape' && obj.shapeData) {
        return renderShapeElement(obj, index, baseStyle);
      }

      // Handle Polygon elements
      if (obj.type === 'polygon') {
        return renderPolygonElement(obj, index, baseStyle);
      }

      // Handle Line elements
      if (obj.type === 'line') {
        return (
          <div
            key={`canvas-line-${obj.id || index}`}
            style={{
              ...baseStyle,
              backgroundColor: obj.stroke || '#000000',
              border: 'none',
              height: obj.strokeWidth || 1,
              borderRadius: 1,
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Image elements
      if (obj.type === 'image') {
        return renderImageElement(obj, index, designData);
      }

      // Handle SVG Icons
      if (obj.svgCode && obj.isSvgIcon) {
        return renderSvgIconElement(obj, index, designData);
      }

      return null;
    });
  }, [designData]);

  return <>{renderCanvasObjects}</>;
}

// Helper function to render text elements
function renderTextElement(obj: any, index: number, _baseStyle: React.CSSProperties) {
  const fontSize = obj.fontSize || 16;

  // Handle text positioning
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

  const textStyle: React.CSSProperties = {
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

  const textContent = obj.text || obj.content || '';

  // If text has a URL, make it interactive
  if (obj.url) {
    return (
      <button
        type="button"
        key={`canvas-text-${obj.id || index}`}
        style={{
          ...textStyle,
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
        }}
        onClick={() => {
          if (obj.url) {
            const formattedUrl = formatUrl(obj.url, obj.urlType);
            if (obj.urlType === 'phone' || formattedUrl.startsWith('tel:')) {
              handlePhoneClick(formattedUrl, 'copy');
            } else {
              window.open(formattedUrl, '_blank');
            }
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {textContent}
      </button>
    );
  }

  return (
    <div key={`canvas-text-${obj.id || index}`} style={textStyle}>
      {textContent}
    </div>
  );
}

// Helper function to render shape elements
function renderShapeElement(obj: any, index: number, baseStyle: React.CSSProperties) {
  const shapeData = obj.shapeData;
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);
  const angle = obj.angle || 0;

  if (shapeData.type === 'rectangle') {
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

  if (shapeData.type === 'circle') {
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

  if (shapeData.type === 'triangle') {
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

  if (shapeData.type === 'diamond') {
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

  if (shapeData.type === 'line') {
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

// Helper function to render polygon elements
function renderPolygonElement(obj: any, index: number, baseStyle: React.CSSProperties) {
  const isStandardDiamond = obj.shapeType === 'diamond' || (obj.points && obj.points.length === 4);

  if (isStandardDiamond) {
    return (
      <div
        key={`canvas-polygon-diamond-${obj.id || index}`}
        style={{
          ...baseStyle,
          backgroundColor: obj.fill || '#cccccc',
          border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
          transform: `rotate(${obj.angle || 0}deg) rotate(45deg)`,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
    );
  }

  return null;
}

// Helper function to render image elements
function renderImageElement(obj: any, index: number, designData: Design) {
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

// Helper function to render SVG icon elements
function renderSvgIconElement(obj: any, index: number, designData: Design) {
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

  // If SVG icon has a URL, make it interactive
  if (obj.url || obj.URL) {
    return (
      <button
        key={`canvas-svg-icon-${obj.id || index}`}
        type="button"
        onClick={() => handleUrlClick(obj.url || obj.URL, obj.urlType, obj.name)}
        style={{
          position: 'absolute',
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
          cursor: 'pointer',
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
      >
        <div
          dangerouslySetInnerHTML={{ __html: obj.svgCode }}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </button>
    );
  }

  // Non-interactive SVG icon
  return (
    <div
      key={`canvas-svg-icon-${obj.id || index}`}
      style={{
        position: 'absolute',
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
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: obj.svgCode }}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// Helper function to format URLs (duplicate from urlUtils to avoid circular dependency)
function formatUrl(url: string, urlType?: string) {
  if (!url) {
    return '';
  }

  if (urlType) {
    switch (urlType) {
      case 'email':
        return url.startsWith('mailto:') ? url : `mailto:${url}`;
      case 'phone':
        return url.startsWith('tel:') ? url : `tel:${url}`;
      case 'pdf':
        return url;
      case 'vcard':
        return url;
      case 'url':
      default:
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
    }
  }

  if (url.startsWith('mailto:')) {
    return url;
  } else if (url.startsWith('tel:')) {
    return url;
  } else if (url.includes('.pdf') || url.includes('file-storage/files/')) {
    return url;
  } else if (url.includes('.vcf') || url.includes('file-storage/vcards/')) {
    return url;
  } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }

  return url;
}
