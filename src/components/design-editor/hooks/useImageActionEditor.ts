'use client';

import { useCallback, useEffect, useState } from 'react';

type UseImageActionEditorProps = {
  canvas: any;
};

type UseImageActionEditorReturn = {
  imageActionPopup: {
    isVisible: boolean;
    imageObject: any;
    position: { x: number; y: number };
  };
  imageContextualToolbar: {
    isVisible: boolean;
    imageObject: any;
    position: { x: number; y: number };
  };
  handleImageSingleClick: (imageObject: any, event: any) => void;
  handleActionsClick: () => void;
  handleUpdateImageAction: (updates: { url?: string; urlType?: string }) => void;
  handleCloseImageActionPopup: () => void;
  handleCloseImageContextualToolbar: () => void;
};

export function useImageActionEditor({ canvas }: UseImageActionEditorProps): UseImageActionEditorReturn {
  const [imageActionPopup, setImageActionPopup] = useState({
    isVisible: false,
    imageObject: null,
    position: { x: 0, y: 0 },
  });
  const [imageContextualToolbar, setImageContextualToolbar] = useState({
    isVisible: false,
    imageObject: null,
    position: { x: 0, y: 0 },
  });

  const handleImageSingleClick = useCallback((imageObject: any, event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canvas || !imageObject) {
      return;
    }

    const canvasElement = canvas.getElement?.();
    if (!canvasElement) {
      console.warn('Canvas element not found for image positioning.');
      return;
    }

    const rect = canvasElement.getBoundingClientRect();
    const zoom = canvas.getZoom?.() || 1;

    const position = {
      x: rect.left + ((imageObject.left || 0) + (imageObject.width || 0) / 2) * zoom,
      y: rect.top - 30 + (imageObject.top || 0) * zoom,
    };

    setImageContextualToolbar({
      isVisible: true,
      imageObject,
      position,
    });
  }, [canvas]);

  const handleActionsClick = useCallback(() => {
    if (!imageContextualToolbar.imageObject) {
      return;
    }

    setImageContextualToolbar({
      isVisible: false,
      imageObject: null,
      position: { x: 0, y: 0 },
    });

    setImageActionPopup({
      isVisible: true,
      imageObject: imageContextualToolbar.imageObject,
      position: imageContextualToolbar.position,
    });
  }, [imageContextualToolbar]);

  const handleUpdateImageAction = useCallback((updates: { url?: string; urlType?: string }) => {
    if (!imageActionPopup.imageObject || !canvas || !updates) {
      return;
    }

    const imageObject: any = imageActionPopup.imageObject;

    if (updates.url !== undefined) {
      imageObject.set?.({ url: updates.url });
    }
    if (updates.urlType !== undefined) {
      imageObject.set?.({ urlType: updates.urlType });
    }

    canvas.renderAll?.();
    canvas.fire?.('object:modified', { target: imageObject });
  }, [imageActionPopup.imageObject, canvas]);

  const handleCloseImageActionPopup = useCallback(() => {
    setImageActionPopup({
      isVisible: false,
      imageObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  const handleCloseImageContextualToolbar = useCallback(() => {
    setImageContextualToolbar({
      isVisible: false,
      imageObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    let clickTimeout: NodeJS.Timeout;

    const handleMouseDown = (e: any) => {
      const target = e.target;
      if (target && target.type === 'image' && target.elementType !== 'socialIcon') {
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }
        clickTimeout = setTimeout(() => {
          handleImageSingleClick(target, e.e);
        }, 150);
      }
    };

    canvas.on('mouse:down', handleMouseDown);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [canvas, handleImageSingleClick]);

  return {
    imageActionPopup,
    handleImageSingleClick,
    imageContextualToolbar,
    handleActionsClick,
    handleUpdateImageAction,
    handleCloseImageActionPopup,
    handleCloseImageContextualToolbar,
  };
}
