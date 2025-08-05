'use client';

import type { DesignData } from '@/lib/indexedDB';
import { AlertTriangle, Eye, Share2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { designDB } from '@/lib/indexedDB';

type PublicDesignPreviewProps = {
  designId: string;
};

// Define a type for Fabric-like gradient objects that might be passed
type FabricGradient = {
  type?: string;
  colorStops?: Array<{ offset: number; color: string }>;
  coords?: { x1?: number; y1?: number; x2?: number; y2?: number };
};

// Create a demo design fallback with interactive elements
const createDemoDesign = (designId: string): DesignData => {
  return {
    id: designId,
    canvasData: {
      version: '5.2.4',
      objects: [
        {
          type: 'text',
          left: 187.5,
          top: 150,
          width: 200,
          height: 40,
          text: 'Welcome to Our Design!',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#1e40af',
          textAlign: 'center',
          fontFamily: 'Arial',
        },
        {
          type: 'rect',
          left: 187.5,
          top: 220,
          width: 200,
          height: 80,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
          rx: 12,
        },
        {
          type: 'text',
          left: 187.5,
          top: 250,
          width: 200,
          height: 20,
          text: 'Click to Learn More',
          fontSize: 16,
          fill: '#ffffff',
          textAlign: 'center',
          fontFamily: 'Arial',
        },
        {
          elementType: 'button',
          left: 187.5,
          top: 320,
          width: 160,
          height: 45,
          buttonData: {
            text: 'Get Started',
            backgroundColor: '#10b981',
            textColor: '#ffffff',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: '600',
            action: {
              type: 'url',
              value: 'https://example.com',
            },
          },
        },
        {
          elementType: 'link',
          left: 187.5,
          top: 380,
          width: 120,
          height: 25,
          linkData: {
            text: 'Visit our website',
            url: 'https://google.com',
            target: '_blank',
            color: '#3b82f6',
            fontSize: 16,
            fontWeight: 'normal',
            textDecoration: 'underline',
            hoverColor: '#1e40af',
          },
        },
        {
          type: 'text',
          left: 187.5,
          top: 420,
          width: 300,
          height: 60,
          text: 'This is a demo design showcasing our QR code functionality. Create your own designs and share them instantly!',
          fontSize: 14,
          fill: '#64748b',
          textAlign: 'center',
          fontFamily: 'Arial',
        },
      ],
      background: '#f8fafc',
    },
    metadata: {
      width: 375,
      height: 667,
      backgroundColor: '#f8fafc',
      title: 'Demo Design Preview',
      description: 'Interactive design template with QR code sharing',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export function PublicDesignPreview({ designId }: PublicDesignPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [designData, setDesignData] = useState<DesignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveBackgroundStyle = useMemo(() => {
    const backgroundSource = designData?.metadata?.backgroundColor || designData?.canvasData?.background;
    if (typeof backgroundSource === 'string') {
      return { backgroundColor: backgroundSource };
    } else if (
      backgroundSource
      && typeof backgroundSource === 'object'
      && 'colorStops' in backgroundSource // More explicit check
      && Array.isArray(backgroundSource.colorStops)
      && backgroundSource.colorStops.length > 0 // Ensure not empty
    ) {
      const gradient = backgroundSource as FabricGradient; // Type assertion is okay here after checks
      const direction = '135deg';
      // Ensure colorStops is definitely an array before mapping
      const stops = (gradient.colorStops || [])
        .map(stop => `${stop.color} ${stop.offset * 100}%`)
        .join(', ');
      return { background: `linear-gradient(${direction}, ${stops})` };
    }
    return { backgroundColor: '#ffffff' }; // Fallback
  }, [designData]);

  // Load design data from IndexedDB
  useEffect(() => {
    const loadDesignData = async () => {
      try {
        setLoading(true);

        // Initialize IndexedDB first
        await designDB.init();

        // Try to load from IndexedDB
        const savedDesign = await designDB.getDesign(designId);

        if (savedDesign) {
          setDesignData(savedDesign);
        } else {
          // Fallback: try localStorage for backward compatibility
          const localStorageKey = `design_${designId}`;
          const localData = localStorage.getItem(localStorageKey);

          if (localData) {
            try {
              const canvasData = JSON.parse(localData);
              const designData: DesignData = {
                id: designId,
                canvasData,
                metadata: {
                  width: canvasData.width || 375,
                  height: canvasData.height || 667,
                  backgroundColor: canvasData.background || '#ffffff',
                  title: `Design ${designId}`,
                  description: 'Shared design template',
                },
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              // Save to IndexedDB for future use
              await designDB.saveDesign(designData);
              setDesignData(designData);
            } catch (parseError) {
              console.warn('Failed to parse localStorage design data:', parseError);
              throw new Error('Invalid design data format');
            }
          } else {
            // No saved design found, show demo design
            const demoDesign = createDemoDesign(designId);
            setDesignData(demoDesign);
          }
        }
      } catch (err) {
        console.error('Error loading design data:', err);
        setError('Failed to load design data');

        // Even on error, show demo design
        const demoDesign = createDemoDesign(designId);
        setDesignData(demoDesign);
      } finally {
        setLoading(false);
      }
    };

    if (designId) {
      loadDesignData();
    }
  }, [designId]);

  // Render design elements
  useEffect(() => {
    if (!designData || !containerRef.current) {
      return;
    }

    try {
      // Clear container
      containerRef.current.innerHTML = '';

      // Ensure container allows pointer events
      containerRef.current.style.pointerEvents = 'auto';

      // Create design elements
      const objects = designData.canvasData.objects || [];

      objects.forEach((obj: any, index: number) => {
        const left = obj.left || 0;
        const top = obj.top || 0;
        const width = (obj.width || 100) * (obj.scaleX || 1);
        const height = (obj.height || 30) * (obj.scaleY || 1);
        const angle = obj.angle || 0;
        const opacity = obj.opacity !== undefined ? obj.opacity : 1;
        const visible = obj.visible !== false;

        if (!visible) {
          return;
        }

        // Handle social icon elements first
        if (obj.elementType === 'socialIcon' || (obj.type === 'image' && obj.url)) {
          // Create a clickable social icon
          const iconElement = document.createElement('a');
          iconElement.href = obj.url || '#';
          iconElement.target = '_blank';
          iconElement.rel = 'noopener noreferrer';

          // Basic positioning and styling
          iconElement.style.cssText = `
            position: absolute;
            left: ${left}px;
            top: ${top}px;
            width: ${width}px;
            height: ${height}px;
            transform: rotate(${angle}deg);
            opacity: ${opacity};
            z-index: ${index + 1};
            cursor: pointer !important;
            pointer-events: auto !important;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s ease;
            overflow: hidden;
            ${obj.url ? 'border: 2px solid #10b981;' : ''}
          `;

          // Create an image element for the icon
          const iconImage = document.createElement('img');
          iconImage.src = obj.src || '';
          iconImage.alt = obj.name || 'Social Icon';
          iconImage.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
          `;

          // Add click handler as backup
          iconElement.onclick = function (e) {
            const url = obj.url;
            if (!url || url === '#') {
              e.preventDefault();

              // Show a toast message instead of prompt
              toast.error('This social icon has no URL configured. Please edit the design to add a URL.');

              return false;
            }

            // Show success message
            toast.success(`Opening ${obj.name || 'social media'} link: ${url}`);
            return true; // Allow default navigation
          };

          // Add hover effects
          iconElement.onmouseover = function () {
            (this as HTMLElement).style.transform = `rotate(${angle}deg) scale(1.1)`;
            (this as HTMLElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          };

          iconElement.onmouseout = function () {
            (this as HTMLElement).style.transform = `rotate(${angle}deg) scale(1)`;
            (this as HTMLElement).style.boxShadow = 'none';
          };

          // Add double-click handler to edit URL
          iconElement.ondblclick = function (e: MouseEvent) {
            e.preventDefault();

            // Show a toast message instead of prompt
            toast.info('Double-click editing is not available in preview mode. Please edit the design to modify URLs.');

            return false;
          };

          // Append the image to the link
          iconElement.appendChild(iconImage);
          containerRef.current?.appendChild(iconElement);
          return; // Skip the rest of the rendering for this object
        }

        // Handle link elements NEXT, before handling text
        if (obj.elementType === 'link') {
          // Create a real anchor element for links
          const linkElement = document.createElement('a');
          linkElement.textContent = obj.text || obj.linkData?.text || 'Link';

          // Use native anchor element for best compatibility
          linkElement.href = obj.linkData?.url || '#';
          linkElement.target = obj.linkData?.target || '_blank';
          linkElement.rel = 'noopener noreferrer';

          // Basic positioning and styling
          linkElement.style.cssText = `
            position: absolute;
            left: ${left}px;
            top: ${top}px;
            width: auto;
            min-width: ${width}px;
            height: auto;
            min-height: ${height}px;
            transform: rotate(${angle}deg);
            opacity: ${opacity};
            z-index: 9999;
            color: ${obj.linkData?.color || obj.fill || '#3b82f6'};
            font-size: ${obj.fontSize || obj.linkData?.fontSize || 16}px;
            font-weight: ${obj.fontWeight || obj.linkData?.fontWeight || 'normal'};
            font-family: ${obj.fontFamily || obj.linkData?.fontFamily || 'Arial'};
            text-decoration: underline;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer !important;
            pointer-events: auto !important;
            user-select: none;
            transition: all 0.2s ease;
            text-align: center;
            background: none;
            border: none;
            padding: 0;
          `;

          // Remove the existing onclick handler that's preventing default behavior
          // and replace with a simpler approach that works with native links

          // Add hover effects with native CSS
          linkElement.onmouseover = function () {
            (this as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            (this as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.3)';
            (this as HTMLElement).style.color = obj.linkData?.hoverColor || '#1e40af';
          };

          linkElement.onmouseout = function () {
            (this as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            (this as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.2)';
            (this as HTMLElement).style.color = obj.linkData?.color || obj.fill || '#3b82f6';
          };

          containerRef.current?.appendChild(linkElement);
          return; // Skip the rest of the rendering for this object
        }

        // Handle different element types
        if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
          // Don't render text elements that are links
          if (obj.elementType === 'link') {
            return;
          }

          const textElement = document.createElement('div');
          textElement.style.position = 'absolute';
          textElement.style.left = `${left}px`;
          textElement.style.top = `${top}px`;
          textElement.style.width = obj.type === 'textbox' ? `${width}px` : 'auto';
          textElement.style.height = obj.type === 'textbox' ? `${height}px` : 'auto';
          textElement.style.transform = `rotate(${angle}deg)`;
          textElement.style.opacity = `${opacity}`;
          textElement.style.zIndex = `${index + 1}`;
          textElement.textContent = obj.text || '';
          textElement.style.fontSize = `${obj.fontSize || 16}px`;
          textElement.style.color = obj.fill || '#000000';
          textElement.style.fontFamily = obj.fontFamily || 'Arial';
          textElement.style.fontWeight = obj.fontWeight || 'normal';
          textElement.style.fontStyle = obj.fontStyle || 'normal';
          textElement.style.textAlign = obj.textAlign || 'left';
          textElement.style.textDecoration = obj.underline ? 'underline' : obj.linethrough ? 'line-through' : 'none';
          textElement.style.display = 'flex';
          textElement.style.alignItems = 'flex-start';
          textElement.style.justifyContent = obj.textAlign === 'center' ? 'center' : obj.textAlign === 'right' ? 'flex-end' : 'flex-start';
          textElement.style.pointerEvents = 'none';
          textElement.style.whiteSpace = 'pre-wrap';
          textElement.style.lineHeight = `${obj.lineHeight || 1.2}`;
          // Add these properties to fix text rendering
          textElement.style.boxSizing = 'border-box';
          textElement.style.padding = '0';
          textElement.style.margin = '0';
          textElement.style.minHeight = `${(obj.fontSize || 16) * (obj.lineHeight || 1.2)}px`;
          textElement.style.transformOrigin = 'left top';
          textElement.style.overflow = 'visible';

          containerRef.current?.appendChild(textElement);
        } else if (obj.type === 'rect') {
          const rectElement = document.createElement('div');
          rectElement.style.position = 'absolute';
          rectElement.style.left = `${left}px`;
          rectElement.style.top = `${top}px`;
          rectElement.style.width = `${width}px`;
          rectElement.style.height = `${height}px`;
          rectElement.style.transform = `rotate(${angle}deg)`;
          rectElement.style.opacity = `${opacity}`;
          rectElement.style.zIndex = `${index + 1}`;
          rectElement.style.backgroundColor = obj.fill || '#cccccc';
          rectElement.style.border = `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`;
          rectElement.style.borderRadius = `${obj.rx || 0}px`;

          containerRef.current?.appendChild(rectElement);
        } else if (obj.type === 'circle') {
          const circleElement = document.createElement('div');
          circleElement.style.position = 'absolute';
          circleElement.style.left = `${left}px`;
          circleElement.style.top = `${top}px`;
          circleElement.style.width = `${width}px`;
          circleElement.style.height = `${height}px`;
          circleElement.style.transform = `rotate(${angle}deg)`;
          circleElement.style.opacity = `${opacity}`;
          circleElement.style.zIndex = `${index + 1}`;
          circleElement.style.backgroundColor = obj.fill || '#cccccc';
          circleElement.style.border = `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`;
          circleElement.style.borderRadius = '50%';

          containerRef.current?.appendChild(circleElement);
        } else if (obj.type === 'triangle') {
          const triangleElement = document.createElement('div');
          triangleElement.style.position = 'absolute';
          triangleElement.style.left = `${left}px`;
          triangleElement.style.top = `${top}px`;
          triangleElement.style.width = '0';
          triangleElement.style.height = '0';
          triangleElement.style.borderLeft = `${width / 2}px solid transparent`;
          triangleElement.style.borderRight = `${width / 2}px solid transparent`;
          triangleElement.style.borderBottom = `${height}px solid ${obj.fill || '#cccccc'}`;
          triangleElement.style.transform = `rotate(${angle}deg)`;
          triangleElement.style.opacity = `${opacity}`;
          triangleElement.style.zIndex = `${index + 1}`;

          containerRef.current?.appendChild(triangleElement);
        } else if (obj.type === 'polygon' || (obj.shapeData && obj.shapeData.type === 'diamond')) {
          const polygonElement = document.createElement('div');
          polygonElement.style.position = 'absolute';
          polygonElement.style.left = `${left}px`;
          polygonElement.style.top = `${top}px`;
          polygonElement.style.width = `${width}px`;
          polygonElement.style.height = `${height}px`;
          polygonElement.style.opacity = `${opacity}`;
          polygonElement.style.zIndex = `${index + 1}`;
          polygonElement.style.backgroundColor = obj.fill || obj.shapeData?.fill || '#cccccc';
          polygonElement.style.border = `${obj.strokeWidth || obj.shapeData?.strokeWidth || 0}px solid ${obj.stroke || obj.shapeData?.stroke || 'transparent'}`;

          // Diamond shape gets rotated 45 degrees
          if (obj.shapeData?.type === 'diamond' || (obj.points && obj.points.length === 4)) {
            polygonElement.style.transform = `rotate(${angle + 45}deg)`;
            polygonElement.style.borderRadius = '4px';
          } else {
            polygonElement.style.transform = `rotate(${angle}deg)`;
          }

          containerRef.current?.appendChild(polygonElement);
        } else if (obj.type === 'line' || (obj.shapeData && obj.shapeData.type === 'line')) {
          const lineElement = document.createElement('div');
          lineElement.style.position = 'absolute';
          lineElement.style.left = `${left}px`;
          lineElement.style.top = `${top}px`;
          lineElement.style.width = `${width}px`;
          lineElement.style.height = `${obj.strokeWidth || obj.shapeData?.strokeWidth || 2}px`;
          lineElement.style.transform = `rotate(${angle}deg)`;
          lineElement.style.opacity = `${opacity}`;
          lineElement.style.zIndex = `${index + 1}`;
          lineElement.style.backgroundColor = obj.stroke || obj.shapeData?.stroke || '#000000';
          lineElement.style.borderRadius = '1px';

          containerRef.current?.appendChild(lineElement);
        } else if (obj.type === 'image') {
          const imageElement = document.createElement('img');
          imageElement.style.position = 'absolute';
          imageElement.style.left = `${left}px`;
          imageElement.style.top = `${top}px`;
          imageElement.style.width = `${width}px`;
          imageElement.style.height = `${height}px`;
          imageElement.style.transform = `rotate(${angle}deg)`;
          imageElement.style.opacity = `${opacity}`;
          imageElement.style.zIndex = `${index + 1}`;
          imageElement.style.objectFit = 'cover';
          imageElement.src = obj.src || '';
          imageElement.alt = obj.alt || 'Design element';

          containerRef.current?.appendChild(imageElement);
        } else if (obj.elementType === 'button' && obj.buttonData) {
          const button = document.createElement('button');
          button.textContent = obj.buttonData.text || 'Button';
          button.style.position = 'absolute';
          button.style.left = `${left}px`;
          button.style.top = `${top}px`;
          button.style.width = `${width}px`;
          button.style.height = `${height}px`;
          button.style.transform = `rotate(${angle}deg)`;
          button.style.opacity = `${opacity}`;
          button.style.zIndex = `${index + 1}`;
          button.style.backgroundColor = obj.buttonData.backgroundColor || '#3b82f6';
          button.style.color = obj.buttonData.textColor || '#ffffff';
          button.style.border = `${obj.buttonData.borderWidth || 0}px solid ${obj.buttonData.borderColor || 'transparent'}`;
          button.style.borderRadius = `${obj.buttonData.borderRadius || 4}px`;
          button.style.fontSize = `${obj.buttonData.fontSize || 14}px`;
          button.style.fontWeight = obj.buttonData.fontWeight || 'normal';
          button.style.fontFamily = obj.buttonData.fontFamily || 'Arial';
          button.style.cursor = 'pointer';
          button.style.transition = 'all 0.2s ease';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.padding = `${obj.buttonData.padding?.top || 8}px ${obj.buttonData.padding?.right || 16}px ${obj.buttonData.padding?.bottom || 8}px ${obj.buttonData.padding?.left || 16}px`;

          // Add hover effects
          button.onmouseenter = () => {
            if (obj.buttonData.hoverBackgroundColor) {
              button.style.backgroundColor = obj.buttonData.hoverBackgroundColor;
            }
            if (obj.buttonData.hoverTextColor) {
              button.style.color = obj.buttonData.hoverTextColor;
            }
            button.style.transform = `rotate(${angle}deg) translateY(-1px)`;
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          };
          button.onmouseleave = () => {
            button.style.backgroundColor = obj.buttonData.backgroundColor || '#3b82f6';
            button.style.color = obj.buttonData.textColor || '#ffffff';
            button.style.transform = `rotate(${angle}deg) translateY(0)`;
            button.style.boxShadow = 'none';
          };

          // Add click handler
          if (obj.buttonData.action) {
            button.onclick = () => {
              const action = obj.buttonData.action;
              if (action.type === 'url' && action.value) {
                toast.success(`Opening URL: ${action.value}`);

                // Use the same improved approach for opening links
                const url = action.value;

                // Create a temporary anchor element to use native browser navigation
                const tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.target = '_blank';
                tempLink.rel = 'noopener noreferrer';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
              } else if (action.type === 'email' && action.value) {
                toast.success(`Opening email client for: ${action.value}`);
                window.location.href = `mailto:${action.value}`;
              } else if (action.type === 'phone' && action.value) {
                toast.success(`Opening phone app for: ${action.value}`);
                window.location.href = `tel:${action.value}`;
              } else {
                toast.error('This button has no action configured.');
              }
            };
          } else {
            // Add a default click handler for buttons without actions
            button.onclick = () => {
              toast.error('This button has no action configured.');
            };
          }

          containerRef.current?.appendChild(button);
        }
      });
    } catch {
      setError('Failed to render design');
    }
  }, [designData]);

  // Update the useEffect with the canvas initialization
  useEffect(() => {
    if (!containerRef.current || !designData) {
      return;
    }

    let canvas: any = null;
    const canvasRef = document.createElement('canvas');

    // Append canvas to container
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(canvasRef);

    const initCanvas = async () => {
      try {
        // Import fabric dynamically
        const { fabric } = await import('fabric');

        // Initialize canvas
        canvas = new fabric.Canvas(canvasRef, {
          width: designData.metadata?.width || 800,
          height: designData.metadata?.height || 600,
          backgroundColor: designData.metadata?.backgroundColor || '#ffffff',
          selection: false, // Disable selection in preview mode
          hoverCursor: 'pointer', // Show pointer cursor on interactive elements
        });

        // Add double-click handler for social icons
        canvas.on('mouse:dblclick', (opt: any) => {
          const target = opt.target;
          if (!target) {
            return;
          }

          if (target.elementType === 'socialIcon') {
            // Show a toast message instead of prompt
            toast.info('Double-click editing is not available in preview mode. Please edit the design to modify URLs.');
          }
        });

        // Load objects from JSON
        if (designData.canvasData && designData.canvasData.objects && Array.isArray(designData.canvasData.objects)) {
          fabric.util.enlivenObjects(designData.canvasData.objects, (enlivenedObjects: any[]) => {
            enlivenedObjects.forEach((obj) => {
              // Make all objects non-selectable for preview
              obj.set({
                selectable: false,
                evented: true, // But still allow events for interactivity
              });

              // Add click handlers for interactive elements
              if (obj.elementType === 'socialIcon') {
                // Make sure the cursor is a pointer to indicate clickability
                obj.set('hoverCursor', 'pointer');

                obj.on('mousedown', function (this: any, e: any) {
                  if (e.e.button !== 0) {
                    return;
                  } // Only handle left-click
                  e.e.preventDefault();
                  e.e.stopPropagation();

                  // Check if the icon has a URL set
                  if (!this.url) {
                    // Show a toast message instead of prompt
                    toast.error('This social icon has no URL configured. Please edit the design to add a URL.');
                    return;
                  }

                  // If URL exists, open it
                  toast.success(`Opening social media link: ${this.url}`);

                  // Create a temporary anchor element to use native browser navigation
                  const tempLink = document.createElement('a');
                  tempLink.href = this.url;
                  tempLink.target = '_blank';
                  tempLink.rel = 'noopener noreferrer';
                  document.body.appendChild(tempLink);
                  tempLink.click();
                  document.body.removeChild(tempLink);
                });
              } else if (obj.type === 'image' && obj.url) {
                obj.on('mousedown', function (this: any, e: any) {
                  if (e.e.button !== 0) {
                    return;
                  } // Only handle left-click
                  e.e.preventDefault();
                  e.e.stopPropagation();

                  // Open the image URL
                  const tempLink = document.createElement('a');
                  tempLink.href = this.url;
                  tempLink.target = '_blank';
                  tempLink.rel = 'noopener noreferrer';
                  document.body.appendChild(tempLink);
                  tempLink.click();
                  document.body.removeChild(tempLink);
                });
              }

              // Add the object to the canvas
              canvas.add(obj);
            });

            // Render the canvas after all objects are added
            canvas.renderAll();
          });
        }
      } catch {
        setError('Failed to initialize canvas');
      }
    };

    initCanvas();

    // Cleanup function
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [designData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
        <div className="text-center">
          <div className="mx-auto mb-6 size-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <div className="text-lg font-medium text-gray-700">Loading design...</div>
          <div className="mt-2 text-sm text-gray-500">Please wait a moment</div>
        </div>
      </div>
    );
  }

  if (error && !designData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-pink-50/30 to-rose-100/40 p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-10 text-red-600" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Unable to load design</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!designData) {
    return null;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? Math.min(window.innerWidth / designData.metadata.width, window.innerHeight / designData.metadata.height) * 0.9 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
      {/* Header */}
      <div className="border-b border-white/30 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2">
                <Eye className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {designData.metadata.title || 'Design Preview'}
                </h1>
                <p className="text-sm text-gray-600">
                  {designData.metadata.description || 'Shared via QR code'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Share2 className="size-4 text-gray-500" />
              <span className="text-sm text-gray-500">QR Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Design Preview */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative shadow-2xl"
          style={{
            width: `${designData.metadata.width * scale}px`,
            height: `${designData.metadata.height * scale}px`,
            maxWidth: '95vw',
            maxHeight: '80vh',
            borderRadius: '16px',
            overflow: 'hidden',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            ref={containerRef}
            className="relative size-full"
            style={{
              ...effectiveBackgroundStyle, // Apply the dynamic background style
              width: `${designData.metadata.width}px`,
              height: `${designData.metadata.height}px`,
              position: 'relative',
              pointerEvents: 'auto',
            }}
          />

          {/* Overlay for demo indication */}
          {designData.id.includes('demo') && (
            <div className="absolute inset-x-4 bottom-4 rounded-lg bg-blue-500/90 p-3 text-center backdrop-blur-sm">
              <p className="text-sm font-medium text-white">
                This is a demo design. Create your own at our design platform!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
