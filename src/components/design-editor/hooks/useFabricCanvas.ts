import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DESIGN_EDITOR_CONFIG } from '../constants';
import { isCanvasContextReady, safeSetDimensions } from '../utils/canvasSafety';

// Increase Node.js event listener limit to prevent memory leak warnings
if (typeof process !== 'undefined' && process.setMaxListeners) {
  process.setMaxListeners(20);
}

// Import fabric properly with error handling
let fabric: any = null;
let fabricLoaded = false;

const loadFabric = async () => {
  if (typeof window !== 'undefined' && !fabricLoaded) {
    try {
      const fabricModule = await import('fabric');
      fabric = fabricModule.fabric;
      fabricLoaded = true;
      console.warn('Fabric.js loaded successfully');
    } catch (error) {
      console.error('Failed to load Fabric.js:', error);
    }
  }
  return fabric;
};

type CanvasDimensions = {
  width: number;
  height: number;
};

type UseFabricCanvasOptions = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelectionCreated?: (object: any) => void;
  onSelectionUpdated?: (object: any) => void;
  onSelectionCleared?: () => void;
};

export function useFabricCanvas({
  containerRef,
  onSelectionCreated,
  onSelectionUpdated,
  onSelectionCleared,
}: UseFabricCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [fabricError, setFabricError] = useState<string | null>(null);
  const [guideControls, setGuideControls] = useState<any>(null);
  const initializationRef = useRef(false);
  const canvasInitializedRef = useRef(false);
  const contextReadyRef = useRef(false);

  // Memoize canvas configuration to prevent recreation
  const canvasConfig = useMemo(() => ({
    selection: true,
    preserveObjectStacking: true,
  }), []);

  // Check if canvas context is truly ready
  // const isContextReady = useCallback((fabricCanvas: any) => {
  //   return isCanvasContextReady(fabricCanvas);
  // }, []);

  // Wait for context to be ready with timeout
  const waitForContext = useCallback((fabricCanvas: any, maxWaitTime = 2000): Promise<boolean> => {
    return new Promise((resolve) => {
      const startTime = Date.now();

      const checkContext = () => {
        if (isCanvasContextReady(fabricCanvas)) {
          contextReadyRef.current = true;
          resolve(true);
          return;
        }

        const elapsed = Date.now() - startTime;
        if (elapsed >= maxWaitTime) {
          console.warn('Canvas context not ready after timeout, proceeding anyway');
          resolve(false);
          return;
        }

        // Check again in 50ms
        setTimeout(checkContext, 50);
      };

      checkContext();
    });
  }, []);

  // Alignment guide utilities
  const initializeAlignmentGuides = (canvas: any, fabric: any) => {
    let guidelines: any[] = [];
    let isGuidesEnabled = true;

    // Simplified guide line creation without text indicators
    const createGuideLine = (points: number[], options: any = {}) => {
      return new fabric.Line(points, {
        stroke: '#3b82f6',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        opacity: 0.8,
        ...options,
      });
    };

    const clearGuidelines = () => {
      guidelines.forEach((guide) => {
        canvas.remove(guide);
      });
      guidelines = [];
    };

    const getSnapPoints = (movingObject: any) => {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const objects = canvas.getObjects().filter((obj: any) =>
        obj !== movingObject
        && obj.visible !== false
        && !obj.excludeFromExport
        && obj.selectable !== false,
      );

      const snapPoints = {
        vertical: [0, canvasWidth / 2, canvasWidth],
        horizontal: [0, canvasHeight / 2, canvasHeight],
      };

      // Add snap points from other objects
      objects.forEach((obj: any) => {
        const bound = obj.getBoundingRect();

        // Vertical lines (x positions)
        snapPoints.vertical.push(
          bound.left, // Left edge
          bound.left + bound.width / 2, // Center
          bound.left + bound.width, // Right edge
        );

        // Horizontal lines (y positions)
        snapPoints.horizontal.push(
          bound.top, // Top edge
          bound.top + bound.height / 2, // Center
          bound.top + bound.height, // Bottom edge
        );
      });

      // Remove duplicates and sort
      snapPoints.vertical = [...new Set(snapPoints.vertical)].sort((a, b) => a - b);
      snapPoints.horizontal = [...new Set(snapPoints.horizontal)].sort((a, b) => a - b);

      return snapPoints;
    };

    const showGuidelines = (movingObject: any) => {
      if (!isGuidesEnabled) {
        return;
      }

      clearGuidelines();

      const bound = movingObject.getBoundingRect();
      const snapPoints = getSnapPoints(movingObject);
      const threshold = 10 / canvas.getZoom(); // Snap threshold

      const objLeft = bound.left;
      const objRight = bound.left + bound.width;
      const objTop = bound.top;
      const objBottom = bound.top + bound.height;
      const objCenterX = bound.left + bound.width / 2;
      const objCenterY = bound.top + bound.height / 2;

      const canvasHeight = canvas.getHeight();
      const canvasWidth = canvas.getWidth();

      // Check for vertical alignment
      snapPoints.vertical.forEach((snapX) => {
        const distances = [
          Math.abs(objLeft - snapX),
          Math.abs(objRight - snapX),
          Math.abs(objCenterX - snapX),
        ];

        const minDistance = Math.min(...distances);

        if (minDistance <= threshold) {
          // Show vertical guide line
          const guideLine = createGuideLine([snapX, 0, snapX, canvasHeight]);
          canvas.add(guideLine);
          guidelines.push(guideLine);
        }
      });

      // Check for horizontal alignment
      snapPoints.horizontal.forEach((snapY) => {
        const distances = [
          Math.abs(objTop - snapY),
          Math.abs(objBottom - snapY),
          Math.abs(objCenterY - snapY),
        ];

        const minDistance = Math.min(...distances);

        if (minDistance <= threshold) {
          // Show horizontal guide line
          const guideLine = createGuideLine([0, snapY, canvasWidth, snapY]);
          canvas.add(guideLine);
          guidelines.push(guideLine);
        }
      });

      // Use safe render with inline check
      if (canvas.contextContainer && typeof canvas.contextContainer.clearRect === 'function') {
        canvas.renderAll();
      }
    };

    const snapToGuidelines = (movingObject: any) => {
      if (!isGuidesEnabled) {
        return;
      }

      const bound = movingObject.getBoundingRect();
      const snapPoints = getSnapPoints(movingObject);
      const threshold = 10 / canvas.getZoom();

      let newLeft = movingObject.left;
      let newTop = movingObject.top;

      const objLeft = bound.left;
      const objRight = bound.left + bound.width;
      const objTop = bound.top;
      const objBottom = bound.top + bound.height;
      const objCenterX = bound.left + bound.width / 2;
      const objCenterY = bound.top + bound.height / 2;

      // Snap to vertical guidelines
      snapPoints.vertical.forEach((snapX) => {
        // Left edge snap
        if (Math.abs(objLeft - snapX) <= threshold) {
          newLeft = movingObject.left + (snapX - objLeft);
        } else if (Math.abs(objRight - snapX) <= threshold) { // Right edge snap
          newLeft = movingObject.left + (snapX - objRight);
        } else if (Math.abs(objCenterX - snapX) <= threshold) { // Center snap
          newLeft = movingObject.left + (snapX - objCenterX);
        }
      });

      // Snap to horizontal guidelines
      snapPoints.horizontal.forEach((snapY) => {
        // Top edge snap
        if (Math.abs(objTop - snapY) <= threshold) {
          newTop = movingObject.top + (snapY - objTop);
        } else if (Math.abs(objBottom - snapY) <= threshold) { // Bottom edge snap
          newTop = movingObject.top + (snapY - objBottom);
        } else if (Math.abs(objCenterY - snapY) <= threshold) { // Center snap
          newTop = movingObject.top + (snapY - objCenterY);
        }
      });

      // Apply the new position
      movingObject.set({
        left: newLeft,
        top: newTop,
      });
    };

    const handleObjectMoving = (e: any) => {
      showGuidelines(e.target);
      snapToGuidelines(e.target);
    };

    const handleObjectModified = () => {
      clearGuidelines();
    };

    const handleSelectionCleared = () => {
      clearGuidelines();
    };

    const handleObjectMoved = () => {
      clearGuidelines();
    };

    // Add event listeners only once
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:moved', handleObjectMoved);

    // Mark as initialized and store handlers for cleanup
    canvas._alignmentGuidesInitialized = true;
    canvas._alignmentGuideHandlers = {
      handleObjectMoving,
      handleObjectModified,
      handleSelectionCleared,
      handleObjectMoved,
    };

    // Return control functions
    const controls = {
      toggleGuidelines: (enabled: boolean) => {
        isGuidesEnabled = enabled;
        if (!enabled) {
          clearGuidelines();
          // Use safe render with inline check
          if (canvas.contextContainer && typeof canvas.contextContainer.clearRect === 'function') {
            canvas.renderAll();
          }
        }
      },
      clearGuidelines,
      isEnabled: () => isGuidesEnabled,
      cleanup: () => {
        // Remove event listeners
        canvas.off('object:moving', handleObjectMoving);
        canvas.off('object:modified', handleObjectModified);
        canvas.off('selection:cleared', handleSelectionCleared);
        canvas.off('object:moved', handleObjectMoved);

        // Clear guidelines
        clearGuidelines();

        // Mark as not initialized
        canvas._alignmentGuidesInitialized = false;
        canvas._alignmentGuideHandlers = null;
      },
    };

    // Store controls on canvas for reuse
    canvas._alignmentGuides = controls;

    return controls;
  };

  const calculateCanvasDimensions = useCallback((): CanvasDimensions => {
    if (!containerRef.current) {
      // Set mobile as default from constants
      return {
        width: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.WIDTH,
        height: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.HEIGHT,
      };
    }

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 64; // Account for padding
    const containerHeight = container.clientHeight - 64;

    // Mobile-first approach: Start with mobile dimensions from constants
    const mobileWidth = DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.WIDTH;
    const mobileHeight = DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.HEIGHT;

    // Calculate scale factor to fit in container while maintaining mobile aspect ratio
    const scaleX = containerWidth / mobileWidth;
    const scaleY = containerHeight / mobileHeight;
    const scale = Math.min(scaleX, scaleY, 2); // Cap at 2x for readability

    // Apply scale but ensure minimum mobile size
    const width = Math.max(mobileWidth, mobileWidth * scale);
    const height = Math.max(mobileHeight, mobileHeight * scale);

    return { width, height };
  }, [containerRef]);

  // Memoize event handlers to prevent recreation
  const eventHandlers = useMemo(() => ({
    onSelectionCreated: (e: any) => onSelectionCreated?.(e.selected[0]),
    onSelectionUpdated: (e: any) => onSelectionUpdated?.(e.selected[0]),
    onSelectionCleared: () => onSelectionCleared?.(),
  }), [onSelectionCreated, onSelectionUpdated, onSelectionCleared]);

  const initializeCanvas = useCallback(async () => {
    // Prevent multiple initializations
    if (initializationRef.current || !canvasRef.current || !containerRef.current) {
      return null;
    }

    console.warn('Starting canvas initialization...');
    initializationRef.current = true;

    try {
      const fabricLib = await loadFabric();
      if (!fabricLib) {
        setFabricError('Failed to load Fabric.js library');
        initializationRef.current = false;
        return null;
      }

      const { width, height } = calculateCanvasDimensions();

      const fabricCanvas = new fabricLib.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.BACKGROUND_COLOR,
        ...canvasConfig,
      });

      // Add selection event listeners with named functions for proper cleanup
      const handleSelectionCreated = (e: any) => eventHandlers.onSelectionCreated(e);
      const handleSelectionUpdated = (e: any) => eventHandlers.onSelectionUpdated(e);
      const handleSelectionCleared = () => eventHandlers.onSelectionCleared();

      fabricCanvas.on('selection:created', handleSelectionCreated);
      fabricCanvas.on('selection:updated', handleSelectionUpdated);
      fabricCanvas.on('selection:cleared', handleSelectionCleared);

      // Store handlers for cleanup
      fabricCanvas._customHandlers = {
        handleSelectionCreated,
        handleSelectionUpdated,
        handleSelectionCleared,
      };

      // Initialize alignment guides
      const guides = initializeAlignmentGuides(fabricCanvas, fabricLib);
      setGuideControls(guides);

      console.warn('Canvas initialized:', {
        width,
        height,
        fabricVersion: fabricLib.version,
        alignmentGuidesEnabled: guides?.isEnabled?.() || false,
      });

      // Wait for context to be truly ready before marking canvas as ready
      const contextReady = await waitForContext(fabricCanvas);

      if (contextReady) {
        console.warn('Canvas context is ready');
      } else {
        console.warn('Canvas context readiness timeout, proceeding with caution');
      }

      setCanvas(fabricCanvas);
      setIsCanvasReady(true);
      setFabricError(null);

      // Handle window resize with throttling and cleanup
      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (fabricCanvas.isDisposed && fabricCanvas.isDisposed()) {
            return; // Canvas has been disposed, don't try to resize
          }
          try {
            // Check if canvas is safe to use before proceeding
            if (!isCanvasContextReady(fabricCanvas)) {
              console.warn('Canvas not safe during resize, skipping');
              return;
            }

            // Preserve current canvas dimensions instead of recalculating to defaults
            const currentWidth = fabricCanvas.getWidth();
            const currentHeight = fabricCanvas.getHeight();

            // Only recalculate if we don't have valid dimensions
            if (currentWidth && currentHeight && currentWidth > 0 && currentHeight > 0) {
              // Keep current dimensions - don't change them
              console.warn('Preserving current canvas dimensions during resize:', { width: currentWidth, height: currentHeight });
            } else {
              // Fallback to calculated dimensions only if current ones are invalid
              const { width: newWidth, height: newHeight } = calculateCanvasDimensions();
              const success = safeSetDimensions(fabricCanvas, {
                width: newWidth,
                height: newHeight,
              });
              if (success) {
                console.warn('Using calculated dimensions during resize (fallback):', { width: newWidth, height: newHeight });
              } else {
                console.warn('Failed to set calculated dimensions during resize - canvas not ready');
              }
            }

            // Use safe render with inline check
            if (fabricCanvas.contextContainer && typeof fabricCanvas.contextContainer.clearRect === 'function') {
              fabricCanvas.renderAll();
            }
          } catch (error) {
            console.warn('Error during canvas resize:', error);
          }
        }, 150); // Throttle resize events
      };

      window.addEventListener('resize', handleResize);

      // Return cleanup function - will be called only on component unmount
      return () => {
        if (!fabricCanvas) {
          return;
        }

        console.warn('Running canvas cleanup function...');

        // Clear resize timeout
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        // Remove window event listener
        window.removeEventListener('resize', handleResize);

        // Clean up alignment guides
        if (guides?.cleanup) {
          guides.cleanup();
        }

        // Remove custom event listeners
        if (fabricCanvas._customHandlers) {
          fabricCanvas.off('selection:created', fabricCanvas._customHandlers.handleSelectionCreated);
          fabricCanvas.off('selection:updated', fabricCanvas._customHandlers.handleSelectionUpdated);
          fabricCanvas.off('selection:cleared', fabricCanvas._customHandlers.handleSelectionCleared);
        }

        // Dispose of the canvas
        try {
          fabricCanvas.dispose();
        } catch (error) {
          console.warn('Error disposing canvas:', error);
        }

        // Reset state
        initializationRef.current = false;
        setCanvas(null);
        setIsCanvasReady(false);
        setGuideControls(null);
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      setFabricError(`Canvas initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      initializationRef.current = false;
      return null;
    }
  }, [calculateCanvasDimensions, canvasConfig, eventHandlers, containerRef]);

  // Initialization effect with proper dependency handling
  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;

    const initCanvas = async () => {
      // Only initialize once using the ref to track initialization state
      if (!canvasInitializedRef.current && !initializationRef.current) {
        canvasInitializedRef.current = true;
        try {
          const cleanup = await initializeCanvas();
          if (typeof cleanup === 'function') {
            cleanupFunction = cleanup;
          }
        } catch (error) {
          console.error('Canvas initialization failed:', error);
          canvasInitializedRef.current = false;
        }
      }
    };

    initCanvas();

    // Return cleanup function that will run on unmount
    return () => {
      if (cleanupFunction && typeof cleanupFunction === 'function') {
        // Only run cleanup when component unmounts, not on dependency changes
        if (canvasInitializedRef.current) {
          cleanupFunction();
          canvasInitializedRef.current = false;
        }
      }
    };
  }, [initializeCanvas]); // Include initializeCanvas in the dependency array

  // Separate effect for event listener updates to prevent recreation
  useEffect(() => {
    if (canvas && canvas._customHandlers) {
      // Update the handlers with new callback functions
      const handlers = canvas._customHandlers;

      // Remove existing listeners
      canvas.off('selection:created', handlers.handleSelectionCreated);
      canvas.off('selection:updated', handlers.handleSelectionUpdated);
      canvas.off('selection:cleared', handlers.handleSelectionCleared);

      // Create new handlers with updated callbacks
      const newHandleSelectionCreated = (e: any) => eventHandlers.onSelectionCreated(e);
      const newHandleSelectionUpdated = (e: any) => eventHandlers.onSelectionUpdated(e);
      const newHandleSelectionCleared = () => eventHandlers.onSelectionCleared();

      // Add new listeners
      canvas.on('selection:created', newHandleSelectionCreated);
      canvas.on('selection:updated', newHandleSelectionUpdated);
      canvas.on('selection:cleared', newHandleSelectionCleared);

      // Update stored handlers
      canvas._customHandlers = {
        handleSelectionCreated: newHandleSelectionCreated,
        handleSelectionUpdated: newHandleSelectionUpdated,
        handleSelectionCleared: newHandleSelectionCleared,
      };
    }
  }, [canvas, eventHandlers]);

  return {
    canvasRef,
    canvas,
    isCanvasReady,
    fabricError,
    fabric,
    guideControls,
    // Additional safety check for context readiness - compute this dynamically
    isContextReady: canvas ? isCanvasContextReady(canvas) : false,
  };
}
