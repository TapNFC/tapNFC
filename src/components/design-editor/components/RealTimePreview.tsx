'use client';

import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  // Calculate preview scale based on available space
  const getPreviewScale = useMemo(() => {
    const maxWidth = 300;
    const maxHeight = 400;
    const scaleX = maxWidth / width;
    const scaleY = maxHeight / height;
    return Math.min(scaleX, scaleY, 1); // Don't scale up, only down
  }, [width, height]);

  // Calculate display dimensions
  const displayDimensions = useMemo(() => ({
    width: width * getPreviewScale,
    height: height * getPreviewScale,
  }), [width, height, getPreviewScale]);

  // Generate a key for the canvas state to force re-render when needed
  const canvasStateKey = useMemo(() => {
    return JSON.stringify(canvasState?.objects?.length || 0);
  }, [canvasState?.objects?.length]);

  // Handle background color/gradient
  const effectiveBackgroundStyle = useMemo(() => {
    if (typeof backgroundColor === 'string') {
      return { backgroundColor };
    }

    if (backgroundColor && typeof backgroundColor === 'object' && backgroundColor.type === 'linear') {
      const gradient = backgroundColor as FabricGradient;
      if (gradient.colorStops && gradient.colorStops.length > 0) {
        const stops = gradient.colorStops
          .map(stop => `${stop.color} ${stop.offset * 100}%`)
          .join(', ');
        return {
          background: `linear-gradient(to right, ${stops})`,
        };
      }
    }

    return { backgroundColor: '#ffffff' }; // Fallback to white if format is unexpected
  }, [backgroundColor]);

  // Memoize the heavy renderElements function to prevent recreation on every render
  const renderCanvasObjects = useMemo(() => {
    // Remove console.log statements
    if (!canvasState?.objects || !Array.isArray(canvasState.objects)) {
      return [];
    }

    return canvasState.objects.map((obj: any, index: number) => {
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
        zIndex: index + 1, // Stacking order based on array index (fabric's default order)
      };

      // Handle Text elements
      if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
        const fontSize = obj.fontSize || 16;
        const textStyle: React.CSSProperties = {
          ...baseStyle,
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
          // Add these properties to fix text rendering
          width: obj.type === 'textbox' ? `${width}px` : 'auto',
          minHeight: `${fontSize * (obj.lineHeight || 1.2)}px`,
          justifyContent: obj.textAlign === 'center' ? 'center' : obj.textAlign === 'right' ? 'flex-end' : 'flex-start',
          padding: '0',
          margin: '0',
          transformOrigin: 'left top',
        };

        return (
          <div key={`canvas-text-${obj.id || index}`} style={textStyle}>
            {obj.text || ''}
          </div>
        );
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

      // Handle Image elements
      if (obj.type === 'image') {
        // Handle social icons with special styling
        if (obj.elementType === 'socialIcon') {
          return (
            <div
              key={`canvas-social-icon-${obj.id || index}`}
              style={{
                ...baseStyle,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotate(${angle}deg) scale(1.1)`;
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${angle}deg) scale(1)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Image
                src={obj.src || ''}
                alt={obj.name || 'Social Icon'}
                width={width}
                height={height}
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
        return (
          <Image
            key={`canvas-image-${obj.id || index}`}
            src={obj.src || ''}
            alt="Design element"
            width={width}
            height={height}
            style={{
              ...baseStyle,
              // objectFit: 'cover', // or 'contain', depending on desired behavior. Fabric default is like 'fill'
              objectFit: (obj.cropX === undefined && obj.cropY === undefined) ? 'fill' : 'cover', // A common default
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
            key={`canvas-group-${obj.id || index}`}
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
                    key={`group-${obj.id || index}-rect-${groupObj.id || groupIndex}`}
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
                    key={`group-${obj.id || index}-text-${groupObj.id || groupIndex}`}
                    style={{
                      ...groupObjStyle,
                      color: groupObj.fill || '#000000',
                      fontFamily: groupObj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: `${groupTextFontSize}px`,
                      fontWeight: groupObj.fontWeight || 'normal',
                      textAlign: groupObj.textAlign || 'left',
                      whiteSpace: 'pre-wrap',
                      lineHeight: groupObj.lineHeight || 1.2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: groupObj.textAlign === 'center' ? 'center' : groupObj.textAlign === 'right' ? 'flex-end' : 'flex-start',
                      fontStyle: groupObj.fontStyle === 'italic' ? 'italic' : 'normal',
                      textDecoration: `${groupObj.underline ? 'underline' : ''} ${groupObj.linethrough ? 'line-through' : ''}`.trim(),
                      boxSizing: 'border-box',
                    }}
                  >
                    {groupObj.text || ''}
                  </div>
                );
              } else if (groupObj.type === 'image') {
                return (
                  <Image
                    key={`group-${obj.id || index}-image-${groupObj.id || groupIndex}`}
                    src={groupObj.src || ''}
                    alt="Grouped element"
                    width={groupObjWidth}
                    height={groupObjHeight}
                    style={{
                      ...groupObjStyle,
                      objectFit: 'fill',
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
          key={`canvas-element-${obj.id || index}`}
          style={{
            ...baseStyle,
            backgroundColor: obj.fill || '#cccccc', // Default fill
            border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : '1px solid #999', // Default border
            boxSizing: 'border-box',
          }}
        />
      );
    });
  }, [canvasState]);

  const handlePreviewClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasState?.objects || !Array.isArray(canvasState.objects)) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / getPreviewScale;
    const y = (e.clientY - rect.top) / getPreviewScale;

    // Check if we clicked on an interactive element
    for (const obj of canvasState.objects) {
      if (!obj || !obj.left || !obj.top || !obj.width || !obj.height) {
        continue;
      }

      const objLeft = obj.left;
      const objTop = obj.top;
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);

      // Simple hit testing (can be improved with rotation support)
      if (x >= objLeft && x <= objLeft + objWidth && y >= objTop && y <= objTop + objHeight) {
        // Handle social icons - check both url and URL properties to be safe
        if (obj.elementType === 'socialIcon') {
          const url = obj.url || obj.URL;
          if (!url) {
            toast.error('This social icon has no URL configured.');
            return;
          }

          // Create a temporary anchor element to use native browser navigation
          const tempLink = document.createElement('a');
          tempLink.href = url;
          tempLink.target = '_blank';
          tempLink.rel = 'noopener noreferrer';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          return;
        } else if (obj.type === 'image' && (obj.url || obj.URL)) {
          // Create a temporary anchor element to use native browser navigation
          const tempLink = document.createElement('a');
          tempLink.href = obj.url || obj.URL;
          tempLink.target = obj.linkData?.target || '_blank';
          tempLink.rel = 'noopener noreferrer';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          return;
        }

        // Handle links
        if (obj.elementType === 'link' && obj.linkData?.url) {
          // Create a temporary anchor element to use native browser navigation
          const tempLink = document.createElement('a');
          tempLink.href = obj.linkData.url;
          tempLink.target = obj.linkData.target || '_blank';
          tempLink.rel = 'noopener noreferrer';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          return;
        }

        // Handle buttons
        if (obj.elementType === 'button' && obj.buttonData?.action?.type === 'url' && obj.buttonData?.action?.value) {
          // Create a temporary anchor element to use native browser navigation
          const tempLink = document.createElement('a');
          tempLink.href = obj.buttonData.action.value;
          tempLink.target = '_blank';
          tempLink.rel = 'noopener noreferrer';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          return;
        }
      }
    }
  }, [canvasState, getPreviewScale]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Simulate click for keyboard users
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      e.currentTarget.dispatchEvent(clickEvent);
    }
  }, []);

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
    }
  }, [isFullscreen]);

  // Handle hide preview
  const handleHidePreview = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (!isVisible) {
    return null;
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
          className={`${isFullscreen ? 'flex flex-1 items-center justify-center p-4' : 'p-4'}`}
          style={!isFullscreen ? { width: `${displayDimensions.width + 20}px`, height: `${displayDimensions.height + 10}px`, overflow: 'hidden' } : {}}
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
              cursor: 'pointer', // Add pointer cursor to indicate interactivity
            }}
            onClick={handlePreviewClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Interactive design preview"
          >
            {Array.isArray(renderCanvasObjects) && renderCanvasObjects.length > 0
              ? (
                  renderCanvasObjects
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
