import { useEffect } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';
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
  useEffect(() => {
    if (!canvas || !isCanvasReady || isDesignLoaded) {
      return;
    }

    const loadFromSupabase = async () => {
      try {
        console.warn('Loading design from Supabase:', designId);

        // Fetch design from Supabase
        const design = await designService.getDesignById(designId);

        if (design?.canvas_data?.canvasJSON) {
          const canvasDataToLoad = design.canvas_data.canvasJSON;

          if (!canvasDataToLoad.objects) {
            console.warn('Canvas data is missing objects array, creating empty array');
            canvasDataToLoad.objects = [];
          }

          canvas.loadFromJSON?.(canvasDataToLoad, () => {
            try {
              // Set canvas dimensions if available
              if (design.canvas_data.width && design.canvas_data.height) {
                canvas.setDimensions?.({
                  width: design.canvas_data.width,
                  height: design.canvas_data.height,
                });
              }

              // Set background color if available
              if (design.canvas_data.backgroundColor) {
                canvas.setBackgroundColor?.(design.canvas_data.backgroundColor, () => {
                  canvas.renderAll?.();
                });
              } else {
                canvas.renderAll?.();
              }

              setIsDesignLoaded(true);
              console.warn('Design loaded successfully from Supabase');
            } catch (renderError) {
              console.error('Error during canvas rendering after load:', renderError);
              toast.error('Error rendering design');
              setIsDesignLoaded(true);
            }
          });
          return;
        }

        // No existing design found in Supabase, create a new empty canvas
        console.warn('No existing design found in Supabase, starting with empty canvas');

        // Initialize with default canvas settings
        canvas.setDimensions?.({
          width: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.WIDTH,
          height: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.HEIGHT,
        });

        canvas.setBackgroundColor?.(DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.BACKGROUND_COLOR, () => {
          canvas.renderAll?.();
        });

        setIsDesignLoaded(true);
      } catch (error) {
        console.error('Error loading design from Supabase:', error);
        toast.error('Error loading design');
        setIsDesignLoaded(true);
      }
    };

    const loadExistingDesign = async () => {
      try {
        // Ensure the canvas context is available before attempting to load or clear
        if (!canvas.contextContainer) {
          console.warn('Canvas contextContainer not ready, delaying loadExistingDesign.');
          setTimeout(() => {
            if (!isDesignLoaded && isCanvasReady && canvas && canvas.contextContainer) {
              loadExistingDesign();
            } else if (!isDesignLoaded && isCanvasReady && canvas && !canvas.contextContainer) {
              console.error('Canvas contextContainer still not ready after delay. Aborting load.');
              setIsDesignLoaded(true);
            }
          }, DESIGN_EDITOR_CONFIG.CANVAS_CONTEXT_DELAY);
          return;
        }

        // Load from Supabase
        await loadFromSupabase();
      } catch (error) {
        console.error('Error loading existing design:', error);
        toast.error('Error loading design');
        setIsDesignLoaded(true);
      }
    };

    loadExistingDesign();
  }, [canvas, isCanvasReady, designId, isDesignLoaded, setIsDesignLoaded]);
}
