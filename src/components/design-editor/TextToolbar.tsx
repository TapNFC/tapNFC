'use client';

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  ChevronDown,
  ChevronUp,
  Circle,
  Italic,
  Minus,
  Plus,
  Square,
  Strikethrough,
  Type,
  Underline,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type TextToolbarProps = {
  canvas: any;
  selectedObject?: any;
};

const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Palatino',
];

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

export function TextToolbar({ canvas, selectedObject }: TextToolbarProps) {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);

  // Update toolbar state when selected object changes
  useEffect(() => {
    if (selectedObject) {
      const updateState = () => {
        // Text-specific properties
        if (selectedObject.type === 'i-text') {
          setFontFamily(selectedObject.fontFamily || 'Arial');
          setFontSize(selectedObject.fontSize || 16);
          setIsBold(selectedObject.fontWeight === 'bold');
          setIsItalic(selectedObject.fontStyle === 'italic');
          setIsUnderline(selectedObject.underline || false);
          setIsStrikethrough(selectedObject.linethrough || false);
          setTextAlign(selectedObject.textAlign || 'left');
          setTextColor(selectedObject.fill || '#000000');
        }

        // Shape and general object properties
        setFillColor(selectedObject.fill || '#000000');
        setStrokeColor(selectedObject.stroke || '#000000');
        setStrokeWidth(selectedObject.strokeWidth || 1);
      };

      updateState();
    }
  }, [selectedObject]);

  const updateObjectProperty = (property: string, value: any) => {
    if (!canvas || !selectedObject) {
      return;
    }

    selectedObject.set(property, value);
    canvas.renderAll();
  };

  const updateTextProperty = (property: string, value: any) => {
    if (!canvas || !selectedObject || selectedObject.type !== 'i-text') {
      return;
    }

    selectedObject.set(property, value);
    canvas.renderAll();
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    updateTextProperty('fontFamily', value);
  };

  const handleFontSizeChange = (value: string) => {
    const size = Number.parseInt(value);
    setFontSize(size);
    updateTextProperty('fontSize', size);
  };

  const toggleBold = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateTextProperty('fontWeight', newBold ? 'bold' : 'normal');
  };

  const toggleItalic = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateTextProperty('fontStyle', newItalic ? 'italic' : 'normal');
  };

  const toggleUnderline = () => {
    const newUnderline = !isUnderline;
    setIsUnderline(newUnderline);
    updateTextProperty('underline', newUnderline);
  };

  const toggleStrikethrough = () => {
    const newStrikethrough = !isStrikethrough;
    setIsStrikethrough(newStrikethrough);
    updateTextProperty('linethrough', newStrikethrough);
  };

  const handleTextAlign = (align: string) => {
    setTextAlign(align);
    updateTextProperty('textAlign', align);
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    updateTextProperty('fill', color);
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    updateObjectProperty('fill', color);
  };

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    updateObjectProperty('stroke', color);
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    updateObjectProperty('strokeWidth', width);
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 72);
    setFontSize(newSize);
    updateTextProperty('fontSize', newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 8);
    setFontSize(newSize);
    updateTextProperty('fontSize', newSize);
  };

  // Layer management functions
  const bringToFront = () => {
    if (!canvas || !selectedObject) {
      return;
    }
    canvas.bringToFront(selectedObject);
    canvas.renderAll();
  };

  const sendToBack = () => {
    if (!canvas || !selectedObject) {
      return;
    }
    canvas.sendToBack(selectedObject);
    canvas.renderAll();
  };

  const bringForward = () => {
    if (!canvas || !selectedObject) {
      return;
    }
    canvas.bringForward(selectedObject);
    canvas.renderAll();
  };

  const sendBackward = () => {
    if (!canvas || !selectedObject) {
      return;
    }
    canvas.sendBackwards(selectedObject);
    canvas.renderAll();
  };

  const isTextSelected = selectedObject && selectedObject.type === 'i-text';
  const isShapeSelected = selectedObject && ['rect', 'circle', 'ellipse', 'polygon', 'path'].includes(selectedObject.type);
  const isAnyObjectSelected = !!selectedObject;

  return (
    <div className="relative flex items-center gap-3 overflow-x-auto border-b border-white/20 bg-white/80 p-4 shadow-lg shadow-blue-100/20 backdrop-blur-xl">
      {/* Elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>

      <div className="relative z-10 flex w-full items-center gap-3">
        {/* Text Controls - Only show when text is selected */}
        {isTextSelected && (
          <>
            {/* Font Family */}
            <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* Font Size Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={decreaseFontSize}
              >
                <Minus className="size-3" />
              </Button>

              <Select value={fontSize.toString()} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={increaseFontSize}
              >
                <Plus className="size-3" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <Button
                variant={isBold ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0 transition-all duration-200 hover:bg-white/60 hover:text-blue-600"
                onClick={toggleBold}
              >
                <Bold className="size-4" />
              </Button>

              <Button
                variant={isItalic ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0 transition-all duration-200 hover:bg-white/60 hover:text-blue-600"
                onClick={toggleItalic}
              >
                <Italic className="size-4" />
              </Button>

              <Button
                variant={isUnderline ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0 transition-all duration-200 hover:bg-white/60 hover:text-blue-600"
                onClick={toggleUnderline}
              >
                <Underline className="size-4" />
              </Button>

              <Button
                variant={isStrikethrough ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0 transition-all duration-200 hover:bg-white/60 hover:text-blue-600"
                onClick={toggleStrikethrough}
              >
                <Strikethrough className="size-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Text Alignment */}
            <div className="flex items-center gap-1">
              <Button
                variant={textAlign === 'left' ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0"
                onClick={() => handleTextAlign('left')}
              >
                <AlignLeft className="size-4" />
              </Button>

              <Button
                variant={textAlign === 'center' ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0"
                onClick={() => handleTextAlign('center')}
              >
                <AlignCenter className="size-4" />
              </Button>

              <Button
                variant={textAlign === 'right' ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0"
                onClick={() => handleTextAlign('right')}
              >
                <AlignRight className="size-4" />
              </Button>

              <Button
                variant={textAlign === 'justify' ? 'primary' : 'ghost'}
                size="sm"
                className="size-8 p-0"
                onClick={() => handleTextAlign('justify')}
              >
                <AlignJustify className="size-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Text Color */}
            <div className="flex items-center gap-2">
              <Type className="size-4 text-gray-500" />
              <input
                type="color"
                value={textColor}
                onChange={e => handleTextColorChange(e.target.value)}
                className="size-8 cursor-pointer rounded border border-gray-300"
              />
            </div>

            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* Shape Controls - Show when shapes are selected */}
        {isShapeSelected && (
          <>
            {/* Fill Color */}
            <div className="flex items-center gap-2">
              <Square className="size-4 text-gray-500" />
              <span className="text-xs text-gray-500">Fill</span>
              <input
                type="color"
                value={fillColor}
                onChange={e => handleFillColorChange(e.target.value)}
                className="size-8 cursor-pointer rounded border border-gray-300"
              />
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Stroke Color */}
            <div className="flex items-center gap-2">
              <Circle className="size-4 text-gray-500" />
              <span className="text-xs text-gray-500">Border</span>
              <input
                type="color"
                value={strokeColor}
                onChange={e => handleStrokeColorChange(e.target.value)}
                className="size-8 cursor-pointer rounded border border-gray-300"
              />
            </div>

            {/* Stroke Width */}
            <div className="flex items-center gap-1">
              <input
                type="range"
                min="0"
                max="20"
                value={strokeWidth}
                onChange={e => handleStrokeWidthChange(Number.parseInt(e.target.value))}
                className="h-2 w-16"
              />
              <span className="w-6 text-xs text-gray-500">
                {strokeWidth}
                px
              </span>
            </div>

            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* Layer Controls - Works for any selected object */}
        {isAnyObjectSelected && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={bringToFront}
              title="Bring to Front"
            >
              <ArrowUp className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={bringForward}
              title="Bring Forward"
            >
              <ChevronUp className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={sendBackward}
              title="Send Backward"
            >
              <ChevronDown className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={sendToBack}
              title="Send to Back"
            >
              <ArrowDown className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
