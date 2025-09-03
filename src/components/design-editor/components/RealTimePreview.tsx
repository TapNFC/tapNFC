'use client';

import { useRef } from 'react';
import { CanvasRenderer } from '@/components/design-editor/CanvasRenderer';
import { EmptyCanvas, HiddenPreviewButton, PreviewControls, PreviewInfo } from '@/components/design-editor/preview';
import { useRealTimePreview } from '@/hooks/useRealTimePreview';

// Define a type for Fabric-like gradient objects that might be passed
type FabricGradient = {
  type?: string; // e.g., 'linear'
  colorStops?: Array<{ offset: number; color: string }>;
  coords?: { x1?: number; y1?: number; x2?: number; y2?: number };
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
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    isFullscreen,
    isVisible,
    getPreviewScale,
    displayDimensions,
    canvasStateKey,
    effectiveBackgroundStyle,
    toggleFullscreen,
    handleHidePreview,
    handleShowPreview,
  } = useRealTimePreview({ canvasState, width, height, backgroundColor });

  if (!isVisible) {
    return <HiddenPreviewButton onShowPreview={handleShowPreview} />;
  }

  return (
    <div
      ref={previewRef}
      className={`fixed ${isFullscreen ? 'inset-0 z-[9999] flex items-center justify-center bg-gray-900' : `bottom-4 right-4 z-50 ${className}`}`}
    >
      <div className={`${isFullscreen ? 'relative flex flex-col' : 'rounded-lg border border-gray-200 bg-white shadow-lg'}`}>
        {/* Preview Header */}
        <PreviewControls
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => toggleFullscreen(previewRef)}
          onHidePreview={handleHidePreview}
        />

        {/* Preview Content */}
        <div
          className={`${isFullscreen ? 'flex flex-1 items-center justify-center' : 'p-4'}`}
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
              transform: `scale(${isFullscreen ? 1 : getPreviewScale})`,
              transformOrigin: 'top left',
            }}
          >
            {canvasState?.objects && Array.isArray(canvasState.objects) && canvasState.objects.length > 0
              ? (
                  <CanvasRenderer
                    designData={{
                      id: 'preview',
                      user_id: 'preview',
                      name: 'Preview',
                      preview_url: '',
                      width,
                      height,
                      canvas_data: canvasState,
                      is_archived: false,
                      is_template: false,
                      is_public: false,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    }}
                  />
                )
              : (
                  <EmptyCanvas />
                )}
          </div>
        </div>

        {/* Preview Info */}
        <PreviewInfo width={width} height={height} scale={getPreviewScale} />
      </div>
    </div>
  );
}
