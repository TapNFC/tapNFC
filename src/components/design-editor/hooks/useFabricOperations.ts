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
          rx: 8,
          ry: 8,
        });
        break;
      }
      case 'outlined-rectangle': {
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: 'transparent',
          stroke: '#1e40af',
          strokeWidth: 3,
          rx: 8,
          ry: 8,
        });
        break;
      }
      case 'circle': {
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: '#10b981',
          stroke: '#059669',
          strokeWidth: 2,
        });
        break;
      }
      case 'outlined-circle': {
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: 'transparent',
          stroke: '#059669',
          strokeWidth: 3,
        });
        break;
      }
      case 'triangle': {
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#8b5cf6',
          stroke: '#7c3aed',
          strokeWidth: 2,
        });
        break;
      }
      case 'diamond': {
        const points = [
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 },
          { x: 0, y: 50 },
        ];

        shape = new fabric.Polygon(points, {
          left: 100,
          top: 100,
          fill: '#ec4899',
          stroke: '#db2777',
          strokeWidth: 2,
          shapeType: 'diamond',
        });
        break;
      }
      case 'line': {
        shape = new fabric.Line([0, 0, 100, 0], {
          left: 100,
          top: 100,
          stroke: '#374151',
          strokeWidth: 3,
          strokeLineCap: 'round',
        });
        break;
      }
      default:
        return;
    }

    if (shape) {
      (shape as any).elementType = 'shape';
      (shape as any).shapeData = {
        type: shapeType === 'outlined-rectangle'
          ? 'rectangle'
          : shapeType === 'outlined-circle'
            ? 'circle'
            : shapeType,
        fill: shape.fill,
        stroke: shape.stroke,
        strokeWidth: shape.strokeWidth,
      };

      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();

      toast.success(`${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added to canvas`);
    }
  }, [canvas, fabric, fabricReady]);

  const handleBackgroundChange = useCallback((background: string | { type: string; value: string }) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }

    try {
      let colorValue = '';

      if (typeof background === 'string') {
        colorValue = background;
      } else {
        colorValue = background.value;
      }

      // Validate color format
      if (!colorValue || colorValue.trim() === '') {
        toast.error('Invalid color value');
        return;
      }

      // Handle transparent background
      if (colorValue.toLowerCase() === 'transparent') {
        canvas.setBackgroundColor('rgba(0,0,0,0)', () => {
          canvas.renderAll();
          toast.success('Background set to transparent');
        });
        return;
      }

      // Set the background color
      canvas.setBackgroundColor(colorValue, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error('Error changing background color:', error);
      toast.error('Failed to change background color');
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

    (buttonGroup as any).elementType = 'button';
    (buttonGroup as any).buttonData = {
      text: 'Button',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderColor: '#1e40af',
      borderWidth: 0,
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 'normal',
      fontFamily: 'Inter',
      padding: { top: 8, right: 16, bottom: 8, left: 16 },
      action: { type: 'url', value: '' },
    };

    canvas.add(buttonGroup);
    canvas.setActiveObject(buttonGroup);
    canvas.renderAll();

    toast.success('Button added to canvas');
  }, [canvas, fabric, fabricReady]);

  const handleAddLink = useCallback(() => {
    if (!canvas || !fabric || !fabricReady) {
      toast.error('Canvas not ready');
      return;
    }

    const linkText = 'Click me';
    const linkUrl = 'https://example.com'; // Start with example URL to make testing easier

    // Create a more prominent link element
    const link = new fabric.IText(linkText, {
      left: 100,
      top: 100,
      fontSize: 18,
      fill: '#3b82f6',
      fontFamily: 'Inter',
      underline: true,
      selectable: true,
      hoverCursor: 'pointer',
      moveCursor: 'move',
      textAlign: 'center',
      width: 150, // Ensure width is set
      height: 40, // Ensure height is set
      stroke: '#3b82f6',
      strokeWidth: 0,
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
    });

    // Ensure the object has appropriate dimensions
    link.set({
      width: link.getScaledWidth() || 150,
      height: link.getScaledHeight() || 40,
    });

    // Add custom properties for the link
    (link as any).elementType = 'link';
    (link as any).linkData = {
      text: linkText,
      url: linkUrl,
      color: '#3b82f6',
      hoverColor: '#1e40af',
      fontSize: 18,
      fontWeight: 'normal',
      fontFamily: 'Inter',
      textDecoration: 'underline',
      target: '_blank',
    };

    canvas.add(link);
    canvas.setActiveObject(link);
    canvas.renderAll();

    toast.success('Link added! Double-click to edit its URL and text.');
  }, [canvas, fabric, fabricReady]);

  const updateButtonProperties = useCallback((buttonObject: any, updates: any) => {
    if (!buttonObject || buttonObject.elementType !== 'button') {
      return;
    }

    try {
      const buttonData = { ...buttonObject.buttonData, ...updates };
      buttonObject.set('buttonData', buttonData);

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

  const updateLinkProperties = useCallback((linkObject: any, updates: any) => {
    if (!linkObject || linkObject.elementType !== 'link') {
      return;
    }

    try {
      const linkData = { ...linkObject.linkData, ...updates };
      linkObject.set('linkData', linkData);

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
