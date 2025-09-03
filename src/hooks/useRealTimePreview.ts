import { useCallback, useEffect, useMemo, useState } from 'react';
import { handlePhoneClick } from '@/utils/phoneUtils';

// Define a type for Fabric-like gradient objects that might be passed
type FabricGradient = {
  type?: string; // e.g., 'linear'
  colorStops?: Array<{ offset: number; color: string }>;
  coords?: { x1?: number; y1?: number; x2?: number; y2?: number };
};

type RealTimePreviewProps = {
  canvasState: any;
  width: number;
  height: number;
  backgroundColor: string | FabricGradient;
};

export function useRealTimePreview({ canvasState, width, height, backgroundColor }: RealTimePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Calculate preview scale based on available space
  const getPreviewScale = useMemo(() => {
    const maxWidth = 300;
    const maxHeight = 400;
    const scaleX = maxWidth / width;
    const scaleY = maxHeight / height;
    return Math.min(scaleX, scaleY, 1); // Don't scale up, only down
  }, [width, height]);

  // Calculate display dimensions
  const displayDimensions = useMemo(() => ({
    width: width * getPreviewScale,
    height: height * getPreviewScale,
  }), [width, height, getPreviewScale]);

  // Generate a key for the canvas state to force re-render when needed
  const canvasStateKey = useMemo(() => {
    return JSON.stringify(canvasState?.objects?.length || 0);
  }, [canvasState?.objects?.length]);

  // Handle background color/gradient
  const effectiveBackgroundStyle = useMemo(() => {
    if (typeof backgroundColor === 'string') {
      return { backgroundColor };
    }

    if (backgroundColor && typeof backgroundColor === 'object' && backgroundColor.type === 'linear') {
      const gradient = backgroundColor as FabricGradient;
      if (gradient.colorStops && gradient.colorStops.length > 0) {
        const stops = gradient.colorStops
          .map(stop => `${stop.color} ${stop.offset * 100}%`)
          .join(', ');
        return {
          background: `linear-gradient(to right, ${stops})`,
        };
      }
    }

    return { backgroundColor: '#ffffff' }; // Fallback to white if format is unexpected
  }, [backgroundColor]);

  // Handle element clicks with proper URL formatting and handling
  const handleElementClick = useCallback((elementData: any) => {
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
          case 'pdf':
            // For PDFs, return the URL as is (should be a direct link to the file)
            return url;
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
      } else if (url.includes('.pdf') || url.includes('file-storage/files/')) {
        // Detect PDF files
        return url;
      } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }

      return url;
    };

    // Check if this is an Apple Phone or Apple Email icon
    const isPhoneIcon = elementData.name === 'Apple Phone';
    const isEmailIcon = elementData.name === 'Apple Email';

    if (elementData.buttonData?.action) {
      const { type, value } = elementData.buttonData.action;
      if (type === 'url' && value) {
        const formattedUrl = formatUrl(value);
        if (formattedUrl.startsWith('tel:')) {
          handlePhoneClick(formattedUrl, 'copy');
        } else {
          window.open(formattedUrl, '_blank');
        }
      }
    } else if (elementData.linkData?.url) {
      const formattedUrl = formatUrl(elementData.linkData.url);
      if (formattedUrl.startsWith('tel:')) {
        handlePhoneClick(formattedUrl, 'copy');
      } else {
        window.open(formattedUrl, '_blank');
      }
    } else if (elementData.socialData?.url) {
      const formattedUrl = formatUrl(elementData.socialData.url);
      if (formattedUrl.startsWith('tel:')) {
        handlePhoneClick(formattedUrl, 'copy');
      } else {
        window.open(formattedUrl, '_blank');
      }
    } else if (elementData.url) {
      // Handle Apple Phone icons with handlePhoneClick
      if (isPhoneIcon) {
        const formattedUrl = formatUrl(elementData.url, 'phone');
        handlePhoneClick(formattedUrl, 'copy');
        return;
      }

      // Handle Apple Email icons with mailto: prefix
      if (isEmailIcon) {
        const formattedUrl = formatUrl(elementData.url, 'email');
        window.open(formattedUrl, '_blank');
        return;
      }

      // Handle other cases based on urlType
      const formattedUrl = formatUrl(elementData.url, elementData.urlType);
      if (elementData.urlType === 'phone' || formattedUrl.startsWith('tel:')) {
        handlePhoneClick(formattedUrl, 'copy');
      } else {
        window.open(formattedUrl, '_blank');
      }
    }
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback((previewRef: React.RefObject<HTMLDivElement | null>) => {
    if (!isFullscreen && previewRef.current) {
      if (previewRef.current.requestFullscreen) {
        previewRef.current.requestFullscreen();
      } else {
        // Fallback for browsers that might not support it or have a different name
        (previewRef.current as any).webkitRequestFullscreen?.();
        (previewRef.current as any).mozRequestFullScreen?.();
        (previewRef.current as any).msRequestFullscreen?.();
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  // Handle hide preview
  const handleHidePreview = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Handle show preview
  const handleShowPreview = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    isVisible,
    getPreviewScale,
    displayDimensions,
    canvasStateKey,
    effectiveBackgroundStyle,
    handleElementClick,
    toggleFullscreen,
    handleHidePreview,
    handleShowPreview,
  };
}
