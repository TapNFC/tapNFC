import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';

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
  const [designName, setDesignName] = useState<string>('Untitled Design');

  useEffect(() => {
    if (!canvas || !isCanvasReady || isDesignLoaded) {
      return;
    }

    const loadFromSupabase = async () => {
      try {
        console.warn('Loading design from Supabase:', designId);

        // Fetch design from Supabase
        const design = await designService.getDesignById(designId);

        if (design) {
          setDesignName(design.name);
        }

        if (design?.canvas_data?.canvasJSON) {
          const canvasDataToLoad = design.canvas_data.canvasJSON;

          if (!canvasDataToLoad.objects) {
            // ... existing code ...
          }
        }
        setIsDesignLoaded(true);
      } catch (error) {
        console.error('Error loading from Supabase:', error);
        toast.error('Error loading design from Supabase');
        setIsDesignLoaded(true);
      }
    };

    const loadExistingDesign = async () => {
      try {
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

  return { designName };
}
