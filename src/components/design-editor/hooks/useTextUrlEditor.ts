'use client';

import { useCallback, useEffect, useState } from 'react';

type TextContextualToolbarState = {
  isVisible: boolean;
  textObject: any;
  position: { x: number; y: number };
};

type TextUrlEditPopupState = {
  isVisible: boolean;
  textObject: any;
  position: { x: number; y: number };
};

type UseTextUrlEditorProps = {
  canvas: any;
};

type UseTextUrlEditorReturn = {
  contextualToolbar: TextContextualToolbarState;
  textUrlEditPopup: TextUrlEditPopupState;
  handleTextSingleClick: (textObject: any, event: any) => void;
  handleLinkIconClick: () => void;
  handleUpdateTextUrl: (updates: { url?: string; urlType?: string }) => void;
  handleCloseTextUrlEdit: () => void;
  handleCloseContextualToolbar: () => void;
};

export function useTextUrlEditor({ canvas }: UseTextUrlEditorProps): UseTextUrlEditorReturn {
  const [contextualToolbar, setContextualToolbar] = useState<TextContextualToolbarState>({
    isVisible: false,
    textObject: null,
    position: { x: 0, y: 0 },
  });

  const [textUrlEditPopup, setTextUrlEditPopup] = useState<TextUrlEditPopupState>({
    isVisible: false,
    textObject: null,
    position: { x: 0, y: 0 },
  });

  const handleTextSingleClick = useCallback((textObject: any, event: any) => {
    // Prevent default to avoid selecting the object
    event.preventDefault();
    event.stopPropagation();

    if (!canvas || !textObject) {
      return;
    }

    const canvasElement = canvas.getElement?.();
    if (!canvasElement) {
      console.warn('Canvas element not found for text positioning.');
      return;
    }

    const rect = canvasElement.getBoundingClientRect();
    const zoom = canvas.getZoom?.() || 1;

    // Calculate position relative to viewport, positioning near the element
    const position = {
      x: rect.left + ((textObject.left || 0) + (textObject.width || 0) / 2) * zoom,
      y: rect.top + (textObject.top || 0) * zoom, // Position near the element
    };

    // Show contextual toolbar instead of popup
    setContextualToolbar({
      isVisible: true,
      textObject,
      position,
    });
  }, [canvas]);

  const handleLinkIconClick = useCallback(() => {
    if (!contextualToolbar.textObject) {
      return;
    }

    // Close the contextual toolbar
    setContextualToolbar({
      isVisible: false,
      textObject: null,
      position: { x: 0, y: 0 },
    });

    // Open the URL edit popup
    setTextUrlEditPopup({
      isVisible: true,
      textObject: contextualToolbar.textObject,
      position: contextualToolbar.position,
    });
  }, [contextualToolbar]);

  const handleUpdateTextUrl = useCallback((updates: { url?: string; urlType?: string }) => {
    if (!textUrlEditPopup.textObject || !canvas || !updates) {
      return;
    }

    const textObject = textUrlEditPopup.textObject;

    // Update the text's URL and URL type properties
    if (updates.url !== undefined) {
      textObject.set?.({ url: updates.url });
    }
    if (updates.urlType !== undefined) {
      textObject.set?.({ urlType: updates.urlType });
    }

    canvas.renderAll?.();
  }, [textUrlEditPopup.textObject, canvas]);

  const handleCloseTextUrlEdit = useCallback(() => {
    setTextUrlEditPopup({
      isVisible: false,
      textObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  const handleCloseContextualToolbar = useCallback(() => {
    setContextualToolbar({
      isVisible: false,
      textObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  // Set up canvas event listeners for text URL editing
  useEffect(() => {
    if (!canvas) {
      return;
    }

    let clickTimeout: NodeJS.Timeout;
    let isDoubleClick = false;

    const handleMouseDown = (e: any) => {
      const target = e.target;
      if (target && (target.type === 'text' || target.type === 'i-text' || target.type === 'textbox')) {
        // Clear any existing timeout
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }

        // Set a timeout to handle single click
        clickTimeout = setTimeout(() => {
          if (!isDoubleClick && !target.isEditing) {
            handleTextSingleClick(target, e.e);
          }
          isDoubleClick = false;
        }, 200); // 200ms delay to distinguish from double click
      }
    };

    const handleDoubleClick = (e: any) => {
      const target = e.target;
      if (target && (target.type === 'text' || target.type === 'i-text' || target.type === 'textbox')) {
        isDoubleClick = true;
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }
      }
    };

    // Hide toolbar when object starts moving
    const handleObjectMoving = () => {
      handleCloseContextualToolbar();
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:dblclick', handleDoubleClick);
    canvas.on('object:moving', handleObjectMoving);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:dblclick', handleDoubleClick);
      canvas.off('object:moving', handleObjectMoving);
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [canvas, handleTextSingleClick, handleCloseContextualToolbar]);

  return {
    contextualToolbar,
    textUrlEditPopup,
    handleTextSingleClick,
    handleLinkIconClick,
    handleUpdateTextUrl,
    handleCloseTextUrlEdit,
    handleCloseContextualToolbar,
  };
}
