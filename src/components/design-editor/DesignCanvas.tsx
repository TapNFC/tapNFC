'use client';

import type { CanvasSize, DesignElement } from '@/stores/designStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CanvasElement } from './CanvasElement';

type DesignCanvasProps = {
  elements: DesignElement[];
  canvasSize: CanvasSize;
  zoom: number;
  selectedTool: string;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<DesignElement>) => void;
  onElementAdd: (element: Omit<DesignElement, 'id' | 'zIndex'>) => void;
};

export function DesignCanvas({
  elements,
  canvasSize,
  zoom,
  selectedTool,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementAdd,
}: DesignCanvasProps) {
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLButtonElement>(null);

  // Use a ref to track the previous values to avoid unnecessary updates
  const prevCanvasSizeRef = useRef(canvasSize);
  const prevZoomRef = useRef(zoom);

  const updateCanvasOffset = useCallback(() => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const canvasWidth = canvasSize.width * zoom;
        const canvasHeight = canvasSize.height * zoom;

        const newOffset = {
          x: Math.max(0, (containerRect.width - canvasWidth) / 2),
          y: Math.max(0, (containerRect.height - canvasHeight) / 2),
        };

        setCanvasOffset(newOffset);
      }
    }
  }, [canvasSize, zoom]);

  useEffect(() => {
    // Only update if canvasSize or zoom actually changed
    if (
      prevCanvasSizeRef.current.width !== canvasSize.width
      || prevCanvasSizeRef.current.height !== canvasSize.height
      || prevZoomRef.current !== zoom
    ) {
      updateCanvasOffset();
      prevCanvasSizeRef.current = canvasSize;
      prevZoomRef.current = zoom;
    }
  }, [canvasSize, zoom, updateCanvasOffset]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Clicked on empty canvas
      onElementSelect(null);

      // If a tool is selected, add element at click position
      if (selectedTool !== 'select' && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        let newElement: Omit<DesignElement, 'id' | 'zIndex'>;

        switch (selectedTool) {
          case 'text':
            newElement = {
              type: 'text',
              x,
              y,
              width: 200,
              height: 50,
              rotation: 0,
              opacity: 1,
              locked: false,
              visible: true,
              text: {
                content: 'New Text',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: 'normal',
                color: '#000000',
                textAlign: 'left',
                lineHeight: 1.2,
              },
            };
            break;

          case 'rectangle':
            newElement = {
              type: 'shape',
              x,
              y,
              width: 100,
              height: 100,
              rotation: 0,
              opacity: 1,
              locked: false,
              visible: true,
              shape: {
                type: 'rectangle',
                fill: '#3b82f6',
                stroke: '#1e40af',
                strokeWidth: 2,
                borderRadius: 8,
              },
            };
            break;

          case 'circle':
            newElement = {
              type: 'shape',
              x,
              y,
              width: 100,
              height: 100,
              rotation: 0,
              opacity: 1,
              locked: false,
              visible: true,
              shape: {
                type: 'circle',
                fill: '#3b82f6',
                stroke: '#1e40af',
                strokeWidth: 2,
              },
            };
            break;

          default:
            return;
        }

        onElementAdd(newElement);
      }
    }
  }, [selectedTool, zoom, onElementSelect, onElementAdd]);

  const handleCanvasKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onElementSelect(null);
    }
  }, [onElementSelect]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.metaKey)) {
      // Middle mouse button or Cmd+click for panning
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      e.preventDefault();
    }
  }, [canvasOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <button
      className="flex-1 overflow-hidden bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleCanvasKeyDown}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      aria-label="Design canvas workspace"
      type="button"
    >
      {/* Canvas Container */}
      <div
        className="relative"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
          width: canvasSize.width * zoom,
          height: canvasSize.height * zoom,
        }}
      >
        {/* Canvas Background */}
        <button
          ref={canvasRef}
          className="relative bg-white shadow-lg"
          style={{
            width: canvasSize.width * zoom,
            height: canvasSize.height * zoom,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
          onClick={handleCanvasClick}
          onKeyDown={handleCanvasKeyDown}
          aria-label="Design workspace - click to add elements or press Escape to deselect"
          type="button"
        >
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Canvas Elements */}
          {sortedElements.map(element => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              zoom={zoom}
              onSelect={() => onElementSelect(element.id)}
              onUpdate={updates => onElementUpdate(element.id, updates)}
            />
          ))}

          {/* Canvas Border */}
          <div className="pointer-events-none absolute inset-0 border border-gray-300" />
        </button>

        {/* Canvas Info */}
        <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
          {canvasSize.width}
          {' '}
          ×
          {canvasSize.height}
          px
        </div>
      </div>

      {/* Zoom Info */}
      <div className="absolute bottom-4 left-4 rounded bg-black/80 px-2 py-1 text-xs text-white">
        {Math.round(zoom * 100)}
        %
      </div>
    </button>
  );
}
