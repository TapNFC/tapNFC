import { useEffect } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';
import { normalizeTextObjects } from '@/utils/textUtils';
import { DESIGN_EDITOR_CONFIG } from '../constants';
import { isCanvasContextReady, safeLoadFromJSON, safeRenderAll, safeSetBackgroundColor, safeSetDimensions } from '../utils/canvasSafety';

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
  useEffect(() => {
    if (!canvas || !isCanvasReady || isDesignLoaded) {
      return;
    }

    let retryCount = 0;

    const loadFromSupabase = async () => {
      try {
        console.warn('Loading design from Supabase:', designId);

        // Check if canvas context is ready before proceeding
        if (!isCanvasContextReady(canvas)) {
          console.warn('Canvas context not ready, retrying...');
          retryCount++;
          if (retryCount < 3) {
            setTimeout(loadFromSupabase, 1000);
            return;
          } else {
            console.error('Canvas context failed to become ready after retries');
            toast.error('Canvas initialization failed');
            setIsDesignLoaded(true);
            return;
          }
        }

        // Fetch design from Supabase
        const design = await designService.getDesignById(designId);

        if (design) {
          // Set canvas dimensions from top-level design properties (priority)
          if (design.width && design.height) {
            const success = safeSetDimensions(canvas, {
              width: design.width,
              height: design.height,
            });
            if (success) {
              console.warn('Canvas dimensions set from design record:', { width: design.width, height: design.height });
            } else {
              console.warn('Failed to set canvas dimensions from design record - canvas not ready');
            }
          } else if (design.canvas_data?.width && design.canvas_data?.height) {
            // Fallback to canvas_data dimensions
            const success = safeSetDimensions(canvas, {
              width: design.canvas_data.width,
              height: design.canvas_data.height,
            });
            if (success) {
              console.warn('Canvas dimensions set from canvas_data:', { width: design.canvas_data.width, height: design.canvas_data.height });
            } else {
              console.warn('Failed to set canvas dimensions from canvas_data - canvas not ready');
            }
          }

          // Set background color from top-level design properties (priority)
          if (design.background_color) {
            const bgSuccess = safeSetBackgroundColor(canvas, design.background_color);
            if (bgSuccess) {
              console.warn('Background color set from design record:', design.background_color);
            } else {
              console.warn('Failed to set background color from design record - canvas not ready');
            }
          } else if (design.canvas_data?.backgroundColor) {
            // Fallback to canvas_data background color
            const bgSuccess = safeSetBackgroundColor(canvas, design.canvas_data.backgroundColor);
            if (bgSuccess) {
              console.warn('Background color set from canvas_data:', design.canvas_data.backgroundColor);
            } else {
              console.warn('Failed to set background color from canvas_data - canvas not ready');
            }
          }

          if (design?.canvas_data?.canvasJSON) {
            const canvasDataToLoad = design.canvas_data.canvasJSON;

            // Use safeLoadFromJSON instead of direct canvas.loadFromJSON
            const success = safeLoadFromJSON(canvas, canvasDataToLoad, (_loadedCanvas, error) => {
              if (error) {
                console.error('Error loading design from JSON:', error);
                toast.error('Error loading design');
                setIsDesignLoaded(true);
                return;
              }

              try {
                // Normalize text objects to ensure they don't have scaling issues
                normalizeTextObjects(canvas);

                // Use safe render all
                const renderSuccess = safeRenderAll(canvas);
                if (renderSuccess) {
                  setIsDesignLoaded(true);
                  console.warn('Design loaded successfully from Supabase');
                } else {
                  console.warn('Design loaded but rendering failed');
                  setIsDesignLoaded(true);
                }
              } catch (renderError) {
                console.error('Error during canvas rendering after load:', renderError);
                toast.error('Error rendering design');
                setIsDesignLoaded(true);
              }
            });

            if (!success) {
              console.error('Failed to initiate design loading');
              toast.error('Failed to load design');
              setIsDesignLoaded(true);
            }
            return;
          } else {
            // No canvas data, just render with dimensions and background
            const renderSuccess = safeRenderAll(canvas);
            if (renderSuccess) {
              console.warn('Design loaded successfully (no canvas data)');
            } else {
              console.warn('Failed to render empty canvas');
            }
            setIsDesignLoaded(true);
            return;
          }
        }

        // No existing design found in Supabase, create a new empty canvas
        console.warn('No existing design found in Supabase, starting with empty canvas');

        // Initialize with default canvas settings
        const success = safeSetDimensions(canvas, {
          width: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.WIDTH,
          height: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.HEIGHT,
        });

        if (!success) {
          console.warn('Failed to set default canvas dimensions - canvas not ready');
        }

        const bgSuccess = safeSetBackgroundColor(canvas, DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.BACKGROUND_COLOR);
        if (!bgSuccess) {
          console.warn('Failed to set default background color - canvas not ready');
        }

        setIsDesignLoaded(true);
      } catch (error) {
        console.error('Error loading design from Supabase:', error);
        toast.error('Error loading design');
        setIsDesignLoaded(true);
      }
    };

    // Add a small delay to ensure canvas is fully initialized
    const timeout = setTimeout(loadFromSupabase, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [canvas, isCanvasReady, designId, isDesignLoaded, setIsDesignLoaded]);
}
