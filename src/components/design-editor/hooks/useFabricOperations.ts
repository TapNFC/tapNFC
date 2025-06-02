import { useCallback } from 'react';
import { toast } from 'sonner';

type UseFabricOperationsOptions = {
  canvas: any;
  fabric: any;
  fabricReady: boolean;
};

export function useFabricOperations({ canvas, fabric, fabricReady }: UseFabricOperationsOptions) {
  const handleAddText = useCallback((textType: string) => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas not ready');
      return;
    }

    let textContent = 'New Text';
    let fontSize = 16;

    switch (textType) {
      case 'add-text':
      case 'heading': {
        textContent = 'Heading';
        fontSize = 32;
        break;
      }
      case 'add-subheading':
      case 'subheading': {
        textContent = 'Subheading';
        fontSize = 24;
        break;
      }
      case 'add-body':
      case 'body': {
        textContent = 'Body text';
        fontSize = 16;
        break;
      }
      default: {
        textContent = 'Text';
        fontSize = 16;
        break;
      }
    }

    const text = new fabric.IText(textContent, {
      left: 100,
      top: 100,
      fontSize,
      fontFamily: 'Inter',
      fill: '#000000',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [canvas, fabric, fabricReady]);

  const handleAddShape = useCallback((shapeType: string) => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas not ready');
      return;
    }

    let shape;

    switch (shapeType) {
      case 'rectangle': {
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
        });
        break;
      }
      case 'circle': {
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
        });
        break;
      }
      case 'triangle': {
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
        });
        break;
      }
      default:
        return;
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  }, [canvas, fabric, fabricReady]);

  const handleBackgroundChange = useCallback((background: string | { type: string; value: string }) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    if (typeof background === 'string') {
      canvas.setBackgroundColor(background, canvas.renderAll.bind(canvas));
    } else {
      // Handle gradient or pattern backgrounds
      canvas.setBackgroundColor(background.value, canvas.renderAll.bind(canvas));
    }
  }, [canvas]);

  const handleAddButton = useCallback(() => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas not ready');
      return;
    }

    const buttonGroup = new fabric.Group([
      new fabric.Rect({
        width: 120,
        height: 40,
        fill: '#3b82f6',
        rx: 8,
        ry: 8,
      }),
      new fabric.IText('Button', {
        fontSize: 14,
        fill: '#ffffff',
        fontFamily: 'Inter',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
      }),
    ], {
      left: 100,
      top: 100,
    });

    canvas.add(buttonGroup);
    canvas.setActiveObject(buttonGroup);
    canvas.renderAll();
  }, [canvas, fabric, fabricReady]);

  const handleAddLink = useCallback(() => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas not ready');
      return;
    }

    // For now, use default values - in a real app, this would open a dialog
    const linkText = 'Link';
    const linkUrl = 'https://example.com';

    const link = new fabric.IText(linkText, {
      left: 100,
      top: 100,
      fontSize: 16,
      fill: '#3b82f6',
      fontFamily: 'Inter',
      underline: true,
      selectable: true,
      hoverCursor: 'pointer',
      moveCursor: 'pointer',
    });

    // Store URL as custom property
    (link as any).linkUrl = linkUrl;

    canvas.add(link);
    canvas.setActiveObject(link);
    canvas.renderAll();

    toast.success('Link added to canvas');
  }, [canvas, fabric, fabricReady]);

  // Helper function to update button properties
  const updateButtonProperties = useCallback((buttonObject: any, updates: any) => {
    if (!buttonObject || buttonObject.elementType !== 'button') {
      return;
    }

    try {
      const buttonData = { ...buttonObject.buttonData, ...updates };
      buttonObject.set('buttonData', buttonData);

      // Update visual properties
      const [bgRect, textObj] = buttonObject.getObjects();

      if (bgRect && updates.backgroundColor) {
        bgRect.set('fill', updates.backgroundColor);
      }
      if (bgRect && updates.borderColor) {
        bgRect.set('stroke', updates.borderColor);
      }
      if (bgRect && updates.borderRadius !== undefined) {
        bgRect.set({ rx: updates.borderRadius, ry: updates.borderRadius });
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

      canvas.renderAll();
    } catch (error) {
      console.error('Error updating button properties:', error);
    }
  }, [canvas]);

  // Helper function to update link properties
  const updateLinkProperties = useCallback((linkObject: any, updates: any) => {
    if (!linkObject || linkObject.elementType !== 'link') {
      return;
    }

    try {
      const linkData = { ...linkObject.linkData, ...updates };
      linkObject.set('linkData', linkData);

      // Update visual properties
      if (updates.text) {
        linkObject.set('text', updates.text);
      }
      if (updates.color) {
        linkObject.set('fill', updates.color);
      }
      if (updates.fontSize) {
        linkObject.set('fontSize', updates.fontSize);
      }
      if (updates.fontWeight) {
        linkObject.set('fontWeight', updates.fontWeight);
      }
      if (updates.textDecoration) {
        linkObject.set('underline', updates.textDecoration === 'underline');
        linkObject.set('linethrough', updates.textDecoration === 'line-through');
      }

      canvas.renderAll();
    } catch (error) {
      console.error('Error updating link properties:', error);
    }
  }, [canvas]);

  return {
    handleAddText,
    handleAddShape,
    handleBackgroundChange,
    handleAddButton,
    handleAddLink,
    updateButtonProperties,
    updateLinkProperties,
  };
}
