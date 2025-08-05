import { useCallback, useEffect, useState } from 'react';

type SocialIconEditPopupState = {
  isVisible: boolean;
  iconObject: any;
  position: { x: number; y: number };
};

type UseSocialIconEditorProps = {
  canvas: any;
};

type UseSocialIconEditorReturn = {
  socialIconEditPopup: SocialIconEditPopupState;
  handleSocialIconDoubleClick: (iconObject: any, event: any) => void;
  handleUpdateSocialIcon: (updates: { url?: string; name?: string }) => void;
  handleCloseSocialIconEdit: () => void;
};

export function useSocialIconEditor({ canvas }: UseSocialIconEditorProps): UseSocialIconEditorReturn {
  const [socialIconEditPopup, setSocialIconEditPopup] = useState<SocialIconEditPopupState>({
    isVisible: false,
    iconObject: null,
    position: { x: 0, y: 0 },
  });

  const handleSocialIconDoubleClick = useCallback((iconObject: any, event: any) => {
    // Prevent default to avoid selecting the object
    event.preventDefault();
    event.stopPropagation();

    if (!canvas || !iconObject) {
      return;
    }

    const canvasElement = canvas.getElement?.();
    if (!canvasElement) {
      console.warn('Canvas element not found for social icon positioning.');
      return;
    }

    const rect = canvasElement.getBoundingClientRect();
    const zoom = canvas.getZoom?.() || 1;

    // Calculate position relative to viewport, positioning above the element
    const position = {
      x: rect.left + ((iconObject.left || 0) + (iconObject.width || 0) / 2) * zoom,
      y: rect.top + (iconObject.top || 0) * zoom, // Position above the element
    };

    // Update popup state
    setSocialIconEditPopup({
      isVisible: true,
      iconObject,
      position,
    });
  }, [canvas]);

  const handleUpdateSocialIcon = useCallback((updates: { url?: string; name?: string }) => {
    if (!socialIconEditPopup.iconObject || !canvas || !updates) {
      return;
    }

    const iconObject = socialIconEditPopup.iconObject;

    // Update the icon's properties
    if (updates.url !== undefined) {
      iconObject.set?.({ url: updates.url });
    }

    if (updates.name !== undefined) {
      iconObject.set?.({ name: updates.name });
    }

    canvas.renderAll?.();
  }, [socialIconEditPopup.iconObject, canvas]);

  const handleCloseSocialIconEdit = useCallback(() => {
    setSocialIconEditPopup({
      isVisible: false,
      iconObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  // Set up canvas event listeners for social icon editing
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handleDoubleClick = (e: any) => {
      const target = e.target;
      if (target && target.elementType === 'socialIcon') {
        handleSocialIconDoubleClick(target, e.e);
      }
    };

    canvas.on('mouse:dblclick', handleDoubleClick);

    return () => {
      canvas.off('mouse:dblclick', handleDoubleClick);
    };
  }, [canvas, handleSocialIconDoubleClick]);

  return {
    socialIconEditPopup,
    handleSocialIconDoubleClick,
    handleUpdateSocialIcon,
    handleCloseSocialIconEdit,
  };
}
