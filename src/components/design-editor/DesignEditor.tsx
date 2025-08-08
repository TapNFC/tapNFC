'use client';

import { useEffect, useRef, useState } from 'react';
import { useCanvasAutoSave } from '@/hooks/useCanvasAutoSave';
import { CanvasContainer } from './components/CanvasContainer';
import {
  MemoizedLinkEditPopup,
  MemoizedRealTimePreview,
  MemoizedTextToolbar,
} from './components/OptimizedComponents';
import { SocialIconEditPopup } from './components/SocialIconEditPopup';
import { TextContextualToolbar } from './components/TextContextualToolbar';
import { TextUrlEditPopup } from './components/TextUrlEditPopup';
import { DESIGN_EDITOR_CONFIG } from './constants';
import { DesignSidebar } from './DesignSidebar';
import { DesignToolbar } from './DesignToolbar';
import { useCanvasEvents } from './hooks/useCanvasEvents';
import { useDesignEditorState } from './hooks/useDesignEditorState';
import { useDesignLoader } from './hooks/useDesignLoader';
import { useFabricCanvas } from './hooks/useFabricCanvas';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useLinkEditor } from './hooks/useLinkEditor';
import { useSocialIconEditor } from './hooks/useSocialIconEditor';
import { useTextUrlEditor } from './hooks/useTextUrlEditor';

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
  const { linkEditPopup, handleLinkDoubleClick, handleUpdateLink, handleCloseLinkEdit } = useLinkEditor({ canvas });

  // Add the social icon editor hook
  const {
    socialIconEditPopup,
    handleSocialIconDoubleClick,
    handleUpdateSocialIcon,
    handleCloseSocialIconEdit,
  } = useSocialIconEditor({ canvas });

  // Add the text URL editor hook
  const {
    contextualToolbar,
    textUrlEditPopup,
    handleLinkIconClick,
    handleUpdateTextUrl,
    handleCloseTextUrlEdit,
    handleCloseContextualToolbar,
  } = useTextUrlEditor({ canvas });

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

  // Get preview data for real-time preview - use state to trigger updates
  const [previewData, setPreviewData] = useState(() => getPreviewData());

  // Update preview data when canvas changes
  useEffect(() => {
    if (canvas && isCanvasReady) {
      const updatePreview = () => {
        const data = getPreviewData();
        if (data) {
          setPreviewData(data);
        }
      };

      // Update immediately
      updatePreview();

      // Set up event listeners for canvas changes
      const handleCanvasChange = () => {
        updatePreview();
      };

      canvas.on('object:added', handleCanvasChange);
      canvas.on('object:removed', handleCanvasChange);
      canvas.on('object:modified', handleCanvasChange);
      canvas.on('object:moving', handleCanvasChange);
      canvas.on('object:scaling', handleCanvasChange);
      canvas.on('object:rotating', handleCanvasChange);

      return () => {
        canvas.off('object:added', handleCanvasChange);
        canvas.off('object:removed', handleCanvasChange);
        canvas.off('object:modified', handleCanvasChange);
        canvas.off('object:moving', handleCanvasChange);
        canvas.off('object:scaling', handleCanvasChange);
        canvas.off('object:rotating', handleCanvasChange);
      };
    }
    return undefined;
  }, [canvas, isCanvasReady, getPreviewData]);

  // Track canvas readiness
  useEffect(() => {
    if (isCanvasReady) {
      // Canvas is ready for design
    }
  }, [isCanvasReady, designId]);

  // Update the useEffect for double-click handling
  useEffect(() => {
    if (!canvas || !fabric) {
      return;
    }

    // Store the original event handler if it exists
    const originalMouseDblClick = canvas.__eventListeners?.['mouse:dblclick'] || [];

    // Remove any existing mouse:dblclick handlers to avoid duplicates
    canvas.off('mouse:dblclick');

    // Add our custom double-click handler
    canvas.on('mouse:dblclick', (options: any) => {
      const target = options.target;
      if (!target) {
        return;
      }

      if (target.elementType === 'socialIcon') {
        handleSocialIconDoubleClick(target, options.e);
      } else if (target.elementType === 'link') {
        handleLinkDoubleClick(target, options.e);
      } else if (target.elementType === 'button') {
        // For buttons, we'll focus on the URL field in the properties panel
        // and highlight it to draw attention to it
        const urlInput = document.querySelector('#button-action-value') as HTMLInputElement;
        if (urlInput) {
          urlInput.focus();
          urlInput.select();
          // Scroll the properties panel to the action section if needed
          urlInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Clean up event listeners on unmount
    return () => {
      if (canvas) {
        canvas.off('mouse:dblclick');

        // Restore original event handlers if they existed
        if (originalMouseDblClick.length > 0) {
          originalMouseDblClick.forEach((handler: any) => {
            canvas.on('mouse:dblclick', handler);
          });
        }
      }
    };
  }, [canvas, fabric, handleSocialIconDoubleClick, handleLinkDoubleClick]);

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

      {/* Add the social icon edit popup */}
      {socialIconEditPopup.isVisible && (
        <SocialIconEditPopup
          isVisible={socialIconEditPopup.isVisible}
          iconObject={socialIconEditPopup.iconObject}
          position={socialIconEditPopup.position}
          onUpdateIcon={handleUpdateSocialIcon}
          onClose={handleCloseSocialIconEdit}
        />
      )}

      {/* Add the text contextual toolbar */}
      <TextContextualToolbar
        isVisible={contextualToolbar.isVisible}
        position={contextualToolbar.position}
        onLinkClick={handleLinkIconClick}
        onClose={handleCloseContextualToolbar}
      />

      {/* Add the text URL edit popup */}
      {textUrlEditPopup.isVisible && (
        <TextUrlEditPopup
          isVisible={textUrlEditPopup.isVisible}
          textObject={textUrlEditPopup.textObject}
          position={textUrlEditPopup.position}
          onUpdateTextUrl={handleUpdateTextUrl}
          onClose={handleCloseTextUrlEdit}
        />
      )}
    </div>
  );
}
