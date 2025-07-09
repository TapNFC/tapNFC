import { useEffect } from 'react';
import { DESIGN_EDITOR_CONFIG } from '../constants';

type UseCanvasEventsProps = {
  canvas: any;
  incrementCanvasVersion: () => void;
};

export function useCanvasEvents({ canvas, incrementCanvasVersion }: UseCanvasEventsProps) {
  // Force preview updates when canvas changes
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handleCanvasUpdate = () => {
      incrementCanvasVersion();
    };

    const events = [
      DESIGN_EDITOR_CONFIG.CANVAS_EVENTS.OBJECT_ADDED,
      DESIGN_EDITOR_CONFIG.CANVAS_EVENTS.OBJECT_REMOVED,
      DESIGN_EDITOR_CONFIG.CANVAS_EVENTS.OBJECT_MODIFIED,
      DESIGN_EDITOR_CONFIG.CANVAS_EVENTS.OBJECT_MOVING,
      DESIGN_EDITOR_CONFIG.CANVAS_EVENTS.OBJECT_SCALING,
      DESIGN_EDITOR_CONFIG.CANVAS_EVENTS.OBJECT_ROTATING,
      DESIGN_EDITOR_CONFIG.CANVAS_EVENTS.CANVAS_BACKGROUND_CHANGED,
    ];

    events.forEach((event) => {
      canvas.on(event, handleCanvasUpdate);
    });

    // Cleanup function
    return () => {
      if (canvas) {
        events.forEach((event) => {
          canvas.off?.(event, handleCanvasUpdate);
        });
      }
    };
  }, [canvas, incrementCanvasVersion]);
}
