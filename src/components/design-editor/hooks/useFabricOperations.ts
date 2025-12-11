import { useCallback } from 'react';
import { toast } from 'sonner';
import { handleUrlClick } from '@/utils/urlUtils';
import { safeRenderAll } from '../utils/canvasSafety';

// Define types for Fabric.js gradient options, matching those in BackgroundsPanel.tsx
type FabricColorStop = { offset: number; color: string };
type FabricGradientOptionForOps = {
  type: 'linear'; // Currently only supporting linear gradients
  colorStops: FabricColorStop[];
};

// Type for the background input parameter, accommodating strings (solid colors) and gradient objects
type BackgroundInput
  = | string
    | { type: 'gradient'; value: FabricGradientOptionForOps }
    | { type: string; value: string }; // For other potential object-based backgrounds (original structure)

type UseFabricOperationsOptions = {
  canvas: any;
  fabric: any;
  fabricReady: boolean;
};

export function useFabricOperations({ canvas, fabric, fabricReady }: UseFabricOperationsOptions) {
  const handleAddText = useCallback((textType: string) => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas or Fabric.js not ready');
      return;
    }
    try {
      let textObject;
      switch (textType) {
        case 'add-text': // Heading
          textObject = new fabric.Textbox('Heading', {
            left: 50,
            top: 50,
            fontSize: 48,
            fontWeight: 'bold',
            fontFamily: 'Inter',
            fill: '#333',
            width: 300,
            textAlign: 'center',
            lineHeight: 1.2,
            charSpacing: 0,
          });
          break;
        case 'add-subheading':
          textObject = new fabric.Textbox('Subheading', {
            left: 50,
            top: 120,
            fontSize: 32,
            fontWeight: 'normal',
            fontFamily: 'Inter',
            fill: '#555',
            width: 250,
            textAlign: 'center',
            lineHeight: 1.2,
            charSpacing: 0,
          });
          break;
        case 'add-body':
        default:
          textObject = new fabric.Textbox('Body text', {
            left: 50,
            top: 200,
            fontSize: 16,
            fontWeight: 'normal',
            fontFamily: 'Inter',
            fill: '#666',
            width: 200,
            lineHeight: 1.2,
            charSpacing: 0,
          });
          break;
      }
      if (textObject) {
        // Add custom property to identify text type later if needed
        (textObject as any).elementType = 'text';
        // Add URL property for text linking functionality
        (textObject as any).url = '';
        // Ensure text renders at correct size by explicitly setting height
        textObject.set('height', textObject.fontSize * (textObject.lineHeight || 1.2));
        canvas.add(textObject);
        canvas.setActiveObject?.(textObject);
        safeRenderAll(canvas);
        toast.success(`${textType.replace('add-', '').replace('-', ' ')} added`);
      }
    } catch (error) {
      console.error('Error adding text:', error);
      toast.error('Failed to add text');
    }
  }, [canvas, fabric, fabricReady]);

  const handleBackgroundChange = useCallback((backgroundInput: BackgroundInput) => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas or Fabric.js not ready');
      return;
    }

    try {
      if (typeof backgroundInput === 'string') {
        // Solid color or 'transparent'
        const colorValue = backgroundInput;
        if (colorValue.toLowerCase() === 'transparent') {
          canvas.setBackgroundColor?.('rgba(0,0,0,0)', () => {
            // Rendering and event firing are now handled by the overridden setBackgroundColor method
          });
        } else {
          canvas.setBackgroundColor?.(colorValue, () => {
            // Rendering and event firing are now handled by the overridden setBackgroundColor method
          });
        }
      } else if (
        backgroundInput?.type === 'gradient'
        && typeof backgroundInput.value === 'object'
        && backgroundInput.value !== null
        && 'type' in backgroundInput.value
        && backgroundInput.value.type === 'linear'
      ) {
        // Gradient object
        const fabricOptions = backgroundInput.value as FabricGradientOptionForOps;
        const canvasWidth = canvas.getWidth?.();
        const canvasHeight = canvas.getHeight?.();

        if (canvasWidth === undefined || canvasHeight === undefined) {
          toast.error('Canvas dimensions not available for gradient.');
          return;
        }

        const gradientCoords = {
          x1: 0,
          y1: 0,
          x2: canvasWidth,
          y2: canvasHeight,
        };

        const gradient = new fabric.Gradient({
          type: fabricOptions.type,
          coords: gradientCoords,
          colorStops: fabricOptions.colorStops,
        });

        canvas.setBackgroundColor?.(gradient, () => {
          // Rendering and event firing are now handled by the overridden setBackgroundColor method
        });
      } else if (typeof backgroundInput?.value === 'string') { // Check for the old structure { type: string, value: string }
        canvas.setBackgroundColor?.(backgroundInput.value, () => {
          // Rendering and event firing are now handled by the overridden setBackgroundColor method
        });
      } else {
        toast.error('Invalid background type or format');
      }
    } catch (error) {
      console.error('Error changing background:', error);
      toast.error('Failed to change background');
    }
  }, [canvas, fabric, fabricReady]);

  const handleAddButton = useCallback(() => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas or Fabric.js not ready for button');
      return;
    }

    try {
      const buttonText = 'Click Me';
      const fontSize = 18;
      const fontFamily = 'Inter';
      const padding = { top: 10, right: 20, bottom: 10, left: 20 };
      const backgroundColor = '#3b82f6';
      const textColor = '#ffffff';
      const borderRadius = 8;

      // Create text object for measurement
      const text = new fabric.Textbox(buttonText, {
        fontSize,
        fontFamily,
        fill: textColor,
        textAlign: 'center',
        // Ensure text width is not fixed here so it can be measured
      });

      // Calculate dimensions after text is rendered (important for accurate width)
      // This is a bit of a hack. For perfect sizing, one might render off-screen or use DOM measurement.
      // Fabric's text width calculation can be tricky before adding to canvas.
      const textWidth = text.width || (buttonText.length * fontSize * 0.6); // Approximate width
      const textHeight = text.height || fontSize; // Approximate height

      const buttonWidth = textWidth + (padding?.left || 0) + (padding?.right || 0);
      const buttonHeight = textHeight + (padding?.top || 0) + (padding?.bottom || 0);

      // Create background rectangle
      const bgRect = new fabric.Rect({
        width: buttonWidth,
        height: buttonHeight,
        fill: backgroundColor,
        rx: borderRadius,
        ry: borderRadius,
        originX: 'center',
        originY: 'center',
        strokeUniform: true, // Keep stroke width constant when scaling
      });

      // Position text in the center of the button background
      text.set({
        originX: 'center',
        originY: 'center',
      });

      // Create a group for the button
      const buttonGroup = new fabric.Group([bgRect, text], {
        left: 100,
        top: 100,
        // Custom properties for button styling and behavior
        buttonData: {
          text: buttonText,
          backgroundColor,
          textColor,
          borderColor: 'transparent', // Default border
          borderWidth: 0,
          borderRadius,
          fontSize,
          fontFamily,
          fontWeight: 'normal',
          padding,
          hoverBackgroundColor: '#2563eb', // Example hover color
          hoverTextColor: '#ffffff',
          action: { type: 'url', value: '' }, // Default action with URL type
        },
        elementType: 'button', // Custom property to identify this as a button
      });

      // Add click handler for URL functionality
      buttonGroup.on('mousedown', function (this: any, e: any) {
        // Only handle left-click
        if (e.e.button !== 0) {
          return;
        }

        // If the button has a URL and it's not being edited (not selected)
        if (this.buttonData?.action?.value && !canvas.getActiveObject()) {
          // Prevent default to avoid selecting the object
          e.e.preventDefault();
          e.e.stopPropagation();

          // Handle different action types
          const action = this.buttonData.action;
          if (action.type === 'url' && action.value) {
            window.open(action.value, '_blank');
          } else if (action.type === 'email' && action.value) {
            window.location.href = `mailto:${action.value}`;
          } else if (action.type === 'phone' && action.value) {
            window.location.href = `tel:${action.value}`;
          } else if (action.type === 'pdf' && action.value) {
            // For PDFs, open directly in new tab
            window.open(action.value, '_blank');
          } else if (action.type === 'custom' && action.value) {
            console.warn('Custom action:', action.value);
          }
        }
      });

      canvas.add(buttonGroup);
      canvas.setActiveObject?.(buttonGroup);
      safeRenderAll(canvas);

      toast.success('Button added to canvas! Double-click to edit URL.');
    } catch (error) {
      console.error('Error adding button:', error);
      toast.error('Failed to add button.');
    }
  }, [canvas, fabric, fabricReady]);

  const handleAddShape = useCallback((shapeType: string) => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas or Fabric.js not ready for shape');
      return;
    }
    try {
      let shape;
      const commonProps = {
        left: 100,
        top: 100,
        fill: '#3b82f6', // Default fill blue-500
        stroke: '#1e40af', // Default stroke blue-700
        strokeWidth: 2,
        strokeUniform: true, // Keep stroke width constant when scaling
      };

      const outlinedCommonProps = {
        ...commonProps,
        fill: 'transparent',
        stroke: '#4f46e5', // Default stroke indigo-600 for outlined
        strokeUniform: true, // Keep stroke width constant when scaling
      };

      switch (shapeType) {
        case 'rectangle':
          shape = new fabric.Rect({
            ...commonProps,
            width: 100,
            height: 60,
            rx: 0, // Set to 0 for sharp corners
            ry: 0, // Set to 0 for sharp corners
            strokeWidth: 1, // Set to 1px border
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          break;
        case 'outlined-rectangle':
          shape = new fabric.Rect({
            ...outlinedCommonProps,
            width: 100,
            height: 60,
            rx: 0, // Set to 0 for sharp corners
            ry: 0, // Set to 0 for sharp corners
            strokeWidth: 1, // Set to 1px border
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          break;
        case 'circle':
          shape = new fabric.Circle({
            ...commonProps,
            radius: 40,
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          break;
        case 'outlined-circle':
          shape = new fabric.Circle({
            ...outlinedCommonProps,
            radius: 40,
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          break;
        case 'triangle':
          shape = new fabric.Triangle({
            ...commonProps,
            width: 80,
            height: 70,
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          break;
        case 'diamond':
          // Fabric doesn't have a native diamond. We use a polygon or a rotated square.
          // Using a rotated square for simplicity, can be adjusted to polygon for more control.
          shape = new fabric.Rect({
            ...commonProps,
            width: 70,
            height: 70,
            angle: 45,
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          // To make it look more like a diamond, you might want to adjust stroke join, etc.
          // Or define points for a fabric.Polygon
          break;
        case 'line':
          shape = new fabric.Line([50, 100, 150, 100], {
            left: 50,
            top: 50,
            stroke: commonProps.fill, // Use fill color for line stroke as per design
            strokeWidth: 4,
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          break;
        case 'star':
          // Fabric doesn't have a native star. This requires a custom fabric.Polygon.
          // Example points for a 5-point star. Adjust as needed.
          shape = new fabric.Polygon([
            { x: 0, y: -50 },
            { x: 12, y: -15 },
            { x: 48, y: -15 },
            { x: 19, y: 10 },
            { x: 29, y: 45 },
            { x: 0, y: 25 },
            { x: -29, y: 45 },
            { x: -19, y: 10 },
            { x: -48, y: -15 },
            { x: -12, y: -15 },
          ], {
            ...commonProps,
            left: 150,
            top: 150,
            strokeUniform: true, // Keep stroke width constant when scaling
          });
          break;
        default:
          toast(`Shape type "${shapeType}" not recognized.`);
          return;
      }

      if (shape) {
        // Add custom property to identify shape type later if needed
        (shape as any).elementType = 'shape';
        (shape as any).shapeType = shapeType; // Store the original shape type

        canvas.add(shape);
        canvas.setActiveObject?.(shape);
        safeRenderAll(canvas);
        toast.success(`${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added`);
      }
    } catch (error) {
      console.error(`Error adding shape ${shapeType}:`, error);
      toast.error('Failed to add shape.');
    }
  }, [canvas, fabric, fabricReady]);

  const handleAddLink = useCallback(() => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas or Fabric.js not ready for link');
      return;
    }

    const linkText = 'Your Link Text';
    const linkUrl = 'https://example.com';

    const text = new fabric.Textbox(linkText, {
      left: 100,
      top: 150,
      fontSize: 18,
      fontFamily: 'Inter',
      fill: '#3b82f6', // Default link color
      textDecoration: 'underline',
      cursor: 'pointer',
      // Interactive properties for Fabric objects
      selectable: true,
      evented: true,
      // Custom properties for link behavior
      linkData: {
        url: linkUrl,
        text: linkText, // Store initial text
        color: '#3b82f6',
        hoverColor: '#1e40af',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Inter',
        textDecoration: 'underline',
        target: '_blank',
      },
      elementType: 'link', // Custom property for identification
    });

    canvas.add(text);
    canvas.setActiveObject?.(text);
    safeRenderAll(canvas);

    toast.success('Link added! Double-click to edit its URL and text.');
  }, [canvas, fabric, fabricReady]);

  const updateButtonProperties = useCallback((buttonObject: any, updates: any) => {
    if (!canvas || !buttonObject || buttonObject.elementType !== 'button' || !updates) {
      return;
    }

    try {
      const buttonData = { ...(buttonObject.buttonData || {}), ...updates };
      buttonObject.set('buttonData', buttonData);

      const [bgRect, textObj] = buttonObject.getObjects?.() || [];

      if (bgRect && updates.backgroundColor) {
        bgRect.set('fill', updates.backgroundColor);
      }
      if (bgRect && updates.borderColor) {
        bgRect.set('stroke', updates.borderColor);
      }
      if (bgRect && updates.borderRadius !== undefined) {
        bgRect.set({ rx: updates.borderRadius, ry: updates.borderRadius });
      }
      if (bgRect && updates.borderWidth !== undefined) {
        bgRect.set('strokeWidth', updates.borderWidth);
      }

      if (textObj && updates.text) {
        textObj.set('text', updates.text);
      }
      if (textObj && updates.textColor) {
        textObj.set('fill', updates.textColor);
      }
      if (textObj && updates.fontSize) {
        textObj.set('fontSize', updates.fontSize);
      }
      if (textObj && updates.fontFamily) {
        textObj.set('fontFamily', updates.fontFamily);
      }
      if (textObj && updates.fontWeight) {
        textObj.set('fontWeight', updates.fontWeight);
      }

      // Handle URL functionality for buttons
      if (updates.action?.type === 'url' && updates.action?.value) {
        // First remove any existing click handlers to avoid duplicates
        if (buttonObject.__eventListeners && buttonObject.__eventListeners.mousedown) {
          buttonObject.off('mousedown');
        }

        // Set the URL property directly on the object
        buttonObject.set({
          url: updates.action.value,
          hoverCursor: 'pointer',
        });

        // Add a visual indicator for linked buttons
        if (bgRect) {
          bgRect.set({
            stroke: '#10b981', // Green color to indicate it has a link
            strokeWidth: buttonData.borderWidth || 2,
          });
        }

        // Add a custom handler for mouse down events
        buttonObject.on('mousedown', function (this: any, e: any) {
          // Only handle left-click
          if (e.e.button !== 0) {
            return;
          }

          // If the button has a URL and it's not being edited (not selected)
          if (this.buttonData?.action?.value && !canvas.getActiveObject()) {
            // Prevent default to avoid selecting the object
            e.e.preventDefault();
            e.e.stopPropagation();

            // Open the URL in a new tab
            window.open(this.buttonData.action.value, '_blank');
          }
        });

        // Log to confirm URL was set
      }

      // Adjust group size if text or padding changes (simplified)
      if ((updates.text || updates.padding || updates.fontSize) && textObj && bgRect) {
        const padding = buttonData.padding || { top: 0, right: 0, bottom: 0, left: 0 };
        const textWidth = textObj.width || ((buttonData.text?.length || 0) * (buttonData.fontSize || 16) * 0.6);
        const textHeight = textObj.height || (buttonData.fontSize || 16);

        const newWidth = textWidth + (padding.left || 0) + (padding.right || 0);
        const newHeight = textHeight + (padding.top || 0) + (padding.bottom || 0);

        bgRect.set({ width: newWidth, height: newHeight });

        // Recalculate positions within the group if necessary for fabric.Group
        // For basic groups, Fabric handles relative positioning, but explicit update might be needed.
        buttonObject._restoreObjectsState?.(); // May help update layout
        buttonObject.setCoords?.(); // Important for controls
      }

      safeRenderAll(canvas);
      toast.success('Button properties updated');
    } catch (error) {
      console.error('Error updating button properties:', error);
      toast.error('Failed to update button.');
    }
  }, [canvas]);

  const updateLinkProperties = useCallback((linkObject: any, updates: any) => {
    if (!canvas || !linkObject || linkObject.elementType !== 'link' || !updates) {
      return;
    }
    try {
      const linkData = { ...(linkObject.linkData || {}), ...updates };
      linkObject.set('linkData', linkData);

      if (updates.text !== undefined) {
        linkObject.set('text', updates.text);
      }
      if (updates.color !== undefined) {
        linkObject.set('fill', updates.color);
      }
      if (updates.fontSize !== undefined) {
        linkObject.set('fontSize', updates.fontSize);
      }
      if (updates.fontFamily !== undefined) {
        linkObject.set('fontFamily', updates.fontFamily);
      }
      if (updates.fontWeight !== undefined) {
        linkObject.set('fontWeight', updates.fontWeight);
      }
      if (updates.textDecoration !== undefined) {
        linkObject.set('textDecoration', updates.textDecoration);
        // Fabric's Textbox might also use underline, linethrough, overline boolean properties
        linkObject.set('underline', updates.textDecoration === 'underline');
        linkObject.set('linethrough', updates.textDecoration === 'line-through');
        linkObject.set('overline', updates.textDecoration === 'overline');
      }

      safeRenderAll(canvas);
      toast.success('Link properties updated');
    } catch (error) {
      console.error('Error updating link properties:', error);
      toast.error('Failed to update link');
    }
  }, [canvas]);

  // Add social icon to canvas
  const handleAddSocialIcon = useCallback((iconPath: string, iconName: string, svgCode?: string) => {
    if (!canvas || !fabric || !fabricReady) {
      console.warn('Canvas or Fabric not ready');
      return;
    }

    const handleIconAction = (target: any) => {
      if (!target?.url) {
        return;
      }
      const actionType = target.urlType || undefined;
      const actionLabel = actionType === 'email'
        ? 'email'
        : actionType === 'phone'
          ? 'phone number'
          : actionType === 'pdf'
            ? 'PDF'
            : actionType === 'vcard'
              ? 'vCard'
              : 'link';

      toast.success(`Opening ${actionLabel} for ${target.name || 'icon'}`);
      handleUrlClick(target.url, actionType, target.name);
    };

    // If SVG code is provided, create SVG object instead of image
    if (svgCode) {
      fabric.loadSVGFromString(svgCode, (objects: any) => {
        if (objects && objects.length > 0) {
          // Create a group from SVG objects
          const svgGroup = new fabric.Group(objects, {
            left: 100,
            top: 100,
            scaleX: 3.85,
            scaleY: 3.85,
            cornerSize: 12,
            cornerStyle: 'circle',
            cornerColor: '#2563eb',
            cornerStrokeColor: '#ffffff',
            transparentCorners: false,
            borderColor: '#2563eb',
            borderScaleFactor: 2,
            name: iconName,
            elementType: 'socialIcon', // Custom property for identification
            url: '',
            urlType: 'url',
            hoverCursor: 'pointer', // Show pointer cursor on hover
            svgCode, // Store SVG code for color editing
            isSvgIcon: true, // Flag to identify SVG icons
          });

          // Add click handler for the SVG social icon
          svgGroup.on('mousedown', function (this: any, e: any) {
            if (e.e.button !== 0) {
              return;
            }

            if (this.url && !canvas.getActiveObject()) {
              e.e.preventDefault();
              e.e.stopPropagation();

              handleIconAction(this);
            }
          });

          // Add the SVG group to the canvas
          canvas.add(svgGroup);
          canvas.setActiveObject(svgGroup);
          safeRenderAll(canvas);

          // Center the icon on the canvas
          const canvasCenter = canvas.getCenter();
          svgGroup.set({
            left: canvasCenter.left,
            top: canvasCenter.top,
            originX: 'center',
            originY: 'center',
          });

          safeRenderAll(canvas);

          // Notify that a new element was added
          canvas.fire('object:modified', { target: svgGroup });

          // Show a hint about single-clicking
          toast.info('Click the icon to edit its URL and name. SVG icons support color editing!');
        }
      });
      return;
    }

    // Fallback to image-based icon
    fabric.Image.fromURL(iconPath, (img: any) => {
      // Set a default size for social icons
      const iconSize = 50;

      // Scale the image to fit the desired size while maintaining aspect ratio
      const scale = iconSize / Math.max(img.width || 1, img.height || 1);

      img.set({
        left: 100,
        top: 100,
        scaleX: scale,
        scaleY: scale,
        cornerSize: 12,
        cornerStyle: 'circle',
        cornerColor: '#2563eb',
        cornerStrokeColor: '#ffffff',
        transparentCorners: false,
        borderColor: '#2563eb',
        borderScaleFactor: 2,
        name: iconName,
        elementType: 'socialIcon', // Custom property for identification
        // Make sure we set a default URL property - can be updated later
        url: '',
        urlType: 'url',
        hoverCursor: 'pointer', // Show pointer cursor on hover
      });

      // Add a visual indicator that this is a social icon
      img.set({
        strokeWidth: 0, // No stroke initially since there's no URL
        stroke: 'transparent',
      });

      // Add click handler for the social icon
      img.on('mousedown', function (this: any, e: any) {
        if (e.e.button !== 0) {
          return;
        }

        if (this.url && !canvas.getActiveObject()) {
          e.e.preventDefault();
          e.e.stopPropagation();
          handleIconAction(this);
        }
      });

      // Add the image to the canvas
      canvas.add(img);
      canvas.setActiveObject(img);
      safeRenderAll(canvas);

      // Center the icon on the canvas
      const canvasCenter = canvas.getCenter();
      img.set({
        left: canvasCenter.left,
        top: canvasCenter.top,
        originX: 'center',
        originY: 'center',
      });

      safeRenderAll(canvas);

      // Notify that a new element was added
      canvas.fire('object:modified', { target: img });

      // Show a hint about single-clicking
      toast.info('Click the icon to edit its URL and name');
    });
  }, [canvas, fabric, fabricReady]);

  return {
    handleAddText,
    handleBackgroundChange,
    handleAddButton,
    handleAddShape,
    handleAddLink,
    updateButtonProperties,
    updateLinkProperties,
    handleAddSocialIcon, // Export the new function
  };
}
