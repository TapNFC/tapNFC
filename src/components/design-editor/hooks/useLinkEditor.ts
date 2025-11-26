import { useCallback, useEffect, useState } from 'react';

type LinkEditPopupState = {
  isVisible: boolean;
  linkObject: any;
  position: { x: number; y: number };
};

type UseLinkEditorProps = {
  canvas: any;
};

type UseLinkEditorReturn = {
  linkEditPopup: LinkEditPopupState;
  handleLinkDoubleClick: (linkObject: any, event: any) => void;
  handleUpdateLink: (updates: { url?: string; text?: string }) => void;
  handleCloseLinkEdit: () => void;
};

export function useLinkEditor({ canvas }: UseLinkEditorProps): UseLinkEditorReturn {
  const [linkEditPopup, setLinkEditPopup] = useState<LinkEditPopupState>({
    isVisible: false,
    linkObject: null,
    position: { x: 0, y: 0 },
  });

  // Handle link double-click to show edit popup
  const handleLinkDoubleClick = useCallback((linkObject: any, _event: any) => {
    if (!canvas || !linkObject) {
      return;
    }

    const canvasElement = canvas.getElement?.();
    if (!canvasElement) {
      console.warn('Canvas element not found for link positioning.');
      return;
    }

    const rect = canvasElement.getBoundingClientRect();
    const zoom = canvas.getZoom?.() || 1;

    // Calculate position relative to viewport, positioning above the element
    const position = {
      x: rect.left + ((linkObject.left || 0) + (linkObject.width || 0) / 2) * zoom,
      y: rect.top + (linkObject.top || 0) * zoom, // Position above the element
    };

    setLinkEditPopup({
      isVisible: true,
      linkObject,
      position,
    });
  }, [canvas]);

  // Update link properties
  const handleUpdateLink = useCallback((updates: { url?: string; text?: string }) => {
    if (!linkEditPopup.linkObject || !canvas || !updates) {
      return;
    }

    const linkObject = linkEditPopup.linkObject;

    // Update link data
    const linkData = {
      ...(linkObject.linkData || {}),
      ...updates,
    };

    linkObject.set?.({ linkData });

    // If text changed, update the displayed text
    if (updates.text !== undefined) {
      linkObject.set?.({ text: updates.text });
    }

    canvas.renderAll?.();
  }, [linkEditPopup.linkObject, canvas]);

  // Close link edit popup
  const handleCloseLinkEdit = useCallback(() => {
    setLinkEditPopup({
      isVisible: false,
      linkObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  // Set up canvas event listeners for link editing
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handleDoubleClick = (e: any) => {
      const target = e.target;
      if (target && target.elementType === 'link') {
        handleLinkDoubleClick(target, e.e);
      }
    };

    canvas.on('mouse:dblclick', handleDoubleClick);

    return () => {
      canvas.off('mouse:dblclick', handleDoubleClick);
    };
  }, [canvas, handleLinkDoubleClick]);

  return {
    linkEditPopup,
    handleLinkDoubleClick,
    handleUpdateLink,
    handleCloseLinkEdit,
  };
}
