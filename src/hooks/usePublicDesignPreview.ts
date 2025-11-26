import type { Design } from '@/types/design';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { handlePhoneClick } from '@/utils/phoneUtils';

type PublicDesignPreviewProps = {
  designId?: string;
  designSlug?: string;
  initialData?: Design | null;
  forceRefresh?: boolean;
};

// Define a type for Fabric-like gradient objects that might be passed
type FabricGradient = {
  type: string;
  colorStops: Array<{ color: string; offset: number }>;
  coords?: { x1?: number; y1?: number; x2?: number; y2?: number };
};

export function usePublicDesignPreview({
  designId,
  designSlug,
  initialData,
  forceRefresh = false,
}: PublicDesignPreviewProps) {
  const [designData, setDesignData] = useState<Design | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const effectiveBackgroundStyle = useMemo(() => {
    const backgroundSource = designData?.canvas_data?.background;
    if (typeof backgroundSource === 'string') {
      return { backgroundColor: backgroundSource };
    } else if (
      backgroundSource
      && typeof backgroundSource === 'object'
      && 'colorStops' in backgroundSource
      && Array.isArray(backgroundSource.colorStops)
      && backgroundSource.colorStops.length > 0
    ) {
      const gradient = backgroundSource as FabricGradient;
      const direction = '135deg';
      const stops = (gradient.colorStops || [])
        .map(stop => `${stop.color} ${stop.offset * 100}%`)
        .join(', ');
      return { background: `linear-gradient(${direction}, ${stops})` };
    }
    return { backgroundColor: '#ffffff' };
  }, [designData]);

  // Function to load design data from backend API
  const loadDesignData = async () => {
    try {
      setLoading(true);
      setError(null);

      const identifier = designSlug || designId;
      if (!identifier) {
        throw new Error('No design identifier provided');
      }

      const timestamp = Date.now();
      const apiEndpoint = `/api/${identifier}?_t=${timestamp}`;

      const response = await fetch(apiEndpoint, {
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setDesignData(null);
          setError('not_found');
          return;
        }

        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      const design = await response.json();
      setDesignData(design);

      // Record the scan if we have a valid design ID (not a demo) and not archived
      if (design.id && design.id !== 'demo' && !design.is_archived) {
        try {
          fetch(`/api/scan/${design.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }).catch((error) => {
            console.error('Failed to record scan:', error);
          });
        } catch (scanError) {
          console.error('Error recording scan:', scanError);
        }
      }
    } catch (err) {
      console.error('Error loading design data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load design';
      setError(errorMessage);
      setDesignData(null);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Load design data from backend API if not provided via initialData
  useEffect(() => {
    if ((designId || designSlug) && (!initialData || forceRefresh)) {
      loadDesignData();
    }
  }, [designId, designSlug, initialData, forceRefresh]);

  // Record scan when design is provided via initialData
  useEffect(() => {
    if (initialData && initialData.id && initialData.id !== 'demo' && !initialData.is_archived) {
      fetch(`/api/scan/${initialData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((error) => {
        console.error('Failed to record scan:', error);
      });
    }
  }, [initialData]);

  // Calculate responsive scale based on viewport width
  useEffect(() => {
    const calculateScale = () => {
      if (!designData) {
        return;
      }

      const canvasWidth = designData.width || 800;
      const canvasHeight = designData.height || 600;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (viewportWidth >= 500) {
        setScale(1);
        return;
      }

      const padding = 20;
      const maxWidth = viewportWidth - (padding * 2);
      const maxHeight = viewportHeight - (padding * 2);

      const scaleX = maxWidth / canvasWidth;
      const scaleY = maxHeight / canvasHeight;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [designData]);

  // URL formatting utility
  const formatUrl = (url: string, urlType?: string) => {
    if (!url) {
      return '';
    }

    if (urlType) {
      switch (urlType) {
        case 'email':
          return url.startsWith('mailto:') ? url : `mailto:${url}`;
        case 'phone':
          return url.startsWith('tel:') ? url : `tel:${url}`;
        case 'pdf':
          return url;
        case 'vcard':
          return url;
        case 'url':
        default:
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
          }
          return url;
      }
    }

    if (url.startsWith('mailto:')) {
      return url;
    } else if (url.startsWith('tel:')) {
      return url;
    } else if (url.includes('.pdf') || url.includes('file-storage/files/')) {
      return url;
    } else if (url.includes('.vcf') || url.includes('file-storage/vcards/')) {
      return url;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }

    return url;
  };

  // Handle interactive element clicks
  const handleElementClick = (elementData: any) => {
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
      if (isPhoneIcon) {
        const formattedUrl = formatUrl(elementData.url, 'phone');
        handlePhoneClick(formattedUrl, 'copy');
        return;
      }

      if (isEmailIcon) {
        const formattedUrl = formatUrl(elementData.url, 'email');
        window.open(formattedUrl, '_blank');
        return;
      }

      const formattedUrl = formatUrl(elementData.url, elementData.urlType);
      if (elementData.urlType === 'phone' || formattedUrl.startsWith('tel:')) {
        handlePhoneClick(formattedUrl, 'copy');
      } else {
        window.open(formattedUrl, '_blank');
      }
    }
  };

  return {
    designData,
    loading,
    error,
    scale,
    effectiveBackgroundStyle,
    handleElementClick,
    formatUrl,
  };
}
