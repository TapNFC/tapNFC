'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useCanvasAutoSave } from '@/hooks/useCanvasAutoSave';
import { CanvasContainer } from './components/CanvasContainer';
import {
  MemoizedLinkEditPopup,
  MemoizedRealTimePreview,
  MemoizedTextToolbar,
} from './components/OptimizedComponents';
import { DESIGN_EDITOR_CONFIG } from './constants';
import { DesignSidebar } from './DesignSidebar';
import { DesignToolbar } from './DesignToolbar';
import { useCanvasEvents } from './hooks/useCanvasEvents';
import { useDesignEditorState } from './hooks/useDesignEditorState';
import { useDesignLoader } from './hooks/useDesignLoader';
import { useFabricCanvas } from './hooks/useFabricCanvas';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useLinkEditor } from './hooks/useLinkEditor';

type DesignEditorProps = {
  designId: string;
  locale?: string;
};

export function DesignEditor({ designId, locale = 'en' }: DesignEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract state management to custom hook
  const {
    showSaveDialog,
    showLoadDialog,
    setShowSaveDialog,
    setShowLoadDialog,
    handleShowSaveDialog,
    handleShowLoadDialog,
    sidebarCollapsed,
    handleToggleSidebar,
    canvasVersion,
    incrementCanvasVersion,
    isDesignLoaded,
    setIsDesignLoaded,
    selectedObject,
    setSelectedObject,
  } = useDesignEditorState();

  // Initialize canvas with custom hook
  const { canvasRef, canvas, isCanvasReady, fabricError, fabric, guideControls } = useFabricCanvas({
    containerRef,
    onSelectionCreated: setSelectedObject,
    onSelectionUpdated: setSelectedObject,
    onSelectionCleared: () => setSelectedObject(null),
  });

  // Extract link editing functionality to custom hook
  const { linkEditPopup, handleUpdateLink, handleCloseLinkEdit } = useLinkEditor({ canvas });

  // Extract design loading logic to custom hook
  useDesignLoader({
    canvas,
    isCanvasReady,
    designId,
    isDesignLoaded,
    setIsDesignLoaded,
  });

  // Auto-save and real-time state management
  const {
    hasUnsavedChanges,
    lastSaved,
    saveNow,
    getPreviewData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasAutoSave({
    canvas,
    designId,
    autoSaveInterval: DESIGN_EDITOR_CONFIG.AUTO_SAVE_INTERVAL,
    enabled: isCanvasReady && isDesignLoaded, // Only enable auto-save after design is loaded
  });

  // Extract canvas event management to custom hook
  useCanvasEvents({ canvas, incrementCanvasVersion });

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    canvas,
    fabric,
    selectedObject,
    onShowSaveDialog: handleShowSaveDialog,
    onShowLoadDialog: handleShowLoadDialog,
    onUndo: undo,
    onRedo: redo,
    canUndo,
    canRedo,
  });

  // Get preview data for real-time preview - memoize to prevent unnecessary re-renders
  const previewData = useMemo(() => {
    const data = getPreviewData();
    return data;
  }, [getPreviewData, hasUnsavedChanges, canvasVersion]);

  // Log component lifecycle
  useEffect(() => {
    console.warn('DesignEditor mounted, designId:', designId);
    return () => {
      console.warn('DesignEditor unmounting, designId:', designId);
    };
  }, [designId]);

  // Add this useEffect to track canvas readiness
  useEffect(() => {
    if (isCanvasReady) {
      console.warn('Canvas is ready for design:', designId);
    }
  }, [isCanvasReady, designId]);

  return (
    <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.MAIN}>
      {/* Full Width Header */}
      <DesignToolbar
        designId={designId}
        canvas={canvas}
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        showLoadDialog={showLoadDialog}
        setShowLoadDialog={setShowLoadDialog}
        onToggleSidebar={handleToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        onManualSave={saveNow}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        guideControls={guideControls}
        locale={locale}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DesignSidebar
          canvas={canvas}
          collapsed={sidebarCollapsed}
          designId={designId}
          locale={locale}
        />

        {/* Main Editor Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Text Formatting Toolbar */}
          <MemoizedTextToolbar canvas={canvas} selectedObject={selectedObject} />

          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden">
            <CanvasContainer
              canvasRef={canvasRef}
              containerRef={containerRef}
              isCanvasReady={isCanvasReady}
              fabricError={fabricError}
              canvas={canvas}
              fabric={fabric}
            />
          </div>
        </div>
      </div>

      {/* Link Edit Popup */}
      <MemoizedLinkEditPopup
        isVisible={linkEditPopup.isVisible}
        linkObject={linkEditPopup.linkObject}
        position={linkEditPopup.position}
        onUpdateLink={handleUpdateLink}
        onClose={handleCloseLinkEdit}
      />

      {/* Real-time Preview */}
      <MemoizedRealTimePreview
        canvasState={previewData?.canvasData || null}
        width={previewData?.width || DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.WIDTH}
        height={previewData?.height || DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.HEIGHT}
        backgroundColor={previewData?.backgroundColor || DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.BACKGROUND_COLOR}
      />
    </div>
  );
}
