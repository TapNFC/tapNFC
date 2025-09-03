import type { CanvasObject, TextStyle } from '@/hooks/useCanvasRenderer';
import { handlePhoneClick } from '@/utils/phoneUtils';
import { formatUrl } from '@/utils/urlUtils';

type TextElementProps = {
  obj: CanvasObject;
  index: number;
  textStyle: TextStyle;
};

export function TextElement({ obj, index, textStyle }: TextElementProps) {
  const textContent = obj.text || obj.content || '';

  // If text has a URL, make it interactive
  if (obj.url) {
    return (
      <button
        type="button"
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
            const formattedUrl = formatUrl(obj.url, obj.urlType);
            if (obj.urlType === 'phone' || formattedUrl.startsWith('tel:')) {
              handlePhoneClick(formattedUrl, 'copy');
            } else {
              window.open(formattedUrl, '_blank');
            }
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
