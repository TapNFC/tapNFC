'use client';

import { useEffect, useRef, useState } from 'react';
import { useCanvasAutoSave } from '@/hooks/useCanvasAutoSave';
import { isTextObject, normalizeTextObjects } from '@/utils/textUtils';
import { CanvasContainer } from './components/CanvasContainer';
import {
  MemoizedLinkEditPopup,
  MemoizedRealTimePreview,
  MemoizedSocialIconContextualToolbar,
  MemoizedTextToolbar,
} from './components/OptimizedComponents';
import { SocialIconEditPopup } from './components/SocialIconEditPopup';
import { SvgColorPicker } from './components/SvgColorPicker';
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
import { safeRenderAll } from './utils/canvasSafety';

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
  const { canvasRef, canvas, isCanvasReady, fabricError, fabric, guideControls, isContextReady } = useFabricCanvas({
    containerRef,
    onSelectionCreated: setSelectedObject,
    onSelectionUpdated: setSelectedObject,
    onSelectionCleared: () => setSelectedObject(null),
  });

  // Extract link editing functionality to custom hook
  const { linkEditPopup, handleLinkDoubleClick, handleUpdateLink, handleCloseLinkEdit } = useLinkEditor({ canvas });

  // Add the social icon editor hook
  const {
    socialIconContextualToolbar,
    socialIconEditPopup,
    svgColorPicker,
    handleActionsClick,
    handleColorEditClick,
    handleUpdateSocialIcon,
    handleSvgColorChange,
    handleCloseSocialIconEdit,
    handleCloseContextualToolbar: handleCloseSocialIconContextualToolbar,
    handleCloseSvgColorPicker,
  } = useSocialIconEditor({ canvas, designId });

  // Add the text URL editor hook
  const {
    contextualToolbar,
    textUrlEditPopup,
    handleLinkIconClick,
    handleUpdateTextUrl,
    handleCloseTextUrlEdit,
    handleCloseContextualToolbar: handleCloseTextContextualToolbar,
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
    enabled: isCanvasReady && isContextReady && isDesignLoaded, // Only enable auto-save after design is loaded
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
    disableShortcuts: svgColorPicker.isVisible,
  });

  // Get preview data for real-time preview - use state to trigger updates
  const [previewData, setPreviewData] = useState<any>(null);

  // Use a ref to store the latest getPreviewData function to avoid dependency issues
  const getPreviewDataRef = useRef(getPreviewData);

  // Update the ref when getPreviewData changes
  useEffect(() => {
    if (getPreviewData) {
      getPreviewDataRef.current = getPreviewData;
    }
  }, [getPreviewData]);

  // Update preview data when canvas changes
  useEffect(() => {
    if (canvas && isCanvasReady && isContextReady && getPreviewDataRef.current) {
      const updatePreview = () => {
        const data = getPreviewDataRef.current();
        if (data) {
          setPreviewData(data);
        }
      };

      // Update immediately
      updatePreview();

      // Set up event listeners for canvas changes
      const handleCanvasChange = () => {
        if (getPreviewDataRef.current) {
          const data = getPreviewDataRef.current();
          if (data) {
            setPreviewData(data);
          }
        }
      };

      // Special handler for text object scaling to update fontSize
      const handleTextScaling = (e: any) => {
        const target = e?.target;
        if (target && isTextObject(target) && canvas) {
          // Calculate new font size based on scaling
          const originalFontSize = target.fontSize || 16;
          const scaleX = target.scaleX || 1;
          const scaleY = target.scaleY || 1;

          // Use the larger scale to determine font size change
          const scaleFactor = Math.max(scaleX, scaleY);
          const newFontSize = Math.round(originalFontSize * scaleFactor);

          // Update the font size property
          target.set('fontSize', newFontSize);

          // Reset scaling to 1 to maintain proper text rendering
          target.set({
            scaleX: 1,
            scaleY: 1,
          });

          // Update the canvas
          safeRenderAll(canvas);

          // Trigger selection update to refresh TextToolbar
          const activeObject = canvas.getActiveObject();
          if (activeObject === target) {
            canvas.fire('selection:updated', { target });
          }
        }
      };

      // Special handler for image object scaling to prevent exceeding canvas boundaries
      const handleImageScaling = (e: any) => {
        const target = e?.target;
        if (target && target.type === 'image' && canvas) {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();

          // Get the scaled dimensions of the image
          const scaledWidth = (target.width || 0) * (target.scaleX || 1);
          const scaledHeight = (target.height || 0) * (target.scaleY || 1);

          // Check if the scaled image would exceed canvas boundaries
          if (scaledWidth > canvasWidth || scaledHeight > canvasHeight) {
            // Calculate the maximum allowed scale to fit within canvas
            const maxScaleX = canvasWidth / (target.width || 1);
            const maxScaleY = canvasHeight / (target.height || 1);
            const maxScale = Math.min(maxScaleX, maxScaleY);

            // Apply the constrained scale
            target.set({
              scaleX: Math.min(target.scaleX || 1, maxScale),
              scaleY: Math.min(target.scaleY || 1, maxScale),
            });

            // Update the canvas
            safeRenderAll(canvas);
          }
        }
      };

      // Normalize existing text objects that might have scaling applied
      const normalizeExistingTextObjects = () => {
        if (canvas) {
          normalizeTextObjects(canvas);
          safeRenderAll(canvas);
        }
      };

      // Normalize existing text objects when canvas is ready
      normalizeExistingTextObjects();

      canvas.on('object:added', handleCanvasChange);
      canvas.on('object:removed', handleCanvasChange);
      canvas.on('object:modified', handleCanvasChange);
      canvas.on('object:moving', handleCanvasChange);
      canvas.on('object:scaling', (e: any) => {
        // Handle text scaling
        handleTextScaling(e);
        // Handle image scaling constraints
        handleImageScaling(e);
      });
      canvas.on('object:rotating', handleCanvasChange);
      canvas.on('canvas:background:changed', handleCanvasChange);

      return () => {
        if (canvas) {
          canvas.off('object:added', handleCanvasChange);
          canvas.off('object:removed', handleCanvasChange);
          canvas.off('object:modified', handleCanvasChange);
          canvas.off('object:moving', handleCanvasChange);
          canvas.off('object:scaling'); // Remove scaling handler
          canvas.off('object:rotating', handleCanvasChange);
          canvas.off('canvas:background:changed', handleCanvasChange);
        }
      };
    }
    return undefined;
  }, [canvas, isCanvasReady]); // Removed getPreviewData from dependencies

  // Track canvas readiness and initialize preview data
  useEffect(() => {
    if (isCanvasReady && isContextReady && canvas && getPreviewDataRef.current) {
      // Canvas is ready for design, initialize preview data
      const initialData = getPreviewDataRef.current();
      if (initialData) {
        setPreviewData(initialData);
      }
    }
  }, [isCanvasReady, isContextReady, canvas, designId]);

  // Zoom constants
  const ZOOM_STEP = 1.2;
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 0.3;

  // Ref to the canvas inner div element
  const canvasInnerRef = useRef<HTMLDivElement>(null);

  // Zoom functions
  const handleZoomIn = () => {
    if (!canvas || !canvasInnerRef.current) {
      return;
    }
    const currentScale = Number.parseFloat(canvasInnerRef.current.dataset?.zoom || '1');
    const newScale = Math.min(currentScale * ZOOM_STEP, MAX_ZOOM);
    if (canvasInnerRef.current.dataset) {
      canvasInnerRef.current.dataset.zoom = newScale.toString();
    }
    canvasInnerRef.current.style.transform = `scale(${newScale})`;
  };

  const handleZoomReset = () => {
    if (!canvas || !canvasInnerRef.current) {
      return;
    }
    if (canvasInnerRef.current.dataset) {
      canvasInnerRef.current.dataset.zoom = '1';
    }
    canvasInnerRef.current.style.transform = 'scale(1)';
  };

  const handleZoomOut = () => {
    if (!canvas || !canvasInnerRef.current) {
      return;
    }
    const currentScale = Number.parseFloat(canvasInnerRef.current.dataset?.zoom || '1');
    const newScale = Math.max(currentScale / ZOOM_STEP, MIN_ZOOM);
    if (canvasInnerRef.current.dataset) {
      canvasInnerRef.current.dataset.zoom = newScale.toString();
    }
    canvasInnerRef.current.style.transform = `scale(${newScale})`;
  };

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
      const target = options?.target;
      if (!target) {
        return;
      }

      if (target.elementType === 'link') {
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
      // Note: Social icon double-click is now handled in the useSocialIconEditor hook
    });

    // Clean up event listeners on unmount
    return () => {
      if (canvas) {
        canvas.off('mouse:dblclick');

        // Restore original event handlers if they existed
        if (originalMouseDblClick && originalMouseDblClick.length > 0) {
          originalMouseDblClick.forEach((handler: any) => {
            if (handler && canvas) {
              canvas.on('mouse:dblclick', handler);
            }
          });
        }
      }
    };
  }, [canvas, fabric, handleLinkDoubleClick]);

  // Early return if required props are missing
  if (!designId) {
    return null;
  }

  return (
    <div className={DESIGN_EDITOR_CONFIG?.BACKGROUND_CLASSES?.MAIN || ''}>
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
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              canvasInnerRef={canvasInnerRef}
            />
          </div>
        </div>
      </div>

      {/* Link Edit Popup */}
      {linkEditPopup && (
        <MemoizedLinkEditPopup
          isVisible={linkEditPopup.isVisible}
          linkObject={linkEditPopup.linkObject}
          position={linkEditPopup.position}
          onUpdateLink={handleUpdateLink}
          onClose={handleCloseLinkEdit}
        />
      )}

      {/* Real-time Preview */}
      <MemoizedRealTimePreview
        canvasState={previewData?.canvasData || null}
        width={previewData?.width || DESIGN_EDITOR_CONFIG?.DEFAULT_CANVAS?.WIDTH}
        height={previewData?.height || DESIGN_EDITOR_CONFIG?.DEFAULT_CANVAS?.HEIGHT}
        backgroundColor={previewData?.backgroundColor || DESIGN_EDITOR_CONFIG?.DEFAULT_CANVAS?.BACKGROUND_COLOR}
      />

      {/* Add the social icon contextual toolbar */}
      {socialIconContextualToolbar && (
        <MemoizedSocialIconContextualToolbar
          isVisible={socialIconContextualToolbar.isVisible}
          position={socialIconContextualToolbar.position}
          iconObject={socialIconContextualToolbar.iconObject}
          onActionsClick={handleActionsClick}
          onColorEditClick={handleColorEditClick}
          onClose={handleCloseSocialIconContextualToolbar}
        />
      )}

      {/* Add the social icon edit popup */}
      {socialIconEditPopup && socialIconEditPopup.isVisible && (
        <SocialIconEditPopup
          isVisible={socialIconEditPopup.isVisible}
          iconObject={socialIconEditPopup.iconObject}
          position={socialIconEditPopup.position}
          designId={designId}
          onUpdateIcon={handleUpdateSocialIcon}
          onClose={handleCloseSocialIconEdit}
        />
      )}

      {/* Add the SVG color picker */}
      {svgColorPicker.isVisible && (
        <SvgColorPicker
          isVisible={svgColorPicker.isVisible}
          svgCode={svgColorPicker.svgCode}
          onClose={handleCloseSvgColorPicker}
          onColorChange={handleSvgColorChange}
        />
      )}

      {/* Add the text contextual toolbar */}
      {contextualToolbar && (
        <TextContextualToolbar
          isVisible={contextualToolbar.isVisible}
          position={contextualToolbar.position}
          onLinkClick={handleLinkIconClick}
          onClose={handleCloseTextContextualToolbar}
        />
      )}

      {/* Add the text URL edit popup */}
      {textUrlEditPopup && textUrlEditPopup.isVisible && (
        <TextUrlEditPopup
          isVisible={textUrlEditPopup.isVisible}
          textObject={textUrlEditPopup.textObject}
          position={textUrlEditPopup.position}
          designId={designId}
          onUpdateTextUrl={handleUpdateTextUrl}
          onClose={handleCloseTextUrlEdit}
        />
      )}
    </div>
  );
}
