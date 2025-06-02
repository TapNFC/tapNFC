'use client';

import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type RealTimePreviewProps = {
  canvasState: any;
  width: number;
  height: number;
  backgroundColor: string;
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

  // Calculate scale to fit preview in container
  const getPreviewScale = () => {
    if (isFullscreen) {
      return 1;
    }
    const maxPreviewWidth = 300;
    const maxPreviewHeight = 400;
    return Math.min(maxPreviewWidth / width, maxPreviewHeight / height, 1);
  };

  const scale = getPreviewScale();
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Render canvas objects as HTML elements
  const renderElements = () => {
    if (!canvasState?.objects) {
      return [];
    }

    return canvasState.objects.map((obj: any, index: number) => {
      // Handle Fabric.js coordinate system and transforms properly
      const left = obj.left || 0;
      const top = obj.top || 0;
      const width = obj.width || 0;
      const height = obj.height || 0;
      const scaleX = obj.scaleX || 1;
      const scaleY = obj.scaleY || 1;
      const angle = obj.angle || 0;
      const opacity = obj.opacity !== undefined ? obj.opacity : 1;

      // Calculate actual dimensions after scaling
      const actualWidth = width * scaleX;
      const actualHeight = height * scaleY;

      // Base styles for all elements
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        transformOrigin: 'center center',
        opacity,
        zIndex: index + 1,
        pointerEvents: 'none',
      };

      // Handle Button elements
      if (obj.elementType === 'button' && obj.buttonData) {
        const buttonData = obj.buttonData;
        // Convert from center-based to top-left positioning FIRST, then apply scale
        const htmlLeft = (left - (actualWidth / 2)) * scale;
        const htmlTop = (top - (actualHeight / 2)) * scale;
        const scaledWidth = actualWidth * scale;
        const scaledHeight = actualHeight * scale;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: htmlLeft,
              top: htmlTop,
              width: scaledWidth,
              height: scaledHeight,
              transform: `rotate(${angle}deg)`,
              backgroundColor: buttonData.backgroundColor || '#3b82f6',
              color: buttonData.textColor || '#ffffff',
              border: `${(buttonData.borderWidth || 1) * scale}px solid ${buttonData.borderColor || 'transparent'}`,
              borderRadius: (buttonData.borderRadius || 8) * scale,
              fontSize: (buttonData.fontSize || 14) * scale,
              fontWeight: buttonData.fontWeight || 'normal',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            {buttonData.text || 'Button'}
          </div>
        );
      }

      // Handle Link elements
      if (obj.elementType === 'link' && obj.linkData) {
        const linkData = obj.linkData;
        const htmlLeft = (left - (actualWidth / 2)) * scale;
        const htmlTop = (top - (actualHeight / 2)) * scale;
        const scaledWidth = actualWidth * scale;
        const scaledHeight = actualHeight * scale;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: htmlLeft,
              top: htmlTop,
              width: scaledWidth,
              height: scaledHeight,
              transform: `rotate(${angle}deg)`,
              color: linkData.color || '#3b82f6',
              fontSize: (linkData.fontSize || 16) * scale,
              fontWeight: linkData.fontWeight || 'normal',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              textDecoration: linkData.textDecoration || 'underline',
              display: 'inline-block',
            }}
          >
            {linkData.text || 'Link'}
          </div>
        );
      }

      // Handle Rectangle shapes
      if (obj.type === 'rect') {
        // Convert from Fabric.js center-based positioning to HTML top-left positioning
        const htmlLeft = (left - (actualWidth / 2)) * scale;
        const htmlTop = (top - (actualHeight / 2)) * scale;
        const scaledWidth = actualWidth * scale;
        const scaledHeight = actualHeight * scale;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: htmlLeft,
              top: htmlTop,
              width: scaledWidth,
              height: scaledHeight,
              transform: `rotate(${angle}deg)`,
              backgroundColor: obj.fill || '#cccccc',
              border: `${(obj.strokeWidth || 0) * scale}px solid ${obj.stroke || 'transparent'}`,
              borderRadius: (obj.rx || 0) * scale,
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Circle shapes
      if (obj.type === 'circle') {
        const radius = obj.radius || 25;
        const effectiveRadius = radius * Math.max(scaleX, scaleY);
        // For circles, Fabric.js center is the circle center, HTML needs top-left of bounding box
        const htmlLeft = (left - effectiveRadius) * scale;
        const htmlTop = (top - effectiveRadius) * scale;
        const diameter = effectiveRadius * 2 * scale;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: htmlLeft,
              top: htmlTop,
              width: diameter,
              height: diameter,
              transform: `rotate(${angle}deg)`,
              backgroundColor: obj.fill || '#cccccc',
              border: `${(obj.strokeWidth || 0) * scale}px solid ${obj.stroke || 'transparent'}`,
              borderRadius: '50%',
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Triangle shapes
      if (obj.type === 'triangle') {
        const htmlLeft = (left - (actualWidth / 2)) * scale;
        const htmlTop = (top - (actualHeight / 2)) * scale;
        const scaledWidth = actualWidth * scale;
        const scaledHeight = actualHeight * scale;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: htmlLeft,
              top: htmlTop,
              width: 0,
              height: 0,
              transform: `rotate(${angle}deg)`,
              borderLeft: `${scaledWidth / 2}px solid transparent`,
              borderRight: `${scaledWidth / 2}px solid transparent`,
              borderBottom: `${scaledHeight}px solid ${obj.fill || '#cccccc'}`,
            }}
          />
        );
      }

      // Handle Text elements
      if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
        const fontSize = obj.fontSize || 16;

        // Start with Fabric.js coordinates
        let htmlLeft = left;
        let htmlTop = top;

        // Handle text origin adjustments in Fabric.js coordinate space first
        if (obj.originX === 'center') {
          htmlLeft = left - (actualWidth / 2);
        } else if (obj.originX === 'right') {
          htmlLeft = left - actualWidth;
        } else {
          // For 'left' origin, Fabric.js left IS the left edge
          htmlLeft = left;
        }

        if (obj.originY === 'center') {
          htmlTop = top - (actualHeight / 2);
        } else if (obj.originY === 'bottom') {
          htmlTop = top - actualHeight;
        } else {
          // For 'top' origin, Fabric.js top IS the top edge
          htmlTop = top;
        }

        // Additional text baseline adjustments
        if (obj.textBaseline === 'alphabetic' || obj.textBaseline === 'baseline') {
          htmlTop = htmlTop - fontSize * scaleX * 0.2;
        } else if (obj.textBaseline === 'middle') {
          htmlTop = htmlTop - fontSize * scaleX * 0.1;
        }

        // Now apply scale to final coordinates
        const scaledLeft = htmlLeft * scale;
        const scaledTop = htmlTop * scale;
        const scaledWidth = actualWidth * scale;
        const scaledHeight = actualHeight * scale;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: scaledLeft,
              top: scaledTop,
              width: scaledWidth || 'auto',
              height: scaledHeight || 'auto',
              transform: `rotate(${angle}deg)`,
              color: obj.fill || '#000000',
              fontFamily: obj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: fontSize * scaleX * scale,
              fontWeight: obj.fontWeight || 'normal',
              fontStyle: obj.fontStyle || 'normal',
              textAlign: obj.textAlign || 'left',
              textDecoration: obj.underline ? 'underline' : obj.linethrough ? 'line-through' : 'none',
              lineHeight: obj.lineHeight || 1.2,
              boxSizing: 'border-box',
              wordWrap: obj.type === 'textbox' ? 'break-word' : 'normal',
              overflowWrap: obj.type === 'textbox' ? 'break-word' : 'normal',
            }}
          >
            {obj.text || ''}
          </div>
        );
      }

      // Handle Image elements
      if (obj.type === 'image') {
        const htmlLeft = (left - (actualWidth / 2)) * scale;
        const htmlTop = (top - (actualHeight / 2)) * scale;
        const scaledWidth = actualWidth * scale;
        const scaledHeight = actualHeight * scale;

        return (
          <img
            key={index}
            src={obj.src || ''}
            alt="Design element"
            style={{
              ...baseStyle,
              left: htmlLeft,
              top: htmlTop,
              width: scaledWidth,
              height: scaledHeight,
              transform: `rotate(${angle}deg)`,
              objectFit: 'cover',
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Group elements
      if (obj.type === 'group') {
        const htmlLeft = (left - (actualWidth / 2)) * scale;
        const htmlTop = (top - (actualHeight / 2)) * scale;
        const scaledWidth = actualWidth * scale;
        const scaledHeight = actualHeight * scale;

        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: htmlLeft,
              top: htmlTop,
              width: scaledWidth,
              height: scaledHeight,
              transform: `rotate(${angle}deg)`,
            }}
          >
            {obj.objects && obj.objects.map((groupObj: any, groupIndex: number) => {
              const groupWidth = (groupObj.width || 0) * (groupObj.scaleX || 1);
              const groupHeight = (groupObj.height || 0) * (groupObj.scaleY || 1);
              const groupHtmlLeft = ((groupObj.left || 0) - (groupWidth / 2)) * scale;
              const groupHtmlTop = ((groupObj.top || 0) - (groupHeight / 2)) * scale;
              const groupScaledWidth = groupWidth * scale;
              const groupScaledHeight = groupHeight * scale;

              if (groupObj.type === 'rect') {
                return (
                  <div
                    key={groupIndex}
                    style={{
                      position: 'absolute',
                      left: groupHtmlLeft,
                      top: groupHtmlTop,
                      width: groupScaledWidth,
                      height: groupScaledHeight,
                      backgroundColor: groupObj.fill || '#cccccc',
                      borderRadius: (groupObj.rx || 0) * scale,
                      border: `${(groupObj.strokeWidth || 0) * scale}px solid ${groupObj.stroke || 'transparent'}`,
                      boxSizing: 'border-box',
                    }}
                  />
                );
              } else if (groupObj.type === 'text' || groupObj.type === 'i-text') {
                return (
                  <div
                    key={groupIndex}
                    style={{
                      position: 'absolute',
                      left: groupHtmlLeft,
                      top: groupHtmlTop,
                      color: groupObj.fill || '#000000',
                      fontFamily: groupObj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: (groupObj.fontSize || 16) * scale,
                      fontWeight: groupObj.fontWeight || 'normal',
                      textAlign: groupObj.textAlign || 'left',
                      boxSizing: 'border-box',
                    }}
                  >
                    {groupObj.text || ''}
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }

      // Default fallback
      return (
        <div
          key={index}
          style={{
            ...baseStyle,
            left: (left - (actualWidth / 2)) * scale,
            top: (top - (actualHeight / 2)) * scale,
            width: actualWidth * scale,
            height: actualHeight * scale,
            transform: `rotate(${angle}deg)`,
            backgroundColor: obj.fill || '#cccccc',
            border: `${scale}px solid ${obj.stroke || '#999'}`,
          }}
        />
      );
    });
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen && previewRef.current) {
      if (previewRef.current.requestFullscreen) {
        previewRef.current.requestFullscreen();
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle fullscreen events
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
          onClick={() => setIsVisible(true)}
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
      className={`fixed ${isFullscreen ? 'inset-0 z-[9999] bg-gray-900' : 'bottom-4 right-4 z-50'} ${className}`}
    >
      <div className={`${isFullscreen ? 'flex h-full items-center justify-center' : 'rounded-lg border border-gray-200 bg-white shadow-lg'}`}>
        {/* Preview Header */}
        <div className={`${isFullscreen ? 'absolute inset-x-4 top-4' : ''} flex items-center justify-between border-b border-gray-200 bg-white p-3 ${isFullscreen ? 'rounded-lg shadow-lg' : ''}`}>
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
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="size-8 p-0"
            >
              <EyeOff className="size-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className={`${isFullscreen ? 'flex flex-1 items-center justify-center' : 'p-4'}`}>
          <div
            className="relative border border-gray-300 shadow-sm"
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              backgroundColor,
              overflow: 'hidden',
            }}
          >
            {renderElements()}
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
              {Math.round(scale * 100)}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
