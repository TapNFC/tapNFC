/* eslint-disable style/brace-style */
/**
 * Utility to convert Fabric.js canvas to HTML representation
 */

export type CanvasToHtmlOptions = {
  width: number;
  height: number;
  backgroundColor?: string;
};

export function canvasToHtml(canvas: any, options: CanvasToHtmlOptions): string {
  if (!canvas) {
    return createDummyHtml(options);
  }

  try {
    // Get canvas as data URL (image)
    const dataUrl = canvas.toDataURL('image/png', 1.0);

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Design Preview</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
          .design-container {
            max-width: 100vw;
            max-height: 100vh;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="design-container" style="
          width: ${options.width}px;
          height: ${options.height}px;
          background-color: ${options.backgroundColor || '#ffffff'};
        ">
          <img 
            src="${dataUrl}" 
            alt="Design Preview" 
            style="
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
            "
          />
        </div>
      </body>
      </html>
    `;
  } catch (error) {
    // Handle tainted canvas error gracefully
    if (error instanceof Error && error.message.includes('Tainted canvases may not be exported')) {
      console.warn('Canvas contains external images, cannot export due to CORS restrictions. Using fallback HTML.');
      return createDummyHtml(options);
    }

    console.error('Error converting canvas to HTML:', error);
    return createDummyHtml(options);
  }
}

export function createDummyHtml(options: CanvasToHtmlOptions): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Demo Design Preview</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        .design-container {
          max-width: 100vw;
          max-height: 100vh;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }
        .demo-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
        }
        .demo-badge {
          display: inline-block;
          background: linear-gradient(45deg, #f093fb, #f5576c);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .demo-title {
          margin: 0 0 16px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }
        .demo-text {
          margin: 0 0 24px 0;
          font-size: 16px;
          color: #6b7280;
          line-height: 1.5;
        }
        .demo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin: 0 auto;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        .decorative-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
        }
        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }
        .shape-1 {
          top: 20px;
          right: 20px;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }
        .shape-2 {
          bottom: 30px;
          left: 30px;
          width: 60px;
          height: 60px;
          animation-delay: 2s;
        }
        .shape-3 {
          top: 50%;
          left: 10px;
          width: 40px;
          height: 40px;
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      </style>
    </head>
    <body>
      <div class="design-container" style="
        width: ${options.width}px;
        height: ${options.height}px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div class="decorative-elements">
          <div class="floating-shape shape-1"></div>
          <div class="floating-shape shape-2"></div>
          <div class="floating-shape shape-3"></div>
        </div>
        
        <div class="demo-card">
          <div class="demo-badge">Demo Template</div>
          <h1 class="demo-title">Sample Design</h1>
          <p class="demo-text">This is a demo template created because the original design was not available.</p>
          <div class="demo-icon">✨</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Convert localStorage design data to HTML
 */
export function designDataToHtml(designData: any, options: CanvasToHtmlOptions): string {
  if (!designData || !designData.objects || designData.objects.length === 0) {
    return createDummyHtml(options);
  }

  // For complex designs, we'll create a simplified HTML representation
  // This is a fallback that creates a nice representation without canvas
  const objects = designData.objects || [];

  let htmlElements = '';

  objects.forEach((obj: any, index: number) => {
    // Handle Fabric.js coordinate system and transforms properly
    const left = obj.left || 0;
    const top = obj.top || 0;
    const width = obj.width || 0;
    const height = obj.height || 0;
    const scaleX = obj.scaleX || 1;
    const scaleY = obj.scaleY || 1;
    const angle = obj.angle || 0;
    const opacity = obj.opacity !== undefined ? obj.opacity : 1;

    // Calculate actual dimensions after scaling
    const actualWidth = width * scaleX;
    const actualHeight = height * scaleY;

    // Base positioning styles for all elements
    const baseStyles = `
      position: absolute;
      transform-origin: center center;
      opacity: ${opacity};
      z-index: ${index + 1};
    `;

    // Handle Button elements
    if (obj.elementType === 'button' && obj.buttonData) {
      const buttonData = obj.buttonData;

      // Calculate position for center-origin elements
      const adjustedLeft = left - (actualWidth / 2);
      const adjustedTop = top - (actualHeight / 2);

      htmlElements += `
        <button style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          width: ${actualWidth}px;
          height: ${actualHeight}px;
          transform: rotate(${angle}deg);
          background-color: ${buttonData.backgroundColor || '#3b82f6'};
          color: ${buttonData.textColor || '#ffffff'};
          border: ${buttonData.borderWidth || 1}px solid ${buttonData.borderColor || 'transparent'};
          border-radius: ${buttonData.borderRadius || 8}px;
          font-size: ${buttonData.fontSize || 14}px;
          font-weight: ${buttonData.fontWeight || 'normal'};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        " onclick="
          const action = ${JSON.stringify(buttonData.action || { type: 'url', value: '' })};
          if (action.type === 'url' && action.value) {
            window.open(action.value, '_blank');
          } else if (action.type === 'email' && action.value) {
            window.location.href = 'mailto:' + action.value;
          } else if (action.type === 'phone' && action.value) {
            window.location.href = 'tel:' + action.value;
          }
        " onmouseover="
          this.style.backgroundColor='${buttonData.hoverBackgroundColor || '#2563eb'}';
          this.style.color='${buttonData.hoverTextColor || '#ffffff'}';
          this.style.transform = 'rotate(${angle}deg) scale(1.05)';
        " onmouseout="
          this.style.backgroundColor='${buttonData.backgroundColor || '#3b82f6'}';
          this.style.color='${buttonData.textColor || '#ffffff'}';
          this.style.transform = 'rotate(${angle}deg) scale(1)';
        ">${buttonData.text || 'Button'}</button>
      `;
    }
    // Handle Link elements
    else if (obj.elementType === 'link' && obj.linkData) {
      const linkData = obj.linkData;
      const adjustedLeft = left - (actualWidth / 2);
      const adjustedTop = top - (actualHeight / 2);

      htmlElements += `
        <a href="${linkData.url || '#'}" target="${linkData.target || '_blank'}" style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          transform: rotate(${angle}deg);
          color: ${linkData.color || '#3b82f6'};
          font-size: ${linkData.fontSize || 16}px;
          font-weight: ${linkData.fontWeight || 'normal'};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-decoration: ${linkData.textDecoration || 'underline'};
          cursor: pointer;
          display: inline-block;
          transition: all 0.2s ease;
        " onmouseover="
          this.style.color='${linkData.hoverColor || '#1e40af'}';
          this.style.transform = 'rotate(${angle}deg) scale(1.05)';
        " onmouseout="
          this.style.color='${linkData.color || '#3b82f6'}';
          this.style.transform = 'rotate(${angle}deg) scale(1)';
        ">${linkData.text || 'Link'}</a>
      `;
    }

    // Handle Rectangle shapes
    else if (obj.type === 'rect') {
      // For rectangles, Fabric.js uses center-based positioning
      const adjustedLeft = left - (actualWidth / 2);
      const adjustedTop = top - (actualHeight / 2);

      htmlElements += `
        <div style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          width: ${actualWidth}px;
          height: ${actualHeight}px;
          transform: rotate(${angle}deg);
          background-color: ${obj.fill || '#cccccc'};
          border: ${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'};
          border-radius: ${obj.rx || 0}px;
          box-sizing: border-box;
        "></div>
      `;
    }
    // Handle Circle shapes - FIXED positioning
    else if (obj.type === 'circle') {
      const radius = obj.radius || 25;
      // For circles, Fabric.js positions by center, so we need to adjust for HTML which positions by top-left
      const adjustedLeft = left - radius;
      const adjustedTop = top - radius;
      const diameter = radius * 2 * Math.max(scaleX, scaleY); // Use max scale for consistent circular shape

      htmlElements += `
        <div style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          width: ${diameter}px;
          height: ${diameter}px;
          transform: rotate(${angle}deg);
          background-color: ${obj.fill || '#cccccc'};
          border: ${obj.strokeWidth || 0}px solid ${obj.stroke || 'transparent'};
          border-radius: 50%;
          box-sizing: border-box;
        "></div>
      `;
    }
    // Handle Triangle shapes
    else if (obj.type === 'triangle') {
      const adjustedLeft = left - (actualWidth / 2);
      const adjustedTop = top - (actualHeight / 2);

      htmlElements += `
        <div style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          width: 0;
          height: 0;
          transform: rotate(${angle}deg);
          border-left: ${actualWidth / 2}px solid transparent;
          border-right: ${actualWidth / 2}px solid transparent;
          border-bottom: ${actualHeight}px solid ${obj.fill || '#cccccc'};
        "></div>
      `;
    }
    // Handle Text elements (both 'text' and 'i-text')
    else if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
      const fontSize = obj.fontSize || 16;

      // Handle text positioning - Fabric.js text positioning is complex
      let adjustedLeft = left;
      let adjustedTop = top;

      // Adjust for text origin and alignment
      if (obj.originX === 'center') {
        adjustedLeft = left - (actualWidth / 2);
      } else if (obj.originX === 'right') {
        adjustedLeft = left - actualWidth;
      }

      if (obj.originY === 'center') {
        adjustedTop = top - (actualHeight / 2);
      } else if (obj.originY === 'bottom') {
        adjustedTop = top - actualHeight;
      }

      // Additional adjustment for text baseline
      if (obj.textBaseline === 'alphabetic' || obj.textBaseline === 'baseline') {
        adjustedTop = adjustedTop - fontSize * 0.2;
      } else if (obj.textBaseline === 'middle') {
        adjustedTop = adjustedTop - fontSize * 0.1;
      }

      htmlElements += `
        <div style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          width: ${actualWidth || 'auto'}px;
          height: ${actualHeight || 'auto'}px;
          transform: rotate(${angle}deg);
          color: ${obj.fill || '#000000'};
          font-family: ${obj.fontFamily || '-apple-system, BlinkMacSystemFont, Segoe UI'}, sans-serif;
          font-size: ${fontSize}px;
          font-weight: ${obj.fontWeight || 'normal'};
          font-style: ${obj.fontStyle || 'normal'};
          text-align: ${obj.textAlign || 'left'};
          text-decoration: ${obj.underline ? 'underline' : obj.linethrough ? 'line-through' : 'none'};
          line-height: ${obj.lineHeight || 1.2};
          box-sizing: border-box;
          ${obj.type === 'textbox' ? 'word-wrap: break-word; overflow-wrap: break-word;' : ''}
        ">${obj.text || ''}</div>
      `;
    }
    // Handle Image elements
    else if (obj.type === 'image') {
      const adjustedLeft = left - (actualWidth / 2);
      const adjustedTop = top - (actualHeight / 2);

      htmlElements += `
        <img src="${obj.src || ''}" alt="Design image" style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          width: ${actualWidth}px;
          height: ${actualHeight}px;
          transform: rotate(${angle}deg);
          object-fit: ${obj.objectFit || 'cover'};
          box-sizing: border-box;
        " />
      `;
    }
    // Handle Group elements (like button groups)
    else if (obj.type === 'group') {
      const adjustedLeft = left - (actualWidth / 2);
      const adjustedTop = top - (actualHeight / 2);

      htmlElements += `
        <div style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          width: ${actualWidth}px;
          height: ${actualHeight}px;
          transform: rotate(${angle}deg);
        ">
      `;

      // Recursively process group objects
      if (obj.objects && Array.isArray(obj.objects)) {
        obj.objects.forEach((groupObj: any) => {
          // Process each object in the group with relative positioning
          const groupLeft = groupObj.left || 0;
          const groupTop = groupObj.top || 0;
          const groupWidth = (groupObj.width || 0) * (groupObj.scaleX || 1);
          const groupHeight = (groupObj.height || 0) * (groupObj.scaleY || 1);

          if (groupObj.type === 'rect') {
            htmlElements += `
              <div style="
                position: absolute;
                left: ${groupLeft}px;
                top: ${groupTop}px;
                width: ${groupWidth}px;
                height: ${groupHeight}px;
                background-color: ${groupObj.fill || '#cccccc'};
                border-radius: ${groupObj.rx || 0}px;
                border: ${groupObj.strokeWidth || 0}px solid ${groupObj.stroke || 'transparent'};
                box-sizing: border-box;
              "></div>
            `;
          } else if (groupObj.type === 'text' || groupObj.type === 'i-text') {
            htmlElements += `
              <div style="
                position: absolute;
                left: ${groupLeft}px;
                top: ${groupTop}px;
                color: ${groupObj.fill || '#000000'};
                font-family: ${groupObj.fontFamily || '-apple-system, BlinkMacSystemFont, Segoe UI'}, sans-serif;
                font-size: ${groupObj.fontSize || 16}px;
                font-weight: ${groupObj.fontWeight || 'normal'};
                text-align: ${groupObj.textAlign || 'left'};
                box-sizing: border-box;
              ">${groupObj.text || ''}</div>
            `;
          }
        });
      }

      htmlElements += `</div>`;
    }
    // Handle Path elements (SVG paths)
    else if (obj.type === 'path' && obj.path) {
      const adjustedLeft = left - (actualWidth / 2);
      const adjustedTop = top - (actualHeight / 2);

      htmlElements += `
        <svg style="
          ${baseStyles}
          left: ${adjustedLeft}px;
          top: ${adjustedTop}px;
          transform: rotate(${angle}deg);
        " width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}">
          <path d="${obj.path}" fill="${obj.fill || '#cccccc'}" stroke="${obj.stroke || 'none'}" stroke-width="${obj.strokeWidth || 0}" />
        </svg>
      `;
    }
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Design Preview</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        .design-container {
          max-width: 100vw;
          max-height: 100vh;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <div class="design-container" style="
        width: ${options.width}px;
        height: ${options.height}px;
        background-color: ${options.backgroundColor || designData.background || '#ffffff'};
        position: relative;
        margin: 0 auto;
      ">
        ${htmlElements}
      </div>
    </body>
    </html>
  `;
}
