'use client';

import type { Design } from '@/types/design';
import { AlertTriangle, Eye, Share2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type PublicDesignPreviewProps = {
  designId?: string;
  designSlug?: string;
  initialData?: Design | null;
};

// Define a type for Fabric-like gradient objects that might be passed
type FabricGradient = {
  type: string;
  colorStops: Array<{ color: string; offset: number }>;
  coords?: { x1?: number; y1?: number; x2?: number; y2?: number };
};

// Create a demo design fallback with interactive elements
const createDemoDesign = (designId: string): Design => {
  return {
    id: designId,
    user_id: 'demo-user',
    name: 'Welcome Demo Design',
    description: 'A demo design showcasing interactive elements',
    canvas_data: {
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
            text: 'Visit Website',
            url: 'https://example.com',
            color: '#2563eb',
            fontSize: 14,
            underline: true,
          },
        },
        {
          elementType: 'socialIcon',
          left: 250,
          top: 420,
          width: 40,
          height: 40,
          socialData: {
            platform: 'instagram',
            url: 'https://instagram.com/example',
            iconColor: '#e91e63',
            backgroundColor: '#ffffff',
            borderRadius: 8,
          },
        },
        {
          elementType: 'socialIcon',
          left: 300,
          top: 420,
          width: 40,
          height: 40,
          socialData: {
            platform: 'facebook',
            url: 'https://facebook.com/example',
            iconColor: '#1877f2',
            backgroundColor: '#ffffff',
            borderRadius: 8,
          },
        },
      ],
      background: '#ffffff',
      width: 375,
      height: 667,
    },
    preview_url: null,
    qr_code_url: null,
    qr_code_data: null,
    is_template: false,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export function PublicDesignPreview({ designId, designSlug, initialData }: PublicDesignPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [designData, setDesignData] = useState<Design | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const effectiveBackgroundStyle = useMemo(() => {
    const backgroundSource = designData?.canvas_data?.background;
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

  // Load design data from backend API if not provided via initialData
  useEffect(() => {
    const loadDesignData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine the identifier to use (slug takes precedence)
        const identifier = designSlug || designId;
        if (!identifier) {
          throw new Error('No design identifier provided');
        }

        // Use the unified API endpoint
        const apiEndpoint = `/api/preview/${identifier}`;

        console.log('Attempting to load design from backend API:', identifier); // eslint-disable-line no-console
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          if (response.status === 404) {
            console.log('Design not found in backend, showing demo design'); // eslint-disable-line no-console
            // Design not found, show demo design
            const demoDesign = createDemoDesign(identifier);
            setDesignData(demoDesign);
            return;
          }

          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const design = await response.json();
        console.log('Design loaded from backend API:', identifier); // eslint-disable-line no-console
        setDesignData(design);

        // Record the scan if we have a valid design ID (not a demo)
        if (design.id && design.id !== 'demo') {
          try {
            // Record the scan asynchronously (don't wait for it to complete)
            fetch(`/api/scan/${design.id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            }).catch((error) => {
              // Silently fail if scan recording fails - don't affect user experience
              console.error('Failed to record scan:', error);
            });
          } catch (scanError) {
            // Silently fail if scan recording fails
            console.error('Error recording scan:', scanError);
          }
        }
      } catch (err) {
        console.error('Error loading design data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load design';
        setError(errorMessage);

        // Show demo design as fallback
        const fallbackIdentifier = designSlug || designId || 'demo';
        const demoDesign = createDemoDesign(fallbackIdentifier);
        setDesignData(demoDesign);

        toast.error(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    // Only load data if not provided as initialData and we have an identifier
    if ((designId || designSlug) && !initialData) {
      loadDesignData();
    }
  }, [designId, designSlug, initialData]);

  // Record scan when design is provided via initialData
  useEffect(() => {
    if (initialData && initialData.id && initialData.id !== 'demo') {
      // Record the scan asynchronously (don't wait for it to complete)
      fetch(`/api/scan/${initialData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((error) => {
        // Silently fail if scan recording fails - don't affect user experience
        console.error('Failed to record scan:', error);
      });
    }
  }, [initialData]);

  // Handle interactive element clicks
  const handleElementClick = (elementData: any) => {
    const formatUrl = (url: string, urlType?: string) => {
      if (!url) {
        return '';
      }

      // If urlType is specified, handle accordingly
      if (urlType) {
        switch (urlType) {
          case 'email':
            // If it already has mailto:, use as is, otherwise add it
            return url.startsWith('mailto:') ? url : `mailto:${url}`;
          case 'phone':
            // If it already has tel:, use as is, otherwise add it
            return url.startsWith('tel:') ? url : `tel:${url}`;
          case 'url':
          default:
            // For URLs, add https:// if not present
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              return `https://${url}`;
            }
            return url;
        }
      }

      // Fallback: detect type from URL format
      if (url.startsWith('mailto:')) {
        return url;
      } else if (url.startsWith('tel:')) {
        return url;
      } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }

      return url;
    };

    if (elementData.buttonData?.action) {
      const { type, value } = elementData.buttonData.action;
      if (type === 'url' && value) {
        window.open(formatUrl(value), '_blank');
      }
    } else if (elementData.linkData?.url) {
      window.open(formatUrl(elementData.linkData.url), '_blank');
    } else if (elementData.socialData?.url) {
      window.open(formatUrl(elementData.socialData.url), '_blank');
    } else if (elementData.url) {
      // Handle text elements with URLs
      window.open(formatUrl(elementData.url, elementData.urlType), '_blank');
    }
  };

  // Render interactive elements
  const renderInteractiveElement = (obj: any, index: number) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${obj.left}px`,
      top: `${obj.top}px`,
      width: `${obj.width}px`,
      height: `${obj.height}px`,
      cursor: 'pointer',
      zIndex: 10,
    };

    if (obj.elementType === 'button' && obj.buttonData) {
      const { text, backgroundColor, textColor, borderRadius, fontSize, fontWeight } = obj.buttonData;
      return (
        <button
          key={`button-${index}`}
          onClick={() => handleElementClick(obj)}
          className="transition-all duration-200 hover:scale-105 hover:opacity-80"
          style={{
            ...baseStyle,
            backgroundColor,
            color: textColor,
            borderRadius: `${borderRadius}px`,
            fontSize: `${fontSize}px`,
            fontWeight,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {text}
        </button>
      );
    }

    if (obj.elementType === 'link' && obj.linkData) {
      const { text, color, fontSize, underline } = obj.linkData;
      return (
        <button
          key={`link-${index}`}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleElementClick(obj);
          }}
          className="transition-all duration-200 hover:opacity-80"
          style={{
            ...baseStyle,
            color,
            fontSize: `${fontSize}px`,
            textDecoration: underline ? 'underline' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {text}
        </button>
      );
    }

    if (obj.elementType === 'socialIcon' && obj.socialData) {
      const { platform, iconColor, backgroundColor, borderRadius } = obj.socialData;

      // Social media icons (you might want to replace these with actual icon components)
      const getIconPath = (platform: string) => {
        switch (platform) {
          case 'instagram':
            return 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.059 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z';
          case 'facebook':
            return 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';
          default:
            return '';
        }
      };

      return (
        <button
          type="button"
          key={`social-${index}`}
          onClick={() => handleElementClick(obj)}
          className="transition-all duration-200 hover:scale-110 hover:opacity-80"
          style={{
            ...baseStyle,
            backgroundColor,
            borderRadius: `${borderRadius}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={iconColor}
          >
            <path d={getIconPath(platform)} />
          </svg>
        </button>
      );
    }

    return null;
  };

  // Render canvas objects using HTML elements (similar to RealTimePreview)
  const renderCanvasObjects = useMemo(() => {
    if (!designData?.canvas_data?.objects || !Array.isArray(designData.canvas_data.objects)) {
      return [];
    }

    return designData.canvas_data.objects.map((obj: any, index: number) => {
      if (!obj) {
        return null;
      }

      // Common properties that apply to most objects
      const left = obj.left || 0;
      const top = obj.top || 0;
      const width = (obj.width || 0) * (obj.scaleX || 1);
      const height = (obj.height || 0) * (obj.scaleY || 1);
      const angle = obj.angle || 0;

      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center center',
        opacity: obj.opacity !== undefined ? obj.opacity : 1,
        zIndex: index + 1,
      };

      // Handle Text elements
      if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
        const fontSize = obj.fontSize || 16;

        // Handle text positioning - Fabric.js text positioning is complex
        let adjustedLeft = left;
        let adjustedTop = top;

        // Adjust for text origin and alignment
        if (obj.originX === 'center') {
          adjustedLeft = left - (width / 2);
        } else if (obj.originX === 'right') {
          adjustedLeft = left - width;
        }

        if (obj.originY === 'center') {
          adjustedTop = top - (height / 2);
        } else if (obj.originY === 'bottom') {
          adjustedTop = top - height;
        }

        // Additional adjustment for text baseline
        if (obj.textBaseline === 'alphabetic' || obj.textBaseline === 'baseline') {
          adjustedTop = adjustedTop - fontSize * 0.2;
        } else if (obj.textBaseline === 'middle') {
          adjustedTop = adjustedTop - fontSize * 0.1;
        }

        const textStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${adjustedLeft}px`,
          top: `${adjustedTop}px`,
          width: obj.type === 'textbox' ? `${width}px` : 'auto',
          height: obj.type === 'textbox' ? `${height}px` : 'auto',
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'left top',
          opacity: obj.opacity !== undefined ? obj.opacity : 1,
          zIndex: index + 1,
          color: obj.fill || '#000000',
          fontFamily: obj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: `${fontSize}px`,
          fontWeight: obj.fontWeight || 'normal',
          textAlign: obj.textAlign || 'left',
          whiteSpace: 'pre-wrap',
          lineHeight: obj.lineHeight || 1.2,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          fontStyle: obj.fontStyle === 'italic' ? 'italic' : 'normal',
          textDecoration: `${obj.underline ? 'underline' : ''} ${obj.linethrough ? 'line-through' : ''}`.trim(),
          minHeight: `${fontSize * (obj.lineHeight || 1.2)}px`,
          justifyContent: obj.textAlign === 'center' ? 'center' : obj.textAlign === 'right' ? 'flex-end' : 'flex-start',
          padding: '0',
          margin: '0',
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          textShadow: obj.fill === '#ffffff' || obj.fill === '#FFFFFF' ? '0 0 2px rgba(0,0,0,0.5)' : 'none',
        };

        const textContent = obj.text || obj.content || '';

        // If text has a URL, make it interactive
        if (obj.url) {
          return (
            <button
              key={`canvas-text-${obj.id || index}`}
              style={{
                ...textStyle,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
              }}
              onClick={() => {
                if (obj.url) {
                  // Handle different URL types
                  const formatUrl = (url: string, urlType?: string) => {
                    if (!url) {
                      return '';
                    }

                    // If urlType is specified, handle accordingly
                    if (urlType) {
                      switch (urlType) {
                        case 'email':
                          // If it already has mailto:, use as is, otherwise add it
                          return url.startsWith('mailto:') ? url : `mailto:${url}`;
                        case 'phone':
                          // If it already has tel:, use as is, otherwise add it
                          return url.startsWith('tel:') ? url : `tel:${url}`;
                        case 'url':
                        default:
                          // For URLs, add https:// if not present
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            return `https://${url}`;
                          }
                          return url;
                      }
                    }

                    // Fallback: detect type from URL format
                    if (url.startsWith('mailto:')) {
                      return url;
                    } else if (url.startsWith('tel:')) {
                      return url;
                    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                      return `https://${url}`;
                    }

                    return url;
                  };
                  window.open(formatUrl(obj.url, obj.urlType), '_blank');
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {textContent}
            </button>
          );
        }

        return (
          <div key={`canvas-text-${obj.id || index}`} style={textStyle}>
            {textContent}
          </div>
        );
      }

      // Handle Rect elements
      if (obj.type === 'rect') {
        return (
          <div
            key={`canvas-rect-${obj.id || index}`}
            style={{
              ...baseStyle,
              backgroundColor: obj.fill || '#cccccc',
              borderRadius: `${obj.rx || 0}px`,
              border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Circle elements
      if (obj.type === 'circle') {
        return (
          <div
            key={`canvas-circle-${obj.id || index}`}
            style={{
              ...baseStyle,
              backgroundColor: obj.fill || '#cccccc',
              borderRadius: '50%',
              border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Triangle elements
      if (obj.type === 'triangle') {
        return (
          <svg
            key={`canvas-triangle-${obj.id || index}`}
            style={{
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              transform: `rotate(${angle}deg)`,
              transformOrigin: 'center center',
              opacity: obj.opacity !== undefined ? obj.opacity : 1,
              zIndex: index + 1,
            }}
            viewBox={`0 0 ${width} ${height}`}
          >
            <polygon
              points={`${width / 2},0 0,${height} ${width},${height}`}
              fill={obj.fill || '#cccccc'}
              stroke={obj.stroke || 'none'}
              strokeWidth={obj.strokeWidth || 0}
            />
          </svg>
        );
      }

      // Handle custom shape elements (from our shape system)
      if (obj.elementType === 'shape' && obj.shapeData) {
        const shapeData = obj.shapeData;

        if (shapeData.type === 'rectangle') {
          return (
            <div
              key={`canvas-shape-rectangle-${obj.id || index}`}
              style={{
                ...baseStyle,
                backgroundColor: shapeData.fill || obj.fill || '#cccccc',
                border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
                borderRadius: obj.rx || 8,
                boxSizing: 'border-box',
              }}
            />
          );
        }

        if (shapeData.type === 'circle') {
          return (
            <div
              key={`canvas-shape-circle-${obj.id || index}`}
              style={{
                ...baseStyle,
                backgroundColor: shapeData.fill || obj.fill || '#cccccc',
                border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
                borderRadius: '50%',
                boxSizing: 'border-box',
              }}
            />
          );
        }

        if (shapeData.type === 'triangle') {
          return (
            <div
              key={`canvas-shape-triangle-${obj.id || index}`}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                opacity: obj.opacity !== undefined ? obj.opacity : 1,
                zIndex: index + 1,
                width: 0,
                height: 0,
                borderLeft: `${width / 2}px solid transparent`,
                borderRight: `${width / 2}px solid transparent`,
                borderBottom: `${height}px solid ${shapeData.fill || obj.fill || '#cccccc'}`,
                // Add stroke support
                ...(shapeData.stroke || obj.stroke
                  ? {
                      filter: `drop-shadow(0 0 0 ${shapeData.strokeWidth || obj.strokeWidth || 1}px ${shapeData.stroke || obj.stroke})`,
                    }
                  : {}),
              }}
            />
          );
        }

        if (shapeData.type === 'diamond') {
          return (
            <div
              key={`canvas-shape-diamond-${obj.id || index}`}
              style={{
                ...baseStyle,
                backgroundColor: shapeData.fill || obj.fill || '#cccccc',
                border: `${shapeData.strokeWidth || obj.strokeWidth || 0}px solid ${shapeData.stroke || obj.stroke || 'transparent'}`,
                transform: `rotate(${angle}deg) rotate(45deg)`,
                borderRadius: 4,
                boxSizing: 'border-box',
              }}
            />
          );
        }

        if (shapeData.type === 'line') {
          return (
            <div
              key={`canvas-shape-line-${obj.id || index}`}
              style={{
                ...baseStyle,
                backgroundColor: shapeData.stroke || obj.stroke || '#000000',
                border: 'none',
                height: shapeData.strokeWidth || obj.strokeWidth || 2,
                borderRadius: 1,
                boxSizing: 'border-box',
              }}
            />
          );
        }
      }

      // Handle Polygon elements (including diamonds)
      if (obj.type === 'polygon') {
        const isStandardDiamond = obj.shapeType === 'diamond' || (obj.points && obj.points.length === 4);

        if (isStandardDiamond) {
          return (
            <div
              key={`canvas-polygon-diamond-${obj.id || index}`}
              style={{
                ...baseStyle,
                backgroundColor: obj.fill || '#cccccc',
                border: `${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'}`,
                transform: `rotate(${angle}deg) rotate(45deg)`,
                borderRadius: 4,
                boxSizing: 'border-box',
              }}
            />
          );
        }
      }

      // Handle Line elements
      if (obj.type === 'line') {
        return (
          <div
            key={`canvas-line-${obj.id || index}`}
            style={{
              ...baseStyle,
              backgroundColor: obj.stroke || '#000000',
              border: 'none',
              height: obj.strokeWidth || 1,
              borderRadius: 1,
              boxSizing: 'border-box',
            }}
          />
        );
      }

      // Handle Image elements
      if (obj.type === 'image') {
        // Handle social icons with special styling
        if (obj.elementType === 'socialIcon') {
          // For social icons, we need to handle the positioning differently
          // Fabric.js images can have different origin settings (center, left, etc.)

          // Calculate the actual position accounting for origin
          let actualLeft = left;
          let actualTop = top;

          // Check if the object has originX/originY settings (common for social icons)
          if (obj.originX === 'center') {
            actualLeft = left - (width / 2);
          } else if (obj.originX === 'right') {
            actualLeft = left - width;
          }

          if (obj.originY === 'center') {
            actualTop = top - (height / 2);
          } else if (obj.originY === 'bottom') {
            actualTop = top - height;
          }

          // Also handle cases where the image might be positioned from center by default
          if (!obj.originX && !obj.originY) {
            // Check if this looks like a centered object by examining the position
            const canvasWidth = designData?.canvas_data?.width || 800;
            const canvasHeight = designData?.canvas_data?.height || 600;

            // If the object appears to be positioned from center (common with social icons)
            if (Math.abs(left - canvasWidth / 2) < canvasWidth / 3 && Math.abs(top - canvasHeight / 2) < canvasHeight / 3) {
              actualLeft = left - (width / 2);
              actualTop = top - (height / 2);
            }
          }

          return (
            <div
              key={`canvas-social-icon-${obj.id || index}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const url = obj.url || obj.URL;
                  if (url) {
                    // Handle different URL types
                    const formatUrl = (url: string, urlType?: string) => {
                      if (!url) {
                        return '';
                      }

                      // If urlType is specified, handle accordingly
                      if (urlType) {
                        switch (urlType) {
                          case 'email':
                            // If it already has mailto:, use as is, otherwise add it
                            return url.startsWith('mailto:') ? url : `mailto:${url}`;
                          case 'phone':
                            // If it already has tel:, use as is, otherwise add it
                            return url.startsWith('tel:') ? url : `tel:${url}`;
                          case 'url':
                          default:
                            // For URLs, add https:// if not present
                            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                              return `https://${url}`;
                            }
                            return url;
                        }
                      }

                      // Fallback: detect type from URL format
                      if (url.startsWith('mailto:')) {
                        return url;
                      } else if (url.startsWith('tel:')) {
                        return url;
                      } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        return `https://${url}`;
                      }

                      return url;
                    };
                    window.open(formatUrl(url, obj.urlType), '_blank');
                  }
                }
              }}
              style={{
                position: 'absolute',
                left: `${actualLeft}px`,
                top: `${actualTop}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: obj.originX === 'center' && obj.originY === 'center'
                  ? 'center center'
                  : obj.originX === 'center'
                    ? 'center top'
                    : obj.originY === 'center'
                      ? 'left center'
                      : 'left top',
                opacity: obj.opacity !== undefined ? obj.opacity : 1,
                zIndex: index + 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: obj.url ? '2px solid rgba(34, 197, 94, 0.4)' : '2px solid rgba(59, 130, 246, 0.2)',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotate(${angle}deg) scale(1.05)`;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = obj.url ? 'rgba(34, 197, 94, 0.6)' : 'rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${angle}deg) scale(1)`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = obj.url ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.2)';
              }}
              onClick={() => {
                const url = obj.url || obj.URL;
                if (url) {
                  // Handle different URL types
                  const formatUrl = (url: string, urlType?: string) => {
                    if (!url) {
                      return '';
                    }

                    // If urlType is specified, handle accordingly
                    if (urlType) {
                      switch (urlType) {
                        case 'email':
                          // If it already has mailto:, use as is, otherwise add it
                          return url.startsWith('mailto:') ? url : `mailto:${url}`;
                        case 'phone':
                          // If it already has tel:, use as is, otherwise add it
                          return url.startsWith('tel:') ? url : `tel:${url}`;
                        case 'url':
                        default:
                          // For URLs, add https:// if not present
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            return `https://${url}`;
                          }
                          return url;
                      }
                    }

                    // Fallback: detect type from URL format
                    if (url.startsWith('mailto:')) {
                      return url;
                    } else if (url.startsWith('tel:')) {
                      return url;
                    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                      return `https://${url}`;
                    }

                    return url;
                  };
                  window.open(formatUrl(url, obj.urlType), '_blank');
                }
              }}
            >
              <img
                src={obj.src || ''}
                alt={obj.name || 'Social Icon'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />
              {/* Add a small indicator if the icon has a URL */}
              {obj.url && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    border: '1px solid white',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          );
        }

        // Regular image handling with improved positioning
        let imageLeft = left;
        let imageTop = top;

        // Handle origin positioning for regular images too
        if (obj.originX === 'center') {
          imageLeft = left - (width / 2);
        } else if (obj.originX === 'right') {
          imageLeft = left - width;
        }

        if (obj.originY === 'center') {
          imageTop = top - (height / 2);
        } else if (obj.originY === 'bottom') {
          imageTop = top - height;
        }

        // If image has a URL (social icon), make it interactive
        if (obj.url || obj.URL) {
          return (
            <button
              key={`canvas-image-${obj.id || index}`}
              type="button"
              onClick={() => {
                const url = obj.url || obj.URL;
                if (url) {
                  // Handle different URL types
                  const formatUrl = (url: string, urlType?: string) => {
                    if (!url) {
                      return '';
                    }

                    // If urlType is specified, handle accordingly
                    if (urlType) {
                      switch (urlType) {
                        case 'email':
                          // If it already has mailto:, use as is, otherwise add it
                          return url.startsWith('mailto:') ? url : `mailto:${url}`;
                        case 'phone':
                          // If it already has tel:, use as is, otherwise add it
                          return url.startsWith('tel:') ? url : `tel:${url}`;
                        case 'url':
                        default:
                          // For URLs, add https:// if not present
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            return `https://${url}`;
                          }
                          return url;
                      }
                    }

                    // Fallback: detect type from URL format
                    if (url.startsWith('mailto:')) {
                      return url;
                    } else if (url.startsWith('tel:')) {
                      return url;
                    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                      return `https://${url}`;
                    }

                    return url;
                  };
                  window.open(formatUrl(url, obj.urlType), '_blank');
                }
              }}
              style={{
                position: 'absolute',
                left: `${imageLeft}px`,
                top: `${imageTop}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: obj.originX === 'center' && obj.originY === 'center'
                  ? 'center center'
                  : 'left top',
                opacity: obj.opacity !== undefined ? obj.opacity : 1,
                zIndex: index + 1,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <img
                src={obj.src || ''}
                alt="Design element"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  boxSizing: 'border-box',
                  pointerEvents: 'none',
                }}
              />
            </button>
          );
        }

        return (
          <img
            key={`canvas-image-${obj.id || index}`}
            src={obj.src || ''}
            alt="Design element"
            style={{
              position: 'absolute',
              left: `${imageLeft}px`,
              top: `${imageTop}px`,
              width: `${width}px`,
              height: `${height}px`,
              transform: `rotate(${angle}deg)`,
              transformOrigin: obj.originX === 'center' && obj.originY === 'center'
                ? 'center center'
                : 'left top',
              opacity: obj.opacity !== undefined ? obj.opacity : 1,
              zIndex: index + 1,
              objectFit: 'fill',
              boxSizing: 'border-box',
            }}
          />
        );
      }

      return null;
    });
  }, [designData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading design...</p>
        </div>
      </div>
    );
  }

  if (error && !designData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-center justify-center">
            <AlertTriangle className="size-12 text-red-500" />
          </div>
          <h1 className="mb-2 text-center text-xl font-semibold text-gray-900">
            Design Not Found
          </h1>
          <p className="mb-4 text-center text-gray-600">
            The design you're looking for doesn't exist or is no longer available.
          </p>
          <p className="text-center text-sm text-gray-500">
            Error:
            {' '}
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!designData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 size-12 text-gray-400" />
          <p className="text-gray-600">No design data available</p>
        </div>
      </div>
    );
  }

  const canvasData = designData.canvas_data || {};
  const canvasWidth = canvasData.width || 375;
  const canvasHeight = canvasData.height || 667;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Eye className="size-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {designData.name || `Design Preview`}
                </h1>
                {designData.description && (
                  <p className="text-sm text-gray-600">{designData.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Share2 className="size-5 text-gray-400" />
              <span className="text-sm text-gray-500">Shared Design</span>
            </div>
          </div>
        </div>
      </header>

      {/* Design Preview */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="relative mx-auto max-w-sm">
          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-lg shadow-lg"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              ...effectiveBackgroundStyle,
            }}
          >
            {/* Render canvas objects using HTML elements */}
            {renderCanvasObjects}

            {/* Interactive overlay elements */}
            {canvasData.objects?.map((obj: any, index: number) => {
              if (obj.elementType) {
                return renderInteractiveElement(obj, index);
              }
              return null;
            })}
          </div>

          {/* Design Info */}
          <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Created:
                {' '}
                {new Date(designData.created_at).toLocaleDateString()}
              </p>
              {designData.qr_code_url && (
                <p className="mt-1 text-xs text-blue-600">
                  This design has an associated QR code
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
