'use client';

import { useRef, useState } from 'react';
import { useCanvasAutoSave } from '@/hooks/useCanvasAutoSave';
import { CanvasContainer } from './components/CanvasContainer';
import { RealTimePreview } from './components/RealTimePreview';
import { DesignSidebar } from './DesignSidebar';
import { DesignToolbar } from './DesignToolbar';
import { useFabricCanvas } from './hooks/useFabricCanvas';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TextToolbar } from './TextToolbar';

type DesignEditorProps = {
  designId: string;
  locale?: string;
};

export function DesignEditor({ designId, locale = 'en' }: DesignEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize canvas with custom hook
  const { canvasRef, canvas, isCanvasReady, fabricError, fabric } = useFabricCanvas({
    containerRef,
    onSelectionCreated: setSelectedObject,
    onSelectionUpdated: setSelectedObject,
    onSelectionCleared: () => setSelectedObject(null),
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
    autoSaveInterval: 2000, // Auto-save every 2 seconds
    enabled: isCanvasReady,
  });

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    canvas,
    fabric,
    selectedObject,
    onShowSaveDialog: () => setShowSaveDialog(true),
    onShowLoadDialog: () => setShowLoadDialog(true),
    onUndo: undo,
    onRedo: redo,
    canUndo,
    canRedo,
  });

  // Get preview data for real-time preview
  const previewData = getPreviewData();

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Full Width Header */}
      <DesignToolbar
        designId={designId}
        canvas={canvas}
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        showLoadDialog={showLoadDialog}
        setShowLoadDialog={setShowLoadDialog}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        onManualSave={saveNow}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
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
          <TextToolbar canvas={canvas} selectedObject={selectedObject} />

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

      {/* Real-time Preview */}
      {previewData && (
        <RealTimePreview
          canvasState={previewData.canvasData}
          width={previewData.width}
          height={previewData.height}
          backgroundColor={previewData.backgroundColor}
        />
      )}
    </div>
  );
}
