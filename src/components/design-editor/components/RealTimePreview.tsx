'use client';

import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

// Define a type for Fabric-like gradient objects that might be passed
type FabricGradient = {
  type?: string; // e.g., 'linear'
  colorStops?: Array<{ offset: number; color: string }>;
  coords?: { x1?: number; y1?: number; x2?: number; y2?: number };
  // Add other potential gradient properties if needed
};

type RealTimePreviewProps = {
  canvasState: any;
  width: number;
  height: number;
  backgroundColor: string | FabricGradient;
  className?: string;
};

export function RealTimePreview({
  canvasState,
  width,
  height,
  backgroundColor,
  className = '',
}: RealTimePreviewProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Force re-render when canvas state changes by using a key
  const canvasStateKey = useMemo(() => {
    return JSON.stringify(canvasState);
  }, [canvasState]);

  // Memoize scale calculation to prevent unnecessary recalculations
  const getPreviewScale = useMemo(() => {
    if (isFullscreen) {
      return 1;
    }
    // Define the desired maximum dimensions for the small preview *container*
    const smallPreviewContainerMaxWidth = 300; // Adjust as needed for default small preview width
    const smallPreviewContainerMaxHeight = 225; // Adjust as needed for default small preview height

    // Calculate the scale factor needed to fit the original canvas content
    // (dimensions: `width` x `height`) into the small preview container.
    const scaleFactor = Math.min(smallPreviewContainerMaxWidth / (width || 1), smallPreviewContainerMaxHeight / (height || 1), 1);
    return scaleFactor > 0 ? scaleFactor : 1; // Ensure scale is positive, default to 1 if width/height is 0
  }, [isFullscreen, width, height]);

  // Memoize display dimensions
  const displayDimensions = useMemo(() => {
    const scale = getPreviewScale;
    return {
      width: width * scale,
      height: height * scale,
    };
  }, [width, height, getPreviewScale]);

  const effectiveBackgroundStyle = useMemo(() => {
    if (typeof backgroundColor === 'string') {
      return { backgroundColor };
    } else if (backgroundColor && typeof backgroundColor === 'object' && Array.isArray((backgroundColor as FabricGradient)?.colorStops)) {
      const gradient = backgroundColor as FabricGradient;
      // Defaulting to a diagonal gradient (135deg or to bottom right)
      const direction = '135deg'; // Or 'to bottom right'
      const stops = (gradient.colorStops || [])
        .map(stop => `${stop?.color || '#FFFFFF'} ${stop?.offset !== undefined ? stop.offset * 100 : 0}%`)
        .join(', ');
      return { background: `linear-gradient(${direction}, ${stops})` };
    }
    return { backgroundColor: '#ffffff' }; // Fallback to white if format is unexpected
  }, [backgroundColor]);

  // Memoize the heavy renderElements function to prevent recreation on every render
  const renderedElements = useMemo(() => {
    if (!canvasState?.objects || !Array.isArray(canvasState.objects) || canvasState.objects.length === 0) {
      return [];
    }

    return canvasState.objects.map((obj: any, index: number) => {
      if (!obj) {
        return null;
      } // Null check for obj itself

      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objWidth = (obj.width || 0);
      const objHeight = (obj.height || 0);
      const objScaleX = obj.scaleX || 1;
      const objScaleY = obj.scaleY || 1;
      const angle = obj.angle || 0;
      const opacity = obj.opacity !== undefined ? obj.opacity : 1;

      // Calculate actual dimensions after scaling, these are the dimensions on the *original* canvas
      const actualWidth = objWidth * objScaleX;
      const actualHeight = objHeight * objScaleY;

      // Base styles for all elements - positions and dimensions are now relative to the original canvas,
      // the `scale` will be applied by the parent container's transform.
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${objLeft}px`,
        top: `${objTop}px`,
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center center', // Fabric.js typically uses center origin for rotation
        opacity,
        zIndex: index + 1,
        pointerEvents: 'none', // Important for preview
        visibility: obj.visible !== false ? ('visible' as const) : ('hidden' as const),
        boxSizing: 'border-box', // Ensure padding and borders are included in width/height
      };

      // Handle Button elements
      if (obj.elementType === 'button' && obj.buttonData) {
        const buttonData = obj.buttonData;
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              // Override width/height if buttonData has padding, as baseStyle uses scaled dimensions
              // HTML button/div with text will auto-size based on content and padding.
              // Forcing width/height here might conflict with padding.
              // Let's rely on the width/height from baseStyle for now.
              backgroundColor: buttonData.backgroundColor || '#3b82f6',
              color: buttonData.textColor || '#ffffff',
              border: `${buttonData.borderWidth || 1}px solid ${buttonData.borderColor || 'transparent'}`,
              borderRadius: `${buttonData.borderRadius || 8}px`,
              fontSize: `${buttonData.fontSize || 14}px`,
              fontWeight: buttonData.fontWeight || 'normal',
              fontFamily: buttonData.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              padding: `${buttonData.padding?.top || 8}px ${buttonData.padding?.right || 16}px ${buttonData.padding?.bottom || 8}px ${buttonData.padding?.left || 16}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              cursor: 'default', // No interaction in preview
            }}
          >
            {buttonData.text || 'Button'}
          </div>
        );
      }

      // Handle Link elements
      if (obj.elementType === 'link' && obj.linkData) {
        const linkData = obj.linkData;
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              color: linkData.color || '#3b82f6',
              fontSize: `${linkData.fontSize || 16}px`,
              fontWeight: linkData.fontWeight || 'normal',
              fontFamily: linkData.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              textDecoration: linkData.textDecoration || 'underline',
              display: 'flex', // Use flex to better align text
              alignItems: 'center', // Vertically center
              justifyContent: 'flex-start', // Align text to start
              boxSizing: 'border-box',
              cursor: 'default',
            }}
          >
            {linkData.text || 'Link'}
          </div>
        );
      }

      // Handle Rectangle shapes
      if (obj.type === 'rect') {
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              backgroundColor: obj.fill || '#cccccc',
              border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
              borderRadius: `${obj.rx || 0}px`, // rx and ry for rounded corners
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Circle shapes
      if (obj.type === 'circle') {
        // For circles, FabricJS left/top is center of bounding box. HTML needs top-left.
        // However, baseStyle already uses obj.left and obj.top.
        // The width/height in baseStyle are diameter.
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              backgroundColor: obj.fill || '#cccccc',
              border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
              borderRadius: '50%',
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Triangle shapes
      if (obj.type === 'triangle') {
        // Triangles with borders are tricky with CSS. This creates a filled triangle.
        // For CSS triangles, width and height are used differently in border properties.
        // We'll use a simple div with background for fill, border handling might be imperfect.
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              width: 0, // CSS triangle trick
              height: 0, // CSS triangle trick
              borderLeft: `${actualWidth / 2}px solid transparent`,
              borderRight: `${actualWidth / 2}px solid transparent`,
              borderBottom: `${actualHeight}px solid ${obj.fill || '#cccccc'}`,
              // Reset background and border from baseStyle if they interfere
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
        );
      }

      // Handle Polygon shapes (including diamond)
      if (obj.type === 'polygon') {
        const isStandardDiamond = obj.shapeType === 'diamond'
          || (obj.points && obj.points.length === 4);

        if (isStandardDiamond) {
          // Render diamond using CSS transform
          return (
            <div
              key={index}
              style={{
                ...baseStyle,
                backgroundColor: obj.fill || '#cccccc',
                border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
                transform: `${baseStyle.transform} rotate(45deg)`,
                borderRadius: '4px', // Small radius for better appearance
                boxSizing: 'border-box',
              }}
            />
          );
        } else {
          // For other polygons, use SVG for accurate rendering
          const svgPath = `${obj.points?.map((point: any, i: number) =>
            `${i === 0 ? 'M' : 'L'} ${point?.x || 0} ${point?.y || 0}`,
          ).join(' ') || ''} Z`;

          return (
            <div
              key={index}
              style={{
                ...baseStyle,
                overflow: 'visible',
              }}
            >
              <svg
                width={actualWidth}
                height={actualHeight}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                }}
              >
                <path
                  d={svgPath}
                  fill={obj.fill || '#cccccc'}
                  stroke={obj.stroke || 'transparent'}
                  strokeWidth={obj.strokeWidth || 0}
                />
              </svg>
            </div>
          );
        }
      }

      // Handle Line shapes
      if (obj.type === 'line') {
        const x1 = obj.x1 || 0;
        const y1 = obj.y1 || 0;
        const x2 = obj.x2 || actualWidth;
        const y2 = obj.y2 || 0;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              overflow: 'visible',
            }}
          >
            <svg
              width={actualWidth}
              height={actualHeight}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
              }}
            >
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={obj.stroke || '#000000'}
                strokeWidth={obj.strokeWidth || 1}
                strokeLinecap={obj.strokeLineCap || 'round'}
              />
            </svg>
          </div>
        );
      }

      // Handle custom shape elements (from our shape system)
      if (obj.elementType === 'shape' && obj.shapeData) {
        const shapeData = obj.shapeData;

        switch (shapeData.type) {
          case 'rectangle':
            return (
              <div
                key={index}
                style={{
                  ...baseStyle,
                  backgroundColor: shapeData.fill || obj.fill || '#cccccc',
                  border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
                  borderRadius: `${obj.rx || 8}px`,
                  boxSizing: 'border-box',
                }}
              />
            );

          case 'circle':
            return (
              <div
                key={index}
                style={{
                  ...baseStyle,
                  backgroundColor: shapeData.fill || obj.fill || '#cccccc',
                  border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
                  borderRadius: '50%',
                  boxSizing: 'border-box',
                }}
              />
            );

          case 'triangle':
            return (
              <div
                key={index}
                style={{
                  ...baseStyle,
                  width: 0,
                  height: 0,
                  borderLeft: `${actualWidth / 2}px solid transparent`,
                  borderRight: `${actualWidth / 2}px solid transparent`,
                  borderBottom: `${actualHeight}px solid ${shapeData.fill || obj.fill || '#cccccc'}`,
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              />
            );

          case 'diamond':
            return (
              <div
                key={index}
                style={{
                  ...baseStyle,
                  backgroundColor: shapeData.fill || obj.fill || '#cccccc',
                  border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
                  transform: `${baseStyle.transform} rotate(45deg)`,
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            );

          case 'line':
            return (
              <div
                key={index}
                style={{
                  ...baseStyle,
                  backgroundColor: shapeData.stroke || obj.stroke || '#000000',
                  border: 'none',
                  height: `${shapeData.strokeWidth || obj.strokeWidth || 2}px`,
                  borderRadius: '1px',
                }}
              />
            );

          default:
            break;
        }
      }

      // Handle Text elements (i-text, text, textbox)
      if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
        const fontSize = obj.fontSize || 16;
        // Fabric's (left, top) can be affected by originX, originY.
        // PreviewButton's logic for text was more accurate.
        let adjustedTop = objTop;
        let adjustedLeft = objLeft; // Start with object's left

        // Handle originX for left positioning (PreviewButton doesn't explicitly do this for `left`)
        // Fabric's default originX for IText is 'left'.
        // If originX is 'center', left is the center. For HTML, we need the actual left edge.
        if (obj.originX === 'center') {
          adjustedLeft = objLeft - actualWidth / 2;
        } else if (obj.originX === 'right') {
          adjustedLeft = objLeft - actualWidth;
        }
        // If originX is 'left', objLeft is already the left edge.

        // Handle originY and textBaseline for top positioning
        // This logic is similar to PreviewButton
        if (obj.originY === 'center') {
          adjustedTop = objTop - actualHeight / 2;
        } else if (obj.originY === 'bottom') {
          adjustedTop = objTop - actualHeight;
        }
        // If originY is 'top', objTop is already the top edge.

        // Further baseline adjustment for text (inspired by PreviewButton)
        // Note: Fabric's `top` for text also depends on `textBaseline`
        // This might need fine-tuning depending on how Fabric calculates `obj.top` with `textBaseline`
        const textBaseline = obj.textBaseline || 'alphabetic';
        if (textBaseline === 'alphabetic' || textBaseline === 'baseline') {
          // Approximation: Fabric's top is baseline; HTML div top is top.
          // No major adjustment needed if originY is 'top'.
          // If originY is center/bottom, it's already handled.
        } else if (textBaseline === 'middle') {
          // adjustedTop += fontSize * 0.1; // Example fine-tune
        }

        const textStyle: React.CSSProperties = {
          ...baseStyle,
          left: `${adjustedLeft}px`,
          top: `${adjustedTop}px`,
          // For text, width/height from baseStyle might need to be 'auto'
          // if the text content dictates the size. FabricJS text objects can have fixed width/height (Textbox)
          // or be sized by content (IText).
          width: obj.type === 'textbox' ? `${actualWidth}px` : 'auto',
          height: obj.type === 'textbox' ? `${actualHeight}px` : 'auto',
          color: obj.fill || '#000000',
          fontFamily: obj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', // Match RealTimePreview default
          fontSize: `${fontSize}px`, // Use original font size, parent scales
          fontWeight: obj.fontWeight || 'normal',
          fontStyle: obj.fontStyle || 'normal',
          textAlign: obj.textAlign || 'left',
          textDecoration: obj.underline ? 'underline' : obj.linethrough ? 'line-through' : 'none',
          lineHeight: obj.lineHeight || 1.2,
          whiteSpace: 'pre-wrap', // Important for respecting newlines in text
          boxSizing: 'border-box',
          display: 'flex', // Helps with vertical alignment if needed
          alignItems: 'flex-start', // Default for text
          // justifyContent: handled by textAlign
        };
        if (textStyle.textAlign === 'center') {
          textStyle.justifyContent = 'center';
        } else if (textStyle.textAlign === 'right') {
          textStyle.justifyContent = 'flex-end';
        } else {
          textStyle.justifyContent = 'flex-start';
        }

        return (
          <div key={index} style={textStyle}>
            {obj.text || ''}
          </div>
        );
      }

      // Handle Image elements
      if (obj.type === 'image') {
        return (
          <img
            key={index}
            src={obj.src || ''}
            alt="Design element"
            style={{
              ...baseStyle,
              objectFit: obj.objectFit || 'contain', // Default to 'contain' to prevent cropping
              objectPosition: 'center',
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Group elements (basic rendering)
      if (obj.type === 'group' && obj.objects) {
        // For groups, the group itself has left, top, width, height, scaleX, scaleY, angle.
        // The objects within the group have their own relative positions.
        // RealTimePreview has a more detailed group rendering. Let's adopt a similar structure.
        // The baseStyle applies to the group container.
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              // Group's own background/border usually transparent unless specified
              // backgroundColor: obj.fill, // if groups can have fill
              // border: obj.stroke ? `${obj.strokeWidth}px solid ${obj.stroke}` : 'none',
            }}
          >
            {(Array.isArray(obj.objects) ? obj.objects : []).map((groupObj: any, groupIndex: number) => {
              if (!groupObj) {
                return null;
              }

              const groupObjLeft = groupObj.left || 0;
              const groupObjTop = groupObj.top || 0;
              const groupObjWidth = (groupObj.width || 0) * (groupObj.scaleX || 1);
              const groupObjHeight = (groupObj.height || 0) * (groupObj.scaleY || 1);
              const groupObjAngle = groupObj.angle || 0; // Angle relative to group

              const groupObjStyle: React.CSSProperties = {
                position: 'absolute',
                left: `${groupObjLeft}px`, // Positions are relative to the group's top-left
                top: `${groupObjTop}px`,
                width: `${groupObjWidth}px`,
                height: `${groupObjHeight}px`,
                transform: `rotate(${groupObjAngle}deg)`,
                transformOrigin: 'center center',
                opacity: groupObj.opacity !== undefined ? groupObj.opacity : 1,
                zIndex: groupIndex + 1, // Stacking within the group
              };

              if (groupObj.type === 'rect') {
                return (
                  <div
                    key={`${index}-${groupIndex}`}
                    style={{
                      ...groupObjStyle,
                      backgroundColor: groupObj.fill || '#cccccc',
                      borderRadius: `${groupObj.rx || 0}px`,
                      border: `${groupObj.strokeWidth || 0}px solid ${groupObj.stroke || 'transparent'}`,
                      boxSizing: 'border-box',
                    }}
                  />
                );
              } else if (groupObj.type === 'text' || groupObj.type === 'i-text' || groupObj.type === 'textbox') {
                const groupTextFontSize = groupObj.fontSize || 16;
                return (
                  <div
                    key={`${index}-${groupIndex}`}
                    style={{
                      ...groupObjStyle,
                      color: groupObj.fill || '#000000',
                      fontFamily: groupObj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: `${groupTextFontSize}px`,
                      fontWeight: groupObj.fontWeight || 'normal',
                      textAlign: groupObj.textAlign || 'left',
                      whiteSpace: 'pre-wrap',
                      lineHeight: groupObj.lineHeight || 1.2,
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    {groupObj.text || ''}
                  </div>
                );
              } else if (groupObj.type === 'image') {
                return (
                  <img
                    key={`${index}-${groupIndex}`}
                    src={groupObj.src || ''}
                    alt="Grouped element"
                    style={{
                      ...groupObjStyle,
                      objectFit: groupObj.objectFit || 'contain',
                      objectPosition: 'center',
                      boxSizing: 'border-box',
                    }}
                  />
                );
              }
              // Add other group object types as needed
              return null;
            })}
          </div>
        );
      }

      // Default fallback (simple div with background) - useful for unknown types or basic shapes
      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            backgroundColor: obj.fill || '#cccccc', // Default fill
            border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : '1px solid #999', // Default border
            boxSizing: 'border-box',
          }}
        />
      );
    });
  }, [canvasState?.objects]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen && previewRef.current) {
      if (previewRef.current.requestFullscreen) {
        previewRef.current.requestFullscreen();
      } else {
        // Fallback for browsers that might not support it or have a different name
        (previewRef.current as any).webkitRequestFullscreen?.();
        (previewRef.current as any).mozRequestFullScreen?.();
        (previewRef.current as any).msRequestFullscreen?.();
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
      (document as any).webkitExitFullscreen?.();
      (document as any).mozCancelFullScreen?.();
      (document as any).msExitFullscreen?.();
    }
    // Note: setIsFullscreen is handled by the fullscreenchange event listener
  }, [isFullscreen]);

  const handleShowPreview = useCallback(() => setIsVisible(true), []);
  const handleHidePreview = useCallback(() => setIsVisible(false), []);

  // Handle fullscreen events with proper cleanup
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={handleShowPreview}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:shadow-xl"
        >
          <Eye className="mr-2 size-4" />
          Show Preview
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={previewRef}
      className={`fixed ${isFullscreen ? 'inset-0 z-[9999] flex items-center justify-center bg-gray-900' : `bottom-4 right-4 z-50 ${className}`}`}
    >
      <div className={`${isFullscreen ? 'relative flex flex-col' : 'rounded-lg border border-gray-200 bg-white shadow-lg'}`}>
        {/* Preview Header */}
        <div className={`${isFullscreen ? 'absolute inset-x-4 top-4' : ''} flex items-center justify-between border-b border-gray-200 bg-white p-3 ${isFullscreen ? 'rounded-lg shadow-lg' : 'rounded-t-lg'}`}>
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
            <div className="size-2 animate-pulse rounded-full bg-green-400" />
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="size-8 p-0"
            >
              {isFullscreen
                ? (
                    <Minimize2 className="size-4" />
                  )
                : (
                    <Maximize2 className="size-4" />
                  )}
            </Button>
            <Button
              onClick={handleHidePreview}
              variant="ghost"
              size="sm"
              className="size-8 p-0"
            >
              <EyeOff className="size-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div
          className={`${isFullscreen ? 'flex flex-1 items-center justify-center p-8' : 'p-4'}`}
          style={!isFullscreen ? { width: `${displayDimensions.width + 40}px`, height: `${displayDimensions.height + 40}px`, overflow: 'hidden' } : {}}
        >
          <div
            className="relative border border-gray-300 shadow-sm"
            key={canvasStateKey}
            style={{
              width: `${width}px`, // Use original canvas width
              height: `${height}px`, // Use original canvas height
              ...effectiveBackgroundStyle,
              overflow: 'hidden',
              transform: `scale(${getPreviewScale})`,
              transformOrigin: 'top left',
              margin: 'auto', // Center the canvas in the container
            }}
          >
            {renderedElements.length > 0
              ? (
                  renderedElements
                )
              : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-sm">Canvas is empty</div>
                      <div className="text-xs">Add elements to see preview</div>
                    </div>
                  </div>
                )}
          </div>
        </div>

        {/* Preview Info */}
        <div className={`${isFullscreen ? 'absolute inset-x-4 bottom-4' : ''} bg-gray-50 p-2 text-xs text-gray-500 ${isFullscreen ? 'rounded-lg shadow-lg' : 'rounded-b-lg'}`}>
          <div className="flex items-center justify-between">
            <span>
              {width}
              {' '}
              ×
              {' '}
              {height}
              px
            </span>
            <span>
              Scale:
              {Math.round(getPreviewScale * 100)}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
