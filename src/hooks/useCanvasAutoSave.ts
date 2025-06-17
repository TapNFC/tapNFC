import type { DesignData } from '@/lib/indexedDB';
import { useCallback, useEffect, useRef, useState } from 'react';
import { designDB } from '@/lib/indexedDB';

type UseCanvasAutoSaveOptions = {
  canvas: any;
  designId: string;
  autoSaveInterval?: number;
  enabled?: boolean;
};

type PreviewData = {
  canvasData: any;
  width: number;
  height: number;
  backgroundColor: string;
};

export function useCanvasAutoSave({
  canvas,
  designId,
  autoSaveInterval = 3000,
  enabled = true,
}: UseCanvasAutoSaveOptions) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadDesignRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCanvasStateRef = useRef<string>('');
  const isLoadingRef = useRef(false);

  // Save current canvas state to IndexedDB
  const saveCanvasState = useCallback(async () => {
    if (!canvas || !enabled || isLoadingRef.current) {
      return;
    }

    try {
      const canvasData = canvas.toJSON(['elementType', 'buttonData', 'linkData', 'shapeData']);

      // Add canvas dimensions and background
      canvasData.width = canvas.getWidth();
      canvasData.height = canvas.getHeight();
      canvasData.background = canvas.backgroundColor || '#ffffff';

      const designData: DesignData = {
        id: designId,
        canvasData,
        metadata: {
          width: canvas.getWidth(),
          height: canvas.getHeight(),
          backgroundColor: canvas.backgroundColor || '#ffffff',
          title: `Design ${designId}`,
          description: 'Auto-saved design',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await designDB.saveDesign(designData);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save design to IndexedDB:', error);
    }
  }, [canvas, designId, enabled]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
    await saveCanvasState();
  }, [saveCanvasState]);

  // Load design from IndexedDB
  const loadDesign = useCallback(async () => {
    if (!canvas || !designId || isLoadingRef.current) {
      return;
    }

    // Add a robust check for canvas context readiness
    if (!canvas.contextContainer) {
      console.warn('[useCanvasAutoSave] Canvas contextContainer not ready, delaying loadDesign.');
      // Clear any existing retry timeout
      if (loadDesignRetryTimeoutRef.current) {
        clearTimeout(loadDesignRetryTimeoutRef.current);
      }
      loadDesignRetryTimeoutRef.current = setTimeout(() => {
        if (canvas && canvas.contextContainer) {
          loadDesign(); // Retry the load
        } else {
          console.error('[useCanvasAutoSave] Canvas contextContainer still not ready after delay. Aborting load in hook.');
          isLoadingRef.current = false; // Ensure loading ref is reset
        }
      }, 150); // Delay for retry
      return; // Exit and wait for retry
    }

    try {
      isLoadingRef.current = true;
      const designData = await designDB.getDesign(designId);

      if (designData?.canvasData) {
        // Clear canvas first
        canvas.clear();

        // Set canvas dimensions if available
        if (designData.metadata.width && designData.metadata.height) {
          canvas.setDimensions({
            width: designData.metadata.width,
            height: designData.metadata.height,
          });
        }

        // Set background color
        if (designData.metadata.backgroundColor) {
          canvas.backgroundColor = designData.metadata.backgroundColor;
        }

        // Load canvas data
        canvas.loadFromJSON(designData.canvasData, () => {
          canvas.renderAll();
          setLastSaved(designData.updatedAt);
          setHasUnsavedChanges(false);

          // Initialize history with loaded state
          const initialState = canvas.toJSON(['elementType', 'buttonData', 'linkData', 'shapeData']);
          setHistory([initialState]);
          setCurrentHistoryIndex(0);
          lastCanvasStateRef.current = JSON.stringify(initialState);
        });
      } else {
        // No saved design found, initialize with empty state
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();

        const initialState = canvas.toJSON(['elementType', 'buttonData', 'linkData', 'shapeData']);
        setHistory([initialState]);
        setCurrentHistoryIndex(0);
        lastCanvasStateRef.current = JSON.stringify(initialState);
      }
    } catch (error) {
      console.error('Failed to load design from IndexedDB:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [canvas, designId]);

  // Track canvas changes for auto-save and history
  const handleCanvasChange = useCallback(() => {
    if (!canvas || !enabled || isLoadingRef.current) {
      return;
    }

    const currentState = canvas.toJSON(['elementType', 'buttonData', 'linkData', 'shapeData']);
    const currentStateString = JSON.stringify(currentState);

    // Only trigger if state actually changed
    if (currentStateString !== lastCanvasStateRef.current) {
      setHasUnsavedChanges(true);
      lastCanvasStateRef.current = currentStateString;

      // Add to history (limit to 50 states)
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentHistoryIndex + 1);
        newHistory.push(currentState);
        return newHistory.slice(-50); // Keep last 50 states
      });
      setCurrentHistoryIndex(prev => Math.min(prev + 1, 49));

      // Clear existing timeout and set new one
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveCanvasState();
      }, autoSaveInterval);
    }
  }, [canvas, enabled, currentHistoryIndex, autoSaveInterval, saveCanvasState]);

  // Undo function
  const undo = useCallback(() => {
    if (!canvas || currentHistoryIndex <= 0) {
      return;
    }

    const newIndex = currentHistoryIndex - 1;
    const targetState = history[newIndex];

    if (targetState) {
      isLoadingRef.current = true;
      canvas.loadFromJSON(targetState, () => {
        canvas.renderAll();
        setCurrentHistoryIndex(newIndex);
        lastCanvasStateRef.current = JSON.stringify(targetState);
        setHasUnsavedChanges(newIndex !== 0); // Mark as unsaved if not at initial state
        isLoadingRef.current = false;
      });
    }
  }, [canvas, currentHistoryIndex, history]);

  // Redo function
  const redo = useCallback(() => {
    if (!canvas || currentHistoryIndex >= history.length - 1) {
      return;
    }

    const newIndex = currentHistoryIndex + 1;
    const targetState = history[newIndex];

    if (targetState) {
      isLoadingRef.current = true;
      canvas.loadFromJSON(targetState, () => {
        canvas.renderAll();
        setCurrentHistoryIndex(newIndex);
        lastCanvasStateRef.current = JSON.stringify(targetState);
        setHasUnsavedChanges(true);
        isLoadingRef.current = false;
      });
    }
  }, [canvas, currentHistoryIndex, history]);

  // Get preview data for real-time preview
  const getPreviewData = useCallback((): PreviewData | null => {
    if (!canvas) {
      return null;
    }

    try {
      const canvasData = canvas.toJSON(['elementType', 'buttonData', 'linkData', 'shapeData']);
      return {
        canvasData,
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        backgroundColor: canvas.backgroundColor || '#ffffff',
      };
    } catch (error) {
      console.error('Failed to get preview data:', error);
      return null;
    }
  }, [canvas]);

  // Load design on mount
  useEffect(() => {
    if (canvas && designId) {
      loadDesign();
    }
    // Cleanup retry timeout on unmount or when dependencies change
    return () => {
      if (loadDesignRetryTimeoutRef.current) {
        clearTimeout(loadDesignRetryTimeoutRef.current);
      }
    };
  }, [canvas, designId, loadDesign]);

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
      'path:created',
      'text:changed',
      'canvas:background:changed',
    ];

    events.forEach((event) => {
      canvas.on(event, handleCanvasChange);
    });

    return () => {
      events.forEach((event) => {
        canvas.off(event, handleCanvasChange);
      });
    };
  }, [canvas, enabled, handleCanvasChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    hasUnsavedChanges,
    lastSaved,
    saveNow,
    loadDesign,
    getPreviewData,
    undo,
    redo,
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < history.length - 1,
  };
}
