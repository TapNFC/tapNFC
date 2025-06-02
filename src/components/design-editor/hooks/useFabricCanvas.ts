import { useCallback, useEffect, useRef, useState } from 'react';

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
  const initializationRef = useRef(false);

  const calculateCanvasDimensions = useCallback((): CanvasDimensions => {
    if (!containerRef.current) {
      // Set mobile as default - iPhone 14 dimensions
      return { width: 375, height: 667 };
    }

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 64; // Account for padding
    const containerHeight = container.clientHeight - 64;

    // Mobile-first approach: Start with mobile dimensions and scale up if needed
    const mobileWidth = 375;
    const mobileHeight = 667;

    // Calculate scale factor to fit in container while maintaining mobile aspect ratio
    const scaleX = containerWidth / mobileWidth;
    const scaleY = containerHeight / mobileHeight;
    const scale = Math.min(scaleX, scaleY, 2); // Cap at 2x for readability

    // Apply scale but ensure minimum mobile size
    const width = Math.max(mobileWidth, mobileWidth * scale);
    const height = Math.max(mobileHeight, mobileHeight * scale);

    return { width, height };
  }, []);

  const initializeCanvas = useCallback(async () => {
    // Prevent multiple initializations
    if (initializationRef.current || !canvasRef.current || !containerRef.current) {
      return;
    }

    initializationRef.current = true;

    try {
      const fabricLib = await loadFabric();
      if (!fabricLib) {
        setFabricError('Failed to load Fabric.js library');
        initializationRef.current = false;
        return;
      }

      const { width, height } = calculateCanvasDimensions();

      const fabricCanvas = new fabricLib.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      });

      // Add selection event listeners
      fabricCanvas.on('selection:created', (e: any) => {
        onSelectionCreated?.(e.selected[0]);
      });

      fabricCanvas.on('selection:updated', (e: any) => {
        onSelectionUpdated?.(e.selected[0]);
      });

      fabricCanvas.on('selection:cleared', () => {
        onSelectionCleared?.();
      });

      console.warn('Canvas initialized:', {
        width,
        height,
        fabricVersion: fabricLib.version,
      });

      setCanvas(fabricCanvas);
      setIsCanvasReady(true);
      setFabricError(null);

      // Handle window resize
      const handleResize = () => {
        const { width: newWidth, height: newHeight } = calculateCanvasDimensions();
        fabricCanvas.setDimensions({
          width: newWidth,
          height: newHeight,
        });
        fabricCanvas.renderAll();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        fabricCanvas.dispose();
        initializationRef.current = false;
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      setFabricError(`Canvas initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      initializationRef.current = false;
      return undefined;
    }
  }, [calculateCanvasDimensions]);

  useEffect(() => {
    // Only initialize once
    if (!initializationRef.current) {
      initializeCanvas();
    }
  }, []); // Empty dependency array to run only once

  // Separate effect for event listener updates
  useEffect(() => {
    if (canvas) {
      // Remove existing listeners
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');

      // Add new listeners
      canvas.on('selection:created', (e: any) => {
        onSelectionCreated?.(e.selected[0]);
      });

      canvas.on('selection:updated', (e: any) => {
        onSelectionUpdated?.(e.selected[0]);
      });

      canvas.on('selection:cleared', () => {
        onSelectionCleared?.();
      });
    }
  }, [canvas, onSelectionCreated, onSelectionUpdated, onSelectionCleared]);

  return {
    canvasRef,
    canvas,
    isCanvasReady,
    fabricError,
    fabric,
  };
}
