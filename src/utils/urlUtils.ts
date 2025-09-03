import { handlePhoneClick } from '@/utils/phoneUtils';

export const formatUrl = (url: string, urlType?: string) => {
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

export const handleUrlClick = (url: string, urlType?: string, elementName?: string) => {
  const isPhoneIcon = elementName === 'Apple Phone';
  const isEmailIcon = elementName === 'Apple Email';

  if (isPhoneIcon) {
    const formattedUrl = formatUrl(url, 'phone');
    handlePhoneClick(formattedUrl, 'copy');
    return;
  }

  if (isEmailIcon) {
    const formattedUrl = formatUrl(url, 'email');
    window.open(formattedUrl, '_blank');
    return;
  }

  const formattedUrl = formatUrl(url, urlType);
  if (urlType === 'phone' || formattedUrl.startsWith('tel:')) {
    handlePhoneClick(formattedUrl, 'copy');
  } else {
    window.open(formattedUrl, '_blank');
  }
};

/**
 * Utility function to extract simple URL from preview URL
 * Converts URLs like "http://localhost:3000/en/demodesign" to "http://localhost:3000/demodesign"
 */
export const getSimpleUrl = (fullUrl: string): string => {
  try {
    const url = new URL(fullUrl);
    const pathParts = url.pathname.split('/');
    // Extract the last part of the path (the identifier)
    const identifier = pathParts[pathParts.length - 1];
    // Construct the simplified URL
    return `${url.origin}/${identifier}`;
  } catch {
    // Fallback: try to extract from pathname directly
    const pathParts = fullUrl.split('/');
    const identifier = pathParts[pathParts.length - 1];
    // Try to extract origin from the full URL
    const origin = fullUrl.split('/').slice(0, 3).join('/');
    return `${origin}/${identifier}`;
  }
};
