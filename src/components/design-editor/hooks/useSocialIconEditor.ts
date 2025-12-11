import { fabric } from 'fabric';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type SocialIconContextualToolbarState = {
  isVisible: boolean;
  iconObject: any;
  position: { x: number; y: number };
};

type SocialIconEditPopupState = {
  isVisible: boolean;
  iconObject: any;
  position: { x: number; y: number };
};

type UseSocialIconEditorProps = {
  canvas: any;
  designId: string;
};

type UseSocialIconEditorReturn = {
  socialIconContextualToolbar: SocialIconContextualToolbarState;
  socialIconEditPopup: SocialIconEditPopupState;
  svgColorPicker: { isVisible: boolean; svgCode: string };
  handleSocialIconSingleClick: (iconObject: any, event: any) => void;
  handleSocialIconDoubleClick: (iconObject: any, event: any) => void;
  handleActionsClick: () => void;
  handleColorEditClick: () => void;
  handleUpdateSocialIcon: (updates: { url?: string; urlType?: string }) => void;
  handleSvgColorChange: (newSvgCode: string) => void;
  handleCloseSocialIconEdit: () => void;
  handleCloseContextualToolbar: () => void;
  handleCloseSvgColorPicker: () => void;
};

export function useSocialIconEditor({ canvas }: UseSocialIconEditorProps): UseSocialIconEditorReturn {
  const [socialIconContextualToolbar, setSocialIconContextualToolbar] = useState<SocialIconContextualToolbarState>({
    isVisible: false,
    iconObject: null,
    position: { x: 0, y: 0 },
  });

  const [socialIconEditPopup, setSocialIconEditPopup] = useState<SocialIconEditPopupState>({
    isVisible: false,
    iconObject: null,
    position: { x: 0, y: 0 },
  });

  const [svgColorPicker, setSvgColorPicker] = useState<{ isVisible: boolean; svgCode: string }>({
    isVisible: false,
    svgCode: '',
  });

  const handleSocialIconSingleClick = useCallback((iconObject: any, event: any) => {
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
    // Social icons are typically positioned from center, so we need to account for that
    const iconCenterX = iconObject.left || 0;
    const iconCenterY = iconObject.top || 0;
    const iconHeight = (iconObject.height || 0) * (iconObject.scaleY || 1);

    const position = {
      x: rect.left + iconCenterX * zoom,
      y: rect.top + (iconCenterY - iconHeight / 2) - 40 * zoom, // Position above the element, accounting for height and scale
    };

    // Show contextual toolbar instead of popup
    setSocialIconContextualToolbar({
      isVisible: true,
      iconObject,
      position,
    });
  }, [canvas]);

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
    // Social icons are typically positioned from center, so we need to account for that
    const iconCenterX = iconObject.left || 0;
    const iconCenterY = iconObject.top || 0;
    const iconHeight = (iconObject.height || 0) * (iconObject.scaleY || 1);

    const position = {
      x: rect.left + iconCenterX * zoom,
      y: rect.top + (iconCenterY - iconHeight / 2) * zoom, // Position above the element, accounting for height and scale
    };

    // Update popup state
    setSocialIconEditPopup({
      isVisible: true,
      iconObject,
      position,
    });
  }, [canvas]);

  const handleActionsClick = useCallback(() => {
    if (!socialIconContextualToolbar.iconObject) {
      return;
    }

    // Close the contextual toolbar
    setSocialIconContextualToolbar({
      isVisible: false,
      iconObject: null,
      position: { x: 0, y: 0 },
    });

    // Open the edit popup
    setSocialIconEditPopup({
      isVisible: true,
      iconObject: socialIconContextualToolbar.iconObject,
      position: socialIconContextualToolbar.position,
    });
  }, [socialIconContextualToolbar]);

  const handleColorEditClick = useCallback(() => {
    if (!socialIconContextualToolbar.iconObject?.svgCode) {
      return;
    }

    // Show SVG color picker
    setSvgColorPicker({
      isVisible: true,
      svgCode: socialIconContextualToolbar.iconObject.svgCode,
    });
  }, [socialIconContextualToolbar.iconObject]);

  const handleSvgColorChange = useCallback((newSvgCode: string) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    // Try to get the icon object from the contextual toolbar first
    let iconObject = socialIconContextualToolbar.iconObject;

    // If not available in toolbar, try to get the currently active object from canvas
    if (!iconObject) {
      iconObject = canvas.getActiveObject();
    }

    // If still no icon object, try to find any SVG social icon on the canvas
    if (!iconObject || iconObject.elementType !== 'socialIcon' || !iconObject.isSvgIcon) {
      const objects = canvas.getObjects();
      iconObject = objects.find((obj: any) => obj.elementType === 'socialIcon' && obj.isSvgIcon);
    }

    if (!iconObject || iconObject.elementType !== 'socialIcon' || !iconObject.isSvgIcon) {
      toast.error('No SVG social icon found. Please select an SVG icon first.');
      return;
    }

    toast.success('Updating SVG colors...');

    // Update the SVG code
    iconObject.set?.({ svgCode: newSvgCode });

    // Instead of recreating the SVG, update the fill colors of existing paths
    if (iconObject.type === 'group' && iconObject._objects) {
      // Get the new SVG objects to extract color information
      fabric.loadSVGFromString(newSvgCode, (newObjects: any, _options: any) => {
        if (newObjects && newObjects.length > 0) {
          // Update fill colors of existing paths in the group
          iconObject._objects.forEach((pathObj: any, index: number) => {
            if (pathObj.type === 'path' && newObjects[index] && newObjects[index].fill) {
              pathObj.set('fill', newObjects[index].fill);
            }
          });

          // Force the canvas to re-render with updated colors
          iconObject.setCoords();
          canvas.renderAll();

          toast.success('SVG colors updated successfully!');
        }
      });
    } else {
      // Fallback: if it's not a group, just update the svgCode property
      canvas.renderAll();
      toast.success('SVG colors updated successfully!');
    }
  }, [socialIconContextualToolbar.iconObject, canvas]);

  const handleUpdateSocialIcon = useCallback((updates: { url?: string; urlType?: string }) => {
    if (!socialIconEditPopup.iconObject || !canvas || !updates) {
      return;
    }

    const iconObject = socialIconEditPopup.iconObject;

    // Update the icon's properties
    if (updates.url !== undefined) {
      iconObject.set?.({ url: updates.url });
    }
    if (updates.urlType !== undefined) {
      iconObject.set?.({ urlType: updates.urlType });
    }

    canvas.renderAll?.();
    canvas.fire?.('object:modified', { target: iconObject });
  }, [socialIconEditPopup.iconObject, canvas]);

  const handleCloseSocialIconEdit = useCallback(() => {
    setSocialIconEditPopup({
      isVisible: false,
      iconObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  const handleCloseContextualToolbar = useCallback(() => {
    setSocialIconContextualToolbar({
      isVisible: false,
      iconObject: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  const handleCloseSvgColorPicker = useCallback(() => {
    setSvgColorPicker({
      isVisible: false,
      svgCode: '',
    });
  }, []);

  // Set up canvas event listeners for social icon editing
  useEffect(() => {
    if (!canvas) {
      return;
    }

    let clickTimeout: NodeJS.Timeout;
    let isDoubleClick = false;

    const handleMouseDown = (e: any) => {
      const target = e.target;
      if (target && target.elementType === 'socialIcon') {
        // Clear any existing timeout
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }

        // Set a timeout to handle single click
        clickTimeout = setTimeout(() => {
          if (!isDoubleClick) {
            handleSocialIconSingleClick(target, e.e);
          }
          isDoubleClick = false;
        }, 200); // 200ms delay to distinguish from double click
      }
    };

    const handleDoubleClick = (e: any) => {
      const target = e.target;
      if (target && target.elementType === 'socialIcon') {
        isDoubleClick = true;
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }
        handleSocialIconDoubleClick(target, e.e);
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
  }, [canvas, handleSocialIconSingleClick, handleSocialIconDoubleClick, handleCloseContextualToolbar]);

  return {
    socialIconContextualToolbar,
    socialIconEditPopup,
    svgColorPicker,
    handleSocialIconSingleClick,
    handleSocialIconDoubleClick,
    handleActionsClick,
    handleColorEditClick,
    handleUpdateSocialIcon,
    handleSvgColorChange,
    handleCloseSocialIconEdit,
    handleCloseContextualToolbar,
    handleCloseSvgColorPicker,
  };
}
