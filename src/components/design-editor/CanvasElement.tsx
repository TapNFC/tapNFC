'use client';

import type { DesignElement } from '@/stores/designStore';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

type CanvasElementProps = {
  element: DesignElement;
  isSelected: boolean;
  zoom: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<DesignElement>) => void;
};

export function CanvasElement({
  element,
  isSelected,
  zoom,
  onSelect,
  onUpdate,
}: CanvasElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();

    if (e.target === elementRef.current || elementRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setElementStart({
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      });
    }
  }, [onSelect, element]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  }, [onSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && !isResizing) {
      const deltaX = (e.clientX - dragStart.x) / zoom;
      const deltaY = (e.clientY - dragStart.y) / zoom;

      onUpdate({
        x: elementStart.x + deltaX,
        y: elementStart.y + deltaY,
      });
    }
  }, [isDragging, isResizing, dragStart, elementStart, zoom, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, _direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    });
  }, [element]);

  const renderElement = () => {
    const commonStyle = {
      position: 'absolute' as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      visibility: (element.visible ? 'visible' : 'hidden') as 'visible' | 'hidden',
    };

    switch (element.type) {
      case 'text': {
        return (
          <div
            style={{
              ...commonStyle,
              fontSize: element.text?.fontSize || 16,
              fontFamily: element.text?.fontFamily || 'Inter',
              fontWeight: element.text?.fontWeight || 'normal',
              color: element.text?.color || '#000000',
              textAlign: element.text?.textAlign || 'left',
              lineHeight: element.text?.lineHeight || 1.2,
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {element.text?.content || 'Text'}
          </div>
        );
      }

      case 'shape': {
        const shapeStyle = {
          ...commonStyle,
          backgroundColor: element.shape?.fill || '#3b82f6',
          border: `${element.shape?.strokeWidth || 2}px solid ${element.shape?.stroke || '#1e40af'}`,
          cursor: isDragging ? 'grabbing' : 'grab',
        };

        if (element.shape?.type === 'rectangle') {
          return (
            <div
              style={{
                ...shapeStyle,
                borderRadius: element.shape?.borderRadius || 0,
              }}
            />
          );
        } else if (element.shape?.type === 'circle') {
          return (
            <div
              style={{
                ...shapeStyle,
                borderRadius: '50%',
              }}
            />
          );
        } else if (element.shape?.type === 'line') {
          return (
            <div
              style={{
                ...shapeStyle,
                backgroundColor: element.shape?.stroke || '#1e40af',
                border: 'none',
                height: element.shape?.strokeWidth || 2,
              }}
            />
          );
        }
        break;
      }

      case 'image': {
        return (
          <div
            style={{
              ...commonStyle,
              cursor: isDragging ? 'grabbing' : 'grab',
              overflow: 'hidden',
            }}
          >
            <Image
              src={element.image?.src || '/api/placeholder/200/150'}
              alt={element.image?.alt || 'Image'}
              fill
              style={{
                objectFit: element.image?.objectFit || 'cover',
                pointerEvents: 'none',
              }}
            />
          </div>
        );
      }

      case 'button': {
        return (
          <button
            type="button"
            style={{
              ...commonStyle,
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: element.button?.backgroundColor || '#3b82f6',
              color: element.button?.textColor || '#ffffff',
              border: `${element.button?.borderWidth || 1}px solid ${element.button?.borderColor || '#1e40af'}`,
              borderRadius: element.button?.borderRadius || 8,
              fontSize: element.button?.fontSize || 14,
              fontWeight: element.button?.fontWeight || '500',
              padding: `${element.button?.padding?.top || 8}px ${element.button?.padding?.right || 16}px ${element.button?.padding?.bottom || 8}px ${element.button?.padding?.left || 16}px`,
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              if (element.button?.hoverBackgroundColor) {
                e.currentTarget.style.backgroundColor = element.button.hoverBackgroundColor;
              }
              if (element.button?.hoverTextColor) {
                e.currentTarget.style.color = element.button.hoverTextColor;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = element.button?.backgroundColor || '#3b82f6';
              e.currentTarget.style.color = element.button?.textColor || '#ffffff';
            }}
          >
            {element.button?.text || 'Button'}
          </button>
        );
      }

      case 'link': {
        return (
          <button
            type="button"
            style={{
              ...commonStyle,
              cursor: isDragging ? 'grabbing' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: element.link?.color || '#3b82f6',
              fontSize: element.link?.fontSize || 16,
              fontWeight: element.link?.fontWeight || 'normal',
              textDecoration: element.link?.textDecoration || 'underline',
              transition: 'all 0.2s ease-in-out',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              if (element.link?.hoverColor) {
                e.currentTarget.style.color = element.link.hoverColor;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = element.link?.color || '#3b82f6';
            }}
            onClick={(e) => {
              if (!isDragging && element.link?.url) {
                e.preventDefault();
                window.open(element.link.url, element.link.target || '_blank');
              }
            }}
          >
            {element.link?.text || 'Link'}
          </button>
        );
      }

      default:
        return null;
    }
    return null;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={handleKeyDown}
    >
      <div ref={elementRef}>
        {renderElement()}
      </div>

      {/* Selection Handles */}
      {isSelected && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: element.x - 4,
            top: element.y - 4,
            width: element.width + 8,
            height: element.height + 8,
            border: '2px solid #3b82f6',
            borderRadius: '4px',
          }}
        >
          {/* Corner Resize Handles */}
          <button
            type="button"
            className="pointer-events-auto absolute -left-1 -top-1 size-3 cursor-nw-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 'nw')}
            aria-label="Resize northwest"
          />
          <button
            type="button"
            className="pointer-events-auto absolute -right-1 -top-1 size-3 cursor-ne-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 'ne')}
            aria-label="Resize northeast"
          />
          <button
            type="button"
            className="pointer-events-auto absolute -bottom-1 -left-1 size-3 cursor-sw-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 'sw')}
            aria-label="Resize southwest"
          />
          <button
            type="button"
            className="pointer-events-auto absolute -bottom-1 -right-1 size-3 cursor-se-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 'se')}
            aria-label="Resize southeast"
          />

          {/* Edge Resize Handles */}
          <button
            type="button"
            className="pointer-events-auto absolute -top-1 left-1/2 size-3 -translate-x-1/2 cursor-n-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 'n')}
            aria-label="Resize north"
          />
          <button
            type="button"
            className="pointer-events-auto absolute -bottom-1 left-1/2 size-3 -translate-x-1/2 cursor-s-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 's')}
            aria-label="Resize south"
          />
          <button
            type="button"
            className="pointer-events-auto absolute -left-1 top-1/2 size-3 -translate-y-1/2 cursor-w-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 'w')}
            aria-label="Resize west"
          />
          <button
            type="button"
            className="pointer-events-auto absolute -right-1 top-1/2 size-3 -translate-y-1/2 cursor-e-resize rounded-sm border-2 border-blue-500 bg-white"
            onMouseDown={e => handleResizeMouseDown(e, 'e')}
            aria-label="Resize east"
          />
        </div>
      )}
    </div>
  );
}
