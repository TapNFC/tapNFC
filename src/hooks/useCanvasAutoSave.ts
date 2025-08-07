import type { Canvas, Gradient, Pattern } from 'fabric/fabric-impl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';
import { createClient } from '@/utils/supabase/client';

// Define the return type for the hook
type UseCanvasAutoSaveReturn = {
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  saveNow: () => Promise<boolean>;
  getPreviewData: () => any;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

// Define the options for the hook
type UseCanvasAutoSaveOptions = {
  canvas: Canvas | null;
  designId: string;
  autoSaveInterval?: number;
  enabled?: boolean;
};

/**
 * Custom hook to handle auto-saving canvas state to Supabase
 */
export function useCanvasAutoSave({
  canvas,
  designId,
  autoSaveInterval = 30000, // Default to 30 seconds
  enabled = true,
}: UseCanvasAutoSaveOptions): UseCanvasAutoSaveReturn {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Use refs for history to avoid re-renders
  const historyRef = useRef<any[]>([]);
  const historyPositionRef = useRef<number>(-1);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstSaveRef = useRef<boolean>(true);

  // Get the current user ID
  const getUserId = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  }, []);

  // Function to save the canvas state to Supabase
  const saveCanvasState = useCallback(async (): Promise<boolean> => {
    if (!canvas || !designId) {
      return false;
    }

    try {
      // Serialize the entire canvas state, including the background
      const canvasJSON = canvas.toJSON(['id', 'selectable', 'lockMovementX', 'lockMovementY', 'editable', 'hasControls', 'linkUrl', 'background', 'elementType', 'buttonData', 'linkData', 'url', 'name']);

      // Get existing design to update or check if it's new
      const existingDesign = await designService.getDesignById(designId);

      if (existingDesign) {
        // --- UPDATE EXISTING DESIGN ---
        const result = await designService.updateDesign(designId, {
          canvas_data: canvasJSON, // Save the entire canvas JSON
          updated_at: new Date().toISOString(),
        });

        if (result) {
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
          return true;
        }
      } else {
        // --- CREATE NEW DESIGN ---
        const userId = await getUserId();
        if (!userId) {
          toast.error('You must be logged in to save designs');
          return false;
        }

        // 1. Create the design record FIRST
        const newDesign = await designService.createDesign({
          id: designId,
          user_id: userId,
          name: `Design ${designId.slice(-8)}`,
          canvas_data: canvasJSON, // Save the entire canvas JSON
          is_template: false,
          is_public: true,
        });

        if (!newDesign) {
          toast.error('Failed to create new design record.');
          return false;
        }

        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to save canvas state:', error);
      toast.error('Failed to save your design');
      return false;
    }
  }, [canvas, designId, getUserId]);

  // Function to manually save the canvas state
  const saveNow = useCallback(async (): Promise<boolean> => {
    if (!canvas || !designId) {
      return false;
    }

    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Show toast notification
    const toastId = toast.loading('Saving your design...');

    try {
      const success = await saveCanvasState();

      if (success) {
        toast.success('Design saved successfully', { id: toastId });

        // Add to history if it's the first save or if there are unsaved changes
        if (isFirstSaveRef.current || hasUnsavedChanges) {
          const canvasJSON = canvas.toJSON(['id', 'selectable', 'lockMovementX', 'lockMovementY', 'editable', 'hasControls', 'linkUrl', 'background', 'elementType', 'buttonData', 'linkData', 'url', 'name']);

          // If we've gone back in history and made changes, remove future states
          if (historyPositionRef.current < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, historyPositionRef.current + 1);
          }

          // Add current state to history
          historyRef.current.push(canvasJSON);
          historyPositionRef.current = historyRef.current.length - 1;

          // Update undo/redo state
          setCanUndo(historyPositionRef.current > 0);
          setCanRedo(false);

          isFirstSaveRef.current = false;
        }

        return true;
      } else {
        toast.error('Failed to save design', { id: toastId });
        return false;
      }
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Error saving design', { id: toastId });
      return false;
    }
  }, [canvas, designId, hasUnsavedChanges, saveCanvasState]);

  // Function to get preview data for real-time preview
  const getPreviewData = useCallback(() => {
    if (!canvas) {
      return null;
    }

    try {
      const canvasJSON = canvas.toJSON(['id', 'selectable', 'lockMovementX', 'lockMovementY', 'editable', 'hasControls', 'linkUrl', 'background', 'elementType', 'buttonData', 'linkData', 'url', 'name']);

      const result = {
        canvasData: canvasJSON,
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        backgroundColor: canvas.backgroundColor || '#ffffff', // Removed .toString()
      };

      return result;
    } catch {
      return null;
    }
  }, [canvas]);

  // Function to handle undo
  const undo = useCallback(() => {
    if (!canvas || historyPositionRef.current <= 0) {
      return;
    }

    historyPositionRef.current -= 1;
    const previousState = historyRef.current[historyPositionRef.current];

    if (previousState) {
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setCanUndo(historyPositionRef.current > 0);
        setCanRedo(historyPositionRef.current < historyRef.current.length - 1);
        setHasUnsavedChanges(true);
      });
    }
  }, [canvas]);

  // Function to handle redo
  const redo = useCallback(() => {
    if (!canvas || historyPositionRef.current >= historyRef.current.length - 1) {
      return;
    }

    historyPositionRef.current += 1;
    const nextState = historyRef.current[historyPositionRef.current];

    if (nextState) {
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        setCanUndo(historyPositionRef.current > 0);
        setCanRedo(historyPositionRef.current < historyRef.current.length - 1);
        setHasUnsavedChanges(true);
      });
    }
  }, [canvas]);

  // Load initial state when canvas is ready
  useEffect(() => {
    if (!canvas || !enabled) {
      return;
    }

    const loadInitialState = async () => {
      try {
        const design = await designService.getDesignById(designId);

        if (design && design.canvas_data) {
          // Load the entire canvas state from the saved JSON
          canvas.loadFromJSON(design.canvas_data, () => {
            canvas.renderAll();

            // Initialize history with current state
            const initialState = canvas.toJSON(['id', 'selectable', 'lockMovementX', 'lockMovementY', 'editable', 'hasControls', 'linkUrl', 'background', 'elementType', 'buttonData', 'linkData', 'url', 'name']);
            historyRef.current = [initialState];
            historyPositionRef.current = 0;
            setCanUndo(false);
            setCanRedo(false);

            setLastSaved(new Date(design.updated_at));
            setHasUnsavedChanges(false);
            isFirstSaveRef.current = false;
          });
        } else {
          // Initialize history with empty canvas
          const initialState = canvas.toJSON(['id', 'selectable', 'lockMovementX', 'lockMovementY', 'editable', 'hasControls', 'linkUrl', 'background', 'elementType', 'buttonData', 'linkData', 'url', 'name']);
          historyRef.current = [initialState];
          historyPositionRef.current = 0;
          setCanUndo(false);
          setCanRedo(false);

          isFirstSaveRef.current = true;
          // For a new design, we consider it to have unsaved changes immediately
          setHasUnsavedChanges(true);
        }
      } catch (error) {
        console.error('Failed to load initial state:', error);
        toast.error('Failed to load design');
      }
    };

    loadInitialState();
  }, [canvas, designId, enabled]);

  // Setup canvas change detection
  useEffect(() => {
    if (!canvas || !enabled) {
      return;
    }

    const handleCanvasChange = () => {
      setHasUnsavedChanges(true);

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set a new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        saveNow();
      }, autoSaveInterval);
    };

    // Add event listeners for canvas changes
    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);
    canvas.on('object:modified', handleCanvasChange);

    // Custom event for background changes
    const originalSetBackgroundColor = canvas.setBackgroundColor.bind(canvas);
    canvas.setBackgroundColor = ((
      backgroundColor: string | Pattern | Gradient,
      callback?: (canvas: Canvas) => void,
    ) => {
      originalSetBackgroundColor(backgroundColor, (renderedCanvas: Canvas) => {
        if (callback) {
          callback(renderedCanvas);
        }
        handleCanvasChange();
      });
      return canvas;
    }) as any;

    // Cleanup function
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      canvas.off('object:added', handleCanvasChange);
      canvas.off('object:removed', handleCanvasChange);
      canvas.off('object:modified', handleCanvasChange);

      // Restore original setBackgroundColor method on cleanup
      canvas.setBackgroundColor = originalSetBackgroundColor;
    };
  }, [canvas, designId, enabled, autoSaveInterval, saveNow]);

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges && canvas) {
        saveCanvasState();
      }
    };
  }, [hasUnsavedChanges, canvas, saveCanvasState]);

  return {
    hasUnsavedChanges,
    lastSaved,
    saveNow,
    getPreviewData,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
