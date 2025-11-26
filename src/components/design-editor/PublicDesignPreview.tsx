'use client';

import type { Design } from '@/types/design';
import { useRef } from 'react';
import { CanvasRenderer } from '@/components/design-editor/CanvasRenderer';
import { ErrorScreen } from '@/components/design-editor/ErrorScreen';
import { InteractiveElement } from '@/components/design-editor/InteractiveElement';
import { LoadingScreen } from '@/components/design-editor/LoadingScreen';
import { usePublicDesignPreview } from '@/hooks/usePublicDesignPreview';

type PublicDesignPreviewProps = {
  designId?: string;
  designSlug?: string;
  initialData?: Design | null;
  forceRefresh?: boolean;
};

export function PublicDesignPreview({ designId, designSlug, initialData, forceRefresh = false }: PublicDesignPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    designData,
    loading,
    error,
    scale,
    effectiveBackgroundStyle,
  } = usePublicDesignPreview({ designId, designSlug, initialData, forceRefresh });

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && !designData) {
    return <ErrorScreen showTryAgain={true} />;
  }

  if (!designData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No design data available</p>
        </div>
      </div>
    );
  }

  // Show an elegant expired/archived screen for archived designs
  if (designData.is_archived) {
    return <ErrorScreen isArchived={true} showTryAgain={true} />;
  }

  const canvasData = designData.canvas_data || {};
  const canvasWidth = designData.width || 800;
  const canvasHeight = designData.height || 600;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Design Preview */}
      <main className="flex flex-1 items-center justify-center bg-black p-4 sm:p-8">
        <div className="relative flex flex-col items-center">
          {/* Canvas Container with responsive scaling */}
          {scale < 1
            ? (
                <div
                  className="relative"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                >
                  <div
                    ref={containerRef}
                    className="relative overflow-hidden shadow-lg"
                    style={{
                      width: `${canvasWidth}px`,
                      height: `${canvasHeight}px`,
                      ...effectiveBackgroundStyle,
                    }}
                  >
                    {/* Render canvas objects using HTML elements */}
                    <CanvasRenderer designData={designData} />

                    {/* Interactive overlay elements */}
                    {canvasData.objects?.map((obj: any, index: number) => {
                      if (obj.elementType) {
                        return <InteractiveElement key={`interactive-${index}`} obj={obj} index={index} />;
                      }
                      return null;
                    })}
                  </div>
                </div>
              )
            : (
                <div
                  ref={containerRef}
                  className="relative overflow-hidden shadow-lg"
                  style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                    ...effectiveBackgroundStyle,
                  }}
                >
                  {/* Render canvas objects using HTML elements */}
                  <CanvasRenderer designData={designData} />

                  {/* Interactive overlay elements */}
                  {canvasData.objects?.map((obj: any, index: number) => {
                    if (obj.elementType) {
                      return <InteractiveElement key={`interactive-${index}`} obj={obj} index={index} />;
                    }
                    return null;
                  })}
                </div>
              )}
        </div>
      </main>
    </div>
  );
}
