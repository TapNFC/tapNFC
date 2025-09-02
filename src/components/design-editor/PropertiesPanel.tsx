'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  MousePointer,
  RotateCw,
  Trash2,
  Type,
  Unlock,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCanvasRenderScheduler, useThrottle } from '@/components/design-editor/utils/performance';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

type PropertiesPanelProps = {
  canvas?: any;
  selectedObject?: any;
  updateButtonProperties?: (buttonObject: any, updates: any) => void;
  updateLinkProperties?: (linkObject: any, updates: any) => void;
};

export function PropertiesPanel({
  canvas,
  selectedObject,
  updateButtonProperties,
  updateLinkProperties,
}: PropertiesPanelProps) {
  const [objectProperties, setObjectProperties] = useState<any>({});
  const scheduleRender = useCanvasRenderScheduler(canvas);

  // Throttled setters specifically for high-frequency color updates
  const throttledSetFill = useThrottle((value: string) => {
    if (!canvas || !selectedObject) {
      return;
    }
    selectedObject.set('fill', value);
    scheduleRender();
    setObjectProperties((prev: any) => ({ ...prev, fill: value }));
  }, 80);

  const throttledSetStroke = useThrottle((value: string) => {
    if (!canvas || !selectedObject) {
      return;
    }
    selectedObject.set('stroke', value);
    scheduleRender();
    setObjectProperties((prev: any) => ({ ...prev, stroke: value }));
  }, 80);

  // Update local state when selected object changes
  useEffect(() => {
    if (selectedObject) {
      const newProperties = {
        left: Math.round(selectedObject.left || 0),
        top: Math.round(selectedObject.top || 0),
        width: Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1)),
        height: Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1)),
        angle: Math.round(selectedObject.angle || 0),
        opacity: selectedObject.opacity || 1,
        visible: selectedObject.visible !== false,
        locked: selectedObject.selectable === false,
        // Text properties
        text: selectedObject.text || '',
        fontSize: selectedObject.fontSize || 16,
        fontWeight: selectedObject.fontWeight || 'normal',
        fontFamily: selectedObject.fontFamily || 'Arial',
        fill: selectedObject.fill || '#000000',
        textAlign: selectedObject.textAlign || 'left',
        // Shape properties
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 0,
        rx: selectedObject.rx || 0,
        // Button properties
        buttonData: selectedObject.buttonData || null,
        // Link properties
        linkData: selectedObject.linkData || null,
      };

      setObjectProperties(() => newProperties);
    }
  }, [selectedObject]);

  if (!selectedObject) {
    return null;
  }

  const updateObjectProperty = (property: string, value: any) => {
    if (!canvas || !selectedObject) {
      return;
    }

    try {
      selectedObject.set(property, value);

      // Ensure strokeUniform is true when strokeWidth is updated
      if (property === 'strokeWidth') {
        selectedObject.set('strokeUniform', true);
      }

      scheduleRender();

      // Update local state
      setObjectProperties((prev: any) => ({ ...prev, [property]: value }));
    } catch (error) {
      console.error('Error updating object property:', error);
    }
  };

  const updateObjectTransform = (updates: any) => {
    if (!canvas || !selectedObject) {
      return;
    }

    try {
      Object.keys(updates).forEach((key) => {
        selectedObject.set(key, updates[key]);
      });
      selectedObject.setCoords();
      scheduleRender();

      // Update local state
      setObjectProperties((prev: any) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating object transform:', error);
    }
  };

  const handlePositionChange = (field: 'left' | 'top', value: string) => {
    const numValue = Number.parseFloat(value) || 0;
    updateObjectTransform({ [field]: numValue });
  };

  const handleSizeChange = (field: 'width' | 'height', value: string) => {
    if (!selectedObject) {
      return;
    }

    const numValue = Number.parseFloat(value) || 1;

    // For images, check if the new size would exceed canvas boundaries
    if (selectedObject.type === 'image' && canvas) {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      if (field === 'width') {
        const newWidth = numValue;
        const newHeight = (selectedObject.height || 0) * (selectedObject.scaleY || 1);

        // Check if new dimensions would exceed canvas
        if (newWidth > canvasWidth || newHeight > canvasHeight) {
          // Calculate constrained dimensions
          const maxWidth = Math.min(newWidth, canvasWidth);
          const maxHeight = Math.min(newHeight, canvasHeight);

          // Apply the smaller constraint
          if (maxWidth / newWidth < maxHeight / newHeight) {
            const constrainedWidth = maxWidth;
            const scaleX = constrainedWidth / (selectedObject.width || 1);
            updateObjectTransform({ scaleX });
          } else {
            const constrainedHeight = maxHeight;
            const scaleY = constrainedHeight / (selectedObject.height || 1);
            updateObjectTransform({ scaleY });
          }
          return;
        }
      } else {
        const newHeight = numValue;
        const newWidth = (selectedObject.width || 0) * (selectedObject.scaleX || 1);

        // Check if new dimensions would exceed canvas
        if (newWidth > canvasWidth || newHeight > canvasHeight) {
          // Calculate constrained dimensions
          const maxWidth = Math.min(newWidth, canvasWidth);
          const maxHeight = Math.min(newHeight, canvasHeight);

          // Apply the smaller constraint
          if (maxWidth / newWidth < maxHeight / newHeight) {
            const constrainedWidth = maxWidth;
            const scaleX = constrainedWidth / (selectedObject.width || 1);
            updateObjectTransform({ scaleX });
          } else {
            const constrainedHeight = maxHeight;
            const scaleY = constrainedHeight / (selectedObject.height || 1);
            updateObjectTransform({ scaleY });
          }
          return;
        }
      }
    }

    // Apply normal scaling if no constraints needed
    if (field === 'width') {
      const scaleX = numValue / (selectedObject.width || 1);
      updateObjectTransform({ scaleX });
    } else {
      const scaleY = numValue / (selectedObject.height || 1);
      updateObjectTransform({ scaleY });
    }
  };

  const handleOpacityChange = (value: number[]) => {
    if (!value || value.length === 0 || value[0] === undefined) {
      return;
    }
    updateObjectProperty('opacity', value[0] / 100);
  };

  const handleRotationChange = (value: string) => {
    const numValue = Number.parseFloat(value) || 0;
    updateObjectProperty('angle', numValue);
  };

  const toggleLock = () => {
    const newLocked = !objectProperties.locked;
    updateObjectProperty('selectable', !newLocked);
    updateObjectProperty('evented', !newLocked);
    setObjectProperties((prev: any) => ({ ...prev, locked: newLocked }));
  };

  const toggleVisibility = () => {
    const newVisible = !objectProperties.visible;
    updateObjectProperty('visible', newVisible);
    setObjectProperties((prev: any) => ({ ...prev, visible: newVisible }));
  };

  const duplicateElement = () => {
    if (!canvas || !selectedObject) {
      return;
    }

    try {
      selectedObject.clone((cloned: any) => {
        // Preserve all custom properties for icons and other elements
        if (selectedObject.elementType) {
          cloned.elementType = selectedObject.elementType;
        }
        if (selectedObject.svgCode) {
          cloned.svgCode = selectedObject.svgCode;
        }
        if (selectedObject.isSvgIcon) {
          cloned.isSvgIcon = selectedObject.isSvgIcon;
        }
        if (selectedObject.url) {
          cloned.url = selectedObject.url;
        }
        if (selectedObject.name) {
          cloned.name = selectedObject.name;
        }
        if (selectedObject.hoverCursor) {
          cloned.hoverCursor = selectedObject.hoverCursor;
        }
        if (selectedObject.buttonData) {
          cloned.buttonData = selectedObject.buttonData;
        }
        if (selectedObject.linkData) {
          cloned.linkData = selectedObject.linkData;
        }
        if (selectedObject.elementType === 'socialIcon') {
          // Ensure social icon properties are preserved
          cloned.elementType = 'socialIcon';
          cloned.hoverCursor = 'pointer';
        }

        cloned.set({
          left: cloned.left + 20,
          top: cloned.top + 20,
          evented: true,
          selectable: true,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        scheduleRender();
      });
    } catch (error) {
      console.error('Error duplicating element:', error);
    }
  };

  const deleteElement = () => {
    if (!canvas || !selectedObject) {
      return;
    }

    try {
      canvas.remove(selectedObject);
      scheduleRender();
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };

  // Button property handlers
  const handleButtonPropertyChange = (field: string, value: any) => {
    if (!selectedObject || !selectedObject.buttonData || !updateButtonProperties) {
      return;
    }

    const updates = { [field]: value };
    updateButtonProperties(selectedObject, updates);

    // Update local state
    setObjectProperties((prev: any) => ({
      ...prev,
      buttonData: { ...prev.buttonData, ...updates },
    }));
  };

  const handleButtonActionChange = (field: string, value: any) => {
    if (!selectedObject || !selectedObject.buttonData || !updateButtonProperties) {
      return;
    }

    const updates = {
      action: {
        ...selectedObject.buttonData.action,
        [field]: value,
      },
    };
    updateButtonProperties(selectedObject, updates);

    // Update local state
    setObjectProperties((prev: any) => ({
      ...prev,
      buttonData: {
        ...prev.buttonData,
        action: { ...prev.buttonData.action, [field]: value },
      },
    }));
  };

  // Link property handlers
  const handleLinkPropertyChange = (field: string, value: any) => {
    if (!selectedObject || !selectedObject.linkData || !updateLinkProperties) {
      return;
    }

    const updates = { [field]: value };
    updateLinkProperties(selectedObject, updates);

    // Update local state
    setObjectProperties((prev: any) => ({
      ...prev,
      linkData: { ...prev.linkData, ...updates },
    }));
  };

  const getElementType = () => {
    if (selectedObject.elementType === 'button') {
      return 'Button';
    }
    if (selectedObject.elementType === 'link') {
      return 'Link';
    }
    if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
      return 'Text';
    }
    if (selectedObject.type === 'image') {
      return 'Image';
    }
    if (selectedObject.type === 'rect') {
      return 'Rectangle';
    }
    if (selectedObject.type === 'circle') {
      return 'Circle';
    }
    if (selectedObject.type === 'triangle') {
      return 'Triangle';
    }
    if (selectedObject.type === 'polygon') {
      return 'Polygon';
    }
    if (selectedObject.type === 'group') {
      return 'Group';
    }
    return 'Element';
  };

  const isTextElement = selectedObject.type === 'i-text' || selectedObject.type === 'text';
  const isShapeElement = ['rect', 'circle', 'triangle', 'polygon'].includes(selectedObject.type);
  const isButtonElement = selectedObject.elementType === 'button';
  const isLinkElement = selectedObject.elementType === 'link';

  return (
    <div className="w-80 overflow-y-auto border-l border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Properties</h3>
          <p className="text-xs text-gray-500">{getElementType()}</p>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={duplicateElement}
            className="size-8 p-0"
            title="Duplicate"
          >
            <Copy className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLock}
            className="size-8 p-0"
            title={objectProperties.locked ? 'Unlock' : 'Lock'}
          >
            {objectProperties.locked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVisibility}
            className="size-8 p-0"
            title={objectProperties.visible ? 'Hide' : 'Show'}
          >
            {objectProperties.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteElement}
            className="size-8 p-0 text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Position & Size */}
      <div className="mb-6 space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Position & Size</h4>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="x-position" className="text-xs">X</Label>
            <Input
              id="x-position"
              type="number"
              value={objectProperties.left}
              onChange={e => handlePositionChange('left', e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="y-position" className="text-xs">Y</Label>
            <Input
              id="y-position"
              type="number"
              value={objectProperties.top}
              onChange={e => handlePositionChange('top', e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="width" className="text-xs">Width</Label>
            <Input
              id="width"
              type="number"
              value={objectProperties.width}
              onChange={e => handleSizeChange('width', e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-xs">Height</Label>
            <Input
              id="height"
              type="number"
              value={objectProperties.height}
              onChange={e => handleSizeChange('height', e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="rotation" className="text-xs">Rotation</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="rotation"
              type="number"
              value={objectProperties.angle}
              onChange={e => handleRotationChange(e.target.value)}
              className="h-8"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRotationChange('0')}
              className="size-8 p-0"
              title="Reset rotation"
            >
              <RotateCw className="size-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs">Opacity</Label>
          <div className="mt-2">
            <Slider
              value={[objectProperties.opacity * 100]}
              onValueChange={handleOpacityChange}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="mt-1 text-center text-xs text-gray-500">
              {Math.round(objectProperties.opacity * 100)}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Button Properties */}
      {isButtonElement && objectProperties.buttonData && (
        <div className="mb-6 space-y-4">
          <h4 className="flex items-center text-sm font-medium text-gray-700">
            <MousePointer className="mr-2 size-4" />
            Button Properties
          </h4>

          <div>
            <Label htmlFor="button-text" className="text-xs">Button Text</Label>
            <Input
              id="button-text"
              value={objectProperties.buttonData.text || ''}
              onChange={e => handleButtonPropertyChange('text', e.target.value)}
              className="h-8"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="button-font-size" className="text-xs">Font Size</Label>
              <Input
                id="button-font-size"
                type="number"
                value={objectProperties.buttonData.fontSize || 14}
                onChange={e => handleButtonPropertyChange('fontSize', Number.parseInt(e.target.value) || 14)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="button-font-weight" className="text-xs">Font Weight</Label>
              <Select
                value={objectProperties.buttonData.fontWeight || 'normal'}
                onValueChange={value => handleButtonPropertyChange('fontWeight', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="button-bg-color" className="text-xs">Background Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id="button-bg-color"
                type="color"
                value={objectProperties.buttonData.backgroundColor || '#3b82f6'}
                onChange={e => handleButtonPropertyChange('backgroundColor', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <Input
                value={objectProperties.buttonData.backgroundColor || '#3b82f6'}
                onChange={e => handleButtonPropertyChange('backgroundColor', e.target.value)}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="button-text-color" className="text-xs">Text Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id="button-text-color"
                type="color"
                value={objectProperties.buttonData.textColor || '#ffffff'}
                onChange={e => handleButtonPropertyChange('textColor', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <Input
                value={objectProperties.buttonData.textColor || '#ffffff'}
                onChange={e => handleButtonPropertyChange('textColor', e.target.value)}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="button-border-radius" className="text-xs">Border Radius</Label>
            <Input
              id="button-border-radius"
              type="number"
              value={objectProperties.buttonData.borderRadius || 8}
              onChange={e => handleButtonPropertyChange('borderRadius', Number.parseInt(e.target.value) || 0)}
              className="h-8"
              min="0"
            />
          </div>

          <div>
            <Label className="text-xs">Action</Label>
            <div className="space-y-2">
              <Select
                value={objectProperties.buttonData.action?.type || 'url'}
                onValueChange={value => handleButtonActionChange('type', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">Open URL</SelectItem>
                  <SelectItem value="email">Send Email</SelectItem>
                  <SelectItem value="phone">Call Phone</SelectItem>
                  <SelectItem value="pdf">Open PDF</SelectItem>
                  <SelectItem value="custom">Custom Action</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="button-action-value"
                placeholder={
                  objectProperties.buttonData.action?.type === 'url'
                    ? 'https://example.com'
                    : objectProperties.buttonData.action?.type === 'email'
                      ? 'email@example.com'
                      : objectProperties.buttonData.action?.type === 'phone'
                        ? '+1234567890'
                        : objectProperties.buttonData.action?.type === 'pdf'
                          ? 'Upload PDF or enter PDF URL'
                          : 'Custom action'
                }
                value={objectProperties.buttonData.action?.value || ''}
                onChange={e => handleButtonActionChange('value', e.target.value)}
                className="h-8"
              />
              {objectProperties.buttonData.action?.type === 'url' && (
                <p className="mt-1 text-xs text-amber-600">
                  ⚠️ Add a URL to make this button clickable in the preview
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link Properties */}
      {isLinkElement && objectProperties.linkData && (
        <div className="mb-6 space-y-4">
          <h4 className="flex items-center text-sm font-medium text-gray-700">
            <ExternalLink className="mr-2 size-4" />
            Link Properties
          </h4>

          <div>
            <Label htmlFor="link-text" className="text-xs">Link Text</Label>
            <Input
              id="link-text"
              value={objectProperties.linkData.text || ''}
              onChange={e => handleLinkPropertyChange('text', e.target.value)}
              className="h-8"
            />
          </div>

          <div>
            <Label htmlFor="link-url" className="text-xs">URL</Label>
            <Input
              id="link-url"
              value={objectProperties.linkData.url || ''}
              onChange={e => handleLinkPropertyChange('url', e.target.value)}
              placeholder="https://example.com or https://yourwebsite.com"
              className="h-8"
            />
            {(!objectProperties.linkData.url || objectProperties.linkData.url.trim() === '') && (
              <p className="mt-1 text-xs text-amber-600">⚠️ Add a URL to make this link functional in the preview</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="link-font-size" className="text-xs">Font Size</Label>
              <Input
                id="link-font-size"
                type="number"
                value={objectProperties.linkData.fontSize || 16}
                onChange={e => handleLinkPropertyChange('fontSize', Number.parseInt(e.target.value) || 16)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="link-font-weight" className="text-xs">Font Weight</Label>
              <Select
                value={objectProperties.linkData.fontWeight || 'normal'}
                onValueChange={value => handleLinkPropertyChange('fontWeight', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="link-color" className="text-xs">Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id="link-color"
                type="color"
                value={objectProperties.linkData.color || '#3b82f6'}
                onChange={e => handleLinkPropertyChange('color', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <Input
                value={objectProperties.linkData.color || '#3b82f6'}
                onChange={e => handleLinkPropertyChange('color', e.target.value)}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="link-hover-color" className="text-xs">Hover Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id="link-hover-color"
                type="color"
                value={objectProperties.linkData.hoverColor || '#1e40af'}
                onChange={e => handleLinkPropertyChange('hoverColor', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <Input
                value={objectProperties.linkData.hoverColor || '#1e40af'}
                onChange={e => handleLinkPropertyChange('hoverColor', e.target.value)}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="link-decoration" className="text-xs">Text Decoration</Label>
            <Select
              value={objectProperties.linkData.textDecoration || 'underline'}
              onValueChange={value => handleLinkPropertyChange('textDecoration', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="line-through">Line Through</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="link-target" className="text-xs">Target</Label>
            <Select
              value={objectProperties.linkData.target || '_blank'}
              onValueChange={value => handleLinkPropertyChange('target', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_blank">New Tab</SelectItem>
                <SelectItem value="_self">Same Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Text Properties */}
      {isTextElement && !isButtonElement && !isLinkElement && (
        <div className="mb-6 space-y-4">
          <h4 className="flex items-center text-sm font-medium text-gray-700">
            <Type className="mr-2 size-4" />
            Text Properties
          </h4>

          <div>
            <Label htmlFor="text-content" className="text-xs">Content</Label>
            <textarea
              id="text-content"
              value={objectProperties.text}
              onChange={e => updateObjectProperty('text', e.target.value)}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="font-size" className="text-xs">Size</Label>
              <Input
                id="font-size"
                type="number"
                value={objectProperties.fontSize}
                onChange={e => updateObjectProperty('fontSize', Number.parseInt(e.target.value) || 16)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="font-weight" className="text-xs">Weight</Label>
              <Select
                value={objectProperties.fontWeight}
                onValueChange={value => updateObjectProperty('fontWeight', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="text-color" className="text-xs">Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id="text-color"
                type="color"
                value={objectProperties.fill}
                onChange={e => throttledSetFill(e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <Input
                value={objectProperties.fill}
                onChange={e => throttledSetFill(e.target.value)}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Alignment</Label>
            <div className="mt-2 flex space-x-1">
              {(['left', 'center', 'right'] as const).map(align => (
                <Button
                  key={align}
                  variant={objectProperties.textAlign === align ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => updateObjectProperty('textAlign', align)}
                  className="size-8 p-0"
                >
                  {align === 'left' && <AlignLeft className="size-4" />}
                  {align === 'center' && <AlignCenter className="size-4" />}
                  {align === 'right' && <AlignRight className="size-4" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shape Properties */}
      {isShapeElement && (
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Shape Properties</h4>

          <div>
            <Label htmlFor="fill-color" className="text-xs">Fill Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id="fill-color"
                type="color"
                value={objectProperties.fill}
                onChange={e => throttledSetFill(e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <Input
                value={objectProperties.fill}
                onChange={e => throttledSetFill(e.target.value)}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stroke-color" className="text-xs">Stroke Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id="stroke-color"
                type="color"
                value={objectProperties.stroke}
                onChange={e => throttledSetStroke(e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <Input
                value={objectProperties.stroke}
                onChange={e => throttledSetStroke(e.target.value)}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stroke-width" className="text-xs">Stroke Width</Label>
            <Input
              id="stroke-width"
              type="number"
              value={objectProperties.strokeWidth}
              onChange={e => updateObjectProperty('strokeWidth', Number.parseInt(e.target.value) || 0)}
              className="h-8"
              min="0"
            />
          </div>

          {selectedObject.type === 'rect' && (
            <div>
              <Label htmlFor="border-radius" className="text-xs">Border Radius</Label>
              <Input
                id="border-radius"
                type="number"
                value={objectProperties.rx}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 0;
                  updateObjectProperty('rx', value);
                  updateObjectProperty('ry', value);
                }}
                className="h-8"
                min="0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
