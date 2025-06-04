'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCanvasAutoSave } from '@/hooks/useCanvasAutoSave';
import { designDB } from '@/lib/indexedDB';
import { CanvasContainer } from './components/CanvasContainer';
import { LinkEditPopup } from './components/LinkEditPopup';
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
  const [canvasVersion, setCanvasVersion] = useState(0);
  const [isDesignLoaded, setIsDesignLoaded] = useState(false);

  // Link editing popup state
  const [linkEditPopup, setLinkEditPopup] = useState<{
    isVisible: boolean;
    linkObject: any;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    linkObject: null,
    position: { x: 0, y: 0 },
  });

  // Initialize canvas with custom hook
  const { canvasRef, canvas, isCanvasReady, fabricError, fabric, guideControls } = useFabricCanvas({
    containerRef,
    onSelectionCreated: setSelectedObject,
    onSelectionUpdated: setSelectedObject,
    onSelectionCleared: () => setSelectedObject(null),
  });

  // Load existing design data when canvas is ready
  useEffect(() => {
    if (!canvas || !isCanvasReady || isDesignLoaded) {
      return;
    }

    const loadExistingDesign = async () => {
      try {
        // Additional safety check to ensure canvas is fully initialized
        const canvasElement = canvas.getElement();
        if (!canvasElement || !canvas.getContext) {
          console.warn('Canvas element not ready, retrying...');
          setTimeout(() => {
            if (!isDesignLoaded) {
              loadExistingDesign();
            }
          }, 100);
          return;
        }

        // Try to load design from IndexedDB first
        const existingDesign = await designDB.getDesign(designId);

        if (existingDesign && existingDesign.canvasData) {
          console.warn('Loading existing design from IndexedDB:', designId);

          // Validate canvas data before loading
          if (!existingDesign.canvasData.objects) {
            console.warn('Canvas data is missing objects array, creating empty array');
            existingDesign.canvasData.objects = [];
          }

          // Load the canvas data with error handling
          try {
            canvas.loadFromJSON(existingDesign.canvasData, () => {
              try {
                // Set canvas dimensions and background if available
                if (existingDesign.metadata.width && existingDesign.metadata.height) {
                  canvas.setDimensions({
                    width: existingDesign.metadata.width,
                    height: existingDesign.metadata.height,
                  });
                }

                if (existingDesign.metadata.backgroundColor) {
                  canvas.setBackgroundColor(existingDesign.metadata.backgroundColor, () => {
                    canvas.renderAll();
                  });
                } else {
                  canvas.renderAll();
                }

                setIsDesignLoaded(true);
                console.warn('Design loaded successfully from IndexedDB');
              } catch (renderError) {
                console.error('Error during canvas rendering after load:', renderError);
                setIsDesignLoaded(true);
              }
            });
          } catch (loadError) {
            console.error('Error loading canvas JSON:', loadError);
            setIsDesignLoaded(true);
          }
          return;
        }

        // Fallback: try to load from localStorage (for backward compatibility)
        const savedData = localStorage.getItem(`design_${designId}`);
        if (savedData) {
          try {
            const canvasData = JSON.parse(savedData);
            console.warn('Loading existing design from localStorage:', designId);

            // Validate localStorage data
            if (!canvasData.objects) {
              canvasData.objects = [];
            }

            canvas.loadFromJSON(canvasData, () => {
              try {
                canvas.renderAll();
                setIsDesignLoaded(true);
                console.warn('Design loaded successfully from localStorage');
              } catch (renderError) {
                console.error('Error rendering localStorage data:', renderError);
                setIsDesignLoaded(true);
              }
            });
          } catch (error) {
            console.error('Error parsing saved design data:', error);
            setIsDesignLoaded(true); // Set as loaded even if parsing fails
          }
        } else {
          // No existing design found, start with empty canvas
          console.warn('No existing design found, starting with empty canvas');
          setIsDesignLoaded(true);
        }
      } catch (error) {
        console.error('Error loading existing design:', error);
        setIsDesignLoaded(true); // Set as loaded even if loading fails
      }
    };

    // Add a small delay to ensure canvas is fully ready
    const timeoutId = setTimeout(() => {
      loadExistingDesign();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [canvas, isCanvasReady, designId, isDesignLoaded]);

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
    enabled: isCanvasReady && isDesignLoaded, // Only enable auto-save after design is loaded
  });

  // Memoize callback functions to prevent recreation on every render
  const handleShowSaveDialog = useCallback(() => setShowSaveDialog(true), []);
  const handleShowLoadDialog = useCallback(() => setShowLoadDialog(true), []);
  const handleToggleSidebar = useCallback(() => setSidebarCollapsed(!sidebarCollapsed), [sidebarCollapsed]);

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

  // Handle link double-click to show edit popup
  const handleLinkDoubleClick = useCallback((linkObject: any, _event: any) => {
    if (!canvas) {
      return;
    }

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const zoom = canvas.getZoom();

    // Calculate position relative to viewport
    const position = {
      x: rect.left + (linkObject.left + linkObject.width / 2) * zoom,
      y: rect.top + (linkObject.top + linkObject.height) * zoom,
    };

    setLinkEditPopup({
      isVisible: true,
      linkObject,
      position,
    });
  }, [canvas]);

  // Update link properties
  const handleUpdateLink = useCallback((updates: { url?: string; text?: string }) => {
    if (!linkEditPopup.linkObject || !canvas) {
      return;
    }

    const linkObject = linkEditPopup.linkObject;

    // Update link data
    const linkData = {
      ...linkObject.linkData,
      ...updates,
    };

    linkObject.set({ linkData });

    // If text changed, update the displayed text
    if (updates.text !== undefined) {
      linkObject.set({ text: updates.text });
    }

    canvas.renderAll();
  }, [linkEditPopup.linkObject, canvas]);

  // Close link edit popup
  const handleCloseLinkEdit = useCallback(() => {
    setLinkEditPopup({
      isVisible: false,
      linkObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  // Set up canvas event listeners for link editing
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handleDoubleClick = (e: any) => {
      const target = e.target;
      if (target && target.elementType === 'link') {
        handleLinkDoubleClick(target, e);
      }
    };

    canvas.on('mouse:dblclick', handleDoubleClick);

    // Cleanup function
    return () => {
      canvas.off('mouse:dblclick', handleDoubleClick);
    };
  }, [canvas, handleLinkDoubleClick]);

  // Get preview data for real-time preview - memoize to prevent unnecessary re-renders
  const previewData = useMemo(() => {
    const data = getPreviewData();
    return data;
  }, [getPreviewData, hasUnsavedChanges, canvasVersion]);

  // Force preview updates when canvas changes
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handleCanvasUpdate = () => {
      setCanvasVersion(prev => prev + 1);
    };

    const events = [
      'object:added',
      'object:removed',
      'object:modified',
      'object:moving',
      'object:scaling',
      'object:rotating',
    ];

    events.forEach((event) => {
      canvas.on(event, handleCanvasUpdate);
    });

    // Cleanup function
    return () => {
      events.forEach((event) => {
        canvas.off(event, handleCanvasUpdate);
      });
    };
  }, [canvas]);

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
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
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

      {/* Link Edit Popup */}
      <LinkEditPopup
        isVisible={linkEditPopup.isVisible}
        linkObject={linkEditPopup.linkObject}
        position={linkEditPopup.position}
        onUpdateLink={handleUpdateLink}
        onClose={handleCloseLinkEdit}
      />

      {/* Real-time Preview */}
      <RealTimePreview
        canvasState={previewData?.canvasData || null}
        width={previewData?.width || 375}
        height={previewData?.height || 667}
        backgroundColor={previewData?.backgroundColor || '#ffffff'}
      />
    </div>
  );
}
