import { useCallback, useEffect, useRef, useState } from 'react';
import { useTemplateStore } from '@/stores/templateStore';
import { useCanvasHistory } from './useCanvasHistory';

type UseCanvasAutoSaveOptions = {
  canvas: any;
  designId: string;
  autoSaveInterval?: number; // in milliseconds
  enabled?: boolean;
};

// Safely serialize canvas with error handling and cleanup
const safeCanvasToJSON = (canvas: any, customProperties: string[] = []): any | null => {
  if (!canvas) {
    return null;
  }

  try {
    // First, clean up any problematic objects
    const objects = canvas.getObjects();
    let hasProblematicObjects = false;

    objects.forEach((obj: any) => {
      try {
        // Test if object can be serialized
        obj.toObject();
      } catch (error) {
        console.warn('Found problematic object, cleaning up:', error);
        hasProblematicObjects = true;

        // Clean up the object's problematic properties
        if (obj.styles && typeof obj.styles === 'object') {
          Object.keys(obj.styles).forEach((key) => {
            if (!obj.styles[key] || typeof obj.styles[key] !== 'object') {
              delete obj.styles[key];
            }
          });
        }

        // Reset other potentially problematic properties
        if (obj.path && typeof obj.path !== 'string') {
          delete obj.path;
        }
      }
    });

    // If we had problematic objects, render the canvas again
    if (hasProblematicObjects) {
      canvas.renderAll();
    }

    // Now try to serialize the entire canvas
    const serialized = canvas.toJSON(customProperties);

    // Validate the serialized data
    if (!serialized || typeof serialized !== 'object') {
      throw new Error('Serialization resulted in invalid data');
    }

    return serialized;
  } catch (error) {
    console.error('Error serializing canvas:', error);

    // As a last resort, try to create a minimal valid canvas state
    try {
      return {
        version: '5.3.0',
        objects: [],
        background: canvas.backgroundColor || '#ffffff',
        width: canvas.getWidth ? canvas.getWidth() : 375,
        height: canvas.getHeight ? canvas.getHeight() : 667,
      };
    } catch (fallbackError) {
      console.error('Even fallback serialization failed:', fallbackError);
      return null;
    }
  }
};

export function useCanvasAutoSave({
  canvas,
  designId,
  autoSaveInterval = 2000, // Auto-save every 2 seconds
  enabled = true,
}: UseCanvasAutoSaveOptions) {
  const [canvasState, setCanvasState] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCanvasStateRef = useRef<string>('');
  const serializationErrorCount = useRef<number>(0);

  const { saveCurrentTemplate } = useTemplateStore();

  // Initialize canvas history for undo/redo
  const {
    saveState: saveHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
    initializeHistory,
    isPerformingHistoryAction,
  } = useCanvasHistory({ canvas });

  // Get current canvas state as JSON with safe serialization
  const getCurrentCanvasState = useCallback(() => {
    if (!canvas) {
      return null;
    }

    const result = safeCanvasToJSON(canvas, ['elementType', 'buttonData', 'linkData']);

    if (!result) {
      serializationErrorCount.current += 1;
      console.warn(`Canvas serialization failed (attempt ${serializationErrorCount.current})`);

      // If we've had too many serialization errors, disable auto-save temporarily
      if (serializationErrorCount.current > 5) {
        console.error('Too many serialization errors, auto-save may be unstable');
      }
    } else {
      // Reset error count on successful serialization
      serializationErrorCount.current = 0;
    }

    return result;
  }, [canvas]);

  // Save canvas to template store
  const saveCanvas = useCallback(async () => {
    if (!canvas || !enabled) {
      return;
    }

    try {
      const canvasData = getCurrentCanvasState();
      if (!canvasData) {
        console.warn('Cannot save: Canvas state is invalid');
        return;
      }

      const templateName = `Design_${designId}_${Date.now()}`;
      saveCurrentTemplate(canvasData, templateName);

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error auto-saving canvas:', error);
    }
  }, [canvas, designId, enabled, getCurrentCanvasState, saveCurrentTemplate]);

  // Debounced auto-save function
  const scheduleAutoSave = useCallback(() => {
    if (!enabled) {
      return;
    }

    // Skip auto-save if we've had too many serialization errors
    if (serializationErrorCount.current > 5) {
      console.warn('Skipping auto-save due to serialization issues');
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveCanvas();
    }, autoSaveInterval);
  }, [enabled, autoSaveInterval, saveCanvas]);

  // Handle canvas modifications with error boundaries
  const handleCanvasModified = useCallback(() => {
    if (!canvas) {
      return;
    }

    // Don't save history during undo/redo operations
    if (isPerformingHistoryAction()) {
      return;
    }

    try {
      const currentState = getCurrentCanvasState();
      if (!currentState) {
        return;
      }

      const currentStateString = JSON.stringify(currentState);

      // Only update if state actually changed
      if (currentStateString !== lastCanvasStateRef.current) {
        setCanvasState(currentState);
        setHasUnsavedChanges(true);
        lastCanvasStateRef.current = currentStateString;

        // Save to history for undo/redo (only if serialization worked)
        saveHistoryState();

        // Schedule auto-save
        scheduleAutoSave();
      }
    } catch (error) {
      console.error('Error handling canvas modification:', error);
      // Don't propagate the error to prevent crashes
    }
  }, [canvas, getCurrentCanvasState, scheduleAutoSave, saveHistoryState, isPerformingHistoryAction]);

  // Set up canvas event listeners
  useEffect(() => {
    if (!canvas || !enabled) {
      return;
    }

    const events = [
      'object:added',
      'object:removed',
      'object:modified',
      'object:moving',
      'object:scaling',
      'object:rotating',
      'object:skewing',
      'path:created', // For drawing
      'text:changed',
      'canvas:background-changed',
    ];

    // Add event listeners with error boundaries
    const safeHandleCanvasModified = () => {
      try {
        handleCanvasModified();
      } catch (error) {
        console.error('Error in canvas event handler:', error);
      }
    };

    // Add event listeners
    events.forEach((event) => {
      canvas.on(event, safeHandleCanvasModified);
    });

    // Initialize history when canvas is ready
    try {
      initializeHistory();
    } catch (error) {
      console.error('Error initializing canvas history:', error);
    }

    // Initial state capture
    setTimeout(() => {
      safeHandleCanvasModified();
    }, 100); // Small delay to ensure canvas is ready

    // Cleanup
    return () => {
      events.forEach((event) => {
        canvas.off(event, safeHandleCanvasModified);
      });

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [canvas, enabled, handleCanvasModified, initializeHistory]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    await saveCanvas();
  }, [saveCanvas]);

  // Get preview data optimized for preview component
  const getPreviewData = useCallback(() => {
    if (!canvasState) {
      return null;
    }

    try {
      return {
        canvasData: canvasState,
        width: canvas?.getWidth() || 375,
        height: canvas?.getHeight() || 667,
        backgroundColor: canvas?.backgroundColor || '#ffffff',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error getting preview data:', error);
      return null;
    }
  }, [canvasState, canvas]);

  return {
    canvasState,
    hasUnsavedChanges,
    lastSaved,
    saveNow,
    getPreviewData,
    // Expose undo/redo functionality
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
