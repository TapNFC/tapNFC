import { useCallback, useRef, useState } from 'react';

type UseCanvasHistoryOptions = {
  canvas: any;
  maxHistorySize?: number;
};

export function useCanvasHistory({
  canvas,
  maxHistorySize = 50,
}: UseCanvasHistoryOptions) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const historyStack = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const isPerformingHistoryAction = useRef(false);

  // Save current canvas state to history
  const saveState = useCallback(() => {
    if (!canvas || isPerformingHistoryAction.current) {
      return;
    }

    try {
      const canvasState = JSON.stringify(canvas.toJSON(['elementType', 'buttonData', 'linkData', 'url', 'urlType', 'name', 'svgCode', 'isSvgIcon']));

      // Remove any states after current index (when undoing then making new changes)
      historyStack.current = historyStack.current.slice(0, historyIndex.current + 1);

      // Add new state
      historyStack.current.push(canvasState);

      // Limit history size
      if (historyStack.current.length > maxHistorySize) {
        historyStack.current = historyStack.current.slice(-maxHistorySize);
      }

      historyIndex.current = historyStack.current.length - 1;

      // Update button states
      setCanUndo(historyIndex.current > 0);
      setCanRedo(false); // Can't redo after new action
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [canvas, maxHistorySize]);

  // Undo last action
  const undo = useCallback(() => {
    if (!canvas || historyIndex.current <= 0) {
      return;
    }

    try {
      isPerformingHistoryAction.current = true;

      historyIndex.current--;
      const previousState = historyStack.current[historyIndex.current];

      if (previousState) {
        canvas.loadFromJSON(previousState, () => {
          canvas.renderAll();
          isPerformingHistoryAction.current = false;

          // Update button states
          setCanUndo(historyIndex.current > 0);
          setCanRedo(historyIndex.current < historyStack.current.length - 1);
        });
      } else {
        isPerformingHistoryAction.current = false;
      }
    } catch (error) {
      console.error('Error during undo:', error);
      isPerformingHistoryAction.current = false;
    }
  }, [canvas]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas || historyIndex.current >= historyStack.current.length - 1) {
      return;
    }

    try {
      isPerformingHistoryAction.current = true;

      historyIndex.current++;
      const nextState = historyStack.current[historyIndex.current];

      if (nextState) {
        canvas.loadFromJSON(nextState, () => {
          canvas.renderAll();
          isPerformingHistoryAction.current = false;

          // Update button states
          setCanUndo(historyIndex.current > 0);
          setCanRedo(historyIndex.current < historyStack.current.length - 1);
        });
      } else {
        isPerformingHistoryAction.current = false;
      }
    } catch (error) {
      console.error('Error during redo:', error);
      isPerformingHistoryAction.current = false;
    }
  }, [canvas]);

  // Initialize history with initial canvas state
  const initializeHistory = useCallback(() => {
    if (!canvas) {
      return;
    }

    try {
      const initialState = JSON.stringify(canvas.toJSON(['elementType', 'buttonData', 'linkData', 'url', 'name', 'svgCode', 'isSvgIcon']));
      historyStack.current = [initialState];
      historyIndex.current = 0;
      setCanUndo(false);
      setCanRedo(false);
    } catch (error) {
      console.error('Error initializing history:', error);
    }
  }, [canvas]);

  // Clear history
  const clearHistory = useCallback(() => {
    historyStack.current = [];
    historyIndex.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  // Get current history info
  const getHistoryInfo = useCallback(() => {
    return {
      currentIndex: historyIndex.current,
      historyLength: historyStack.current.length,
      canUndo,
      canRedo,
    };
  }, [canUndo, canRedo]);

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    initializeHistory,
    clearHistory,
    getHistoryInfo,
    isPerformingHistoryAction: () => isPerformingHistoryAction.current,
  };
}
