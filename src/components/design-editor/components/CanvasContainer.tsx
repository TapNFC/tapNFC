import React, { useEffect, useRef, useState } from 'react';

type CanvasContainerProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isCanvasReady: boolean;
  fabricError: string | null;
  canvas: any;
  fabric: any;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  canvasInnerRef?: React.RefObject<HTMLDivElement | null>;
};

export function CanvasContainer({
  canvasRef,
  containerRef,
  isCanvasReady: _isCanvasReady,
  fabricError: _fabricError,
  canvas: _canvas,
  fabric: _fabric,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canvasInnerRef,
}: CanvasContainerProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const localCanvasInnerRef = useRef<HTMLDivElement>(null);

  // Use the passed ref if provided, otherwise use local ref
  const finalCanvasInnerRef = canvasInnerRef || localCanvasInnerRef;

  // Update zoom level display when zoom changes
  useEffect(() => {
    const updateZoomDisplay = () => {
      if (finalCanvasInnerRef.current) {
        const currentScale = Number.parseFloat(finalCanvasInnerRef.current.dataset.zoom || '1');
        const zoomPercentage = Math.round(currentScale * 100);
        setZoomLevel(zoomPercentage);
      }
    };

    // Update immediately
    updateZoomDisplay();

    // Set up a mutation observer to watch for zoom changes
    const observer = new MutationObserver(updateZoomDisplay);
    if (finalCanvasInnerRef.current) {
      observer.observe(finalCanvasInnerRef.current, { attributes: true, attributeFilter: ['style'] });
    }

    return () => observer.disconnect();
  }, [finalCanvasInnerRef]);

  return (
    <div
      ref={containerRef}
      className="relative flex size-full items-center justify-center overflow-hidden bg-gray-50 p-4"
    >
      {/* Zoom Controls - Bottom Left */}
      {onZoomIn && onZoomOut && onZoomReset && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm">
          <button
            type="button"
            onClick={onZoomReset}
            className="flex size-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            title="Reset Zoom (100%)"
          >
            <svg className="size-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onZoomOut}
            className="flex size-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            title="Zoom Out"
          >
            <svg className="size-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>

          {/* Zoom Level Display */}
          <div className="flex min-w-12 items-center justify-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
            <span>
              {zoomLevel}
              %
            </span>
          </div>

          <button
            type="button"
            onClick={onZoomIn}
            className="flex size-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            title="Zoom In"
          >
            <svg className="size-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>
      )}
      <div ref={finalCanvasInnerRef} className="relative flex max-h-full max-w-full items-center justify-center">

        {/* Keyboard Shortcuts Help */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded bg-black/80 p-3 text-xs text-white opacity-0 transition-opacity hover:pointer-events-auto hover:opacity-100">
          <div className="space-y-1">
            <div className="mb-2 font-semibold">Keyboard Shortcuts</div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+Shift+S</kbd>
              {' '}
              Save Template
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+O</kbd>
              {' '}
              Load Template
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+C/V/X</kbd>
              {' '}
              Copy/Paste/Cut
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Del</kbd>
              {' '}
              Delete
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+A</kbd>
              {' '}
              Select All
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Arrows</kbd>
              {' '}
              Move (+Shift: 10px)
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+1-9</kbd>
              {' '}
              Quick Load Template
            </div>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="border border-gray-300 shadow-lg"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
