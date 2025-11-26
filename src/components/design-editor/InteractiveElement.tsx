import { handleUrlClick } from '@/utils/urlUtils';

type InteractiveElementProps = {
  obj: any;
  index: number;
};

export function InteractiveElement({ obj, index }: InteractiveElementProps) {
  const baseStyle = {
    position: 'absolute' as const,
    left: `${obj.left}px`,
    top: `${obj.top}px`,
    width: `${obj.width}px`,
    height: `${obj.height}px`,
    cursor: 'pointer',
    zIndex: 10,
  };

  const handleClick = () => {
    if (obj.buttonData?.action) {
      const { type, value } = obj.buttonData.action;
      if (type === 'url' && value) {
        handleUrlClick(value);
      }
    } else if (obj.linkData?.url) {
      handleUrlClick(obj.linkData.url);
    } else if (obj.socialData?.url) {
      handleUrlClick(obj.socialData.url);
    } else if (obj.url) {
      handleUrlClick(obj.url, obj.urlType, obj.name);
    }
  };

  if (obj.elementType === 'button' && obj.buttonData) {
    const { text, backgroundColor, textColor, borderRadius, fontSize, fontWeight } = obj.buttonData;
    return (
      <button
        type="button"
        key={`button-${index}`}
        onClick={handleClick}
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
          handleClick();
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
        onClick={handleClick}
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
}
