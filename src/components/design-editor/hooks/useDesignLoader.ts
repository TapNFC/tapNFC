import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';
import { normalizeTextObjects } from '@/utils/textUtils';
import { DESIGN_EDITOR_CONFIG } from '../constants';

type UseDesignLoaderProps = {
  canvas: any;
  isCanvasReady: boolean;
  designId: string;
  isDesignLoaded: boolean;
  setIsDesignLoaded: (loaded: boolean) => void;
};

export function useDesignLoader({
  canvas,
  isCanvasReady,
  designId,
  isDesignLoaded,
  setIsDesignLoaded,
}: UseDesignLoaderProps) {
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  useEffect(() => {
    if (!canvas || !isCanvasReady || isDesignLoaded) {
      return;
    }

    const loadFromSupabase = async (): Promise<boolean> => {
      try {
        console.warn('Loading design from Supabase:', designId);

        // Fetch design from Supabase
        const design = await designService.getDesignById(designId);

        if (design) {
          // Set canvas dimensions from top-level design properties (priority)
          if (design.width && design.height) {
            canvas.setDimensions?.({
              width: design.width,
              height: design.height,
            });
            console.warn('Canvas dimensions set from design record:', { width: design.width, height: design.height });
          } else if (design.canvas_data?.width && design.canvas_data?.height) {
            // Fallback to canvas_data dimensions
            canvas.setDimensions?.({
              width: design.canvas_data.width,
              height: design.canvas_data.height,
            });
            console.warn('Canvas dimensions set from canvas_data:', { width: design.canvas_data.width, height: design.canvas_data.height });
          }

          // Set background color from top-level design properties (priority)
          if (design.background_color) {
            canvas.setBackgroundColor?.(design.background_color, () => {
              canvas.renderAll?.();
            });
            console.warn('Background color set from design record:', design.background_color);
          } else if (design.canvas_data?.backgroundColor) {
            // Fallback to canvas_data background
            canvas.setBackgroundColor?.(design.canvas_data.backgroundColor, () => {
              canvas.renderAll?.();
            });
            console.warn('Background color set from canvas_data:', design.canvas_data.backgroundColor);
          }

          if (design?.canvas_data?.canvasJSON) {
            const canvasDataToLoad = design.canvas_data.canvasJSON;

            if (!canvasDataToLoad.objects) {
              console.warn('Canvas data is missing objects array, creating empty array');
              canvasDataToLoad.objects = [];
            }

            canvas.loadFromJSON?.(canvasDataToLoad, () => {
              try {
                // Normalize text objects to ensure they don't have scaling issues
                normalizeTextObjects(canvas);

                canvas.renderAll?.();
                setIsDesignLoaded(true);
                console.warn('Design loaded successfully from Supabase');
              } catch (renderError) {
                console.error('Error during canvas rendering after load:', renderError);
                toast.error('Error rendering design');
                setIsDesignLoaded(true);
              }
            });
            return true;
          } else {
            // No canvas data, just render with dimensions and background
            canvas.renderAll?.();
            setIsDesignLoaded(true);
            console.warn('Design loaded successfully (no canvas data)');
            return true;
          }
        }

        // No existing design found in Supabase
        console.warn('No existing design found in Supabase, starting with empty canvas');
        return false;
      } catch (error) {
        console.error('Error loading design from Supabase:', error);
        return false;
      }
    };

    const initializeEmptyCanvas = () => {
      // Initialize with default canvas settings
      canvas.setDimensions?.({
        width: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.WIDTH,
        height: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.HEIGHT,
      });

      canvas.setBackgroundColor?.(DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.BACKGROUND_COLOR, () => {
        canvas.renderAll?.();
      });

      setIsDesignLoaded(true);
      console.warn('Empty canvas initialized with default settings');
    };

    const loadExistingDesign = async () => {
      try {
        // Ensure the canvas context is available before attempting to load or clear
        if (!canvas.contextContainer) {
          console.warn('Canvas contextContainer not ready, delaying loadExistingDesign.');
          const contextTimeout = setTimeout(() => {
            if (!isDesignLoaded && isCanvasReady && canvas && canvas.contextContainer) {
              loadExistingDesign();
            } else if (!isDesignLoaded && isCanvasReady && canvas && !canvas.contextContainer) {
              console.error('Canvas contextContainer still not ready after delay. Aborting load.');
              initializeEmptyCanvas();
            }
          }, DESIGN_EDITOR_CONFIG.CANVAS_CONTEXT_DELAY);

          // Clean up timeout if component unmounts
          return () => clearTimeout(contextTimeout);
        }

        // Try to load from Supabase
        const designLoaded = await loadFromSupabase();

        if (!designLoaded && retryCountRef.current < maxRetries) {
          // Retry loading the design (useful for newly created designs)
          retryCountRef.current++;
          console.warn(`Design ${designId} not found, retrying... (${retryCountRef.current}/${maxRetries})`);
          console.warn('This commonly happens with newly created designs that need time to be committed to the database.');

          const retryTimeout = setTimeout(() => {
            if (!isDesignLoaded) {
              loadExistingDesign();
            }
          }, retryDelay);

          // Clean up timeout if component unmounts
          return () => clearTimeout(retryTimeout);
        }

        if (!designLoaded) {
          // After max retries, initialize empty canvas
          console.warn(`Design ${designId} not found after ${maxRetries} retries, initializing empty canvas`);
          console.warn('This may indicate the design was deleted or there is a database issue.');
          initializeEmptyCanvas();
        }

        return undefined;
      } catch (error) {
        console.error('Error loading existing design:', error);
        toast.error('Error loading design');
        initializeEmptyCanvas();
        return undefined;
      }
    };

    loadExistingDesign();
  }, [canvas, isCanvasReady, designId, isDesignLoaded, setIsDesignLoaded]);
}
