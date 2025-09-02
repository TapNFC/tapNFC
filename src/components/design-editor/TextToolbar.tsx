'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronUp,
  Circle,
  Italic,
  Minus,
  Plus,
  Send,
  Square,
  Strikethrough,
  Type,
  Underline,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useCanvasRenderScheduler, useThrottle } from '@/components/design-editor/utils/performance';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TextToolbarProps = {
  canvas: any;
  selectedObject?: any;
};

// Memoize font families array outside component to prevent recreation
const FONT_FAMILIES = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Helvetica',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Lucida Console',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Pinyon Script',
] as const;

// Helper function to normalize and match font family names
const normalizeFontFamily = (fontFamily: string): string => {
  if (!fontFamily) {
    return 'Inter';
  }

  // Remove quotes and normalize spaces
  const normalized = fontFamily.replace(/['"]/g, '').trim();

  // Try exact match first
  const exactMatch = FONT_FAMILIES.find(font => font === normalized);
  if (exactMatch) {
    return exactMatch;
  }

  // Try case-insensitive match
  const caseInsensitiveMatch = FONT_FAMILIES.find(font =>
    font.toLowerCase() === normalized.toLowerCase(),
  );
  if (caseInsensitiveMatch) {
    return caseInsensitiveMatch;
  }

  // Try match ignoring spaces
  const noSpacesMatch = FONT_FAMILIES.find(font =>
    font.toLowerCase().replace(/\s+/g, '') === normalized.toLowerCase().replace(/\s+/g, ''),
  );
  if (noSpacesMatch) {
    return noSpacesMatch;
  }

  // Try partial match for common variations
  const partialMatch = FONT_FAMILIES.find(font =>
    font.toLowerCase().includes(normalized.toLowerCase())
    || normalized.toLowerCase().includes(font.toLowerCase()),
  );
  if (partialMatch) {
    return partialMatch;
  }

  // Fallback to default
  return 'Inter';
};

// Memoize text alignment options
const TEXT_ALIGNMENTS = [
  { value: 'left', icon: AlignLeft, label: 'Left' },
  { value: 'center', icon: AlignCenter, label: 'Center' },
  { value: 'right', icon: AlignRight, label: 'Right' },
] as const;

export function TextToolbar({ canvas, selectedObject }: TextToolbarProps) {
  // Text properties
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#000000');

  // Shape properties
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);

  // Common properties
  const [opacity, setOpacity] = useState(100);

  const scheduleRender = useCanvasRenderScheduler(canvas);

  const isTextObject = selectedObject
    && (selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox');

  const isShapeObject = selectedObject
    && !isTextObject
    && selectedObject.type !== 'image';

  // Update properties based on selected object
  useEffect(() => {
    if (selectedObject) {
      // Debug logging to help identify selection issues
      if (process.env.NODE_ENV === 'development') {
        console.warn('Object selected:', selectedObject.type, selectedObject);
      }

      // Update state based on selected object properties
      const updateState = () => {
        // Handle text objects
        if (selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox') {
          // Extract and normalize font family
          const newFontFamily = selectedObject.fontFamily || 'Inter';

          // Normalize font family name to match our FONT_FAMILIES array
          const normalizedFontFamily = normalizeFontFamily(newFontFamily);

          // Debug logging to help identify font family issues
          if (process.env.NODE_ENV === 'development') {
            console.warn('Selected object font family:', selectedObject.fontFamily);
            console.warn('Normalized font family:', normalizedFontFamily);
            console.warn('Available font families:', FONT_FAMILIES);
          }

          const newFontSize = selectedObject.fontSize || 16;
          const newIsBold = selectedObject.fontWeight === 'bold';
          const newIsItalic = selectedObject.fontStyle === 'italic';
          const newIsUnderline = selectedObject.underline || false;
          const newIsStrikethrough = selectedObject.linethrough || false;
          const newTextAlign = selectedObject.textAlign || 'left';
          const newTextColor = selectedObject.fill || '#000000';

          setFontFamily(normalizedFontFamily);
          setFontSize(newFontSize);
          setIsBold(newIsBold);
          setIsItalic(newIsItalic);
          setIsUnderline(newIsUnderline);
          setIsStrikethrough(newIsStrikethrough);
          setTextAlign(newTextAlign);
          setTextColor(newTextColor);
        }

        // Handle shape objects or any non-text objects
        if (!isTextObject) {
          const newFillColor = selectedObject.fill || '#000000';
          const newStrokeColor = selectedObject.stroke || '#000000';
          const newStrokeWidth = selectedObject.strokeWidth || 0;

          setFillColor(newFillColor);
          setStrokeColor(newStrokeColor);
          setStrokeWidth(newStrokeWidth);
        }

        // Handle all objects for opacity
        const newOpacity = Math.round((selectedObject.opacity || 1) * 100);
        setOpacity(newOpacity);
      };

      updateState();
    } else {
      // Reset to defaults when no object is selected
      setOpacity(100);
    }
  }, [selectedObject, isTextObject]);

  const updateObjectProperty = useCallback((property: string, value: any) => {
    if (selectedObject && canvas) {
      selectedObject.set?.(property, value);

      // Ensure strokeUniform is true when strokeWidth is updated
      if (property === 'strokeWidth') {
        selectedObject.set?.('strokeUniform', true);
      }

      scheduleRender();
    }
  }, [selectedObject, canvas, scheduleRender]);

  const updateTextProperty = useCallback((property: string, value: any) => {
    if (isTextObject) {
      updateObjectProperty(property, value);
    }
  }, [isTextObject, updateObjectProperty]);

  // Throttled updaters for color changes to avoid excessive canvas renders while dragging
  const throttledUpdateTextFill = useThrottle((color: string) => updateTextProperty('fill', color), 80);
  const throttledUpdateFill = useThrottle((color: string) => updateObjectProperty('fill', color), 80);
  const throttledUpdateStroke = useThrottle((color: string) => updateObjectProperty('stroke', color), 80);

  const handleFontFamilyChange = useCallback((value: string) => {
    setFontFamily(value);
    updateTextProperty('fontFamily', value);

    // Debug logging to help identify font family change issues
    if (process.env.NODE_ENV === 'development') {
      console.warn('Font family changed to:', value);
      console.warn('Selected object:', selectedObject);
    }
  }, [updateTextProperty, selectedObject]);

  const handleFontSizeChange = useCallback((value: string) => {
    const size = Number.parseInt(value);
    if (!Number.isNaN(size) && size > 0) {
      setFontSize(size);
      updateTextProperty('fontSize', size);
    }
  }, [updateTextProperty]);

  const toggleBold = useCallback(() => {
    const newValue = !isBold;
    setIsBold(newValue);
    updateTextProperty('fontWeight', newValue ? 'bold' : 'normal');
  }, [isBold, updateTextProperty]);

  const toggleItalic = useCallback(() => {
    const newValue = !isItalic;
    setIsItalic(newValue);
    updateTextProperty('fontStyle', newValue ? 'italic' : 'normal');
  }, [isItalic, updateTextProperty]);

  const toggleUnderline = useCallback(() => {
    const newValue = !isUnderline;
    setIsUnderline(newValue);
    updateTextProperty('underline', newValue);
  }, [isUnderline, updateTextProperty]);

  const toggleStrikethrough = useCallback(() => {
    const newValue = !isStrikethrough;
    setIsStrikethrough(newValue);
    updateTextProperty('linethrough', newValue);
  }, [isStrikethrough, updateTextProperty]);

  const handleTextAlign = useCallback((align: string) => {
    setTextAlign(align);
    updateTextProperty('textAlign', align);
  }, [updateTextProperty]);

  const handleTextColorChange = useCallback((color: string) => {
    setTextColor(color);
    throttledUpdateTextFill(color);
  }, [throttledUpdateTextFill]);

  const handleFillColorChange = useCallback((color: string) => {
    setFillColor(color);
    throttledUpdateFill(color);
  }, [throttledUpdateFill]);

  const handleStrokeColorChange = useCallback((color: string) => {
    setStrokeColor(color);
    throttledUpdateStroke(color);
  }, [throttledUpdateStroke]);

  const handleStrokeWidthChange = useCallback((width: number) => {
    setStrokeWidth(width);
    updateObjectProperty('strokeWidth', width);
  }, [updateObjectProperty]);

  const handleOpacityChange = useCallback((value: number[]) => {
    // Only proceed if value is an array with at least one element
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number') {
      const opacityValue = value[0] / 100;
      setOpacity(value[0]);
      updateObjectProperty('opacity', opacityValue);
    }
  }, [updateObjectProperty]);

  const increaseFontSize = useCallback(() => {
    const newSize = Math.min(fontSize + 2, 200);
    setFontSize(newSize);
    updateTextProperty('fontSize', newSize);
  }, [fontSize, updateTextProperty]);

  const decreaseFontSize = useCallback(() => {
    const newSize = Math.max(fontSize - 2, 8);
    setFontSize(newSize);
    updateTextProperty('fontSize', newSize);
  }, [fontSize, updateTextProperty]);

  const bringToFront = useCallback(() => {
    if (selectedObject && canvas) {
      canvas.bringToFront?.(selectedObject);
      canvas.renderAll?.();
    }
  }, [selectedObject, canvas]);

  const sendToBack = useCallback(() => {
    if (selectedObject && canvas) {
      canvas.sendToBack?.(selectedObject);
      canvas.renderAll?.();
    }
  }, [selectedObject, canvas]);

  const bringForward = useCallback(() => {
    if (selectedObject && canvas) {
      canvas.bringForward?.(selectedObject);
      canvas.renderAll?.();
    }
  }, [selectedObject, canvas]);

  const sendBackward = useCallback(() => {
    if (selectedObject && canvas) {
      canvas.sendBackward?.(selectedObject);
      canvas.renderAll?.();
    }
  }, [selectedObject, canvas]);

  // Render the text toolbar controls
  const renderTextControls = () => (
    <>
      {/* Font Family */}
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">Font:</Label>
        <Select
          value={fontFamily}
          onValueChange={handleFontFamilyChange}
          disabled={!isTextObject}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map(font => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size */}
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={decreaseFontSize}
              className="size-8 p-0"
              disabled={!isTextObject}
            >
              <Minus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Decrease font size</TooltipContent>
        </Tooltip>

        <Input
          type="number"
          value={fontSize}
          onChange={e => handleFontSizeChange(e.target.value)}
          className="w-16 text-center text-sm"
          min="8"
          max="200"
          disabled={!isTextObject}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={increaseFontSize}
              className="size-8 p-0"
              disabled={!isTextObject}
            >
              <Plus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Increase font size</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isBold ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggleBold}
              className="size-8 p-0"
              disabled={!isTextObject}
            >
              <Bold className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isItalic ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggleItalic}
              className="size-8 p-0"
              disabled={!isTextObject}
            >
              <Italic className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isUnderline ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggleUnderline}
              className="size-8 p-0"
              disabled={!isTextObject}
            >
              <Underline className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isStrikethrough ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggleStrikethrough}
              className="size-8 p-0"
              disabled={!isTextObject}
            >
              <Strikethrough className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Strikethrough</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <div className="flex items-center space-x-1">
        {TEXT_ALIGNMENTS.map(({ value, icon: Icon, label }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <Button
                variant={textAlign === value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleTextAlign(value)}
                className="size-8 p-0"
                title={label}
                disabled={!isTextObject}
              >
                <Icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Color */}
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">Text:</Label>
        <div className="relative">
          <input
            type="color"
            value={textColor}
            onChange={e => handleTextColorChange(e.target.value)}
            className="size-8 cursor-pointer rounded border-2 border-gray-300 shadow-sm"
            disabled={!isTextObject}
          />
        </div>
      </div>
    </>
  );

  // Render the shape toolbar controls
  const renderShapeControls = () => (
    <>
      {/* Shape Type Indicator */}
      <div className="flex items-center space-x-2">
        <div className="rounded-md bg-blue-100 p-1.5">
          {selectedObject?.type === 'rect' && <Square className="size-5 text-blue-600" />}
          {selectedObject?.type === 'circle' && <Circle className="size-5 text-blue-600" />}
          {(!selectedObject?.type || selectedObject?.type === 'path') && <Type className="size-5 text-blue-600" />}
        </div>
        <Label className="font-medium text-gray-700">
          {selectedObject?.type === 'rect' && 'Rectangle'}
          {selectedObject?.type === 'circle' && 'Circle'}
          {selectedObject?.type === 'triangle' && 'Triangle'}
          {selectedObject?.type === 'path' && 'Path'}
          {!selectedObject?.type && 'Shape'}
        </Label>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Fill Color */}
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">Fill:</Label>
        <div className="relative">
          <input
            type="color"
            value={fillColor}
            onChange={e => handleFillColorChange(e.target.value)}
            className="size-8 cursor-pointer rounded border-2 border-gray-300 shadow-sm"
            disabled={!isShapeObject}
          />
        </div>
      </div>

      {/* Stroke Color */}
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">Stroke:</Label>
        <div className="relative">
          <input
            type="color"
            value={strokeColor}
            onChange={e => handleStrokeColorChange(e.target.value)}
            className="size-8 cursor-pointer rounded border-2 border-gray-300 shadow-sm"
            disabled={!isShapeObject}
          />
        </div>
      </div>

      {/* Stroke Width */}
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-gray-700">Width:</Label>
        <Input
          type="number"
          value={strokeWidth}
          onChange={e => handleStrokeWidthChange(Number(e.target.value))}
          className="w-16 text-sm"
          min="0"
          max="20"
          disabled={!isShapeObject}
        />
      </div>
    </>
  );

  return (
    <div className="border-b border-white/20 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <TooltipProvider>
          <div className="flex items-center space-x-4">
            {/* Dynamically switch between text and shape controls */}
            {isShapeObject ? renderShapeControls() : renderTextControls()}

            <Separator orientation="vertical" className="h-6" />

            {/* Opacity Control - for all objects */}
            <div className={`flex items-center space-x-3 ${!selectedObject ? 'opacity-50' : ''}`}>
              <Label className="text-sm font-medium text-gray-700">Opacity:</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[opacity]}
                  onValueChange={handleOpacityChange}
                  max={100}
                  min={0}
                  step={1}
                  className="w-24"
                  disabled={!selectedObject}
                />
                <span className="w-8 text-xs text-gray-600">
                  {opacity}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Layer Controls - only enabled when an object is selected */}
          <div className={`flex items-center space-x-1 ${!selectedObject ? 'opacity-50' : ''}`}>
            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={bringToFront}
                  className="size-8 p-0"
                  disabled={!selectedObject}
                >
                  <ChevronUp className="size-4" />
                  <Send className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bring to front</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={bringForward}
                  className="size-8 p-0"
                  disabled={!selectedObject}
                >
                  <ChevronUp className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bring forward</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={sendBackward}
                  className="size-8 p-0"
                  disabled={!selectedObject}
                >
                  <ChevronDown className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send backward</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={sendToBack}
                  className="size-8 p-0"
                  disabled={!selectedObject}
                >
                  <ChevronDown className="size-4" />
                  <Send className="size-3 rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send to back</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
