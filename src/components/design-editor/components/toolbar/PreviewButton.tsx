'use client';

import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type PreviewButtonProps = {
  canvas?: any;
  onPreview?: () => void;
  hasUnsavedChanges?: boolean;
};

export function PreviewButton({ canvas, onPreview, hasUnsavedChanges = false }: PreviewButtonProps) {
  const handlePreview = () => {
    if (!canvas) {
      console.warn('Canvas not available for preview');
      toast.error('Canvas not available. Please wait and try again.');
      return;
    }

    try {
      // Get canvas dimensions
      const canvasWidth = canvas.getWidth?.() || 800;
      const canvasHeight = canvas.getHeight?.() || 600;
      const canvasBackground = canvas.backgroundColor || '#ffffff';

      // Get all objects from canvas with custom properties
      const canvasData = canvas.toJSON?.(['elementType', 'buttonData', 'linkData', 'shapeData', 'url', 'name', 'svgCode', 'isSvgIcon']);
      const objects = canvasData?.objects || [];

      if (!Array.isArray(objects) || objects.length === 0) {
        toast.info('Canvas is empty. Add some elements to preview.');
        return;
      }

      // Convert Fabric.js objects to HTML elements
      const renderElements = () => {
        return objects.map((obj: any, index: number) => {
          if (!obj) {
            return '';
          }
          try {
            const left = obj.left || 0;
            const top = obj.top || 0;
            const width = (obj.width || 0) * (obj.scaleX || 1);
            const height = (obj.height || 0) * (obj.scaleY || 1);
            const angle = obj.angle || 0;

            // Common styles
            const baseStyle = {
              position: 'absolute' as const,
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              transform: `rotate(${angle}deg)`,
              opacity: obj.opacity ?? 1,
              visibility: obj.visible !== false ? 'visible' as const : 'hidden' as const,
            };

            // Handle different element types
            if (obj.elementType === 'button' && obj.buttonData) {
              const buttonData = obj.buttonData;
              return `
                <button
                  key="${index}"
                  style="
                    ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                    background-color: ${buttonData.backgroundColor || '#3b82f6'};
                    color: ${buttonData.textColor || '#ffffff'};
                    border: ${buttonData.borderWidth || 0}px solid ${buttonData.borderColor || 'transparent'};
                    border-radius: ${buttonData.borderRadius || 8}px;
                    font-size: ${buttonData.fontSize || 14}px;
                    font-weight: ${buttonData.fontWeight || 'normal'};
                    padding: ${buttonData.padding?.top || 8}px ${buttonData.padding?.right || 16}px ${buttonData.padding?.bottom || 8}px ${buttonData.padding?.left || 16}px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    outline: none;
                    transition: all 0.2s ease;
                  "
                  onmouseover="this.style.backgroundColor='${buttonData.hoverBackgroundColor || '#2563eb'}'; this.style.color='${buttonData.hoverTextColor || '#ffffff'}';"
                  onmouseout="this.style.backgroundColor='${buttonData.backgroundColor || '#3b82f6'}'; this.style.color='${buttonData.textColor || '#ffffff'}';"
                  onclick="
                    const action = ${JSON.stringify(buttonData.action || { type: 'url', value: '' })}
                    if (action.type === 'url' && action.value) {
                      window.open(action.value, '_blank');
                    } else if (action.type === 'email' && action.value) {
                      window.location.href = 'mailto:' + action.value;
                    } else if (action.type === 'phone' && action.value) {
                      window.location.href = 'tel:' + action.value;
                    } else if (action.type === 'pdf' && action.value) {
                      window.open(action.value, '_blank');
                    } else if (action.type === 'vcard' && action.value) {
                      window.open(action.value, '_blank');
                    } else if (action.type === 'custom' && action.value) {
                      console.log('Custom action:', action.value);
                    }
                  "
                >
                  ${buttonData.text || 'Button'}
                </button>
              `;
            }

            // Handle Link elements
            if (obj.elementType === 'link' && obj.linkData) {
              const linkData = obj.linkData;
              const hasUrl = linkData.url && String(linkData.url).trim() !== '';

              return `
                <a
                  key="${index}"
                  href="${hasUrl ? linkData.url : '#'}"
                  target="${hasUrl ? (linkData.target || '_blank') : '_self'}"
                  style="
                    ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                    color: ${linkData.color || '#3b82f6'};
                    font-size: ${linkData.fontSize || 16}px;
                    font-weight: ${linkData.fontWeight || 'normal'};
                    text-decoration: ${linkData.textDecoration || 'underline'};
                    cursor: ${hasUrl ? 'pointer' : 'default'};
                    display: inline-block;
                    transition: all 0.2s ease;
                    ${!hasUrl ? 'opacity: 0.6;' : ''}
                  "
                  onmouseover="this.style.color='${linkData.hoverColor || '#1e40af'}';"
                  onmouseout="this.style.color='${linkData.color || '#3b82f6'}';"
                  onclick="${hasUrl ? '' : 'event.preventDefault(); alert(\'This link has no URL configured.\'); return false;'}"
                >
                  ${linkData.text || 'Link'}
                </a>
              `;
            }

            // Handle text elements
            if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
              const fontSize = obj.fontSize || 16;
              const adjustedTop = top;

              return `
                <div
                  key="${index}"
                  style="
                    ${Object.entries({ ...baseStyle, top: `${adjustedTop}px` }).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                    color: ${obj.fill || '#000000'};
                    font-size: ${fontSize}px;
                    font-weight: ${obj.fontWeight || 'normal'};
                    font-family: ${obj.fontFamily || 'Arial'};
                    text-align: ${obj.textAlign || 'left'};
                    white-space: pre-wrap;
                    pointer-events: none;
                    line-height: ${obj.lineHeight || 1.2};
                    display: flex;
                    align-items: flex-start;
                    justify-content: ${obj.textAlign === 'center' ? 'center' : obj.textAlign === 'right' ? 'flex-end' : 'flex-start'};
                    min-height: ${fontSize * (obj.lineHeight || 1.2)}px;
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                    transform-origin: left top;
                    overflow: visible;
                    font-style: ${obj.fontStyle === 'italic' ? 'italic' : 'normal'};
                    text-decoration: ${obj.underline ? 'underline' : obj.linethrough ? 'line-through' : 'none'};
                    width: ${obj.type === 'textbox' ? `${width}px` : 'auto'};
                  "
                >
                  ${obj.text || ''}
                </div>
              `;
            }

            // Handle shape elements
            if (obj.type && ['rect', 'circle', 'triangle', 'polygon'].includes(obj.type)) {
              if (obj.type === 'rect') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      background-color: ${obj.fill || 'transparent'};
                      border: ${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'};
                      border-radius: ${obj.rx || 0}px;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }

              if (obj.type === 'circle') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      background-color: ${obj.fill || 'transparent'};
                      border: ${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'};
                      border-radius: 50%;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }

              if (obj.type === 'triangle') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      width: 0;
                      height: 0;
                      border-left: ${width / 2}px solid transparent;
                      border-right: ${width / 2}px solid transparent;
                      border-bottom: ${height}px solid ${obj.fill || '#cccccc'};
                      background-color: transparent;
                      border: none;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }

              if (obj.type === 'polygon') {
                const isStandardDiamond = obj.shapeType === 'diamond'
                  || (obj.points && obj.points.length === 4);

                if (isStandardDiamond) {
                  return `
                    <div
                      key="${index}"
                      style="
                        ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                        background-color: ${obj.fill || 'transparent'};
                        border: ${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'};
                        transform: ${baseStyle.transform} rotate(45deg);
                        border-radius: 4px;
                        pointer-events: none;
                      "
                    ></div>
                  `;
                }
              }
            }

            // Handle custom shape elements (from our shape system)
            if (obj.elementType === 'shape' && obj.shapeData) {
              const shapeData = obj.shapeData;

              if (shapeData.type === 'rectangle') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      background-color: ${shapeData.fill || obj.fill || '#cccccc'};
                      border: ${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'};
                      border-radius: ${obj.rx || 8}px;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }

              if (shapeData.type === 'circle') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      background-color: ${shapeData.fill || obj.fill || '#cccccc'};
                      border: ${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'};
                      border-radius: 50%;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }

              if (shapeData.type === 'triangle') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      width: 0;
                      height: 0;
                      border-left: ${width / 2}px solid transparent;
                      border-right: ${width / 2}px solid transparent;
                      border-bottom: ${height}px solid ${shapeData.fill || obj.fill || '#cccccc'};
                      background-color: transparent;
                      border: none;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }

              if (shapeData.type === 'diamond') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      background-color: ${shapeData.fill || obj.fill || '#cccccc'};
                      border: ${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'};
                      transform: ${baseStyle.transform} rotate(45deg);
                      border-radius: 4px;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }

              if (shapeData.type === 'line') {
                return `
                  <div
                    key="${index}"
                    style="
                      ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                      background-color: ${shapeData.stroke || obj.stroke || '#000000'};
                      border: none;
                      height: ${shapeData.strokeWidth || obj.strokeWidth || 2}px;
                      border-radius: 1px;
                      pointer-events: none;
                    "
                  ></div>
                `;
              }
            }

            // Handle images
            if (obj.type === 'image') {
              return `
                <img
                  key="${index}"
                  src="${obj.src || ''}"
                  style="
                    ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                    object-fit: cover;
                    pointer-events: none;
                  "
                  alt="${obj.alt || 'Image'}"
                />
              `;
            }

            // Handle Line shapes
            if (obj.type === 'line') {
              return `
                <div
                  key="${index}"
                  style="
                    ${Object.entries(baseStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')};
                    background-color: ${obj.stroke || '#000000'};
                    border: none;
                    height: ${obj.strokeWidth || 1}px;
                    border-radius: 1px;
                    pointer-events: none;
                  "
                ></div>
              `;
            }

            return '';
          } catch (error) {
            console.error(`Error rendering element ${index}:`, error);
            return '';
          }
        }).filter(Boolean).join('');
      };

      // Create preview HTML
      const previewHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Design Preview - ${hasUnsavedChanges ? 'Unsaved Changes' : 'Saved'}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .preview-container {
              position: relative;
              width: ${canvasWidth}px;
              height: ${canvasHeight}px;
              background-color: ${canvasBackground};
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              border-radius: 8px;
              overflow: hidden;
            }
            .header-bar {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 10px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              z-index: 1000;
              backdrop-filter: blur(10px);
            }
            .status {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .status-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${hasUnsavedChanges ? '#fbbf24' : '#10b981'};
            }
            .close-button {
              background: #ef4444;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 8px 16px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            }
            .close-button:hover {
              background: #dc2626;
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div class="status">
              <div class="status-dot"></div>
              <span>${hasUnsavedChanges ? 'Unsaved Changes' : 'Design Preview'}</span>
            </div>
            <button class="close-button" onclick="window.close()">Close Preview</button>
          </div>
          <div class="preview-container">
            ${renderElements()}
          </div>
        </body>
        </html>
      `;

      // Open preview in new window
      const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      if (previewWindow) {
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
        previewWindow.focus();
      } else {
        toast.error('Please allow popups to view the preview. Your browser might be blocking new windows.');
      }

      // Call the onPreview callback if provided
      if (onPreview) {
        onPreview();
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Error generating preview. Please try again.');
    }
  };

  return (
    <Button
      onClick={handlePreview}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 border-white/20 bg-white/10  hover:bg-white/20"
    >
      <ExternalLink className="size-4" />
      Preview
      {hasUnsavedChanges && (
        <div className="size-2 animate-pulse rounded-full bg-yellow-400" />
      )}
    </Button>
  );
}
