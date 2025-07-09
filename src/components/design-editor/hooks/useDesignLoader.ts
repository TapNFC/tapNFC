import { useEffect } from 'react';
import { designDB } from '@/lib/indexedDB';
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

    const loadFromIndexedDB = async (existingDesign: any) => {
      try {
        console.warn('Loading existing design from IndexedDB:', designId);

        const canvasDataToLoad = existingDesign.canvasData;
        if (!canvasDataToLoad.objects) {
          console.warn('Canvas data is missing objects array, creating empty array');
          canvasDataToLoad.objects = [];
        }

        canvas.loadFromJSON?.(canvasDataToLoad, () => {
          try {
            if (existingDesign.metadata?.width && existingDesign.metadata?.height) {
              canvas.setDimensions?.({
                width: existingDesign.metadata.width,
                height: existingDesign.metadata.height,
              });
            }

            if (existingDesign.metadata?.backgroundColor) {
              canvas.setBackgroundColor?.(existingDesign.metadata.backgroundColor, () => {
                canvas.renderAll?.();
              });
            } else {
              canvas.renderAll?.();
            }

            setIsDesignLoaded(true);
            console.warn('Design loaded successfully from IndexedDB');
          } catch (renderError) {
            console.error('Error during canvas rendering after load:', renderError);
            setIsDesignLoaded(true);
          }
        });
      } catch (loadError) {
        console.error('Error loading canvas JSON from IndexedDB:', loadError);
        setIsDesignLoaded(true);
      }
    };

    const loadFromLocalStorage = async (savedData: string) => {
      try {
        const canvasData = JSON.parse(savedData);
        console.warn('Loading existing design from localStorage:', designId);

        if (!canvasData?.objects) {
          canvasData.objects = [];
        }

        canvas.loadFromJSON?.(canvasData, () => {
          try {
            canvas.renderAll?.();
            setIsDesignLoaded(true);
            console.warn('Design loaded successfully from localStorage');
          } catch (renderError) {
            console.error('Error rendering localStorage data:', renderError);
            setIsDesignLoaded(true);
          }
        });
      } catch (error) {
        console.error('Error parsing saved design data:', error);
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

        // Try loading from IndexedDB first
        const existingDesign = await designDB.getDesign(designId);
        if (existingDesign?.canvasData) {
          await loadFromIndexedDB(existingDesign);
          return;
        }

        // Fallback to localStorage
        const savedData = localStorage.getItem(
          `${DESIGN_EDITOR_CONFIG.STORAGE_KEYS.DESIGN_PREFIX}${designId}`,
        );
        if (savedData) {
          await loadFromLocalStorage(savedData);
          return;
        }

        // No existing design found
        console.warn('No existing design found, starting with empty canvas');
        setIsDesignLoaded(true);
      } catch (error) {
        console.error('Error loading existing design:', error);
        setIsDesignLoaded(true);
      }
    };

    loadExistingDesign();
  }, [canvas, isCanvasReady, designId, isDesignLoaded, setIsDesignLoaded]);
}
